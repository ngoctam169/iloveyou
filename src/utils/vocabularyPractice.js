const normalizeAnswer = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '')

const types = ['meaning', 'word', 'gap', 'listenChoice', 'listenType', 'match', 'context', 'write', 'synonym', 'collocation', 'sentence']
const labels = {
  meaning: 'Chọn nghĩa', word: 'Chọn từ theo nghĩa', gap: 'Điền từ vào câu',
  listenChoice: 'Nghe và chọn từ', listenType: 'Nghe và viết từ', match: 'Ghép từ với nghĩa',
  context: 'Chọn từ trong ngữ cảnh', write: 'Viết từ theo nghĩa',
  synonym: 'Chọn từ đồng nghĩa', collocation: 'Chọn cụm từ', sentence: 'Chọn câu đúng',
}

function choices(correct, source, index) {
  const other = [...new Set(source.filter((value) => value && value !== correct))]
  const options = [correct, ...other.slice(index % Math.max(1, other.length), index % Math.max(1, other.length) + 3)]
  for (const value of other) if (options.length < 4 && !options.includes(value)) options.push(value)
  const position = index % options.length
  options.splice(position, 0, options.shift())
  return { options, answer: position }
}

function exampleGap(word) {
  const match = word.example?.toLocaleLowerCase().indexOf(word.word.toLocaleLowerCase()) ?? -1
  return match < 0 ? null : `${word.example.slice(0, match)}____${word.example.slice(match + word.word.length)}`
}

export function buildVocabularyPractice(words, catalogue, count = 11) {
  if (!words.length) return []
  return Array.from({ length: Math.min(count, Math.max(words.length, types.length)) }, (_, index) => {
    const word = words[index % words.length]
    const pool = catalogue.filter((item) => item.languageId === word.languageId && item.level === word.level)
    let kind = types[index % types.length]
    const gap = exampleGap(word)
    if ((kind === 'gap' || kind === 'context') && !gap) kind = 'write'
    if (kind === 'match' && new Set(pool.map((item) => item.meaningVi)).size < 3) kind = 'write'
    if (['meaning','word','listenChoice','context'].includes(kind) && pool.length < 2) kind = 'write'
    if (kind === 'synonym' && !word.synonyms?.length) kind = 'meaning'
    if (kind === 'collocation' && !word.collocations?.length) kind = 'meaning'
    if (kind === 'sentence' && (!word.example || pool.filter((item) => item.example && item.example !== word.example).length < 2)) kind = 'meaning'
    const base = { id: `${word.languageId}:${word.level}:${word.id}:${index}`, kind, word, type: labels[kind], explanation: `${word.word} — ${word.meaningVi}. ${word.example || ''}` }
    if (kind === 'match') {
      const pairs = [word, ...pool.filter((item) => item.id !== word.id && item.meaningVi !== word.meaningVi).slice(index, index + 2)]
      for (const item of pool) if (pairs.length < 3 && !pairs.some((pair) => pair.id === item.id)) pairs.push(item)
      return { ...base, question: 'Ghép mỗi từ với nghĩa đúng.', pairs: pairs.slice(0, 3), options: pairs.slice(0, 3).map((item) => item.meaningVi).reverse() }
    }
    if (kind === 'meaning') return { ...base, question: `“${word.word}” nghĩa là gì?`, ...choices(word.meaningVi, pool.map((item) => item.meaningVi), index) }
    if (kind === 'word') return { ...base, question: `Từ nào có nghĩa là “${word.meaningVi}”?`, ...choices(word.word, pool.map((item) => item.word), index) }
    if (kind === 'listenChoice') return { ...base, question: 'Nghe và chọn từ bạn vừa nghe.', audio: true, ...choices(word.word, pool.map((item) => item.word), index) }
    if (kind === 'listenType') return { ...base, question: 'Nghe và viết lại từ bạn vừa nghe.', audio: true, correct: word.word }
    if (kind === 'gap') return { ...base, question: `Điền từ còn thiếu: ${gap}`, correct: word.word }
    if (kind === 'context') return { ...base, question: `Chọn từ phù hợp: ${gap}`, ...choices(word.word, pool.map((item) => item.word), index) }
    if (kind === 'synonym') return { ...base, question: `Từ nào gần nghĩa với “${word.word}”?`, ...choices(word.synonyms[0], pool.flatMap((item) => item.synonyms || []).concat(pool.map((item) => item.word)), index) }
    if (kind === 'collocation') return { ...base, question: `Cụm từ nào đi với “${word.word}”?`, ...choices(word.collocations[0], pool.flatMap((item) => item.collocations || []), index) }
    if (kind === 'sentence') return { ...base, question: `Câu nào dùng đúng từ “${word.word}”?`, ...choices(word.example, pool.map((item) => item.example), index) }
    return { ...base, question: `Viết từ có nghĩa “${word.meaningVi}”.`, correct: word.word }
  })
}

export function checkVocabularyAnswer(question, value) {
  if (question.kind === 'match') return Array.isArray(value) && question.pairs.every((word, index) => question.options[value[index]] === word.meaningVi)
  if (question.options) return value === question.answer
  return normalizeAnswer(value) === normalizeAnswer(question.correct)
}
