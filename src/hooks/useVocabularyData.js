import { useEffect, useMemo, useState } from 'react'
import { getCachedVocabularyScope, loadVocabularyKeys, loadVocabularyScope, mergePersonalVocabulary } from '../services/vocabularyRuntime'

export function useVocabularyData(state, languageId, level) {
  const [baseWords, setBaseWords] = useState(() => getCachedVocabularyScope(languageId, level))
  const [loading, setLoading] = useState(() => !baseWords.length)
  const [error, setError] = useState(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let active = true
    const cached = getCachedVocabularyScope(languageId, level)
    setBaseWords(cached)
    setLoading(!cached.length)
    setError(null)
    loadVocabularyScope(languageId, level).then((words) => {
      if (!active) return
      setBaseWords(words)
      setLoading(false)
    }).catch((reason) => {
      if (!active) return
      setError(reason instanceof Error ? reason : new Error('Không tải được dữ liệu từ vựng.'))
      setLoading(false)
    })
    return () => { active = false }
  }, [languageId, level, retryToken])

  const words = useMemo(
    () => mergePersonalVocabulary(state, baseWords, languageId, level),
    [baseWords, state.personalVocabulary, languageId, level],
  )
  return { words, loading, error, retry:() => setRetryToken((value) => value + 1) }
}

export function useVocabularyKeys(state, keys = []) {
  const keySignature = [...keys].sort().join('|')
  const [baseWords, setBaseWords] = useState([])
  const [loading, setLoading] = useState(Boolean(keys.length))
  const [error, setError] = useState(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let active = true
    if (!keys.length) {
      setBaseWords([])
      setLoading(false)
      return () => { active = false }
    }
    setLoading(true)
    setError(null)
    loadVocabularyKeys(keys).then((words) => {
      if (!active) return
      setBaseWords(words)
      setLoading(false)
    }).catch((reason) => {
      if (!active) return
      setError(reason instanceof Error ? reason : new Error('Không tải được dữ liệu từ vựng.'))
      setLoading(false)
    })
    return () => { active = false }
  }, [keySignature, retryToken])

  const words = useMemo(() => mergePersonalVocabulary(state, baseWords), [baseWords, state.personalVocabulary])
  return { words, loading, error, retry:() => setRetryToken((value) => value + 1) }
}
