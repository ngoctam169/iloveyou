import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2, ChevronLeft, CircleHelp, Headphones, Mic, PenLine, RotateCcw, Sparkles, Star, Volume2, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import AudioPlayer from '../components/common/AudioPlayer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import SpeakingExercise from '../components/exercises/SpeakingExercise'
import VocabularyCard from '../components/vocabulary/VocabularyCard'
import { useApp } from '../context/AppContext'
import { getLesson, getRoadmap } from '../data/courses'
import { findLevel, getLanguage } from '../data/languages'
import { useVocabularyData } from '../hooks/useVocabularyData'
import { speak } from '../utils/speech'
import { wordKey } from '../utils/srs'
import { buildGrammarQuestion, grammarEntryFor } from '../utils/grammarPractice'
import NotFound from './NotFound'
import { grammarPath, lessonPath as cleanLessonPath, levelPath, vocabularyPath } from '../utils/routes'

const sections = [
  ['Vocabulary', BookOpen], ['Grammar', Sparkles], ['Listening', Headphones], ['Speaking', Mic],
  ['Reading', BookOpen], ['Writing', PenLine], ['Quiz', CircleHelp], ['Review', Star],
]
const blankAnswers = { grammar: null, listening: null, reading: null, writing: '', writingIdeas: [], speakingScore: null, quiz: null }

const vocabularyLookupKey = (value = '') => String(value).normalize('NFKC').trim().toLocaleLowerCase()
const asLessonTuple = (word) => [word.word || '', word.ipa || '', word.partOfSpeech || '', word.meaningVi || word.definition || '', word.example || '', word.translation || '']
function hydrateLessonVocabulary(lesson, vocabulary = []) {
  if (!lesson?.vocab?.length || !vocabulary.length) return lesson
  const lookup = new Map(vocabulary.map((word) => [vocabularyLookupKey(word.word), word]))
  const vocab = lesson.vocab.map((row) => lookup.has(vocabularyLookupKey(row[0])) ? asLessonTuple(lookup.get(vocabularyLookupKey(row[0]))) : row)
  return { ...lesson, vocab }
}

export default function Lesson() {
  const { languageId, levelSlug: levelSlugParam, lessonId } = useParams()
  const language = getLanguage(languageId)
  const level = findLevel(language, levelSlugParam)
  const rawLesson = useMemo(() => getLesson(languageId, level?.[0], lessonId), [languageId, level?.[0], lessonId])
  const { state, persistLessonSession, chooseCourse, completeLesson, addMistake, toggleSaved, setToast } = useApp()
  const { words: levelVocabulary } = useVocabularyData(state, languageId, level?.[0])
  const lesson = useMemo(() => hydrateLessonVocabulary(rawLesson, levelVocabulary), [rawLesson, levelVocabulary])
  const savedSession = state.lessonSessions?.[lessonId]
  const location = useLocation()
  const sectionIndex = sections.findIndex(([name]) => name.toLowerCase() === new URLSearchParams(location.search).get('section')?.toLowerCase())
  const [step, setStep] = useState(() => sectionIndex >= 0 ? sectionIndex : Math.min(8, Number(savedSession?.step) || 0))
  const rate = state.settings.speechSpeed === 'slow' ? .75 : state.settings.speechSpeed === 'fast' ? 1.25 : 1
  const [answers, setAnswers] = useState(() => ({ ...blankAnswers, ...(savedSession?.answers || {}) }))
  const [checked, setChecked] = useState(() => savedSession?.checked || {})
  const [completed, setCompleted] = useState(() => Boolean(savedSession?.completed))
  const [xpEarned, setXpEarned] = useState(() => Number(savedSession?.xpEarned) || 0)
  const [completedSections, setCompletedSections] = useState(() => savedSession?.completedSections || (savedSession?.completed ? sections.map((_, index) => index) : Array.from({ length: Math.min(8, Number(savedSession?.step) || 0) }, (_, index) => index)))
  const activeSeconds = useRef(Number(savedSession?.activeSeconds) || 0)
  const lastInteraction = useRef(Date.now())
  const navigate = useNavigate()
  const lessonPath = level ? cleanLessonPath(languageId, level[0], lessonId) : location.pathname
  const grammarEntry = lesson && grammarEntryFor(languageId, level?.[0], lesson.grammar.name)
  const grammarQuestion = grammarEntry && buildGrammarQuestion(grammarEntry)
  const writing = writingResult(lesson?.writing, answers.writing, answers.writingIdeas)
  const skills = useMemo(() => ({
    Vocabulary: lesson?.vocab?.length ? Math.round(lesson.vocab.filter((word) => state.flashcardProgress[wordKey({ languageId, level: level?.[0], word: word[0] })] || state.vocabularyMeta?.[wordKey({ languageId, level: level?.[0], word: word[0] })]?.learned).length / lesson.vocab.length * 100) : 0,
    Grammar: checked.grammar && grammarQuestion ? (answers.grammar === grammarQuestion.answer ? 100 : 0) : 0,
    Listening: checked.listening ? (listeningIsCorrect(lesson?.listening, answers.listening, lesson) ? 100 : 0) : 0,
    Speaking: answers.speakingScore ?? 0,
    Reading: checked.reading ? (answers.reading === lesson?.reading.answer ? 100 : 0) : 0,
    Writing: writing.score,
  }), [answers, checked, lesson, grammarQuestion?.answer, state.flashcardProgress, state.vocabularyMeta, languageId, level?.[0]])
  const resultScore = Math.round(Object.values(skills).reduce((sum, value) => sum + value, 0) / Object.keys(skills).length)

  useEffect(() => {
    if (level && (state.selectedLanguage !== languageId || state.selectedLevel !== level[0])) chooseCourse(languageId, level[0])
  }, [languageId, level?.[0], state.selectedLanguage, state.selectedLevel])

  useEffect(() => { if (sectionIndex >= 0) setStep(sectionIndex) }, [location.search])

  const noteActivity = () => {
    const now = Date.now()
    if (document.visibilityState === 'visible') activeSeconds.current += Math.min(300, Math.max(0, (now - lastInteraction.current) / 1000))
    lastInteraction.current = now
  }

  useEffect(() => { noteActivity() }, [step, answers, checked])

  useEffect(() => {
    if (lesson && step === 2 && state.settings.autoplay) speak(lesson.listening?.audio || lesson.listen, languageId, rate, setToast)
  }, [step, lesson?.id, state.settings.autoplay, languageId])

  useLayoutEffect(() => {
    if (!lesson) return
    persistLessonSession(lesson.id, { step, answers, checked, completed, completedSections, xpEarned, activeSeconds:activeSeconds.current, updatedAt:new Date().toISOString() })
  }, [step, answers, checked, completed, completedSections, xpEarned, lesson?.id])

  const lessonSaved = lesson ? state.savedItems.some((item) => item.id === `lesson-${lesson.id}`) : false
  if (!language || !level || !lesson) return <NotFound compact />
  const totalProgress = completed ? 100 : Math.round((completedSections.length / sections.length) * 100)
  const remainingSections = sections.slice(0, 7).map(([name], index) => completedSections.includes(index) ? null : name).filter(Boolean)
  const levelLessons = getRoadmap(languageId, level[0]).flatMap((unit) => unit.lessons)
  const lessonIndex = levelLessons.findIndex((item) => item.id === lesson.id)
  const previousLesson = levelLessons[lessonIndex - 1]
  const nextLesson = levelLessons[lessonIndex + 1]

  const finishLesson = () => {
    if (completed) return
    if (remainingSections.length) { setToast(`Hãy đi qua các phần còn lại: ${remainingSections.join(', ')}`); return }
    noteActivity()
    setCompleted(true)
    setCompletedSections(sections.map((_, index) => index))
    setXpEarned(state.levelProgress?.[`${languageId}:${level[0]}`]?.completedLessons?.includes(lesson.id) ? 20 : 100 + (resultScore === 100 ? 50 : 0))
    const path = lessonPath
    if (checked.listening && !listeningIsCorrect(lesson.listening, answers.listening, lesson)) addMistake({ id: `listening-${lesson.id}`, type: 'Listening', prompt: lesson.listening?.prompt || 'Đoạn ghi âm nói về điều gì?', answer: answerLabel(lesson.listening, lesson), yourAnswer: responseLabel(lesson.listening, answers.listening), path })
    if (checked.grammar && grammarQuestion && answers.grammar !== grammarQuestion.answer) addMistake({ id:`grammar-${lesson.id}`, type:'Grammar', prompt:grammarQuestion.question, answer:grammarQuestion.options[grammarQuestion.answer], yourAnswer:grammarQuestion.options[answers.grammar] || 'Chưa trả lời', explanation:grammarQuestion.explanation, path:`${path}?section=grammar` })
    if (checked.reading && answers.reading !== lesson.reading.answer) addMistake({ id: `reading-${lesson.id}`, type: 'Reading', prompt: lesson.reading.question, answer: lesson.reading.options[lesson.reading.answer], yourAnswer: lesson.reading.options[answers.reading] || 'Chưa trả lời', path })
    if (checked.quiz && !quizIsCorrect(lesson.quiz, answers.quiz)) addMistake({ id: `quiz-${lesson.id}`, type: lesson.quiz.type === 'Listening Quiz' ? 'Listening' : lesson.quiz.type?.includes('Vocabulary') ? 'Vocabulary' : 'Grammar', prompt: lesson.quiz.question, answer: quizAnswerLabel(lesson.quiz), yourAnswer: quizResponseLabel(lesson.quiz, answers.quiz), path })
    if ((answers.speakingScore ?? 0) < 70) addMistake({ id:`speaking-${lesson.id}`, type:'Speaking', prompt:lesson.target, answer:'Đạt transcript match từ 70% trở lên, sau đó tiếp tục luyện độ tự nhiên và ngữ điệu.', yourAnswer:`Pronunciation Match: ${answers.speakingScore ?? 0}%`, path:`${path}?section=speaking` })
    if (writing.score < 60) addMistake({ id: `writing-${lesson.id}`, type: 'Writing', prompt: lesson.writing.prompt, answer: writing.guidance, yourAnswer: writing.text || 'Chưa viết', path })
    completeLesson({ lessonId: lesson.id, languageId, level: level[0], score: resultScore, skills, vocabularyCount: lesson.vocab.length, vocabularyWords: lesson.vocab.map((word) => word[0]), minutes: Math.max(0.1, Math.round(activeSeconds.current / 6) / 10) })
    setStep(8)
  }

  const next = () => {
    if (step < 7) {
      setCompletedSections((current) => current.includes(step) ? current : [...current, step])
      setStep((current) => current + 1)
    }
    else finishLesson()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const restart = () => {
    setStep(0)
    setCompletedSections([])
    activeSeconds.current = 0
    lastInteraction.current = Date.now()
    setChecked({})
    setAnswers(blankAnswers)
    setCompleted(false)
    setXpEarned(0)
  }

  return <div className="lesson-page">
    <header className="lesson-header"><button className="icon-btn" onClick={() => navigate(levelPath(languageId,level[0]))} aria-label="Thoát bài học"><X /></button><div className="lesson-head-title"><span>{language.flag} {language.name} · {level[0]}</span><strong>Bài {lesson.number}: {lesson.title}</strong><button className={`icon-btn lesson-save ${lessonSaved ? 'saved' : ''}`} aria-label={lessonSaved ? 'Bỏ lưu bài học' : 'Lưu bài học'} onClick={() => toggleSaved({ id: `lesson-${lesson.id}`, type: 'Lesson', title: lesson.title, subtitle: `${language.name} · ${level[0]}`, languageId, level: level[0], path: lessonPath })}><Bookmark fill={lessonSaved ? 'currentColor' : 'none'} /></button></div><div className="lesson-head-progress"><ProgressBar value={totalProgress} /><span>{totalProgress}%</span></div><span className="lesson-part-count">8 phần</span></header>
    {step < 8 && <div className="lesson-layout"><aside className="lesson-sidebar"><span className="overline">NỘI DUNG BÀI HỌC</span>{sections.map(([name, Icon], index) => <button key={name} className={`${index === step ? 'active' : ''} ${completedSections.includes(index) ? 'done' : ''}`} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}><span>{completedSections.includes(index) ? <Check /> : <Icon />}</span><div><strong>{name}</strong><small>{['Từ mới trong bài','Ngữ pháp trọng tâm',lesson.listening?.type || 'Nghe hiểu','Luyện phát âm',lesson.reading.type || 'Đọc hiểu',lesson.writing.type || 'Viết chủ động',lesson.quiz.type || 'Kiểm tra nhanh','Tổng kết'][index]}</small></div></button>)}</aside><main className="lesson-content"><div className="lesson-breadcrumb"><Link to={levelPath(languageId,level[0])}><ChevronLeft /> {language.name} {level[0]}</Link><span>/</span><span>Bài {lesson.number}</span></div><div className="lesson-step-heading"><span className="step-icon">{(() => { const Icon = sections[step][1]; return <Icon /> })()}</span><div><span>PHẦN {step + 1} / 8</span><h1>{sections[step][0]}</h1><p>{stepDescriptions[step]}</p></div></div>
      {step === 0 && <VocabularySection lesson={lesson} languageId={languageId} level={level[0]} />}
      {step === 1 && <GrammarSection grammar={lesson.grammar} question={grammarQuestion} answers={answers} setAnswers={setAnswers} checked={checked} setChecked={setChecked} languageId={languageId} lessonPath={lessonPath} level={level[0]} />}
      {step === 2 && <ListeningSection lesson={lesson} languageId={languageId} rate={rate} answers={answers} setAnswers={setAnswers} checked={checked} setChecked={setChecked} setToast={setToast} />}
      {step === 3 && <SpeakingExercise target={lesson.target} languageId={languageId} setToast={setToast} onComplete={(score) => setAnswers((current) => ({ ...current, speakingScore: score }))} />}
      {step === 4 && <ReadingSection lesson={lesson} languageId={languageId} lessonPath={lessonPath} level={level[0]} answers={answers} setAnswers={setAnswers} checked={checked} setChecked={setChecked} />}
      {step === 5 && <WritingSection lesson={lesson} answers={answers} setAnswers={setAnswers} />}
      {step === 6 && <QuizSection lesson={lesson} languageId={languageId} answers={answers} setAnswers={setAnswers} checked={checked} setChecked={setChecked} setToast={setToast} />}
      {step === 7 && <ReviewSection lesson={lesson} answers={answers} checked={checked} skills={skills} remainingSections={remainingSections} />}
      <div className="lesson-footer-actions"><button className="btn ghost" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft /> Quay lại</button><button className="btn large" disabled={completed} onClick={next}>{step === 7 ? 'Hoàn thành bài học' : 'Tiếp tục'} <ArrowRight /></button></div>
    </main></div>}
    {step < 8 && <nav className="lesson-related" aria-label="Điều hướng bài học"><div>{previousLesson ? <Link to={cleanLessonPath(languageId,level[0],previousLesson.id)}><ChevronLeft/> Bài trước: {previousLesson.title}</Link> : <span/>}{nextLesson && <Link to={cleanLessonPath(languageId,level[0],nextLesson.id)}>Bài tiếp: {nextLesson.title} <ArrowRight/></Link>}</div><div><Link to={vocabularyPath(languageId,level[0])}>Từ vựng {level[0]}</Link><Link to={grammarPath(languageId,level[0])}>Ngữ pháp {level[0]}</Link></div></nav>}
    {step === 8 && <Result lesson={lesson} score={resultScore} skills={skills} xpEarned={xpEarned} onAgain={restart} onReview={() => navigate('/mistakes')} />}
  </div>
}

const stepDescriptions = ['Khám phá những từ và cụm từ quan trọng trong bài.', 'Nắm cấu trúc, cách dùng và tránh lỗi thường gặp.', 'Nghe câu mẫu ở tốc độ phù hợp rồi hoàn thành hoạt động.', 'Nghe, ghi âm và so sánh với câu mẫu.', 'Đọc đoạn văn theo độ khó của level và trả lời câu hỏi.', 'Chủ động sử dụng kiến thức vừa học với tiêu chí minh bạch.', 'Kiểm tra nhanh và xem giải thích ngay sau khi trả lời.', 'Nhìn lại điểm thật của từng kỹ năng trước khi hoàn thành.']

function VocabularySection({ lesson, languageId, level }) {
  const objectives = lesson.objectives || [`Nhận biết và sử dụng ${lesson.vocab.length} từ mới.`, `Vận dụng ${lesson.grammar.name}.`, 'Hoàn thành hoạt động nghe, nói, đọc và viết.']
  return <div className="vocab-list"><section className="lesson-objectives"><div><span className="overline">MỤC TIÊU BÀI HỌC</span><h2>Sau {lesson.duration || 25} phút, bạn có thể…</h2></div><ul>{objectives.map((objective) => <li key={objective}><CheckCircle2/>{objective}</li>)}</ul><p>{lesson.detailedExplanation || `Bài học đưa từ vựng và ngữ pháp vào các tình huống thực tế của chủ đề ${lesson.topic || lesson.title}.`}</p></section><h2>Key Vocabulary</h2>{lesson.vocab.map((word, index) => <VocabularyCard key={word[0]} word={word} languageId={languageId} level={level} index={index} />)}<div className="tip-box"><span>💡</span><p><strong>Mẹo ghi nhớ</strong>Nhấn biểu tượng loa, nghe hai lần rồi đọc thành tiếng mà không nhìn phiên âm.</p></div></div>
}

function GrammarSection({ grammar, question, answers, setAnswers, checked, setChecked, languageId, lessonPath, level }) {
  const { state, toggleSaved } = useApp()
  const item = { id: `grammar-${languageId}-${level}-${grammar.name}`, type: 'Grammar', title: grammar.name, subtitle: grammar.structure, languageId, level, path: `${lessonPath}?section=grammar` }
  const saved = state.savedItems.some((savedItem) => savedItem.id === item.id)
  return <div className="grammar-card"><button className={`icon-btn bookmark-heading ${saved ? 'saved' : ''}`} aria-label={saved ? 'Bỏ lưu điểm ngữ pháp' : 'Lưu điểm ngữ pháp'} onClick={() => toggleSaved(item)}><Bookmark fill={saved ? 'currentColor' : 'none'} /></button><span className="grammar-tag">GRAMMAR FOCUS</span><h2>{grammar.name}</h2><p>{grammar.explanation}</p><div className="structure-box"><span>CẤU TRÚC</span><strong>{grammar.structure}</strong></div><h3>{grammar.referenceOnly ? 'Mẫu cấu trúc & ghi nhớ' : 'Ví dụ'}</h3><div className="example-list">{grammar.examples.map((example, index) => <p key={example}><span>{index + 1}</span>{example}</p>)}</div><div className="mistake-box"><strong>⚠ Lỗi thường gặp</strong><p>{grammar.mistake}</p></div>{question && <div className="lesson-grammar-quiz"><QuizQuestion question={question} value={answers.grammar} onChange={(value) => setAnswers({ ...answers, grammar:value })} checked={Boolean(checked.grammar)}/>{!checked.grammar && <button className="btn" disabled={answers.grammar === null} onClick={() => setChecked({ ...checked, grammar:true })}>Kiểm tra ngữ pháp</button>}</div>}</div>
}

function ListeningSection({ lesson, languageId, rate, answers, setAnswers, checked, setChecked, setToast }) {
  const spec = lesson.listening || { type: 'Listen & Choose', audio: lesson.listen, prompt: 'Đoạn ghi âm nói về điều gì?', options: [lesson.vocab[1][3], lesson.nativeTitle, lesson.vocab[0][3]], answer: 1, explanation: `Bạn vừa nghe: “${lesson.listen}”` }
  const isText = typeof spec.expected === 'string'
  const correct = listeningIsCorrect(spec, answers.listening, lesson)
  return <><div className="exercise-card"><span className="exercise-type">{spec.type.toUpperCase()}</span><h2>{spec.prompt}</h2><AudioPlayer text={spec.audio} languageId={languageId} label="Nghe bài" initialRate={rate}/>{isText ? <label className="text-answer"><span>Câu trả lời</span><input value={answers.listening || ''} disabled={checked.listening} onChange={(event) => setAnswers({ ...answers, listening: event.target.value })} placeholder={spec.type === 'Dictation' ? 'Nhập toàn bộ câu bạn nghe…' : 'Nhập từ còn thiếu…'} /></label> : <div className="answer-list">{spec.options.map((option, index) => <button className={`${answers.listening === index ? 'selected' : ''} ${checked.listening ? (index === spec.answer ? 'correct' : answers.listening === index ? 'wrong' : '') : ''}`} onClick={() => !checked.listening && setAnswers({ ...answers, listening: index })} key={`${option}-${index}`}><span>{String.fromCharCode(65 + index)}</span>{option}{checked.listening && index === spec.answer && <CheckCircle2 />}</button>)}</div>}{!checked.listening ? <button className="btn" disabled={answers.listening === null || answers.listening === ''} onClick={() => setChecked({ ...checked, listening: true })}>Kiểm tra</button> : <Feedback correct={correct} text={spec.explanation} />}</div>{lesson.dialogue && <article className="dialogue-card"><span className="overline">ĐOẠN HỘI THOẠI THỰC TẾ</span><h2>Listen, shadow, then role-play</h2>{lesson.dialogue.lines.map(([speaker,line],index) => <div key={`${speaker}-${index}`}><strong>{speaker}</strong><p>{line}</p><button className="icon-btn" aria-label={`Nghe câu của ${speaker}`} onClick={() => speak(line,languageId,rate,setToast)}><Volume2/></button></div>)}<p className="dialogue-translation"><strong>Bản dịch ý:</strong> {lesson.dialogue.translation}</p></article>}</>
}

function ReadingSection({ lesson, languageId, lessonPath, level, answers, setAnswers, checked, setChecked }) {
  const { state, toggleSaved, savePersonalWord, setToast } = useApp()
  const [selectedWord, setSelectedWord] = useState(null)
  const r = lesson.reading
  const item = { id: `reading-${languageId}-${lesson.id}`, type: 'Reading', title: r.title, subtitle: lesson.title, languageId, level, path: lessonPath }
  const saved = state.savedItems.some((savedItem) => savedItem.id === item.id)
  const alreadyPersonal = selectedWord && state.personalVocabulary.some((word) => word.languageId === languageId && word.level === level && word.word.toLocaleLowerCase() === selectedWord[0].toLocaleLowerCase())
  const addSelectedWord = () => {
    try {
      savePersonalWord({ languageId, level, word:selectedWord[0], ipa:selectedWord[1], partOfSpeech:selectedWord[2], meaningVi:selectedWord[3], example:selectedWord[4], translation:selectedWord[5], topic:lesson.topic || lesson.title })
    } catch (error) { setToast(error.message) }
  }
  return <div className="reading-wrap"><article className="reading-passage"><button className={`icon-btn bookmark-heading ${saved ? 'saved' : ''}`} aria-label={saved ? 'Bỏ lưu bài đọc' : 'Lưu bài đọc'} onClick={() => toggleSaved(item)}><Bookmark fill={saved ? 'currentColor' : 'none'} /></button><span className="overline">{r.title}</span><h2>{lesson.title}</h2><p>{highlightVocabulary(r.text, lesson.vocab, setSelectedWord)}</p>{lesson.extraReading && <p>{highlightVocabulary(lesson.extraReading, lesson.vocab, setSelectedWord)}</p>}<div className="reading-context"><h3>Từ của bài trong ngữ cảnh</h3>{lesson.vocab.map((word) => <p key={word[0]}>{highlightVocabulary(word[4], [word], setSelectedWord)}</p>)}</div><div className="highlight-legend"><span>●</span> Chạm vào từ được đánh dấu để xem nghĩa và lưu vào kho cá nhân.</div>{selectedWord && <div className="reading-word-detail" aria-live="polite"><div><strong>{selectedWord[0]}</strong><span>{selectedWord[1]} · {selectedWord[2]}</span><p>{selectedWord[3]}</p><small>{selectedWord[4]} — {selectedWord[5]}</small></div><div className="reading-word-actions"><button className="btn secondary small" onClick={() => speak(selectedWord[0], languageId, 1, setToast)}><Volume2/> Nghe</button><button className="btn small" disabled={alreadyPersonal} onClick={addSelectedWord}>{alreadyPersonal ? 'Đã thêm vào kho cá nhân' : 'Thêm vào My Vocabulary'}</button></div></div>}</article><div className="exercise-card"><span className="exercise-type">{(r.type || 'Reading Comprehension').toUpperCase()}</span><h3>{r.question}</h3><div className="answer-list">{r.options.map((option,index) => <button key={option} className={`${answers.reading === index ? 'selected' : ''} ${checked.reading ? (index === r.answer ? 'correct' : answers.reading === index ? 'wrong' : '') : ''}`} onClick={() => !checked.reading && setAnswers({ ...answers, reading: index })}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{!checked.reading ? <button className="btn" disabled={answers.reading === null} onClick={() => setChecked({ ...checked, reading: true })}>Kiểm tra</button> : <Feedback correct={answers.reading === r.answer} text="Đối chiếu thông tin và ý chính trong đoạn văn phía trên." />}</div></div>
}

function WritingSection({ lesson, answers, setAnswers }) {
  const task = lesson.writing
  const result = writingResult(task, answers.writing, answers.writingIdeas)
  const setWriting = (value) => setAnswers({ ...answers, writing: value })
  return <div className="writing-card"><span className="exercise-type">{(task.type || 'Guided Writing').toUpperCase()}</span><h2>{task.prompt}</h2>{task.type === 'Reorder Sentence' ? <ReorderBuilder tokens={task.tokens} value={Array.isArray(answers.writing) ? answers.writing : []} onChange={setWriting} /> : <label htmlFor="writing-answer"><span className="writing-label">Bài viết của bạn</span>{task.type === 'Fill Missing Word' ? <input id="writing-answer" value={typeof answers.writing === 'string' ? answers.writing : ''} onChange={(event) => setWriting(event.target.value)} placeholder="Nhập từ còn thiếu…" /> : <textarea id="writing-answer" value={typeof answers.writing === 'string' ? answers.writing : ''} onChange={(event) => setWriting(event.target.value)} placeholder="Bắt đầu viết ở đây…" rows="8" />}</label>}<div className="writing-stats"><span>{result.wordCount} từ{task.minWords ? ` / tối thiểu ${task.minWords}` : ''}</span><span>{result.keywordCount}/{task.keywords?.length || 0} từ khóa</span><span>{result.hasPunctuation ? '✓ Có dấu câu' : '○ Thêm dấu câu'}</span><span>{result.sentenceCount} câu</span></div>{task.requiredIdeas && <div className="required-ideas"><strong>Tự kiểm tra ý bắt buộc</strong>{task.requiredIdeas.map((idea) => <label key={idea}><input type="checkbox" checked={answers.writingIdeas.includes(idea)} onChange={(event) => setAnswers({ ...answers, writingIdeas: event.target.checked ? [...answers.writingIdeas, idea] : answers.writingIdeas.filter((item) => item !== idea) })} /> {idea}</label>)}</div>}<div className="criteria-result" aria-live="polite"><strong>Task completion: {result.score}%</strong><ProgressBar value={result.score} /></div><small>Điểm này chỉ phản ánh mức hoàn thành tiêu chí local (độ dài, từ khóa, số câu, dấu câu và checklist ý), không phải điểm Writing proficiency.</small></div>
}

function QuizSection({ lesson, languageId, answers, setAnswers, checked, setChecked, setToast }) {
  const quiz = lesson.quiz
  const correct = quizIsCorrect(quiz, answers.quiz)
  const setQuiz = (value) => setAnswers({ ...answers, quiz: value })
  return <div className="exercise-card"><div className="quiz-progress"><span>Question 1 / 1</span><ProgressBar value={checked.quiz ? 100 : 50} /></div><span className="exercise-type">{(quiz.type || 'Multiple Choice').toUpperCase()}</span>{quiz.type === 'Listening Quiz' && <button className="audio-button quiz-audio" aria-label="Nghe câu hỏi" onClick={() => speak(quiz.audio, languageId, 1, setToast)}><Volume2 /></button>}<h2>{quiz.question}</h2>{quiz.type === 'Reorder Sentence' ? <ReorderBuilder tokens={quiz.tokens} value={Array.isArray(answers.quiz) ? answers.quiz : []} onChange={setQuiz} disabled={checked.quiz} /> : quiz.type === 'Matching' ? <MatchingAnswer quiz={quiz} value={answers.quiz && !Array.isArray(answers.quiz) ? answers.quiz : {}} onChange={setQuiz} disabled={checked.quiz} /> : typeof quiz.expected === 'string' ? <label className="text-answer"><span>Câu trả lời</span><input value={typeof answers.quiz === 'string' ? answers.quiz : ''} disabled={checked.quiz} onChange={(event) => setQuiz(event.target.value)} placeholder="Nhập đáp án…" /></label> : <div className="answer-list">{quiz.options.map((option,index) => <button key={`${option}-${index}`} className={`${answers.quiz === index ? 'selected' : ''} ${checked.quiz ? (index === quiz.answer ? 'correct' : answers.quiz === index ? 'wrong' : '') : ''}`} onClick={() => !checked.quiz && setQuiz(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{checked.quiz && index === quiz.answer && <CheckCircle2 />}</button>)}</div>}{!checked.quiz ? <button className="btn" disabled={!hasQuizAnswer(quiz, answers.quiz)} onClick={() => setChecked({ ...checked, quiz: true })}>Kiểm tra đáp án</button> : <Feedback correct={correct} text={quiz.explanation} />}</div>
}

function ReorderBuilder({ tokens, value, onChange, disabled = false }) {
  const selected = Array.isArray(value) ? value : []
  return <div className="reorder-exercise"><div className="reorder-result" aria-live="polite">{selected.length ? selected.map((index) => tokens[index]).join(' ') : 'Chọn từng từ theo đúng thứ tự'}</div><div className="token-bank">{tokens.map((token, index) => <button type="button" key={`${token}-${index}`} disabled={disabled || selected.includes(index)} onClick={() => onChange([...selected, index])}>{token}</button>)}</div><button type="button" className="btn ghost small" disabled={disabled || !selected.length} onClick={() => onChange([])}><RotateCcw /> Làm lại thứ tự</button></div>
}

function MatchingAnswer({ quiz, value, onChange, disabled }) {
  const meanings = quiz.pairs.map((pair) => pair[1]).slice().reverse()
  return <div className="matching-grid">{quiz.pairs.map(([word], index) => <label key={word}><span>{word}</span><select disabled={disabled} value={value[index] ?? ''} onChange={(event) => onChange({ ...value, [index]: event.target.value })}><option value="">Chọn nghĩa…</option>{meanings.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>)}</div>
}

function ReviewSection({ lesson, checked, skills, remainingSections }) {
  return <><div className="review-summary"><div className="review-celebrate">✦</div><h2>Tổng kết bài học</h2><p>Xem kết quả các kỹ năng trong bài <strong>{lesson.title}</strong> trước khi hoàn thành.</p><div className="review-check-grid">{[['Từ vựng',`${lesson.vocab.length} từ mới`],['Ngữ pháp',lesson.grammar.name],['Nghe & nói',`${skills.Listening}% · ${skills.Speaking}%`],['Đọc & viết',`${skills.Reading}% · ${skills.Writing}%`]].map(([title,sub]) => <div key={title}><CheckCircle2 /><span><strong>{title}</strong><small>{sub}</small></span></div>)}</div>{remainingSections.length > 0 && <div className="notice warning">Đi qua các phần còn lại trước khi hoàn thành: {remainingSections.join(', ')}.</div>}{(!checked.grammar || !checked.listening || !checked.reading || !checked.quiz || skills.Writing === 0) && <div className="notice warning">Các hoạt động chưa làm hoặc chưa kiểm tra sẽ được tính 0 điểm.</div>}</div><ConsolidationPractice lesson={lesson}/></>
}

function ConsolidationPractice({ lesson }) {
  const practice = lesson.practice || { fill:{ prompt:lesson.vocab[0][4].replace(new RegExp(lesson.vocab[0][0],'i'),'_____'),answer:lesson.vocab[0][0] }, reorder:{ tokens:lesson.target.replace(/[.!?]/g,'').split(/\s+/).sort((a,b)=>a.localeCompare(b)),answer:lesson.target }, translation:{ prompt:lesson.vocab[1][5],answer:lesson.vocab[1][4] } }
  const [fill,setFill] = useState('')
  const [order,setOrder] = useState([])
  const [translation,setTranslation] = useState('')
  const [checkedPractice,setCheckedPractice] = useState(false)
  const fillCorrect = normalizeAnswer(fill) === normalizeAnswer(practice.fill.answer)
  const orderText = order.map((index)=>practice.reorder.tokens[index]).join(' ')
  const orderCorrect = normalizeAnswer(orderText) === normalizeAnswer(practice.reorder.answer)
  const translationCorrect = normalizeAnswer(translation).split(' ').filter((word)=>normalizeAnswer(practice.translation.answer).includes(word)).length >= 3
  return <section className="consolidation-card"><span className="overline">BÀI TỔNG KẾT CUỐI BÀI</span><h2>Active recall challenge</h2><p>Hoàn thành ba dạng bài để kiểm tra khả năng sử dụng chủ động.</p><label className="text-answer"><span>1. Điền từ: {practice.fill.prompt}</span><input value={fill} disabled={checkedPractice} onChange={(event)=>setFill(event.target.value)} placeholder="Nhập từ còn thiếu…"/></label><div><strong>2. Sắp xếp câu</strong><ReorderBuilder tokens={practice.reorder.tokens} value={order} onChange={setOrder} disabled={checkedPractice}/></div><label className="text-answer"><span>3. Diễn đạt theo yêu cầu: {practice.translation.prompt}</span><input value={translation} disabled={checkedPractice} onChange={(event)=>setTranslation(event.target.value)} placeholder="Viết bản dịch của bạn…"/></label>{!checkedPractice ? <button className="btn" disabled={!fill || order.length !== practice.reorder.tokens.length || !translation} onClick={()=>setCheckedPractice(true)}>Chấm bài tổng kết</button> : <div className="practice-feedback-list">{[[fillCorrect,'Điền từ',practice.fill.answer],[orderCorrect,'Sắp xếp câu',practice.reorder.answer],[translationCorrect,'Dịch',practice.translation.answer]].map(([correct,label,answer])=><div className={correct?'correct':'wrong'} key={label}><strong>{correct?'✓':'✕'} {label}</strong>{!correct&&<span>Đáp án gợi ý: {answer}</span>}</div>)}</div>}</section>
}

function Feedback({ correct, text }) {
  return <div className={`feedback ${correct ? 'correct' : 'wrong'}`} role="status"><strong>{correct ? '✓ Correct!' : '✕ Incorrect'}</strong><p>{text}</p></div>
}

function Result({ lesson, score, skills, xpEarned, onAgain, onReview }) {
  const navigate = useNavigate()
  const weak = Object.entries(skills).filter(([,value])=>value<70).map(([name])=>name)
  return <main className="result-page"><div className="confetti">✦</div><span className="result-icon">🏆</span><span className="overline">LESSON COMPLETE!</span><h1>Tuyệt vời! Bạn đã hoàn thành<br />“{lesson.title}”</h1><div className="score-circle" style={{ '--p': `${score * 3.6}deg` }}><span><strong>{score}%</strong><small>Lesson performance</small></span></div>{xpEarned > 0 && <div className="xp-earned"><Star fill="currentColor" /> XP Earned <strong>+{xpEarned}</strong></div>}<div className="skill-scores">{Object.entries(skills).map(([name,value]) => <div key={name}><span>{name}</span><strong>{value}%</strong><ProgressBar value={value} /></div>)}</div><div className="result-recommendation"><strong>Nội dung nên ôn lại</strong><p>{weak.length ? `${weak.join(', ')} đang dưới 70%. Các câu làm sai đã được lưu trong Mistake Notebook.` : 'Bạn đạt từ 70% ở mọi kỹ năng. Hãy ôn flashcard theo lịch để duy trì trí nhớ.'}</p></div><div className="result-actions"><button className="btn large" onClick={() => navigate('/dashboard')}>Continue <ArrowRight /></button><button className="btn secondary" onClick={onReview}>Review Mistakes</button><button className="btn ghost" onClick={onAgain}><RotateCcw /> Practice Again</button></div></main>
}

function normalizeAnswer(value) {
  return String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()
}

function listeningIsCorrect(spec, answer, lesson) {
  const current = spec || { answer: 1, options: [lesson?.vocab?.[1]?.[3], lesson?.nativeTitle, lesson?.vocab?.[0]?.[3]] }
  return typeof current.expected === 'string' ? normalizeAnswer(answer) === normalizeAnswer(current.expected) : answer === current.answer
}

function answerLabel(spec, lesson) {
  if (typeof spec?.expected === 'string') return spec.expected
  return spec?.options?.[spec.answer] || lesson?.nativeTitle || ''
}

function responseLabel(spec, answer) {
  return typeof spec?.expected === 'string' ? String(answer || 'Chưa trả lời') : spec?.options?.[answer] || 'Chưa trả lời'
}

function quizIsCorrect(quiz, answer) {
  if (!quiz) return false
  if (quiz.type === 'Reorder Sentence') return normalizeAnswer((Array.isArray(answer) ? answer : []).map((index) => quiz.tokens[index]).join(' ')) === normalizeAnswer(quiz.expected)
  if (quiz.type === 'Matching') return quiz.pairs.every((pair, index) => answer?.[index] === pair[1])
  if (typeof quiz.expected === 'string') return normalizeAnswer(answer) === normalizeAnswer(quiz.expected)
  return answer === quiz.answer
}

function hasQuizAnswer(quiz, answer) {
  if (quiz.type === 'Reorder Sentence') return Array.isArray(answer) && answer.length === quiz.tokens.length
  if (quiz.type === 'Matching') return answer && Object.keys(answer).length === quiz.pairs.length
  return answer !== null && answer !== ''
}

function quizAnswerLabel(quiz) {
  if (quiz.type === 'Matching') return quiz.pairs.map((pair) => pair.join(' → ')).join('; ')
  if (typeof quiz.expected === 'string') return quiz.expected
  return quiz.options?.[quiz.answer] || ''
}

function quizResponseLabel(quiz, answer) {
  if (quiz.type === 'Reorder Sentence') return (Array.isArray(answer) ? answer : []).map((index) => quiz.tokens[index]).join(' ') || 'Chưa trả lời'
  if (quiz.type === 'Matching') return quiz.pairs.map(([word], index) => `${word} → ${answer?.[index] || '?'}`).join('; ')
  if (typeof quiz.expected === 'string') return String(answer || 'Chưa trả lời')
  return quiz.options?.[answer] || 'Chưa trả lời'
}

function writingResult(task, answer, writingIdeas = []) {
  if (!task) return { score: 0, wordCount: 0, keywordCount: 0, sentenceCount: 0, hasPunctuation: false, text: '', guidance: '' }
  const text = task.type === 'Reorder Sentence' ? (Array.isArray(answer) ? answer : []).map((index) => task.tokens[index]).join(' ') : String(answer || '')
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const keywordCount = (task.keywords || []).filter((word) => normalizeAnswer(text).includes(normalizeAnswer(word))).length
  const sentenceCount = (text.match(/[.!?。！？]+/g) || []).length
  const hasPunctuation = /[.!?。！？]$/.test(text.trim())
  if (task.expected) {
    const exact = normalizeAnswer(text) === normalizeAnswer(task.expected)
    return { score: exact ? 100 : text ? 40 : 0, wordCount, keywordCount, sentenceCount, hasPunctuation, text, guidance: `Đáp án mẫu: ${task.expected}` }
  }
  const checks = [wordCount >= (task.minWords || 1), !task.maxWords || wordCount <= task.maxWords, !(task.keywords || []).length || keywordCount > 0, sentenceCount >= (task.minWords >= 50 ? 3 : 1), hasPunctuation]
  if (task.requiredIdeas?.length) checks.push(task.requiredIdeas.every((idea) => writingIdeas.includes(idea)))
  const score = Math.round(checks.filter(Boolean).length / checks.length * 100)
  return { score, wordCount, keywordCount, sentenceCount, hasPunctuation, text, guidance: `Đáp ứng ${task.minWords || 1}${task.maxWords ? `–${task.maxWords}` : '+'} từ, dùng từ vựng gợi ý, viết đủ câu và dấu câu.` }
}

function highlightVocabulary(text, vocabulary, onSelect) {
  const words = vocabulary.map((item) => item[0]).filter(Boolean)
  if (!words.length) return text
  const expression = new RegExp(`(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(expression).map((part, index) => {
    const match = vocabulary.find((word) => word[0].toLocaleLowerCase() === part.toLocaleLowerCase())
    return match ? <button type="button" className="reading-word" aria-label={`Xem từ ${part}`} key={`${part}-${index}`} onClick={() => onSelect(match)}><mark>{part}</mark></button> : part
  })
}

