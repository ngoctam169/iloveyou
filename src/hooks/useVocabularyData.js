import { useEffect, useMemo, useState } from 'react'
import { getCachedVocabularyScope, loadVocabularyKeys, loadVocabularyScope, mergePersonalVocabulary } from '../services/vocabularyRuntime'

export function useVocabularyData(state, languageId, level) {
  const [baseWords, setBaseWords] = useState(() => getCachedVocabularyScope(languageId, level))
  const [loading, setLoading] = useState(() => !baseWords.length)

  useEffect(() => {
    let active = true
    const cached = getCachedVocabularyScope(languageId, level)
    setBaseWords(cached)
    setLoading(!cached.length)
    loadVocabularyScope(languageId, level).then((words) => {
      if (!active) return
      setBaseWords(words)
      setLoading(false)
    })
    return () => { active = false }
  }, [languageId, level])

  const words = useMemo(
    () => mergePersonalVocabulary(state, baseWords, languageId, level),
    [baseWords, state.personalVocabulary, languageId, level],
  )
  return { words, loading }
}

export function useVocabularyKeys(state, keys = []) {
  const keySignature = [...keys].sort().join('|')
  const [baseWords, setBaseWords] = useState([])
  const [loading, setLoading] = useState(Boolean(keys.length))

  useEffect(() => {
    let active = true
    if (!keys.length) {
      setBaseWords([])
      setLoading(false)
      return () => { active = false }
    }
    setLoading(true)
    loadVocabularyKeys(keys).then((words) => {
      if (!active) return
      setBaseWords(words)
      setLoading(false)
    })
    return () => { active = false }
  }, [keySignature])

  const words = useMemo(() => mergePersonalVocabulary(state, baseWords), [baseWords, state.personalVocabulary])
  return { words, loading }
}
