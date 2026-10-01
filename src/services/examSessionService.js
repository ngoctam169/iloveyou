const SESSION_PREFIX = 'nt_exam_session_v1:'
const FORM_HISTORY_PREFIX = 'nt_exam_forms_v1:'

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

const questionSourceIds = (sections = []) =>
  sections.flatMap((section) => section.questions || []).map((question) => question.sourceId || question.id)

export function pickFreshForm(factory, fallback, historyKey) {
  if (!factory) return fallback
  const recent = historyKey ? readJson(FORM_HISTORY_PREFIX + historyKey, []) : []
  const frequency = new Map()
  recent.slice(0, 5).forEach((ids, attemptIndex) => ids.forEach((id) => {
    frequency.set(id, (frequency.get(id) || 0) + (5 - attemptIndex))
  }))
  let best = null
  let bestScore = Number.POSITIVE_INFINITY
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = factory()
    const score = questionSourceIds(candidate).reduce((sum, id) => sum + (frequency.get(id) || 0), 0)
    if (score < bestScore) {
      best = candidate
      bestScore = score
    }
    if (score === 0) break
  }
  return best || factory()
}

export function rememberForm(historyKey, sections) {
  if (!historyKey) return
  try {
    const key = FORM_HISTORY_PREFIX + historyKey
    const recent = readJson(key, [])
    localStorage.setItem(key, JSON.stringify([questionSourceIds(sections), ...recent].slice(0, 5)))
  } catch { /* storage may be unavailable */ }
}

export function loadExamSession(sessionKey, fallbackSections) {
  if (!sessionKey) return null
  const saved = readJson(SESSION_PREFIX + sessionKey, null)
  if (!saved?.started || !Array.isArray(saved.examSections) || !saved.examSections.length) return null
  const totalDuration = saved.examSections.reduce((sum, section) => sum + (Number(section.duration) || 0), 0) * 1000
  const startedAt = Number(saved.sessionStartedAt) || Number(saved.savedAt) || 0
  if (!startedAt || Date.now() - startedAt > totalDuration + 5 * 60 * 1000) {
    clearExamSession(sessionKey)
    return null
  }
  const sectionIndex = Math.max(0, Math.min(saved.examSections.length - 1, Number(saved.sectionIndex) || 0))
  const section = saved.examSections[sectionIndex] || fallbackSections[0]
  return {
    ...saved,
    sectionIndex,
    questionIndex:Math.max(0, Math.min((section?.questions?.length || 1) - 1, Number(saved.questionIndex) || 0)),
  }
}

export function saveExamSession(sessionKey, value) {
  if (!sessionKey) return false
  try {
    localStorage.setItem(SESSION_PREFIX + sessionKey, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function clearExamSession(sessionKey) {
  if (!sessionKey) return
  try { localStorage.removeItem(SESSION_PREFIX + sessionKey) } catch { /* storage may be unavailable */ }
}
