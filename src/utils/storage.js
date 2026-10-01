import { languages, levelSlug } from '../data/languages'
import { emptyLevelProgress, progressKey } from './progress'
import { localDate } from './srs'

export const STORAGE_KEY = 'nt_state_v1'

export const defaultState = {
  schemaVersion: 2,
  selectedLanguage: 'english',
  selectedLevel: 'B1',
  levelProgress: {},
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  dailyGoal: 30,
  dailyVocabularyGoal: 10,
  todayMinutes: 0,
  todayDate: null,
  theme: 'light',
  savedItems: [],
  mistakes: [],
  flashcardProgress: {},
  skillReview: {},
  vocabularyMeta: {},
  personalVocabulary: [],
  vocabularyLists: [],
  lessonSessions: {},
  writingDrafts: {},
  vocabularyActivity: [],
  selfStudyHistory: [],
  dailyActivity: {},
  learningHistory: [],
  totalStudySeconds: 0,
  longestStreak: 0,
  toeicTarget: 650,
  toeicHistory: [],
  ieltsTarget: 6.5,
  ieltsHistory: [],
  profile: { displayName: 'Minh Anh', avatar: 'MA', goal: 'Giao tiếp' },
  settings: { autoplay: false, speechSpeed: 'normal' },
  activityHistory: [0, 0, 0, 0, 0, 0, 0],
  onboardingComplete: false,
}

export function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaultState
    const today = localDate()
    const migrated = migrateProgress(parsed)
    const selectedLanguage = languages.some((language) => language.id === parsed.selectedLanguage) ? parsed.selectedLanguage : defaultState.selectedLanguage
    const selectedCourse = languages.find((language) => language.id === selectedLanguage)
    const selectedLevel = selectedCourse.levels.some(([level]) => level === parsed.selectedLevel) ? parsed.selectedLevel : selectedCourse.levels[0][0]
    const parsedProfile = parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : {}
    return {
      ...defaultState,
      ...parsed,
      schemaVersion: 2,
      selectedLanguage,
      selectedLevel,
      levelProgress: migrated,
      xp: Math.max(0, Number(parsed.xp) || 0),
      streak: Math.max(0, Number(parsed.streak) || 0),
      lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null,
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      dailyGoal: [15, 30, 45, 60].includes(Number(parsed.dailyGoal)) ? Number(parsed.dailyGoal) : defaultState.dailyGoal,
      dailyVocabularyGoal: [5, 10, 20, 30].includes(Number(parsed.dailyVocabularyGoal)) ? Number(parsed.dailyVocabularyGoal) : defaultState.dailyVocabularyGoal,
      todayMinutes: parsed.todayDate === today ? Math.max(0, Number(parsed.todayMinutes) || 0) : 0,
      todayDate: today,
      profile: { ...defaultState.profile, ...parsedProfile, displayName: typeof parsedProfile.displayName === 'string' && parsedProfile.displayName.trim() ? parsedProfile.displayName.trim() : defaultState.profile.displayName, goal: typeof parsedProfile.goal === 'string' ? parsedProfile.goal : defaultState.profile.goal },
      settings: { autoplay: parsed.settings?.autoplay === true, speechSpeed: ['slow','normal','fast'].includes(parsed.settings?.speechSpeed) ? parsed.settings.speechSpeed : 'normal' },
      savedItems: Array.isArray(parsed.savedItems) ? parsed.savedItems.filter((item) => item && typeof item === 'object' && typeof item.id === 'string').map(migrateLinkedItem) : [],
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes.filter((item) => item && typeof item === 'object' && typeof item.id === 'string').map(migrateLinkedItem) : [],
      flashcardProgress: migrateFlashcards(parsed.flashcardProgress, selectedLanguage, selectedLevel),
      skillReview: parsed.skillReview && typeof parsed.skillReview === 'object' && !Array.isArray(parsed.skillReview) ? parsed.skillReview : {},
      vocabularyMeta: parsed.vocabularyMeta && typeof parsed.vocabularyMeta === 'object' && !Array.isArray(parsed.vocabularyMeta) ? parsed.vocabularyMeta : {},
      personalVocabulary: Array.isArray(parsed.personalVocabulary) ? parsed.personalVocabulary.filter((word) => word && typeof word.id === 'string' && typeof word.word === 'string' && typeof word.meaningVi === 'string' && languages.some((language) => language.id === word.languageId && language.levels.some(([level]) => level === word.level))).map((word) => ({ ...word, personal: true, collocations: Array.isArray(word.collocations) ? word.collocations : [], synonyms: Array.isArray(word.synonyms) ? word.synonyms : [], antonyms: Array.isArray(word.antonyms) ? word.antonyms : [], lessons: [], lessonIds: [] })) : [],
      vocabularyLists: Array.isArray(parsed.vocabularyLists) ? parsed.vocabularyLists.filter((list) => list && typeof list.id === 'string' && typeof list.name === 'string' && Array.isArray(list.wordKeys)).map((list) => ({ ...list, wordKeys: list.wordKeys.filter((key) => typeof key === 'string') })) : [],
      lessonSessions: parsed.lessonSessions && typeof parsed.lessonSessions === 'object' ? parsed.lessonSessions : {},
      writingDrafts: parsed.writingDrafts && typeof parsed.writingDrafts === 'object' && !Array.isArray(parsed.writingDrafts) ? parsed.writingDrafts : {},
      vocabularyActivity: Array.isArray(parsed.vocabularyActivity) ? parsed.vocabularyActivity.slice(-3000) : [],
      selfStudyHistory: Array.isArray(parsed.selfStudyHistory) ? parsed.selfStudyHistory.slice(0, 100) : [],
      dailyActivity: parsed.dailyActivity && typeof parsed.dailyActivity === 'object' ? parsed.dailyActivity : {},
      learningHistory: Array.isArray(parsed.learningHistory) ? parsed.learningHistory.slice(0, 5000) : [],
      totalStudySeconds: Math.max(0, Number(parsed.totalStudySeconds) || 0),
      longestStreak: Math.max(0, Number(parsed.longestStreak) || 0),
      toeicTarget: [450, 550, 650, 750, 850, 900].includes(Number(parsed.toeicTarget)) ? Number(parsed.toeicTarget) : defaultState.toeicTarget,
      toeicHistory: Array.isArray(parsed.toeicHistory) ? parsed.toeicHistory.slice(-20) : [],
      ieltsTarget: [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].includes(Number(parsed.ieltsTarget)) ? Number(parsed.ieltsTarget) : defaultState.ieltsTarget,
      ieltsHistory: Array.isArray(parsed.ieltsHistory) ? parsed.ieltsHistory.slice(-20) : [],
      activityHistory: Array.isArray(parsed.activityHistory) ? parsed.activityHistory.slice(-28).map((minutes) => Math.max(0, Number(minutes) || 0)) : defaultState.activityHistory,
    }
  } catch {
    return defaultState
  }
}

function migrateProgress(parsed) {
  const result = {}
  if (parsed.levelProgress && typeof parsed.levelProgress === 'object') {
    Object.entries(parsed.levelProgress).forEach(([key, value]) => {
      if (!value || typeof value !== 'object') return
      const completedLessons = Array.isArray(value.completedLessons) ? [...new Set(value.completedLessons.filter((id) => typeof id === 'string').map((id) => normalizeLessonId(key, id)))] : []
      result[key] = {
        ...emptyLevelProgress(),
        ...value,
        completedLessons,
        lessonScores: migrateLessonMap(key, value.lessonScores),
        lessonSkillScores: migrateLessonMap(key, value.lessonSkillScores),
        skillScores: { ...emptyLevelProgress().skillScores, ...(value.skillScores || {}) },
        lastLessonId: typeof value.lastLessonId === 'string' ? normalizeLessonId(key, value.lastLessonId) : null,
      }
    })
  }
  if (Array.isArray(parsed.completedLessons)) {
    parsed.completedLessons.forEach((lessonId) => {
      const course = languages.flatMap((language) => language.levels.map(([level]) => ({ languageId: language.id, level, prefix: `${language.id}-${levelSlug(level)}-` }))).find((item) => typeof lessonId === 'string' && lessonId.startsWith(item.prefix))
      if (!course) return
      const key = progressKey(course.languageId, course.level)
      const normalizedId = normalizeLessonId(key, lessonId)
      const current = result[key] || emptyLevelProgress()
      if (!current.completedLessons.includes(normalizedId)) current.completedLessons.push(normalizedId)
      if (parsed.lessonScores?.[lessonId] !== undefined) current.lessonScores[normalizedId] = parsed.lessonScores[lessonId]
      current.vocabularyLearned = Math.max(Number(current.vocabularyLearned) || 0, current.completedLessons.length * 3)
      result[key] = current
    })
  }
  return result
}

function normalizeLessonId(key, lessonId) {
  if (key !== 'english:A1') return lessonId
  return lessonId.replace(/^english-a1-([1-3])$/, 'english-a1-1-$1')
}

function migrateLessonMap(key, value) {
  if (!value || typeof value !== 'object') return {}
  return Object.fromEntries(Object.entries(value).map(([lessonId, data]) => [normalizeLessonId(key, lessonId), data]))
}

function migrateLinkedItem(item) {
  if (!item || typeof item !== 'object') return item
  const path = typeof item.path === 'string' ? item.path.replace(/^(\/lesson\/english\/a1\/english-a1-)([1-3])$/, (_, prefix, lessonNumber) => `${prefix}1-${lessonNumber}`) : item.path
  return { ...item, path }
}

function migrateFlashcards(value, selectedLanguage, selectedLevel) {
  if (!value || typeof value !== 'object') return {}
  const result = {}
  for (const [key, schedule] of Object.entries(value)) {
    const legacy = key.match(/^(english|chinese|japanese|korean)-(.+)$/)
    const legacyLevel = legacy?.[1] === selectedLanguage ? selectedLevel : legacy ? languages.find((language) => language.id === legacy[1]).levels[0][0] : null
    const migrated = legacy ? `${legacy[1]}:${legacyLevel}:${legacy[2]}` : key
    const parts = migrated.match(/^(english|chinese|japanese|korean):([^:]+):(.+)$/)
    const canonical = parts ? `${parts[1]}:${parts[2]}:${parts[3].normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g, '-')}` : migrated
    if (!result[canonical] || Date.parse(schedule?.lastReview || 0) > Date.parse(result[canonical]?.lastReview || 0)) result[canonical] = schedule
  }
  return result
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* storage may be disabled */ }
}

export function clearAllAppStorage() {
  try {
    const keys = []
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (key?.startsWith('nt_')) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
    return true
  } catch {
    return false
  }
}

