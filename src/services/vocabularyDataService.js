import { vocabularyCatalog } from '../data/vocabulary/catalog.js'

const memoryCache = new Map()
const pending = new Map()

export const vocabularyLevelFile = (level = '') => String(level)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const dataUrl = (languageId, level) => `${import.meta.env.BASE_URL || '/'}vocabulary-data/${languageId}/${vocabularyLevelFile(level)}.json`

export async function loadVocabularyLevel(languageId, level) {
  if (!languageId || !level) return []
  const key = `${languageId}:${level}`
  if (memoryCache.has(key)) return memoryCache.get(key)
  if (pending.has(key)) return pending.get(key)

  const request = fetch(dataUrl(languageId, level), { cache:'force-cache' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Vocabulary data ${languageId} ${level} returned ${response.status}`)
      const words = await response.json()
      if (!Array.isArray(words)) throw new Error(`Vocabulary data ${languageId} ${level} is invalid`)
      memoryCache.set(key, words)
      pending.delete(key)
      return words
    })
    .catch((error) => {
      pending.delete(key)
      throw error
    })

  pending.set(key, request)
  return request
}

export async function loadVocabularyLevels(languageId, levels = []) {
  const groups = await Promise.all(levels.map((level) => loadVocabularyLevel(languageId, level)))
  return groups.flat()
}

export function mergeVocabularySources(state, remoteWords = [], languageId = null, levels = []) {
  const allowedLevels = new Set(levels.filter(Boolean))
  const inScope = (word) => (!languageId || word.languageId === languageId) && (!allowedLevels.size || allowedLevels.has(word.level))
  const merged = new Map()
  const semanticKey = (word) => `${word.languageId || 'english'}:${word.level}:${String(word.word).normalize('NFKC').trim().toLocaleLowerCase()}`

  for (const word of remoteWords.filter(inScope)) merged.set(semanticKey(word), word)
  for (const word of vocabularyCatalog.filter(inScope)) {
    const key = semanticKey(word)
    const remote = merged.get(key)
    merged.set(key, remote ? { ...remote, ...word, id:remote.id } : word)
  }
  for (const word of (state?.personalVocabulary || []).filter(inScope)) merged.set(semanticKey(word), word)

  return [...merged.values()]
}

export function clearVocabularyMemoryCache() {
  memoryCache.clear()
  pending.clear()
}
