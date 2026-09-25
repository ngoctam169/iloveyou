export const progressKey = (languageId, level) => `${languageId}:${level}`

export const emptyLevelProgress = () => ({
  completedLessons: [],
  lessonScores: {},
  lessonSkillScores: {},
  skillScores: { Vocabulary: 0, Grammar: 0, Listening: 0, Speaking: 0, Reading: 0, Writing: 0 },
  vocabularyLearned: 0,
  studyMinutes: 0,
  lastLessonId: null,
})

export function getLevelProgress(state, languageId, level) {
  const saved = state.levelProgress?.[progressKey(languageId, level)]
  if (!saved) return emptyLevelProgress()
  return {
    ...emptyLevelProgress(),
    ...saved,
    completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
    lessonScores: saved.lessonScores && typeof saved.lessonScores === 'object' ? saved.lessonScores : {},
    lessonSkillScores: saved.lessonSkillScores && typeof saved.lessonSkillScores === 'object' ? saved.lessonSkillScores : {},
    skillScores: { ...emptyLevelProgress().skillScores, ...(saved.skillScores || {}) },
  }
}

export function summarizeProgress(state) {
  const entries = Object.values(state.levelProgress || {})
  return entries.reduce((summary, entry) => ({
    completedLessons: summary.completedLessons + (Array.isArray(entry.completedLessons) ? entry.completedLessons.length : 0),
    vocabularyLearned: summary.vocabularyLearned + (Number(entry.vocabularyLearned) || 0),
    studyMinutes: summary.studyMinutes + (Number(entry.studyMinutes) || 0),
  }), { completedLessons: 0, vocabularyLearned: 0, studyMinutes: 0 })
}

export function totalStudyMinutes(state, courseMinutes = summarizeProgress(state).studyMinutes) {
  const selfStudyMinutes = (state.selfStudyHistory || []).reduce((sum, entry) => sum + (Number(entry.seconds) || 0), 0) / 60
  return Math.round(Math.max(courseMinutes + selfStudyMinutes, (Number(state.totalStudySeconds) || 0) / 60))
}

export function averageSkillScores(lessonSkillScores) {
  const rows = Object.values(lessonSkillScores || {})
  const names = ['Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing']
  return Object.fromEntries(names.map((name) => {
    const values = rows.map((row) => Number(row?.[name])).filter(Number.isFinite)
    return [name, values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0]
  }))
}

export function levelStatus(completed, total) {
  if (!completed) return 'Not Started'
  return completed >= total && total > 0 ? 'Completed' : 'In Progress'
}
