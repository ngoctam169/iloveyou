import { useEffect, useMemo, useState } from 'react'
import { loadVocabularyLevels, mergeVocabularySources } from '../services/vocabularyDataService.js'

export function useVocabularyData(state, language, selectedLevel = null) {
  const levels = useMemo(() => {
    if (!language) return []
    if (selectedLevel && selectedLevel !== 'All levels') return [selectedLevel]
    return language.levels.map(([name]) => name)
  }, [language?.id, selectedLevel])

  const [remoteWords, setRemoteWords] = useState([])
  const [loading, setLoading] = useState(Boolean(language && levels.length))
  const [error, setError] = useState(null)
  const levelKey = levels.join('|')

  useEffect(() => {
    let cancelled = false
    if (!language || !levels.length) {
      setRemoteWords([])
      setLoading(false)
      setError(null)
      return undefined
    }

    setLoading(true)
    setError(null)
    loadVocabularyLevels(language.id, levels)
      .then((words) => {
        if (!cancelled) setRemoteWords(words)
      })
      .catch((reason) => {
        if (!cancelled) {
          setRemoteWords([])
          setError(reason instanceof Error ? reason : new Error(String(reason)))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [language?.id, levelKey])

  const words = useMemo(
    () => mergeVocabularySources(state, remoteWords, language?.id, levels),
    [state?.personalVocabulary, remoteWords, language?.id, levelKey],
  )

  return { words, loading, error, levels }
}
