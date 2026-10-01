import { BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, Mic, PenLine, RotateCcw, Square, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import SectionedExamRunner from '../components/exam/SectionedExamRunner'
import AudioPlayer from '../components/common/AudioPlayer'
import ExamTimer from '../components/common/ExamTimer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion, { isCorrectAnswer } from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { ieltsSpeaking } from '../data/ielts'
import { buildIeltsObjectiveResult, ieltsAcademicWritingTasks, ieltsFullListening, ieltsFullReading, ieltsFullSections } from '../data/exams/ieltsFull'
import { buildIeltsExamSections, buildIeltsWritingTasks } from '../data/exams/ieltsAdvanced'
import { buildExamMistakes } from '../utils/examMistakes'
import IELTSSpeakingStudio from '../components/exam/IELTSSpeakingStudio'

const tabs = ['Overview','Full Mock','Listening Practice','Reading Practice','Writing','Speaking','History']
const IELTS_FLOW_KEY = 'nt_ielts_full_flow_v1'
const IELTS_WRITING_KEY = 'nt_ielts_writing_session_v1'

function readLocal(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}
function clearLocal(key) {
  try { localStorage.removeItem(key) } catch { /* storage may be unavailable */ }
}

export default function IELTS() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const latest = state.ieltsHistory?.[0]
  return <div className="inner-page section-shell learning-hub exam-hub">
    <div className="hub-hero ielts-hero">
      <div>
        <span className="overline">IELTS ACADEMIC</span>
        <h1>Mô phỏng IELTS Academic theo từng phần</h1>
        <p>Listening 40 câu · Reading 40 câu · Writing 2 tasks · Speaking 3 parts với timer và recorder.</p>
      </div>
      <label className="target-picker"><span>Target band</span><select value={state.ieltsTarget} onChange={(event) => update({ ieltsTarget:Number(event.target.value) })}>{[4,5,5.5,6,6.5,7,7.5,8,8.5,9].map((score) => <option value={score} key={score}>{Number(score).toFixed(1)}</option>)}</select></label>
    </div>

    <div className="hub-tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>

    {tab === 'Overview' && <IELTSOverview state={state} latest={latest} onOpen={setTab}/>}
    {tab === 'Full Mock' && <IELTSFullMock onSpeaking={() => setTab('Speaking')} onHistory={() => setTab('History')}/>}
    {tab === 'Listening Practice' && <ObjectivePractice title="IELTS Listening Practice" questions={ieltsFullListening} audio/>}
    {tab === 'Reading Practice' && <ObjectivePractice title="IELTS Academic Reading Practice" questions={ieltsFullReading} passage/>}
    {tab === 'Writing' && <StandaloneWriting/>}
    {tab === 'Speaking' && <IELTSSpeakingStudio/>}
    {tab === 'History' && <IELTSHistory history={state.ieltsHistory || []}/>}
  </div>
}

function IELTSOverview({ state, latest, onOpen }) {
  const bands = latest?.bands || {}
  return <>
    <div className="metric-grid exam-metrics">
      <StatisticsCard icon={Target} value={`${Number(state.ieltsTarget).toFixed(1)}+`} label="Target band"/>
      <StatisticsCard icon={Headphones} value={bands.Listening?.toFixed?.(1) || '—'} label="Listening"/>
      <StatisticsCard icon={BookOpen} value={bands.Reading?.toFixed?.(1) || '—'} label="Reading"/>
      <StatisticsCard icon={PenLine} value={latest?.writingWords ? `${latest.writingWords.task1}/${latest.writingWords.task2}` : '—'} label="Writing words"/>
      <StatisticsCard icon={Mic} value="11–14m" label="Speaking"/>
      <StatisticsCard icon={Clock3} value={latest?.timeUsed ? `${Math.ceil(latest.timeUsed/60)}m` : '—'} label="Last mock time"/>
    </div>

    <section className="exam-primary-cta">
      <div><span className="overline">ACADEMIC FULL MOCK</span><h2>Listening + Reading + Writing</h2><p>Listening 30 phút, Reading 60 phút, Writing 60 phút. Hết giờ từng phần sẽ tự chuyển hoặc tự nộp.</p></div>
      <button className="btn large" onClick={() => onOpen('Full Mock')}>Bắt đầu Full Mock <ChevronRight/></button>
    </section>

    <div className="exam-format-grid">
      {[
        ['Listening','40 câu · 4 parts','~30 phút',Headphones],
        ['Academic Reading','40 câu · 3 passages','60 phút',BookOpen],
        ['Writing','Task 1 ≥150 + Task 2 ≥250','60 phút',PenLine],
        ['Speaking','Part 1 · 2 · 3','11–14 phút',Mic],
      ].map(([title,detail,time,Icon]) => <article key={title}><span><Icon/></span><div><h3>{title}</h3><strong>{time}</strong><p>{detail}</p></div></article>)}
    </div>

    <section className="panel exam-note"><h2>Điểm IELTS trong app</h2><p>Listening và Academic Reading được chấm raw score /40 rồi quy đổi sang estimated band 1–9. Writing và Speaking cần đánh giá của examiner theo tiêu chí IELTS nên app không bịa band tự động. Full Mock vẫn lưu word count, thời gian và trạng thái hoàn thành hai phần này.</p></section>
  </>
}

function IELTSFullMock({ onSpeaking,onHistory }) {
  const { saveExamResult, addMistakes } = useApp()
  const [savedFlow] = useState(() => {
    const saved = readLocal(IELTS_FLOW_KEY, null)
    return saved?.savedAt && Date.now() - saved.savedAt < 3 * 60 * 60 * 1000 ? saved : null
  })
  const [phase,setPhase] = useState(savedFlow?.phase || 'objective')
  const [objective,setObjective] = useState(savedFlow?.objective || null)
  const [finalResult,setFinalResult] = useState(null)
  const [writingTasks,setWritingTasks] = useState(() => savedFlow?.writingTasks || buildIeltsWritingTasks())

  useEffect(() => {
    if (phase === 'result') return
    writeLocal(IELTS_FLOW_KEY, { phase, objective, writingTasks, savedAt:Date.now() })
  }, [phase, objective, writingTasks])

  const reset = () => {
    clearLocal(IELTS_FLOW_KEY)
    clearLocal(IELTS_WRITING_KEY)
    clearLocal('nt_exam_session_v1:ielts-full')
    setPhase('objective')
    setObjective(null)
    setFinalResult(null)
    setWritingTasks(buildIeltsWritingTasks())
  }

  if (phase === 'objective') return <SectionedExamRunner
    title="IELTS Academic Full Mock"
    subtitle="Mỗi lần bắt đầu sẽ tạo một form khác; hệ thống ưu tiên form ít trùng với các lần thi gần đây."
    sections={ieltsFullSections}
    sectionsFactory={buildIeltsExamSections}
    sessionKey="ielts-full"
    startNotes={[
      'Listening: 4 parts, 40 câu, 30 phút.',
      'Academic Reading: 3 passages, 40 câu, 60 phút.',
      'Sau Reading, tiếp tục Writing 60 phút với Task 1 và Task 2.',
      'Bài đang làm được tự lưu trên thiết bị để có thể tiếp tục sau khi refresh.',
    ]}
    buildResult={buildIeltsObjectiveResult}
    onComplete={(report, attempt) => {
      writeLocal(IELTS_FLOW_KEY, { phase:'objective-result', objective:report, writingTasks, savedAt:Date.now() })
      setObjective(report)
      addMistakes(buildExamMistakes('IELTS',attempt.sections,attempt.answers,'/ielts'))
      setPhase('objective-result')
    }}
    renderResult={() => null}
  />

  if (phase === 'objective-result' && objective) return <section className="practice-result exam-result">
    <CheckCircle2/>
    <h2>Listening & Reading hoàn thành</h2>
    <div className="result-breakdown">
      <div><b>{objective.bands.Listening.toFixed(1)}</b><span>Listening band</span><small>{objective.listeningCorrect}/40 đúng</small></div>
      <div><b>{objective.bands.Reading.toFixed(1)}</b><span>Reading band</span><small>{objective.readingCorrect}/40 đúng</small></div>
      <div><b>{objective.unanswered}</b><span>Unanswered</span><small>câu bỏ trống</small></div>
    </div>
    <button className="btn large" onClick={() => setPhase('writing')}>Tiếp tục Writing · 60 phút <ChevronRight/></button>
  </section>

  if (phase === 'writing' && objective) return <IELTSWritingExam objective={objective} tasks={writingTasks} persistKey={IELTS_WRITING_KEY} onComplete={(report) => {
    const merged={ ...objective,...report,type:'Academic Full Mock',bands:objective.bands,timeUsed:objective.timeUsed + report.writingTimeUsed }
    saveExamResult('ielts',merged)
    clearLocal(IELTS_FLOW_KEY)
    clearLocal(IELTS_WRITING_KEY)
    setFinalResult(merged)
    setPhase('result')
  }}/>

  if (!finalResult) {
    return <section className="practice-result exam-result"><p>Phiên Full Mock không còn hợp lệ.</p><button className="btn" onClick={reset}>Bắt đầu lại</button></section>
  }

  return <section className="practice-result exam-result full-score-report">
    <span>🏁</span>
    <h2>IELTS Academic Mock hoàn thành</h2>
    <div className="result-breakdown">
      <div><b>{finalResult.bands.Listening.toFixed(1)}</b><span>Listening</span><small>{finalResult.listeningCorrect}/40</small></div>
      <div><b>{finalResult.bands.Reading.toFixed(1)}</b><span>Reading</span><small>{finalResult.readingCorrect}/40</small></div>
      <div><b>{finalResult.writingWords.task1}</b><span>Writing Task 1</span><small>từ · mục tiêu ≥150</small></div>
      <div><b>{finalResult.writingWords.task2}</b><span>Writing Task 2</span><small>từ · mục tiêu ≥250</small></div>
      <div><b>{Math.ceil(finalResult.timeUsed/60)}m</b><span>Time used</span><small>L + R + W</small></div>
      <div><b>{finalResult.unanswered}</b><span>Unanswered</span><small>L + R</small></div>
    </div>
    <p>Listening/Reading là estimated band từ raw score. Writing chưa gán band tự động vì cần examiner đánh giá Task Achievement/Response, Coherence & Cohesion, Lexical Resource và Grammar.</p>
    <div className="center-actions">
      <button className="btn secondary" onClick={reset}><RotateCcw/> Thi lại</button>
      <button className="btn secondary" onClick={onHistory}>Lịch sử</button>
      <button className="btn" onClick={onSpeaking}>Tiếp tục Speaking 11–14 phút</button>
    </div>
  </section>
}

function IELTSWritingExam({ objective,onComplete,tasks=ieltsAcademicWritingTasks,persistKey=null }) {
  const [saved] = useState(() => persistKey ? readLocal(persistKey, null) : null)
  const [task1,setTask1] = useState(saved?.task1 || '')
  const [task2,setTask2] = useState(saved?.task2 || '')
  const [deadline] = useState(() => Number(saved?.deadline) || Date.now() + 60*60*1000)
  const [seconds,setSeconds] = useState(() => Math.max(0, Math.ceil((deadline-Date.now())/1000)))
  const submitted=useRef(false)
  const words=(value)=>value.trim() ? value.trim().split(/\s+/).length : 0

  useEffect(() => {
    if (!persistKey || submitted.current) return undefined
    const persist = () => writeLocal(persistKey, { task1, task2, deadline, savedAt:Date.now() })
    const timer = window.setTimeout(persist, 250)
    window.addEventListener('pagehide',persist)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pagehide',persist)
    }
  }, [persistKey, task1, task2, deadline])

  const finish=()=> {
    if (submitted.current) return
    submitted.current=true
    if (persistKey) clearLocal(persistKey)
    onComplete({
      writingWords:{ task1:words(task1),task2:words(task2) },
      writingComplete:words(task1)>=150 && words(task2)>=250,
      writingTimeUsed:60*60-seconds,
    })
  }
  return <section className="writing-workspace full-writing-exam">
    <div className="timed-test-head"><div><span>IELTS Academic</span><strong>Writing · Task 1 & Task 2</strong></div><ExamTimer seconds={seconds} onChange={setSeconds} onEnd={finish} deadline={deadline} resetKey="full-writing"/></div>
    <div className="writing-exam-stack">
      {tasks.map((task,index) => {
        const value=index===0?task1:task2
        const setValue=index===0?setTask1:setTask2
        const count=words(value)
        return <article className="writing-exam-task" key={task.id}>
          <header><div><span className="type-tag">{task.task}</span><h2>{task.task}</h2></div><strong className={count < task.minWords ? 'danger-text' : ''}>{count} / {task.minWords} words</strong></header>
          <p>{task.prompt}</p>
          {task.data && <div className="exam-source-box"><strong>Data</strong><p>{task.data}</p></div>}
          <textarea value={value} onChange={(event)=>setValue(event.target.value)} rows={index===0?12:16} placeholder={`Write your ${task.task} response here…`}/>
        </article>
      })}
    </div>
    <div className="mock-actions"><span/><button className="btn large" onClick={finish}>Nộp Writing</button></div>
    <p className="exam-disclaimer">Task 2 nên dành khoảng 40 phút và có trọng số lớn hơn Task 1 trong kỳ thi thật. App tự lưu bài viết đang làm trên thiết bị nhưng không giả lập examiner band.</p>
  </section>
}

function ObjectivePractice({ title,questions,audio=false,passage=false }) {
  const [index,setIndex] = useState(0)
  const [answers,setAnswers] = useState({})
  const [checked,setChecked] = useState({})
  const [done,setDone] = useState(false)
  const q=questions[index]
  const correct=questions.filter((item)=>isCorrectAnswer(item,answers[item.id])).length

  if (done) return <section className="practice-result exam-result"><CheckCircle2/><h2>{title} hoàn thành</h2><strong>{correct}/{questions.length}</strong><p>{Math.round(correct/questions.length*100)}% chính xác.</p><button className="btn" onClick={()=>{ setIndex(0);setAnswers({});setChecked({});setDone(false) }}><RotateCcw/> Luyện lại</button></section>

  const isLast=index===questions.length-1
  const selected=answers[q.id]
  return <section className="exam-practice objective-practice">
    <div className="practice-head"><div><span>{q.section || q.passageTitle || title}</span><strong>Câu {index+1}/{questions.length} · {q.type}</strong></div><ProgressBar value={index+Number(Boolean(checked[q.id]))} max={questions.length}/></div>
    {passage && q.passage && <article className="exam-passage"><h3>{q.passageTitle}</h3>{q.passage.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</article>}
    {audio && q.audio && <AudioPlayer text={q.audio} label="Phát recording mô phỏng"/>}
    <QuizQuestion question={q} value={selected} onChange={(value)=>setAnswers((current)=>({ ...current,[q.id]:value }))} checked={checked[q.id]}/>
    <div className="practice-actions spread">
      <button className="btn ghost" disabled={index===0} onClick={()=>setIndex((value)=>Math.max(0,value-1))}><ChevronLeft/> Previous</button>
      {!checked[q.id] && <button className="btn" disabled={selected===undefined || selected===''} onClick={()=>setChecked((current)=>({ ...current,[q.id]:true }))}>Kiểm tra</button>}
      {checked[q.id] && !isLast && <button className="btn" onClick={()=>setIndex((value)=>value+1)}>Next <ChevronRight/></button>}
      {checked[q.id] && isLast && <button className="btn" onClick={()=>setDone(true)}>Xem kết quả</button>}
    </div>
  </section>
}

function StandaloneWriting() {
  const { saveExamResult } = useApp()
  const [done,setDone]=useState(false)
  const [report,setReport]=useState(null)
  const [tasks,setTasks]=useState(() => buildIeltsWritingTasks())
  if (done) return <section className="practice-result exam-result"><CheckCircle2/><h2>Writing practice hoàn thành</h2><p>Task 1: {report.writingWords.task1} từ · Task 2: {report.writingWords.task2} từ.</p><button className="btn" onClick={()=>{setTasks(buildIeltsWritingTasks());setDone(false)}}>Luyện lại</button></section>
  return <IELTSWritingExam objective={null} tasks={tasks} onComplete={(value)=>{ const result={...value,type:'Writing',topic:'Academic Task 1 + Task 2'};saveExamResult('ielts',result);setReport(result);setDone(true) }}/>
}

function IELTSHistory({ history }) {
  if (!history.length) return <div className="empty-inline"><BarChart3/><h2>Chưa có lịch sử IELTS</h2><p>Hoàn thành Full Mock hoặc Writing để lưu kết quả.</p></div>
  return <section className="history-list"><div className="panel-title"><div><h2>IELTS practice history</h2><p>Kết quả gần nhất được lưu trên thiết bị.</p></div></div>{history.map((item)=><article key={item.id}><div><strong>{item.bands?.Listening?.toFixed?.(1)||'—'}</strong><span>Listening</span></div><div><b>{item.bands?.Reading?.toFixed?.(1)||'—'}</b><span>Reading</span></div><div><b>{item.writingWords?.task1 ?? '—'}</b><span>Task 1 words</span></div><div><b>{item.writingWords?.task2 ?? '—'}</b><span>Task 2 words</span></div><time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(item.date))}</time></article>)}</section>
}
