import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearState, defaultState, loadState, saveState } from '../utils/storage'
import { averageSkillScores, emptyLevelProgress, progressKey } from '../utils/progress'
import { applyActivity } from '../utils/activity'
import { localDate, nextSchedule, wordKey } from '../utils/srs'
import { normalizePersonalWord } from '../services/personalVocabularyService'
import { vocabularyPath } from '../utils/routes'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [toast, setToast] = useState('')
  const storageWarningShown = useRef(false)

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.lang = 'vi'
    const saved = saveState(state)
    if (!saved && !storageWarningShown.current) {
      storageWarningShown.current = true
      setToast('Không thể lưu tiến độ trên thiết bị này. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.')
    } else if (saved) storageWarningShown.current = false
  }, [state])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const update = (partial) => setState((current) => ({ ...current, ...(typeof partial === 'function' ? partial(current) : partial) }))
  const persistLessonSession = (lessonId, session) => setState((current) => ({
    ...current,
    lessonSessions: { ...(current.lessonSessions || {}), [lessonId]: session },
  }))
  const chooseCourse = (language, level) => update({ selectedLanguage: language, selectedLevel: level })

  const completeLesson = ({ lessonId, languageId, level, score, skills, vocabularyCount = 0, vocabularyWords = [], minutes = 8 }) => {
    setState((current) => {
      const key = progressKey(languageId, level)
      const previous = { ...emptyLevelProgress(), ...(current.levelProgress?.[key] || {}) }
      const completedLessons = Array.isArray(previous.completedLessons) ? previous.completedLessons : []
      const isNew = !completedLessons.includes(lessonId)
      const lessonSkillScores = { ...(previous.lessonSkillScores || {}), [lessonId]: skills }
      const activity = applyActivity(current, { type: 'Lesson', skill: 'Course', topic: lessonId, seconds: minutes * 60 })
      const vocabularyMeta = { ...(current.vocabularyMeta || {}) }
      const skillReview = { ...(current.skillReview || {}) }
      Object.entries(skills || {}).forEach(([skill, value]) => {
        if (skill === 'Vocabulary') return
        const reviewKey = `${languageId}:${level}:${lessonId}:${skill}`
        const previousReview = skillReview[reviewKey] || {}
        const schedule = nextSchedule(previousReview, Number(value) >= 70 ? 'good' : 'hard')
        skillReview[reviewKey] = { ...schedule, languageId, level, lessonId, skill, score:Number(value) || 0, updatedAt:new Date().toISOString() }
      })
      if (isNew) vocabularyWords.forEach((word) => {
        const wordId = wordKey({ languageId, level, word })
        vocabularyMeta[wordId] = { ...vocabularyMeta[wordId], started: true }
      })
      const levelWordPrefix = `${languageId}:${level}:`
      const actualVocabularyLearned = new Set([
        ...Object.entries(vocabularyMeta).filter(([key, meta]) => key.startsWith(levelWordPrefix) && meta?.learned).map(([key]) => key),
        ...Object.keys(current.flashcardProgress || {}).filter((key) => key.startsWith(levelWordPrefix)),
      ]).size
      const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0))
      const xpGain = isNew
        ? 40 + Math.round(normalizedScore * 0.6) + (normalizedScore === 100 ? 20 : 0)
        : Math.max(5, Math.round(normalizedScore * 0.15))
      return {
        ...activity,
        selectedLanguage: languageId,
        selectedLevel: level,
        levelProgress: {
          ...(current.levelProgress || {}),
          [key]: {
            ...previous,
            completedLessons: isNew ? [...completedLessons, lessonId] : completedLessons,
            lessonScores: { ...(previous.lessonScores || {}), [lessonId]: score },
            lessonSkillScores,
            skillScores: averageSkillScores(lessonSkillScores),
            vocabularyLearned: Math.max(Number(previous.vocabularyLearned) || 0, actualVocabularyLearned),
            studyMinutes: (Number(previous.studyMinutes) || 0) + minutes,
            lastLessonId: lessonId,
          },
        },
        vocabularyMeta,
        skillReview,
        xp: (Number(current.xp) || 0) + xpGain,
      }
    })
  }

  const toggleSaved = (item) => {
    setState((current) => {
      const exists = current.savedItems.find((saved) => saved.id === item.id || item.type === 'Vocabulary' && saved.type === 'Vocabulary' && saved.title?.toLocaleLowerCase() === item.title?.toLocaleLowerCase() && (saved.level || (saved.subtitle?.includes(item.level) ? item.level : null)) === item.level && (!saved.languageId || saved.languageId === item.languageId))
      return { ...current, savedItems: exists ? current.savedItems.filter((saved) => saved.id !== exists.id) : [...current.savedItems, item] }
    })
    setToast('Đã cập nhật mục đã lưu')
  }

  const removeMistake = (id) => setState((current) => ({ ...current, mistakes: current.mistakes.filter((item) => item.id !== id) }))
  const addMistakes = (mistakes) => setState((current) => {
    const incoming = Array.isArray(mistakes) ? mistakes.filter(Boolean) : [mistakes].filter(Boolean)
    if (!incoming.length) return current
    const now = new Date().toISOString()
    const byId = new Map((current.mistakes || []).map((item) => [item.id, item]))
    incoming.forEach((mistake) => {
      const previous = byId.get(mistake.id)
      byId.set(mistake.id, {
        ...previous,
        ...mistake,
        mistakeCount: (previous?.mistakeCount || 0) + 1,
        createdAt: previous?.createdAt || now,
        lastAttempted: now,
      })
    })
    const incomingIds = new Set(incoming.map((item) => item.id))
    return {
      ...current,
      mistakes: [
        ...incoming.map((item) => byId.get(item.id)),
        ...(current.mistakes || []).filter((item) => !incomingIds.has(item.id)),
      ].slice(0, 1000),
    }
  })
  const addMistake = (mistake) => addMistakes([mistake])

  const reviewVocabulary = (word, quality) => {
    setState((current) => {
      const normalizedWord = Array.isArray(word)
        ? { languageId: 'english', level: word.level || current.selectedLevel, id: word[0], word: word[0] }
        : word
      const key = wordKey(normalizedWord)
      const saved = current.flashcardProgress[key] || {}
      const schedule = nextSchedule(saved, quality)
      const reviewedAt = new Date().toISOString()
      const activity = applyActivity(current, { type: 'Vocabulary', skill: 'Vocabulary', wordKey: key, correct: quality === 'good' || quality === 'easy', seconds: 0 })
      return {
        ...activity,
        xp: (Number(current.xp) || 0) + 3,
        flashcardProgress: { ...current.flashcardProgress, [key]: schedule },
        vocabularyMeta: { ...current.vocabularyMeta, [key]: { ...current.vocabularyMeta?.[key], started: true } },
        vocabularyActivity: [...(current.vocabularyActivity || []).slice(-2999), { date: localDate(), reviewedAt, wordId: normalizedWord.id || normalizedWord.word, key, quality, correct: quality === 'good' || quality === 'easy' }],
      }
    })
  }

  const setVocabularyMeta = (word, patch) => {
    const key = wordKey(word)
    setState((current) => ({ ...current, vocabularyMeta: { ...current.vocabularyMeta, [key]: { ...current.vocabularyMeta?.[key], ...patch } } }))
  }

  const savePersonalWord = (input, existingId = null) => {
    const word = normalizePersonalWord(input, existingId)
    if (state.personalVocabulary.some((item) => item.id !== word.id && item.languageId === word.languageId && item.level === word.level && item.word.toLocaleLowerCase() === word.word.toLocaleLowerCase())) throw new Error('Từ này đã có trong kho cá nhân ở level đã chọn.')
    setState((current) => {
      const old = current.personalVocabulary.find((item) => item.id === word.id)
      const oldKey = old && wordKey(old)
      const newKey = wordKey(word)
      const moveKey = (source) => { if (!oldKey || oldKey === newKey || !source?.[oldKey]) return source; const next = { ...source, [newKey]: source[oldKey] }; delete next[oldKey]; return next }
      return { ...current, personalVocabulary: existingId ? current.personalVocabulary.map((item) => item.id === existingId ? word : item) : [...current.personalVocabulary, word], flashcardProgress: moveKey(current.flashcardProgress), vocabularyMeta: moveKey(current.vocabularyMeta), vocabularyLists: oldKey && oldKey !== newKey ? current.vocabularyLists.map((list) => ({ ...list, wordKeys: list.wordKeys.map((key) => key === oldKey ? newKey : key) })) : current.vocabularyLists, savedItems: oldKey ? current.savedItems.map((item) => item.id !== `vocab-${oldKey}` ? item : ({ ...item, id: `vocab-${newKey}`, title: word.word, subtitle: `${word.meaningVi} · ${word.level}`, languageId: word.languageId, level: word.level, path: vocabularyPath(word.languageId,word.level,word.word) })) : current.savedItems }
    })
    setToast(existingId ? 'Đã cập nhật từ cá nhân' : 'Đã thêm từ vào kho cá nhân')
    return word
  }
  const deletePersonalWord = (id) => {
    setState((current) => {
      const word = current.personalVocabulary.find((item) => item.id === id)
      if (!word) return current
      const key = wordKey(word)
      const flashcardProgress = { ...current.flashcardProgress }; delete flashcardProgress[key]
      const vocabularyMeta = { ...current.vocabularyMeta }; delete vocabularyMeta[key]
      return { ...current, personalVocabulary: current.personalVocabulary.filter((item) => item.id !== id), vocabularyLists: current.vocabularyLists.map((list) => ({ ...list, wordKeys: list.wordKeys.filter((item) => item !== key) })), savedItems: current.savedItems.filter((item) => item.id !== `vocab-${key}`), flashcardProgress, vocabularyMeta }
    })
    setToast('Đã xóa từ cá nhân')
  }
  const createVocabularyList = (name) => {
    const clean = name.trim()
    if (!clean) return
    setState((current) => current.vocabularyLists.some((list) => list.name.toLocaleLowerCase() === clean.toLocaleLowerCase()) ? current : { ...current, vocabularyLists: [...current.vocabularyLists, { id: `list-${crypto.randomUUID()}`, name: clean, wordKeys: [] }] })
    setToast('Đã tạo danh sách từ')
  }
  const toggleWordInList = (listId, word) => {
    const key = wordKey(word)
    setState((current) => ({ ...current, vocabularyLists: current.vocabularyLists.map((list) => list.id !== listId ? list : ({ ...list, wordKeys: list.wordKeys.includes(key) ? list.wordKeys.filter((item) => item !== key) : [...list.wordKeys, key] })) }))
    setToast('Đã cập nhật danh sách từ')
  }
  const deleteVocabularyList = (id) => { setState((current) => ({ ...current, vocabularyLists: current.vocabularyLists.filter((list) => list.id !== id) })); setToast('Đã xóa danh sách') }

  const recordSelfStudy = (entry) => {
    setState((current) => {
      const score = Math.max(0, Math.min(100, Number(entry.score) || 0))
      const activity = applyActivity(current, {
        type: 'Self Study',
        skill: entry.skill,
        seconds: entry.seconds,
        total: 1,
        correct: score >= 70 ? 1 : 0,
        topic: entry.topic,
      })
      return {
        ...activity,
        xp: (Number(current.xp) || 0) + Math.max(5, Math.round(score / 10)),
        selfStudyHistory: [{ ...entry, score, id: entry.id || `self-${Date.now()}`, date: new Date().toISOString() }, ...(current.selfStudyHistory || [])].slice(0, 100),
      }
    })
    setToast('Đã lưu phiên tự học và cập nhật thống kê kỹ năng')
  }

  const recordStudyTime = (seconds = 900, type = 'Daily Review') => {
    setState((current) => applyActivity(current, { type, seconds }))
  }
  const recordGrammarAnswer = (topic, correct) => {
    setState((current) => {
      const activity = applyActivity(current, { type:'Grammar', skill:'Grammar', topic, total:1, correct:correct ? 1 : 0, seconds:0 })
      return { ...activity, xp:(Number(current.xp) || 0) + (correct ? 3 : 1) }
    })
  }

  const saveExamResult = (kind, result) => setState((current) => ({
    ...current,
    [`${kind}History`]: [{ ...result, id: `${kind}-${Date.now()}`, date: new Date().toISOString() }, ...(current[`${kind}History`] || [])].slice(0, 20),
  }))

  const reset = () => {
    clearState()
    setState({ ...defaultState, levelProgress: {}, savedItems: [], mistakes: [], flashcardProgress: {}, onboardingComplete: true })
    setToast('Tiến độ đã được đặt lại')
  }

  const value = useMemo(() => ({
    state, update, persistLessonSession, chooseCourse, completeLesson, toggleSaved, removeMistake, addMistake, addMistakes, reviewVocabulary, setVocabularyMeta, savePersonalWord, deletePersonalWord, createVocabularyList, toggleWordInList, deleteVocabularyList, recordSelfStudy, recordStudyTime, recordGrammarAnswer, saveExamResult, reset,
    toast, setToast,
  }), [state, toast])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
