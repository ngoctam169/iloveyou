import { DatabaseSync } from 'node:sqlite'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const TARGET_PER_LEVEL = 1000
const cacheDir = join(tmpdir(), 'nt-vocabulary-cache')
const outputDir = new URL('../public/vocabulary-data/', import.meta.url)
const outputPath = fileURLToPath(outputDir)

const sources = {
  dictionary: ['nt-en-vi.db', 'https://raw.githubusercontent.com/skypediacode/english-vietnamese-dictionary/main/dictionary_en_vi.db'],
  cefr: ['cefrj-vocabulary-profile-1.5.csv', 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/cefrj-vocabulary-profile-1.5.csv'],
  advanced: ['octanove-vocabulary-profile-c1c2-1.0.csv', 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/octanove-vocabulary-profile-c1c2-1.0.csv'],
  cvdict: ['CVDICT.u8', 'https://raw.githubusercontent.com/ph0ngp/CVDICT/master/CVDICT.u8'],
  korean: ['topik-vocab-vi.csv', 'https://topikvocab.foldalpha.com/download/topik-vocab-vi.csv'],
}

await mkdir(cacheDir, { recursive:true })

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
const compact = (value = '', max = 220) => clean(value).replace(/^[-–—•]+\s*/, '').slice(0, max)
const slug = (value) => clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
const levelFile = (level) => slug(level)

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
const inferTopic = (...parts) => topicRules.find(([, pattern]) => pattern.test(parts.filter(Boolean).join(' ')))?.[0] || 'General'

const posNames = { n:'noun', v:'verb', a:'adjective', r:'adverb', d:'adverb', p:'preposition', c:'conjunction', u:'particle', m:'number', t:'time expression', q:'classifier', e:'interjection' }
const normalizePos = (value = '') => posNames[String(value).split(/[;,/]/)[0].toLowerCase()] || clean(value).toLowerCase()

const dictionaryPos = {
  noun:['N'], verb:['V'], 'be-verb':['V'], 'do-verb':['V'], 'have-verb':['V'], 'modal auxiliary':['V'],
  adjective:['A'], adverb:['D','adv'], pronoun:['P'], preposition:['E'], 'infinitive-to':['E'],
  conjunction:['C'], determiner:['X'], interjection:['O'], number:['A','N'],
}

function chooseDictionaryRow(rows, preferredPos = '') {
  const expected = dictionaryPos[clean(preferredPos).toLowerCase()] || []
  return rows
    .map((row) => {
      const definition = compact(row.definition)
      const posMatch = expected.includes(row.pos) || normalizePos(row.pos) === normalizePos(preferredPos)
      const cleanSense = definition && !/[\[\]{}<>]|(^|\s)(tục|thô tục|xem |viết tắt)/i.test(definition)
      return { ...row, definition, score:(posMatch ? 100 : 0) + (cleanSense ? 10 : 0) + (definition.length >= 3 && definition.length <= 180 ? 5 : 0) + (row.ipa ? 1 : 0) }
    })
    .filter((row) => row.definition)
    .sort((a, b) => b.score - a.score || (a.definitionId || 0) - (b.definitionId || 0))[0]
}

const baseWord = (languageId, level, index, data) => ({
  id: `${languageId}-${levelFile(level)}-${slug(data.word)}`,
  languageId,
  level,
  officialLevel: data.officialLevel || level,
  levelBasis: data.officialLevel && data.officialLevel !== level ? 'NT expanded learning band' : 'source level',
  word: clean(data.word),
  ipa: clean(data.ipa),
  partOfSpeech: clean(data.partOfSpeech),
  meaningVi: compact(data.meaningVi),
  definition: compact(data.definition),
  example: compact(data.example, 280),
  translation: compact(data.translation, 280),
  translationLanguage: data.translationLanguage || 'vi',
  topic: clean(data.topic) || 'General',
  exam: data.exam || 'General',
  collocations: data.collocations || [],
  synonyms: [],
  antonyms: [],
  wordFamily: [],
  phrases: [],
  lessonIds: [],
  lessons: [],
  source: data.source,
})

function allocateBands(candidates, appLevels, sourceOrder, target = TARGET_PER_LEVEL) {
  const used = new Set()
  const result = {}
  const bySource = new Map(sourceOrder.map((level) => [level, candidates.filter((word) => word.officialLevel === level)]))

  for (const appLevel of appLevels) {
    const preferredIndex = sourceOrder.indexOf(appLevel)
    const selected = []
    const addFrom = (pool) => {
      for (const word of pool || []) {
        const key = clean(word.word).normalize('NFKC').toLocaleLowerCase()
        if (!key || used.has(key)) continue
        selected.push(word)
        used.add(key)
        if (selected.length >= target) break
      }
    }

    addFrom(bySource.get(appLevel))
    for (let offset = 1; selected.length < target && offset < sourceOrder.length; offset += 1) {
      const harder = sourceOrder[preferredIndex + offset]
      if (harder) addFrom(bySource.get(harder))
    }
    for (let offset = 1; selected.length < target && offset < sourceOrder.length; offset += 1) {
      const easier = sourceOrder[preferredIndex - offset]
      if (easier) addFrom(bySource.get(easier))
    }
    if (selected.length < target) {
      const local = new Set(selected.map((word) => clean(word.word).normalize('NFKC').toLocaleLowerCase()))
      for (const word of candidates) {
        const key = clean(word.word).normalize('NFKC').toLocaleLowerCase()
        if (!key || local.has(key)) continue
        selected.push({ ...word, reusedAcrossLevels:true })
        local.add(key)
        if (selected.length >= target) break
      }
    }
    if (selected.length < target) throw new Error(`${appLevel}: expected ${target}, got ${selected.length}`)
    result[appLevel] = selected.slice(0, target).map((word, index) => baseWord(word.languageId, appLevel, index, word))
  }
  return result
}

async function loadTatoebaEnglish() {
  const pairs = JSON.parse(await readFile(new URL('./vocabulary-sources/tatoeba-en-vi.json', import.meta.url), 'utf8'))
  const index = new Map()
  for (const [example, translation] of pairs) {
    if (!example || !translation) continue
    const tokens = new Set(String(example).toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [])
    for (const token of tokens) if (!index.has(token)) index.set(token, { example, translation })
  }
  return index
}

async function buildEnglish(db) {
  const [cefrPath, advancedPath, examples] = await Promise.all([cached(sources.cefr), cached(sources.advanced), loadTatoebaEnglish()])
  const profiles = [...parseCsv(await readFile(cefrPath, 'utf8')).slice(1), ...parseCsv(await readFile(advancedPath, 'utf8')).slice(1)]
  const levels = ['A1','A2','B1','B2','C1','C2']
  const lookup = db.prepare(`
    SELECT DISTINCT d.id AS definitionId, p.ipa, d.definition, d.pos, wd.example
    FROM words w
    LEFT JOIN pronunciations p ON p.word_id = w.id
    JOIN word_definitions wd ON wd.word_id = w.id
    JOIN definitions d ON d.id = wd.definition_id
    WHERE w.word = ? COLLATE NOCASE AND d.definition_lang = 'vi'
  `)
  const byLevel = Object.fromEntries(levels.map((level) => [level, []]))

  for (const row of profiles) {
    const [headword, profilePos, level, ...tags] = row
    const word = clean(headword)
    if (!levels.includes(level) || !/^[A-Za-z][A-Za-z' -]{0,40}$/.test(word)) continue
    if (byLevel[level].some((item) => item.word.toLowerCase() === word.toLowerCase())) continue
    const dictionary = chooseDictionaryRow(lookup.all(word), profilePos)
    if (!dictionary?.definition) continue
    const sample = !word.includes(' ') ? examples.get(word.toLowerCase()) : null
    byLevel[level].push({
      languageId:'english', officialLevel:level, word, ipa:dictionary.ipa || '', partOfSpeech:normalizePos(profilePos || dictionary.pos),
      meaningVi:dictionary.definition, definition:'', example:sample?.example || dictionary.example || '', translation:sample?.translation || '',
      topic:inferTopic(tags.join(' '), dictionary.definition), exam:'CEFR',
      source:level === 'C1' || level === 'C2' ? 'Octanove Vocabulary Profile + EN–VI dictionary' : 'CEFR-J Vocabulary Profile + EN–VI dictionary',
    })
  }

  const result = {}
  for (const level of levels) {
    const selected = byLevel[level].sort((a,b) => a.word.localeCompare(b.word,'en')).slice(0,TARGET_PER_LEVEL)
    if (selected.length < TARGET_PER_LEVEL) throw new Error(`English ${level}: expected ${TARGET_PER_LEVEL}, got ${selected.length}`)
    result[level] = selected.map((word,index) => baseWord('english',level,index,word))
  }
  return result
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
  const sourceLevels = ['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6','HSK 7']
  const appLevels = sourceLevels.slice(0,6)
  const candidates = []

  for (let number = 1; number <= 7; number += 1) {
    const path = await cached([`hsk-new-${number}.json`, `https://raw.githubusercontent.com/jelleverheyen/hsk-vocabulary/main/wordlists/exclusive/new/${number}.min.json`])
    const rows = JSON.parse(await readFile(path,'utf8')).sort((a,b) => (a.q || 999999) - (b.q || 999999))
    for (const row of rows) {
      const translation = dictionary.get(row.s)
      const form = row.f?.[0]
      if (!row.s || !translation?.meanings?.[0]) continue
      candidates.push({
        languageId:'chinese', officialLevel:`HSK ${number}`, word:row.s, ipa:form?.i?.y || translation.pinyin || '',
        partOfSpeech:normalizePos(row.p?.[0]), meaningVi:translation.meanings[0], definition:form?.m?.join('; ') || '',
        example:'', translation:'', topic:inferTopic(form?.m?.join(' '), translation.meanings.join(' ')), exam:'HSK',
        collocations:form?.c || [], source:'HSK 3.0 vocabulary + CVDICT',
      })
    }
  }
  return allocateBands(candidates, appLevels, sourceLevels)
}

function glossCandidates(value = '') {
  return [...new Set(clean(value).replace(/^to\s+/i,'').split(/[;,/]|\s+\(/).map((part) => clean(part).replace(/\.$/,'')).filter((part) => /^[a-z][a-z' -]{1,40}$/i.test(part)))]
}

async function buildJapanese(db) {
  const levels = ['N5','N4','N3','N2','N1']
  const lookup = db.prepare(`
    SELECT DISTINCT d.id AS definitionId, p.ipa, d.definition, d.pos
    FROM words w
    LEFT JOIN pronunciations p ON p.word_id = w.id
    JOIN word_definitions wd ON wd.word_id = w.id
    JOIN definitions d ON d.id = wd.definition_id
    WHERE w.word = ? COLLATE NOCASE AND d.definition_lang = 'vi'
  `)
  const candidates = []

  for (const level of levels) {
    const path = await cached([`openjlpt-${level.toLowerCase()}.csv`, `https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/csv/vocab-${level.toLowerCase()}.csv`])
    const [headers,...rows] = parseCsv(await readFile(path,'utf8'))
    for (const row of rows) {
      const item = Object.fromEntries(headers.map((header,index) => [header,row[index] || '']))
      if (!item.word) continue
      let dictionary
      for (const gloss of glossCandidates(item.meanings)) {
        dictionary = chooseDictionaryRow(lookup.all(gloss))
        if (dictionary?.definition) break
      }
      const vietnamese = dictionary?.definition || `[EN] ${compact(item.meanings)}`
      candidates.push({
        languageId:'japanese', officialLevel:level, word:item.word, ipa:item.reading || '', partOfSpeech:normalizePos(dictionary?.pos || ''),
        meaningVi:vietnamese, definition:compact(item.meanings), example:item.example_ja || '', translation:item.example_en || '',
        translationLanguage:'en', topic:inferTopic(item.meanings,vietnamese), exam:'JLPT', source:'OpenJLPT + EN–VI dictionary',
      })
    }
  }
  return allocateBands(candidates, levels, levels)
}

const koreanPos = { 의:'particle', 동:'verb', 명:'noun', 형:'adjective', 부:'adverb', 보:'auxiliary verb', 대:'pronoun', 관:'determiner', 수:'number', 감:'interjection', 접:'affix' }
async function buildKorean() {
  const path = await cached(sources.korean)
  const [headers,...rows] = parseCsv(await readFile(path,'utf8'))
  const records = rows
    .map((row) => Object.fromEntries(headers.map((header,index) => [header,row[index] || ''])))
    .filter((row) => clean(row.word) && clean(row.meaning))

  const gradeOrder = { A:0, B:1, C:2 }
  records.sort((a,b) => (gradeOrder[a.nikl_grade?.[0]] ?? 9) - (gradeOrder[b.nikl_grade?.[0]] ?? 9) || clean(a.word).localeCompare(clean(b.word),'ko'))

  const unique = []
  const seen = new Set()
  for (const row of records) {
    const key = clean(row.word).normalize('NFKC').toLocaleLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(row)
  }
  if (unique.length < TARGET_PER_LEVEL) throw new Error(`Korean source has only ${unique.length} unique words`)

  const levels = ['TOPIK 1','TOPIK 2','TOPIK 3','TOPIK 4','TOPIK 5','TOPIK 6']
  const output = {}
  for (let index = 0; index < levels.length; index += 1) {
    const start = index * TARGET_PER_LEVEL
    let rowsForLevel = unique.slice(start, start + TARGET_PER_LEVEL)
    if (rowsForLevel.length < TARGET_PER_LEVEL) {
      const local = new Set(rowsForLevel.map((row) => clean(row.word).normalize('NFKC').toLocaleLowerCase()))
      for (const row of unique) {
        const key = clean(row.word).normalize('NFKC').toLocaleLowerCase()
        if (local.has(key)) continue
        rowsForLevel.push(row)
        local.add(key)
        if (rowsForLevel.length >= TARGET_PER_LEVEL) break
      }
    }
    if (rowsForLevel.length < TARGET_PER_LEVEL) throw new Error(`${levels[index]}: expected ${TARGET_PER_LEVEL}, got ${rowsForLevel.length}`)
    output[levels[index]] = rowsForLevel.map((row, wordIndex) => baseWord('korean',levels[index],wordIndex,{
      officialLevel:row.nikl_grade ? `NIKL ${row.nikl_grade}` : (row.topik_level || 'Korean source ungraded'),
      word:row.word, ipa:row.pronunciation || '', partOfSpeech:koreanPos[row.pos] || row.pos,
      meaningVi:row.meaning, definition:row.definition_ko || '', example:row.example_ko, translation:row.example_translation,
      topic:inferTopic(row.meaning,row.example_translation), exam:'TOPIK learning band', source:'NIKL/TOPIK vocabulary Vietnamese export',
    }))
  }
  return output
}

async function writeDatasets(datasets) {
  await rm(outputPath,{ recursive:true, force:true })
  await mkdir(outputPath,{ recursive:true })
  const manifest = {
    version:2,
    targetPerLevel:TARGET_PER_LEVEL,
    generatedAt:new Date().toISOString(),
    note:'NT learning bands target about 1000 words per app level. officialLevel and levelBasis preserve source-level provenance when a source list is smaller than 1000.',
    languages:{},
  }

  for (const [languageId, levels] of Object.entries(datasets)) {
    const languageDir = join(outputPath,languageId)
    await mkdir(languageDir,{ recursive:true })
    manifest.languages[languageId] = {}
    for (const [level, words] of Object.entries(levels)) {
      const file = `${levelFile(level)}.json`
      await writeFile(join(languageDir,file),`${JSON.stringify(words)}\n`)
      manifest.languages[languageId][level] = { count:words.length, file:`${languageId}/${file}` }
      console.log(`${languageId} ${level}: ${words.length}`)
    }
  }
  await writeFile(join(outputPath,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`)
  return manifest
}

const manifestPath = join(outputPath,'manifest.json')
if (process.env.VOCAB_REFRESH !== '1' && existsSync(manifestPath)) {
  try {
    const previous = JSON.parse(await readFile(manifestPath,'utf8'))
    const counts = Object.values(previous.languages || {}).flatMap((levels) => Object.values(levels).map((item) => item.count))
    if (previous.targetPerLevel === TARGET_PER_LEVEL && counts.length === 23 && counts.every((count) => count >= TARGET_PER_LEVEL)) {
      console.log(`Vocabulary data already built: ${counts.length} levels × ${TARGET_PER_LEVEL}. Set VOCAB_REFRESH=1 to rebuild.`)
      process.exit(0)
    }
  } catch { /* rebuild invalid cache */ }
}

const dbPath = await cached(sources.dictionary)
const db = new DatabaseSync(dbPath,{ readOnly:true })
const datasets = {
  english:await buildEnglish(db),
  chinese:await buildChinese(),
  japanese:await buildJapanese(db),
  korean:await buildKorean(),
}
db.close()
await writeDatasets(datasets)
console.log(`Vocabulary build complete: ${Object.values(datasets).flatMap((levels) => Object.values(levels)).reduce((sum,words) => sum + words.length,0)} words across 23 app levels.`)
