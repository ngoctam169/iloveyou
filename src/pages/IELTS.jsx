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
import { recognitionFor } from '../utils/speech'

const tabs = ['Overview','Full Mock','Listening Practice','Reading Practice','Writing','Speaking','History']

export default function IELTS() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const latest = state.ieltsHistory?.[0]
  return <div className="inner-page section-shell learning-hub exam-hub">
    <div className="hub-hero ielts-hero">
      <div>
        <span className="overline">IELTS ACADEMIC</span>
        <h1>Thi thử IELTS theo đúng nhịp một kỳ thi</h1>
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
    {tab === 'Speaking' && <IELTSSpeaking/>}
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
  const { saveExamResult } = useApp()
  const [phase,setPhase] = useState('objective')
  const [objective,setObjective] = useState(null)
  const [finalResult,setFinalResult] = useState(null)

  const reset = () => { setPhase('objective'); setObjective(null); setFinalResult(null) }

  if (phase === 'objective') return <SectionedExamRunner
    title="IELTS Academic Full Mock"
    subtitle="Bộ đề mô phỏng tự viết theo format IELTS Academic trên máy tính."
    sections={ieltsFullSections}
    startNotes={[
      'Listening: 4 parts, 40 câu, 30 phút.',
      'Academic Reading: 3 passages, 40 câu, 60 phút.',
      'Sau Reading, tiếp tục Writing 60 phút với Task 1 và Task 2.',
    ]}
    buildResult={buildIeltsObjectiveResult}
    onComplete={setObjective}
    renderResult={({ result }) => <section className="practice-result exam-result">
      <CheckCircle2/>
      <h2>Listening & Reading hoàn thành</h2>
      <div className="result-breakdown">
        <div><b>{result.bands.Listening.toFixed(1)}</b><span>Listening band</span><small>{result.listeningCorrect}/40 đúng</small></div>
        <div><b>{result.bands.Reading.toFixed(1)}</b><span>Reading band</span><small>{result.readingCorrect}/40 đúng</small></div>
        <div><b>{result.unanswered}</b><span>Unanswered</span><small>câu bỏ trống</small></div>
      </div>
      <button className="btn large" onClick={() => setPhase('writing')}>Tiếp tục Writing · 60 phút <ChevronRight/></button>
    </section>}
  />

  if (phase === 'writing') return <IELTSWritingExam objective={objective} onComplete={(report) => {
    const merged={ ...objective,...report,type:'Academic Full Mock',bands:objective.bands,timeUsed:objective.timeUsed + report.writingTimeUsed }
    saveExamResult('ielts',merged)
    setFinalResult(merged)
    setPhase('result')
  }}/>

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

function IELTSWritingExam({ objective,onComplete }) {
  const [task1,setTask1] = useState('')
  const [task2,setTask2] = useState('')
  const [seconds,setSeconds] = useState(60*60)
  const [deadline] = useState(() => Date.now() + 60*60*1000)
  const submitted=useRef(false)
  const words=(value)=>value.trim() ? value.trim().split(/\s+/).length : 0
  const finish=()=> {
    if (submitted.current) return
    submitted.current=true
    onComplete({
      writingWords:{ task1:words(task1),task2:words(task2) },
      writingComplete:words(task1)>=150 && words(task2)>=250,
      writingTimeUsed:60*60-seconds,
    })
  }
  return <section className="writing-workspace full-writing-exam">
    <div className="timed-test-head"><div><span>IELTS Academic</span><strong>Writing · Task 1 & Task 2</strong></div><ExamTimer seconds={seconds} onChange={setSeconds} onEnd={finish} deadline={deadline} resetKey="full-writing"/></div>
    <div className="writing-exam-stack">
      {ieltsAcademicWritingTasks.map((task,index) => {
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
    <p className="exam-disclaimer">Task 2 nên dành khoảng 40 phút và có trọng số lớn hơn Task 1 trong kỳ thi thật. App lưu bài và word count nhưng không giả lập examiner band.</p>
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
  if (done) return <section className="practice-result exam-result"><CheckCircle2/><h2>Writing practice hoàn thành</h2><p>Task 1: {report.writingWords.task1} từ · Task 2: {report.writingWords.task2} từ.</p><button className="btn" onClick={()=>setDone(false)}>Luyện lại</button></section>
  return <IELTSWritingExam objective={null} onComplete={(value)=>{ const result={...value,type:'Writing',topic:'Academic Task 1 + Task 2'};saveExamResult('ielts',result);setReport(result);setDone(true) }}/>
}

function IELTSSpeaking() {
  const { setToast } = useApp()
  const [part,setPart] = useState('All parts')
  const [index,setIndex] = useState(0)
  const [phase,setPhase] = useState('idle')
  const [seconds,setSeconds] = useState(60)
  const [recording,setRecording] = useState(false)
  const [audioUrl,setAudioUrl] = useState('')
  const [transcript,setTranscript] = useState('')
  const recorder=useRef(null)
  const stream=useRef(null)
  const recognition=useRef(null)
  const filtered=ieltsSpeaking.filter((item)=>part==='All parts'||item.part===part)
  const topic=filtered[index % Math.max(1,filtered.length)]

  useEffect(()=>()=>{ stream.current?.getTracks().forEach((track)=>track.stop());recognition.current?.abort();if(audioUrl)URL.revokeObjectURL(audioUrl) },[audioUrl])

  const stop=()=>{ if(recorder.current?.state==='recording')recorder.current.stop();recognition.current?.stop();setRecording(false);setPhase('done') }
  const prepare=()=>{ setTranscript('');if(audioUrl)URL.revokeObjectURL(audioUrl);setAudioUrl('');setPhase(topic.part==='Part 2'?'preparation':'speaking');setSeconds(topic.part==='Part 2'?60:topic.part==='Part 1'?300:300) }
  const start=async()=>{
    try{
      if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setToast('Trình duyệt không hỗ trợ ghi âm; timer vẫn chạy.');setPhase('speaking');setSeconds(topic.part==='Part 2'?120:300);return}
      stream.current=await navigator.mediaDevices.getUserMedia({audio:true})
      const chunks=[]
      recorder.current=new MediaRecorder(stream.current)
      recorder.current.ondataavailable=(event)=>{if(event.data.size)chunks.push(event.data)}
      recorder.current.onstop=()=>{setAudioUrl(URL.createObjectURL(new Blob(chunks,{type:'audio/webm'})));stream.current?.getTracks().forEach((track)=>track.stop())}
      recorder.current.start();setRecording(true);setPhase('speaking');setSeconds(topic.part==='Part 2'?120:300)
      const speech=recognitionFor('english')
      if(speech){recognition.current=speech;speech.continuous=true;speech.interimResults=true;speech.onresult=(event)=>setTranscript(Array.from(event.results).map((result)=>result[0].transcript).join(' '));try{speech.start()}catch{/* recording still works */}}
    }catch{setToast('Không truy cập được microphone. Hãy cấp quyền rồi thử lại.')}
  }
  const timeout=()=>{ if(phase==='preparation'){setPhase('speaking');setSeconds(120)}else stop() }

  return <section className="speaking-studio">
    <div className="filter-bar mini"><label><span>Part</span><select value={part} onChange={(event)=>{setPart(event.target.value);setIndex(0);setPhase('idle')}}>{['All parts','Part 1','Part 2','Part 3'].map((item)=><option key={item}>{item}</option>)}</select></label><span className="filter-result">{filtered.length} topics</span></div>
    <div className="speaking-topic"><span className="type-tag">{topic.part} · {topic.topic}</span><h2>{topic.question}</h2>{topic.part==='Part 2'&&<div className="cue-card"><strong>You should say:</strong>{topic.bullets.map((item)=><p key={item}>• {item}</p>)}</div>}</div>
    <div className="speaking-console">
      <div className={`mic-circle ${recording?'recording':''}`}><Mic/></div>
      <div><span>{phase==='preparation'?'Preparation':phase==='speaking'?'Speaking':phase==='done'?'Recording complete':'Ready'}</span>{['preparation','speaking'].includes(phase)&&<ExamTimer seconds={seconds} onChange={setSeconds} onEnd={timeout}/>}</div>
      <div className="center-actions">{phase==='idle'&&<button className="btn secondary" onClick={prepare}><Clock3/> Chuẩn bị</button>}{!recording&&['idle','preparation'].includes(phase)&&<button className="btn" onClick={start}><Mic/> Record</button>}{recording&&<button className="btn danger" onClick={stop}><Square/> Stop</button>}{phase==='done'&&<button className="btn secondary" onClick={prepare}><RotateCcw/> Retry</button>}</div>
      {audioUrl&&<audio className="recording-player" controls src={audioUrl}/>}
      {transcript&&<div className="speech-transcript"><strong>SpeechRecognition transcript</strong><p>{transcript}</p><small>Transcript tự động chỉ để tự kiểm tra độ rõ; không phải IELTS Speaking score.</small></div>}
    </div>
    <div className="practice-actions spread"><button className="btn ghost" disabled={index===0} onClick={()=>{setIndex((value)=>Math.max(0,value-1));setPhase('idle')}}><ChevronLeft/> Previous</button><button className="btn ghost" disabled={index===filtered.length-1} onClick={()=>{setIndex((value)=>Math.min(filtered.length-1,value+1));setPhase('idle')}}>Next <ChevronRight/></button></div>
  </section>
}

function IELTSHistory({ history }) {
  if (!history.length) return <div className="empty-inline"><BarChart3/><h2>Chưa có lịch sử IELTS</h2><p>Hoàn thành Full Mock hoặc Writing để lưu kết quả.</p></div>
  return <section className="history-list"><div className="panel-title"><div><h2>IELTS practice history</h2><p>Kết quả gần nhất được lưu trên thiết bị.</p></div></div>{history.map((item)=><article key={item.id}><div><strong>{item.bands?.Listening?.toFixed?.(1)||'—'}</strong><span>Listening</span></div><div><b>{item.bands?.Reading?.toFixed?.(1)||'—'}</b><span>Reading</span></div><div><b>{item.writingWords?.task1 ?? '—'}</b><span>Task 1 words</span></div><div><b>{item.writingWords?.task2 ?? '—'}</b><span>Task 2 words</span></div><time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(item.date))}</time></article>)}</section>
}
