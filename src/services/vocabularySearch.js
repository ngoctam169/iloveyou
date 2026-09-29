const normalizeSearch = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim()

export function searchVocabulary(source = [], query, filters = {}) {
  const needle = normalizeSearch(query)
  return source.filter((word) => {
    if (filters.languageId && word.languageId !== filters.languageId) return false
    if (filters.level && word.level !== filters.level) return false
    if (filters.topic && word.topic !== filters.topic) return false
    if (!needle) return true
    const text = [word.word, word.ipa, word.meaningVi, word.definition, word.example, word.translation, word.topic, word.partOfSpeech, ...(word.collocations || []), ...(word.phrases || []), ...(word.synonyms || [])].join(' ')
    return normalizeSearch(text).includes(needle)
  })
}

export function getRandomVocabulary(source = [], options = {}, count = 1) {
  const matches = searchVocabulary(source, '', options)
  const shuffled = [...matches]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]]
  }
  return shuffled.slice(0, Math.max(0, count))
}
