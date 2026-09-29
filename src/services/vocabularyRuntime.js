import { getLanguage, levelSlug } from '../data/languages'
import { wordKey } from '../utils/srs'

const chunkLoaders = import.meta.glob('../data/vocabulary/generated/runtime/*.json', { import:'default' })
const scopeCache = new Map()
let searchIndexPromise

const scopeKey = (languageId, level) => `${languageId}:${level}`
const runtimePath = (languageId, level) => `../data/vocabulary/generated/runtime/${languageId}-${levelSlug(level)}.json`

export function getCachedVocabularyScope(languageId, level) {
  if (!languageId) return []
  if (level) return scopeCache.get(scopeKey(languageId, level)) || []
  const language = getLanguage(languageId)
  return language ? language.levels.flatMap(([name]) => scopeCache.get(scopeKey(languageId, name)) || []) : []
}

export async function loadVocabularyScope(languageId, level) {
  const language = getLanguage(languageId)
  if (!language) return []
  const levels = level ? [level] : language.levels.map(([name]) => name)
  await Promise.all(levels.map(async (name) => {
    const key = scopeKey(languageId, name)
    if (scopeCache.has(key)) return
    const loader = chunkLoaders[runtimePath(languageId, name)]
    if (!loader) {
      scopeCache.set(key, [])
      return
    }
    const words = await loader()
    scopeCache.set(key, Array.isArray(words) ? words : [])
  }))
  return getCachedVocabularyScope(languageId, level)
}

export function mergePersonalVocabulary(state, words, languageId, level) {
  const personal = Array.isArray(state?.personalVocabulary) ? state.personalVocabulary.filter((word) =>
    (!languageId || word.languageId === languageId) && (!level || word.level === level)
  ) : []
  if (!personal.length) return words
  const personalKeys = new Set(personal.map(wordKey))
  return [...personal, ...words.filter((word) => !personalKeys.has(wordKey(word)))]
}

export async function loadVocabularyKeys(keys = []) {
  const scopes = new Set()
  for (const key of keys) {
    const [languageId, level] = String(key).split(':')
    if (languageId && level) scopes.add(`${languageId}:${level}`)
  }
  await Promise.all([...scopes].map((scope) => {
    const split = scope.indexOf(':')
    return loadVocabularyScope(scope.slice(0, split), scope.slice(split + 1))
  }))
  return [...scopes].flatMap((scope) => {
    const split = scope.indexOf(':')
    return getCachedVocabularyScope(scope.slice(0, split), scope.slice(split + 1))
  })
}

export async function loadVocabularySearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = import('../data/vocabulary/generated/runtime/search-index.json', { with:{ type:'json' } })
      .then((module) => module.default || [])
  }
  return searchIndexPromise
}

export function clearVocabularyRuntimeCache() {
  scopeCache.clear()
  searchIndexPromise = undefined
}
