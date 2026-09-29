import { DatabaseSync } from 'node:sqlite'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const cacheDir = tmpdir()
const outputDir = new URL('../src/data/vocabulary/generated/', import.meta.url)
const runtimeDir = new URL('../src/data/vocabulary/generated/runtime/', import.meta.url)

const sources = {
  dictionary: ['nt-en-vi.db', 'https://raw.githubusercontent.com/skypediacode/english-vietnamese-dictionary/main/dictionary_en_vi.db'],
  cefr: ['cefrj-vocabulary-profile-1.5.csv', 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/cefrj-vocabulary-profile-1.5.csv'],
  advanced: ['octanove-vocabulary-profile-c1c2-1.0.csv', 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/octanove-vocabulary-profile-c1c2-1.0.csv'],
  cvdict: ['CVDICT.u8', 'https://raw.githubusercontent.com/ph0ngp/CVDICT/master/CVDICT.u8'],
  korean: ['topik-vocab-vi.csv', 'https://topikvocab.foldalpha.com/download/topik-vocab-vi.csv'],
}

async function cached([name, url]) {
  const path = join(cacheDir, name)
  if (existsSync(path)) return path
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Cannot download ${url}: ${response.status}`)
  await writeFile(path, Buffer.from(await response.arrayBuffer()))
  return path
}

function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1 }
      else quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(field); field = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(field)
      if (row.some(Boolean)) rows.push(row)
      row = []; field = ''
    } else field += char
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim()
const compact = (value = '', max = 190) => clean(value).replace(/^[-–—•]+\s*/, '').slice(0, max)
const slug = (value) => clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')

const TARGET_WORDS_PER_LEVEL = 1000
const MIN_WORDS_PER_LEVEL = 900

const baseWord = (languageId, level, index, data) => ({
  id: `${languageId}-${level.toLowerCase().replace(/\s+/g, '-')}-${String(index + 1).padStart(4, '0')}-${slug(data.word)}`,
  languageId, level, appLevel: level,
  word: clean(data.word), ipa: clean(data.ipa), partOfSpeech: clean(data.partOfSpeech),
  meaningVi: compact(data.meaningVi), definition: compact(data.definition),
  example: compact(data.example, 260), translation: compact(data.translation, 260),
  topic: clean(data.topic) || 'General', exam: data.exam || 'General',
  collocations: data.collocations || [], synonyms: [], antonyms: [], wordFamily: [], phrases: [],
  lessonIds: [], lessons: [], source: data.source,
  levelBasis: data.levelBasis || 'source vocabulary level',
  sourceLevel: data.sourceLevel || level,
  levelStatus: languageId === 'korean'
    ? 'study-band'
    : clean(data.sourceLevel || level) === level && !/estimated|extension/i.test(data.levelBasis || '')
      ? 'source'
      : 'extended',
})

function uniqueByWord(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = clean(item.word).normalize('NFKC').toLocaleLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function fillLevel(core, pool, target = TARGET_WORDS_PER_LEVEL, basis = 'estimated extension') {
  const selected = uniqueByWord(core).slice(0, target)
  const seen = new Set(selected.map((item) => clean(item.word).normalize('NFKC').toLocaleLowerCase()))
  for (const item of pool) {
    if (selected.length >= target) break
    const key = clean(item.word).normalize('NFKC').toLocaleLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    selected.push({ ...item, levelBasis: basis })
  }
  return selected
}

function assertApproxLevel(language, level, words) {
  if (words.length < MIN_WORDS_PER_LEVEL) throw new Error(`${language} ${level}: expected about ${TARGET_WORDS_PER_LEVEL} words, got ${words.length}`)
  console.log(`${language} ${level}: ${words.length} words`)
}

const topicRules = [
  ['Travel', /travel|journey|airport|train|bus|hotel|tour|flight|passport|trip|transport|đi lại|du lịch|khách sạn/i],
  ['Food & Drink', /food|drink|eat|meal|restaurant|fruit|vegetable|cook|kitchen|ăn|uống|món|rau|quả/i],
  ['Work & Business', /work|job|office|business|company|career|money|market|làm việc|công ty|kinh doanh/i],
  ['Education', /school|student|teacher|learn|study|university|education|exam|học|giáo viên|sinh viên/i],
  ['Health', /health|doctor|hospital|medicine|body|disease|pain|medical|sức khỏe|bệnh|bác sĩ/i],
  ['Technology', /computer|internet|phone|technology|digital|software|machine|máy tính|điện thoại/i],
  ['People & Relationships', /family|friend|person|people|mother|father|child|relationship|gia đình|bạn bè/i],
  ['Home & Daily Life', /home|house|room|clothes|daily|morning|evening|nhà|phòng|quần áo/i],
  ['Nature & Environment', /nature|animal|plant|weather|water|environment|earth|sea|thiên nhiên|động vật|thời tiết/i],
  ['Society & Culture', /society|culture|government|law|public|community|history|art|xã hội|văn hóa/i],
  ['Communication', /speak|say|tell|write|read|language|question|answer|nói|viết|đọc|ngôn ngữ/i],
]
function inferTopic(...parts) {
  const text = parts.filter(Boolean).join(' ')
  return topicRules.find(([, pattern]) => pattern.test(text))?.[0] || 'General'
}

const posNames = { n: 'noun', v: 'verb', a: 'adjective', r: 'adverb', d: 'adverb', p: 'preposition', c: 'conjunction', u: 'particle', m: 'number', t: 'time expression', q: 'classifier', e: 'interjection' }
const normalizePos = (value = '') => posNames[String(value).split(/[;,/]/)[0].toLowerCase()] || clean(value).toLowerCase()
const dictionaryPos = {
  noun: ['N'], verb: ['V'], 'be-verb': ['V'], 'do-verb': ['V'], 'have-verb': ['V'],
  'modal auxiliary': ['V'], adjective: ['A'], adverb: ['D', 'adv'], pronoun: ['P'],
  preposition: ['E'], 'infinitive-to': ['E'], conjunction: ['C'], determiner: ['X'],
  interjection: ['O'], number: ['A', 'N'],
}
const sourcePos = {
  noun: ['n'], verb: ['v'], 'be-verb': ['v'], 'do-verb': ['v'], 'have-verb': ['v'],
  'modal auxiliary': ['v'], adjective: ['a'], adverb: ['r', 'adv'], pronoun: ['p'],
  preposition: ['prep'], conjunction: ['c'], determiner: ['det'], interjection: ['e'], number: ['m', 'num'],
}

async function loadFrequencyWords() {
  const map = new Map()
  for (let tier = 1; tier <= 4; tier += 1) {
    const local = join(cacheDir, `nt-freq-0${tier}.jsonl`)
    if (!existsSync(local)) continue
    for (const line of (await readFile(local, 'utf8')).split(/\r?\n/)) {
      if (!line.trim()) continue
      const item = JSON.parse(line)
      if (!item.headword || map.has(item.headword.toLowerCase())) continue
      map.set(item.headword.toLowerCase(), item)
    }
  }
  return map
}

async function loadTatoeba() {
  const folder = join(cacheDir, 'opus-tatoeba-en-vi')
  const enPath = join(folder, 'Tatoeba.en-vi.en')
  const viPath = join(folder, 'Tatoeba.en-vi.vi')
  const index = new Map()
  let en, vi
  if (existsSync(enPath) && existsSync(viPath)) {
    en = (await readFile(enPath, 'utf8')).split(/\r?\n/)
    vi = (await readFile(viPath, 'utf8')).split(/\r?\n/)
  } else {
    const pairs = JSON.parse(await readFile(new URL('./vocabulary-sources/tatoeba-en-vi.json', import.meta.url), 'utf8'))
    en = pairs.map(([source]) => source); vi = pairs.map(([, target]) => target)
  }
  for (let i = 0; i < Math.min(en.length, vi.length); i += 1) {
    const sentence = clean(en[i]), translation = clean(vi[i])
    if (!sentence || !translation || sentence.length > 150 || translation.length > 190) continue
    const tokens = new Set(sentence.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [])
    for (const token of tokens) {
      const old = index.get(token)
      if (!old || sentence.length < old.example.length) index.set(token, { example: sentence, translation })
    }
  }
  return index
}

async function loadParallelCorpus(folderName, sourceSuffix, targetSuffix, label = 'parallel corpus') {
  const folder = join(cacheDir, folderName)
  if (!existsSync(folder)) return null
  const files = await readdir(folder)
  const sourceFile = files.find((name) => name.endsWith(sourceSuffix))
  const targetFile = files.find((name) => name.endsWith(targetSuffix))
  if (!sourceFile || !targetFile) return null
  return {
    label,
    source: (await readFile(join(folder, sourceFile), 'utf8')).split(/\r?\n/),
    target: (await readFile(join(folder, targetFile), 'utf8')).split(/\r?\n/),
  }
}

async function loadBundledParallel(fileName, label) {
  const pairs = JSON.parse(await readFile(new URL(`./vocabulary-sources/${fileName}`, import.meta.url), 'utf8'))
  return { label, source: pairs.map(([source]) => source), target: pairs.map(([, target]) => target) }
}

function addParallelExamples(words, corpus) {
  if (!corpus || !words.length) return words
  const uniqueWords = [...new Set(words.map((word) => word.word))].sort((a, b) => b.length - a.length)
  const byFirstCharacter = new Map()
  for (const word of uniqueWords) {
    const first = [...word][0]
    byFirstCharacter.set(first, [...(byFirstCharacter.get(first) || []), word])
  }
  const found = new Map()
  for (let index = 0; index < Math.min(corpus.source.length, corpus.target.length); index += 1) {
    const example = clean(corpus.source[index]).replace(/<[^>]+>/g, '')
    const translation = clean(corpus.target[index]).replace(/<[^>]+>/g, '')
    if (example.length < 5 || example.length > 120 || translation.length < 4 || translation.length > 180 || /https?:|www\.|[{}<>]/i.test(`${example} ${translation}`)) continue
    const matches = new Set()
    for (let offset = 0; offset < example.length; offset += 1) {
      const options = byFirstCharacter.get(example[offset])
      if (!options) continue
      for (const word of options) if (example.startsWith(word, offset)) matches.add(word)
    }
    for (const word of matches) {
      const score = Math.abs(example.length - 32) + Math.abs(translation.length - 50) / 3
      if (!found.has(word) || score < found.get(word).score) found.set(word, { example, translation, score })
    }
  }
  return words.map((word) => {
    const pair = found.get(word.word)
    return pair ? { ...word, ...pair, source: `${word.source} + ${corpus.label}` } : word
  })
}

const primarySensePatterns = {
  a: /^Một;/i, an: /^Một;/i, i: /^Tôi,/i, it: /^Cái đó/i, he: /^Nó, anh ấy/i,
  she: /^Nó, bà ấy/i, we: /^Chúng tôi/i, they: /^Chúng nó|^Họ[,;.]/i,
  be: /^Thì, là/i, have: /^Có\./i, do: /^Làm[,;.]/i, can: /^Có thể[,;]/i,
  in: /^Ở, tại, trong/i, at: /^Ở, tại/i, on: /^Trên[,;.]/i,
}
function chooseDictionaryRow(rows, preferredPos, headword = '') {
  const expected = dictionaryPos[clean(preferredPos).toLowerCase()] || []
  const preferredSense = primarySensePatterns[clean(headword).toLowerCase()]
  const scored = rows.map((row) => {
    const definition = compact(row.definition)
    const posMatch = expected.includes(row.pos) || normalizePos(row.pos) === normalizePos(preferredPos)
    const cleanSense = definition && !/[\[\]{}<>]|(^|\s)(tục|thô tục|xem |viết tắt)/i.test(definition)
    return { ...row, definition, posMatch, score: (posMatch ? 100 : 0) + (preferredSense?.test(definition) ? 50 : 0) + (cleanSense ? 5 : 0) + (definition.length >= 4 && definition.length <= 160 ? 3 : 0) + (row.ipa ? 1 : 0) }
  }).filter((row) => row.definition).sort((a, b) => b.score - a.score || (a.definitionId || 0) - (b.definitionId || 0))
  return scored[0]
}

async function buildEnglish(db, freq, tatoeba) {
  const [cefrPath, advancedPath] = await Promise.all([cached(sources.cefr), cached(sources.advanced)])
  const profiles = [...parseCsv(await readFile(cefrPath, 'utf8')).slice(1), ...parseCsv(await readFile(advancedPath, 'utf8')).slice(1)]
  const target = { A1: TARGET_WORDS_PER_LEVEL, A2: TARGET_WORDS_PER_LEVEL, B1: TARGET_WORDS_PER_LEVEL, B2: TARGET_WORDS_PER_LEVEL, C1: TARGET_WORDS_PER_LEVEL, C2: TARGET_WORDS_PER_LEVEL }
  const byLevel = Object.fromEntries(Object.keys(target).map((level) => [level, []]))
  const lookup = db.prepare(`
    SELECT DISTINCT d.id AS definitionId, p.ipa, d.definition, d.pos, wd.example
    FROM words w
    LEFT JOIN pronunciations p ON p.word_id = w.id
    JOIN word_definitions wd ON wd.word_id = w.id
    JOIN definitions d ON d.id = wd.definition_id
    WHERE w.word = ? COLLATE NOCASE AND d.definition_lang = 'vi'
  `)
  for (const row of profiles) {
    const [headword, profilePos, level, ...tags] = row
    if (!target[level] || byLevel[level].some((item) => item.word.toLowerCase() === clean(headword).toLowerCase())) continue
    if (!/^[A-Za-z][A-Za-z' -]{0,34}$/.test(clean(headword))) continue
    const dictionary = chooseDictionaryRow(lookup.all(clean(headword)), profilePos, headword)
    if (!dictionary?.definition) continue
    const common = freq.get(clean(headword).toLowerCase())
    const expectedSourcePos = sourcePos[clean(profilePos).toLowerCase()] || []
    const commonMatches = common && expectedSourcePos.includes(clean(common.pos).toLowerCase())
    const parallel = !headword.includes(' ') ? tatoeba.get(clean(headword).toLowerCase()) : undefined
    byLevel[level].push({
      word: headword, sourceLevel: level, levelBasis: 'CEFR-J / Octanove source level',
      ipa: common?.pron || dictionary.ipa || '',
      partOfSpeech: normalizePos(profilePos || common?.pos || dictionary.pos),
      meaningVi: dictionary.definition,
      definition: commonMatches ? (common.gloss_en?.[0] || common.senses_en?.[0] || '') : '',
      example: parallel?.example || dictionary.example || '',
      translation: parallel?.translation || '',
      topic: inferTopic(tags.join(' '), common?.gloss_en?.join(' '), dictionary.definition),
      exam: 'CEFR',
      source: level === 'C1' || level === 'C2' ? 'Octanove C1/C2 + Skypedia EN–VI' : 'CEFR-J + Skypedia EN–VI',
      rank: common?.freq || 0,
    })
  }
  const output = []
  const levels = Object.keys(target)
  const reserved = new Set()
  const selections = new Map()
  const keyFor = (word) => clean(word.word).normalize('NFKC').toLocaleLowerCase()

  for (const level of levels) {
    const core = byLevel[level]
      .sort((a, b) => b.rank - a.rank || a.word.localeCompare(b.word, 'en'))
      .filter((word) => !reserved.has(keyFor(word)))
      .slice(0, target[level])
    core.forEach((word) => reserved.add(keyFor(word)))
    selections.set(level, core)
  }

  for (const level of levels) {
    const selected = selections.get(level)
    const levelIndex = levels.indexOf(level)
    const pool = Object.values(byLevel).flat()
      .filter((word) => !reserved.has(keyFor(word)))
      .sort((a, b) => Math.abs(levels.indexOf(a.sourceLevel) - levelIndex) - Math.abs(levels.indexOf(b.sourceLevel) - levelIndex) || b.rank - a.rank || a.word.localeCompare(b.word, 'en'))
    for (const next of pool) {
      if (selected.length >= target[level]) break
      const key = keyFor(next)
      if (reserved.has(key)) continue
      reserved.add(key)
      selected.push({ ...next, levelBasis: `estimated CEFR extension for ${level}; source ${next.sourceLevel}` })
    }
    assertApproxLevel('English', level, selected)
    output.push(...selected.map((word, index) => baseWord('english', level, index, word)))
  }
  return output
}

async function loadCvdict() {
  const path = await cached(sources.cvdict)
  const map = new Map()
  for (const line of (await readFile(path, 'utf8')).split(/\r?\n/)) {
    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)]\s+\/(.+)\/$/)
    if (!match) continue
    const [, traditional, simplified, pinyin, raw] = match
    const meanings = raw.split('/').map((value) => compact(value)).filter((value) => value.length >= 2 && !/^(xem|như|viết tắt)/i.test(value))
    if (meanings.length && !map.has(simplified)) map.set(simplified, { traditional, pinyin, meanings })
  }
  return map
}

async function buildChinese() {
  const dictionary = await loadCvdict()
  const candidates = []
  for (let number = 1; number <= 7; number += 1) {
    const path = await cached([`hsk-new-${number}.json`, `https://raw.githubusercontent.com/jelleverheyen/hsk-vocabulary/main/wordlists/exclusive/new/${number}.min.json`])
    const rows = JSON.parse(await readFile(path, 'utf8')).sort((a, b) => (a.q || 999999) - (b.q || 999999))
    for (const row of rows) {
      const translation = dictionary.get(row.s)
      const form = row.f?.[0]
      if (!translation?.meanings?.[0] || !form?.m?.length) continue
      candidates.push({
        word: row.s, ipa: form.i?.y || translation.pinyin, partOfSpeech: normalizePos(row.p?.[0]),
        meaningVi: translation.meanings[0], definition: form.m.join('; '), example: '', translation: '',
        topic: inferTopic(form.m.join(' '), translation.meanings.join(' ')), exam: 'HSK',
        source: 'HSK 3.0 vocabulary + CVDICT', collocations: form.c || [],
        sourceLevel: `HSK ${number}`, sourceNumber: number, rank: row.q || 999999,
        levelBasis: number <= 6 ? 'HSK 3.0 source level' : 'HSK 7 source expansion pool',
      })
    }
  }
  const corpus = await loadParallelCorpus('opus-tatoeba-cmn-vi', '.cmn', '.vi', 'Tatoeba ZH–VI')
    || await loadBundledParallel('tatoeba-cmn-vi.json', 'Tatoeba ZH–VI')
  const enriched = addParallelExamples(uniqueByWord(candidates), corpus)
  const reserved = new Set()
  const selections = new Map()

  for (let number = 1; number <= 6; number += 1) {
    const level = `HSK ${number}`
    const core = enriched
      .filter((word) => word.sourceNumber === number && !reserved.has(word.word))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, TARGET_WORDS_PER_LEVEL)
    core.forEach((word) => reserved.add(word.word))
    selections.set(level, core)
  }

  const extensionPool = enriched
    .filter((word) => !reserved.has(word.word))
    .sort((a, b) => Number(a.sourceNumber !== 7) - Number(b.sourceNumber !== 7) || a.rank - b.rank)

  for (let number = 1; number <= 6; number += 1) {
    const level = `HSK ${number}`
    const current = selections.get(level)
    while (current.length < TARGET_WORDS_PER_LEVEL && extensionPool.length) {
      const next = extensionPool.shift()
      if (reserved.has(next.word)) continue
      reserved.add(next.word)
      current.push({
        ...next,
        levelBasis: `estimated app extension for ${level}; source ${next.sourceLevel}`,
      })
    }
    assertApproxLevel('Chinese', level, current)
  }

  return [...selections].flatMap(([level, words]) => words.map((word, index) => baseWord('chinese', level, index, word)))
}

function englishGlossCandidates(meanings) {
  const candidates = []
  for (const raw of meanings || []) {
    const cleaned = clean(raw).replace(/^to\s+/i, '').replace(/^(a|an|the)\s+/i, '')
    for (const part of cleaned.split(/[;,/]|\s+\(/)) {
      const value = clean(part).replace(/\.$/, '')
      if (/^[a-z][a-z' -]{1,34}$/i.test(value)) candidates.push(value)
    }
  }
  return [...new Set(candidates)]
}

async function buildJapanese(db) {
  const lookup = db.prepare(`
    SELECT DISTINCT d.id AS definitionId, p.ipa, d.definition, d.pos
    FROM words w
    LEFT JOIN pronunciations p ON p.word_id = w.id
    JOIN word_definitions wd ON wd.word_id = w.id
    JOIN definitions d ON d.id = wd.definition_id
    WHERE w.word = ? COLLATE NOCASE AND d.definition_lang = 'vi'
  `)
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1']
  const candidates = []
  for (const level of levels) {
    const path = await cached([`openjlpt-${level.toLowerCase()}.json`, `https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/${level.toLowerCase()}.json`])
    const rows = JSON.parse(await readFile(path, 'utf8'))
    for (const row of rows) {
      let dictionary
      for (const gloss of englishGlossCandidates(row.meanings)) {
        dictionary = chooseDictionaryRow(lookup.all(gloss), '')
        if (dictionary?.definition) break
      }
      if (!dictionary?.definition || !row.word) continue
      candidates.push({
        word: row.word, ipa: row.reading || '', partOfSpeech: normalizePos(dictionary.pos),
        meaningVi: dictionary.definition, definition: (row.meanings || []).join('; '),
        example: row.examples?.[0]?.ja || '', translation: '',
        topic: inferTopic((row.meanings || []).join(' '), dictionary.definition), exam: 'JLPT',
        source: 'OpenJLPT + Skypedia EN–VI', sourceLevel: level, levelBasis: 'OpenJLPT source level',
      })
    }
  }
  const corpus = await loadParallelCorpus('opus-tatoeba-ja-vi', '.ja', '.vi', 'Tatoeba JA–VI')
    || await loadBundledParallel('tatoeba-ja-vi.json', 'Tatoeba JA–VI')
  const enriched = addParallelExamples(uniqueByWord(candidates), corpus)
  const reserved = new Set()
  const selections = new Map()

  for (const level of levels) {
    const core = enriched.filter((word) => word.sourceLevel === level && !reserved.has(word.word)).slice(0, TARGET_WORDS_PER_LEVEL)
    core.forEach((word) => reserved.add(word.word))
    selections.set(level, core)
  }

  for (const level of levels) {
    const current = selections.get(level)
    const levelIndex = levels.indexOf(level)
    const pool = enriched
      .filter((word) => !reserved.has(word.word))
      .sort((a, b) => Math.abs(levels.indexOf(a.sourceLevel) - levelIndex) - Math.abs(levels.indexOf(b.sourceLevel) - levelIndex))
    for (const next of pool) {
      if (current.length >= TARGET_WORDS_PER_LEVEL) break
      if (reserved.has(next.word)) continue
      reserved.add(next.word)
      current.push({ ...next, levelBasis: `estimated app extension for ${level}; source ${next.sourceLevel}` })
    }
    assertApproxLevel('Japanese', level, current)
  }

  return [...selections].flatMap(([level, words]) => words.map((word, index) => baseWord('japanese', level, index, word)))
}

const koreanPos = { 의: 'particle', 동: 'verb', 명: 'noun', 형: 'adjective', 부: 'adverb', 보: 'auxiliary verb', 대: 'pronoun', 관: 'determiner', 수: 'number', 감: 'interjection', 접: 'affix' }
async function buildKorean() {
  const path = await cached(sources.korean)
  const [headers, ...rows] = parseCsv(await readFile(path, 'utf8'))
  const records = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])))
  const uniqueRecords = []
  const seenWords = new Set()
  for (const row of records) {
    const key = clean(row.word).normalize('NFKC')
    if (!key || seenWords.has(key)) continue
    seenWords.add(key)
    uniqueRecords.push(row)
  }
  const gradeOrder = { A: 0, B: 1, C: 2 }
  const ordered = [...uniqueRecords].sort((a, b) => {
    const aGrade = gradeOrder[a.nikl_grade?.[0]] ?? 99
    const bGrade = gradeOrder[b.nikl_grade?.[0]] ?? 99
    return aGrade - bGrade || clean(a.word).localeCompare(clean(b.word), 'ko')
  })
  const levels = ['TOPIK 1', 'TOPIK 2', 'TOPIK 3', 'TOPIK 4', 'TOPIK 5', 'TOPIK 6']
  const output = []
  for (let index = 0; index < levels.length; index += 1) {
    const start = Math.round(ordered.length * index / levels.length)
    const end = Math.round(ordered.length * (index + 1) / levels.length)
    const recordsForLevel = ordered.slice(start, end)
    const level = levels[index]
    const normalized = uniqueByWord(recordsForLevel.map((row) => ({
      word: row.word, ipa: '', partOfSpeech: koreanPos[row.pos] || row.pos,
      meaningVi: row.meaning, definition: '', example: row.example_ko, translation: row.example_translation,
      topic: inferTopic(row.meaning), exam: 'TOPIK',
      source: 'NIKL Korean learner vocabulary (Vietnamese)',
      sourceLevel: row.nikl_grade,
      levelBasis: 'balanced app study band ordered by NIKL A/B/C grade; not an official TOPIK 1–6 word list',
    })))
    assertApproxLevel('Korean', level, normalized)
    output.push(...normalized.map((word, wordIndex) => baseWord('korean', level, wordIndex, word)))
  }
  return output
}


await mkdir(outputDir, { recursive: true })
await mkdir(runtimeDir, { recursive: true })
const dbPath = await cached(sources.dictionary)
const db = new DatabaseSync(dbPath, { readOnly: true })
const [frequency, tatoeba] = await Promise.all([loadFrequencyWords(), loadTatoeba()])
const datasets = {
  english: await buildEnglish(db, frequency, tatoeba),
  chinese: await buildChinese(),
  japanese: await buildJapanese(db),
  korean: await buildKorean(),
}
db.close()

for (const [language, words] of Object.entries(datasets)) {
  await writeFile(new URL(`${language}.json`, outputDir), `${JSON.stringify(words, null, 2)}\n`)
  console.log(`${language}: ${words.length}`)
}

const lessonPools = {}
for (const [languageId, words] of Object.entries(datasets)) {
  const levels = [...new Set(words.map((word) => word.level))]
  lessonPools[languageId] = {}
  for (const level of levels) {
    const rows = words.filter((word) => word.level === level).slice(0, 180).map((word) => [
      word.word || '', word.ipa || '', word.partOfSpeech || '', word.meaningVi || word.definition || '',
      word.example || '', word.translation || '',
    ])
    lessonPools[languageId][level] = rows
  }
}
await writeFile(new URL('lesson-pools.json', outputDir), `${JSON.stringify(lessonPools)}\n`)


await writeFile(new URL('index.js', outputDir), `import english from './english.json' with { type: 'json' }\nimport chinese from './chinese.json' with { type: 'json' }\nimport japanese from './japanese.json' with { type: 'json' }\nimport korean from './korean.json' with { type: 'json' }\n\nexport const generatedVocabulary = [...english, ...chinese, ...japanese, ...korean]\n`)
console.log(`total: ${Object.values(datasets).flat().length}`)

const { vocabularyCatalog } = await import('../src/data/vocabulary/catalog.js')
const runtimeGroups = new Map()
for (const word of vocabularyCatalog) {
  const key = `${word.languageId}::${word.level}`
  if (!runtimeGroups.has(key)) runtimeGroups.set(key, [])
  runtimeGroups.get(key).push(word)
}
for (const [key, words] of runtimeGroups) {
  const [languageId, level] = key.split('::')
  const fileName = `${languageId}-${slug(level)}.json`
  await writeFile(new URL(fileName, runtimeDir), `${JSON.stringify(words)}\n`)
}
const searchIndex = vocabularyCatalog.map(({ languageId, level, word, meaningVi, topic }) => [languageId, level, word, meaningVi, topic || ''])
await writeFile(new URL('search-index.json', runtimeDir), `${JSON.stringify(searchIndex)}\n`)
console.log(`runtime vocabulary chunks: ${runtimeGroups.size}; search index: ${searchIndex.length}`)

