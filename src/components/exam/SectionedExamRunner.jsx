import { ChevronLeft, ChevronRight, Flag, TimerReset, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ExamTimer from '../common/ExamTimer'
import ProgressBar from '../common/ProgressBar'
import QuizQuestion, { hasAnswer } from '../common/QuizQuestion'
import { useApp } from '../../context/AppContext'
import { speak } from '../../utils/speech'

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

function questionSourceIds(sections = []) {
  return sections.flatMap((section) => section.questions || []).map((question) => question.sourceId || question.id)
}

function pickFreshForm(factory, fallback, historyKey) {
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

function rememberForm(historyKey, sections) {
  if (!historyKey) return
  try {
    const key = FORM_HISTORY_PREFIX + historyKey
    const recent = readJson(key, [])
    localStorage.setItem(key, JSON.stringify([questionSourceIds(sections), ...recent].slice(0, 5)))
  } catch { /* storage may be unavailable */ }
}

function loadExamSession(sessionKey, fallbackSections) {
  if (!sessionKey) return null
  const saved = readJson(SESSION_PREFIX + sessionKey, null)
  if (!saved?.started || !Array.isArray(saved.examSections) || !saved.examSections.length) return null
  const totalDuration = saved.examSections.reduce((sum, section) => sum + (Number(section.duration) || 0), 0) * 1000
  const startedAt = Number(saved.sessionStartedAt) || Number(saved.savedAt) || 0
  if (!startedAt || Date.now() - startedAt > totalDuration + 5 * 60 * 1000) {
    try { localStorage.removeItem(SESSION_PREFIX + sessionKey) } catch { /* storage may be unavailable */ }
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

function clearExamSession(sessionKey) {
  if (!sessionKey) return
  try { localStorage.removeItem(SESSION_PREFIX + sessionKey) } catch { /* storage may be unavailable */ }
}

export default function SectionedExamRunner({
  title,
  subtitle,
  sections,
  sectionsFactory,
  startNotes = [],
  buildResult,
  renderResult,
  onComplete,
  sessionKey,
}) {
  const { setToast } = useApp()
  const [initialSession] = useState(() => loadExamSession(sessionKey, sections))
  const initialSections = initialSession?.examSections || sections
  const initialSectionIndex = initialSession?.sectionIndex || 0
  const initialDeadline = Number(initialSession?.deadline) || null
  const [started, setStarted] = useState(Boolean(initialSession?.started))
  const [examSections, setExamSections] = useState(initialSections)
  const [sectionIndex, setSectionIndex] = useState(initialSectionIndex)
  const [questionIndex, setQuestionIndex] = useState(initialSession?.questionIndex || 0)
  const [answers, setAnswers] = useState(initialSession?.answers || {})
  const [remaining, setRemaining] = useState(() => initialDeadline
    ? Math.max(0, Math.ceil((initialDeadline - Date.now()) / 1000))
    : initialSections[initialSectionIndex]?.duration || 0)
  const [deadline, setDeadline] = useState(initialDeadline)
  const [elapsed, setElapsed] = useState(initialSession?.elapsed || {})
  const [result, setResult] = useState(null)
  const [flagged, setFlagged] = useState(initialSession?.flagged || {})
  const [playedAudio, setPlayedAudio] = useState(initialSession?.playedAudio || {})
  const [sessionStartedAt, setSessionStartedAt] = useState(Number(initialSession?.sessionStartedAt) || null)

  const section = examSections[sectionIndex]
  const questions = section?.questions || []
  const question = questions[questionIndex]
  const answered = useMemo(() => questions.filter((item) => hasAnswer(answers[item.id])).length, [questions, answers])
  const totalQuestions = examSections.reduce((sum, item) => sum + item.questions.length, 0)
  const totalAnswered = examSections.reduce((sum, item) => sum + item.questions.filter((q) => hasAnswer(answers[q.id])).length, 0)

  const begin = () => {
    const nextSections = pickFreshForm(sectionsFactory, sections, sessionKey)
    rememberForm(sessionKey, nextSections)
    const duration = nextSections[0]?.duration || 0
    const now = Date.now()
    setExamSections(nextSections)
    setStarted(true)
    setSectionIndex(0)
    setQuestionIndex(0)
    setAnswers({})
    setFlagged({})
    setPlayedAudio({})
    setElapsed({})
    setResult(null)
    setRemaining(duration)
    setSessionStartedAt(now)
    setDeadline(now + duration * 1000)
  }

  useEffect(() => {
    if (!sessionKey || !started || result || !deadline) return undefined
    const persist = () => {
      try {
        localStorage.setItem(SESSION_PREFIX + sessionKey, JSON.stringify({
          started:true,
          examSections,
          sectionIndex,
          questionIndex,
          answers,
          deadline,
          elapsed,
          flagged,
          playedAudio,
          sessionStartedAt,
          savedAt:Date.now(),
        }))
      } catch {
        setToast('Không thể tự lưu bài thi trên thiết bị này.')
      }
    }
    const timer = window.setTimeout(persist, 250)
    window.addEventListener('pagehide', persist)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pagehide', persist)
    }
  }, [sessionKey, started, result, examSections, sectionIndex, questionIndex, answers, deadline, elapsed, flagged, playedAudio, sessionStartedAt, setToast])

  const finish = (timedOut = false) => {
    if (result) return
    const sectionRemaining = timedOut ? 0 : remaining
    const currentElapsed = {
      ...elapsed,
      [section.id]: Math.max(0, section.duration - sectionRemaining),
    }
    const report = buildResult({ answers, sections:examSections, elapsed: currentElapsed })
    setElapsed(currentElapsed)
    setResult(report)
    clearExamSession(sessionKey)
    onComplete?.(report, { answers, sections:examSections })
  }

  const advanceSection = (timedOut = false) => {
    const sectionRemaining = timedOut ? 0 : remaining
    const currentElapsed = {
      ...elapsed,
      [section.id]: Math.max(0, section.duration - sectionRemaining),
    }
    if (sectionIndex >= examSections.length - 1) {
      finish(timedOut)
      return
    }
    const nextIndex = sectionIndex + 1
    const duration = examSections[nextIndex].duration
    setElapsed(currentElapsed)
    setSectionIndex(nextIndex)
    setQuestionIndex(0)
    setRemaining(duration)
    setDeadline(Date.now() + duration * 1000)
  }

  if (!started) {
    return <section className="exam-start full-exam-start">
      <span className="exam-start-icon">📝</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div className="full-exam-format">
        {sections.map((item) => <article key={item.id}>
          <strong>{item.label}</strong>
          <span>{item.questions.length} câu</span>
          <small>{Math.round(item.duration / 60)} phút</small>
        </article>)}
      </div>
      {startNotes.length > 0 && <ul>{startNotes.map((note) => <li key={note}>{note}</li>)}</ul>}
      <button className="btn large" onClick={begin}>Bắt đầu bài thi</button>
    </section>
  }

  if (result) return renderResult({ result, restart:begin, answers, sections:examSections })

  const atLastQuestion = questionIndex === questions.length - 1
  const atLastSection = sectionIndex === examSections.length - 1
  const globalBefore = examSections.slice(0, sectionIndex).reduce((sum, item) => sum + item.questions.length, 0)
  const globalNumber = globalBefore + questionIndex + 1
  const audioKey = question?.audio || ''
  const audioPlayed = Boolean(audioKey && playedAudio[audioKey])
  const playExamAudio = () => {
    if (!audioKey || audioPlayed) return
    const startedPlayback = speak(audioKey,'english',1,setToast)
    if (startedPlayback) setPlayedAudio((current) => ({ ...current,[audioKey]:true }))
  }

  return <section className="full-exam-runner">
    <header className="full-exam-topbar">
      <div>
        <span>{section.label}</span>
        <strong>{title}</strong>
        <small>Câu {globalNumber}/{totalQuestions} · {totalAnswered}/{totalQuestions} đã trả lời</small>
      </div>
      <div className="full-exam-clock">
        <ExamTimer
          seconds={remaining}
          onChange={setRemaining}
          onEnd={() => advanceSection(true)}
          deadline={deadline}
          resetKey={section.id}
        />
        <span>{answered}/{questions.length} phần này</span>
      </div>
    </header>

    <ProgressBar value={totalAnswered} max={totalQuestions}/>

    <div className="full-exam-layout">
      <aside className="full-question-nav">
        <div className="full-question-nav-head">
          <strong>{section.label}</strong>
          <span>{questions.length} câu</span>
        </div>
        <div className="question-nav dense">
          {questions.map((item, index) => <button
            key={item.id}
            aria-label={`Câu ${globalBefore + index + 1}`}
            className={`${index === questionIndex ? 'active' : ''} ${hasAnswer(answers[item.id]) ? 'answered' : ''} ${flagged[item.id] ? 'flagged' : ''}`}
            onClick={() => setQuestionIndex(index)}
          >{globalBefore + index + 1}</button>)}
        </div>
        <div className="nav-legend">
          <span><i className="answered"/>Đã trả lời</span>
          <span><i className="flagged"/>Đánh dấu</span>
        </div>
      </aside>

      <main className="question-card full-exam-question">
        <div className="full-question-meta">
          <div><span>{section.label}</span><strong>{question.part ? `Part ${question.part} · ` : ''}{question.type}</strong></div>
          <button className={`icon-btn ${flagged[question.id] ? 'saved' : ''}`} aria-label="Đánh dấu câu hỏi" onClick={() => setFlagged((current) => ({ ...current, [question.id]:!current[question.id] }))}><Flag/></button>
        </div>

        {question.passage && <article className="exam-passage"><h3>{question.passageTitle || 'Passage'}</h3>{Array.isArray(question.passage) ? question.passage.map((p) => <p key={p}>{p}</p>) : <p>{question.passage}</p>}</article>}
        {question.audio && <div className="exam-audio-once"><button className="btn secondary" disabled={audioPlayed} onClick={playExamAudio}><Volume2/> {audioPlayed ? 'Audio đã phát' : 'Phát audio · 1 lần'}</button><small>Tốc độ cố định 1× · Full Test không cho replay.</small></div>}

        <QuizQuestion
          question={question}
          value={answers[question.id]}
          onChange={(value) => setAnswers((current) => ({ ...current, [question.id]:value }))}
          checked={false}
          reveal={false}
        />

        <div className="mock-actions full-exam-actions">
          <button className="btn secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex((value) => Math.max(0, value - 1))}><ChevronLeft/> Previous</button>
          {!atLastQuestion && <button className="btn" onClick={() => setQuestionIndex((value) => Math.min(questions.length - 1, value + 1))}>Next <ChevronRight/></button>}
          {atLastQuestion && !atLastSection && <button className="btn" onClick={() => advanceSection(false)}>Nộp {section.label} · sang {examSections[sectionIndex + 1].label} <ChevronRight/></button>}
          {atLastQuestion && atLastSection && <button className="btn" onClick={() => finish(false)}>Nộp bài</button>}
        </div>
      </main>
    </div>

    <div className="full-exam-footer-status"><TimerReset/><span>Hết giờ phần hiện tại hệ thống sẽ tự chuyển phần hoặc tự nộp bài.</span></div>
  </section>
}
