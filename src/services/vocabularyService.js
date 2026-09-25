import { vocabularyCatalog } from '../data/vocabulary/catalog.js'
import { isDue, wordKey } from '../utils/srs.js'
export { normalizePersonalWord } from './personalVocabularyService.js'

const normalizeSearch = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim()
const wordsFrom = (source) => Array.isArray(source) ? source : allVocabulary(source)

export function allVocabulary(state) {
  const personal = Array.isArray(state?.personalVocabulary) ? state.personalVocabulary : []
  const keys = new Set(personal.map(wordKey))
  return [...personal, ...vocabularyCatalog.filter((word) => !keys.has(wordKey(word)))]
}

export function vocabularyForState(state, languageId, level) {
  return allVocabulary(state).filter((word) => word.languageId === languageId && (!level || word.level === level))
}

export const getVocabulary = allVocabulary

export function getVocabularyByLanguage(state, languageId) {
  return allVocabulary(state).filter((word) => word.languageId === languageId)
}

export function getVocabularyByLevel(state, languageId, level) {
  return getVocabularyByLanguage(state, languageId).filter((word) => word.level === level)
}

export function getVocabularyByTopic(state, languageId, topic, level) {
  return vocabularyForState(state, languageId, level).filter((word) => word.topic === topic)
}

export function searchVocabulary(source, query, filters = {}) {
  const needle = normalizeSearch(query)
  return wordsFrom(source).filter((word) => {
    if (filters.languageId && word.languageId !== filters.languageId) return false
    if (filters.level && word.level !== filters.level) return false
    if (filters.topic && word.topic !== filters.topic) return false
    if (!needle) return true
    const text = [word.word, word.ipa, word.meaningVi, word.definition, word.example, word.translation, word.topic, word.partOfSpeech, ...(word.collocations || []), ...(word.phrases || []), ...(word.synonyms || [])].join(' ')
    return normalizeSearch(text).includes(needle)
  })
}

export function getRandomVocabulary(source, options = {}, count = 1) {
  const matches = searchVocabulary(source, '', options)
  const shuffled = [...matches]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]]
  }
  return shuffled.slice(0, Math.max(0, count))
}

export function getReviewVocabulary(state, languageId, level) {
  return vocabularyForState(state, languageId, level)
    .filter((word) => isDue(state?.flashcardProgress?.[wordKey(word)]))
    .sort((a, b) => Date.parse(state.flashcardProgress[wordKey(a)].nextReview) - Date.parse(state.flashcardProgress[wordKey(b)].nextReview))
}
