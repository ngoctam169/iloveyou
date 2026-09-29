import { getLanguage, levelSlug } from '../data/languages'
import { wordKey } from '../utils/srs'

const scopeCache = new Map()
const pendingScopes = new Map()
let searchIndexPromise

const scopeKey = (languageId, level) => `${languageId}:${level}`
const dataUrl = (file) => `${import.meta.env.BASE_URL}data/vocabulary/${file}`
const runtimeFile = (languageId, level) => `${languageId}-${levelSlug(level)}.json`

async function fetchJson(file) {
  const response = await fetch(dataUrl(file), { credentials:'same-origin' })
  if (!response.ok) throw new Error(`Không tải được dữ liệu từ vựng (${response.status})`)
  return response.json()
}

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
    if (!pendingScopes.has(key)) {
      pendingScopes.set(key, fetchJson(runtimeFile(languageId, name))
        .then((words) => {
          scopeCache.set(key, Array.isArray(words) ? words : [])
          return scopeCache.get(key)
        })
        .finally(() => pendingScopes.delete(key)))
    }
    await pendingScopes.get(key)
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
  if (!searchIndexPromise) searchIndexPromise = fetchJson('search-index.json')
    .then((items) => Array.isArray(items) ? items : [])
    .catch((error) => {
      searchIndexPromise = undefined
      throw error
    })
  return searchIndexPromise
}

export function clearVocabularyRuntimeCache() {
  scopeCache.clear()
  pendingScopes.clear()
  searchIndexPromise = undefined
}
