import { BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, History, RotateCcw, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import SectionedExamRunner from '../components/exam/SectionedExamRunner'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import AudioPlayer from '../components/common/AudioPlayer'
import { useApp } from '../context/AppContext'
import { toeicListeningQuestions, toeicReading } from '../data/toeic'
import { buildToeicFullResult, toeicFullSections, toeicFullStats } from '../data/exams/toeicFull'
import { buildToeicExamSections } from '../data/exams/toeicAdvanced'
import { buildExamMistakes } from '../utils/examMistakes'

const tabs = ['Overview','Full Test','Listening Practice','Reading Practice','History']

export default function TOEIC() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const latest = state.toeicHistory?.[0]
  return <div className="inner-page section-shell learning-hub exam-hub">
    <div className="hub-hero exam-hero">
      <div>
        <span className="overline">TOEIC LISTENING &amp; READING</span>
        <h1>Mô phỏng TOEIC Listening & Reading đủ 200 câu</h1>
        <p>200 câu · Listening 45 phút · Reading 75 phút · chấm điểm ước tính trên thang 10–990.</p>
      </div>
      <label className="target-picker"><span>Target score</span><select value={state.toeicTarget} onChange={(event) => update({ toeicTarget:Number(event.target.value) })}>{[450,550,650,750,850,900].map((score) => <option key={score}>{score}</option>)}</select></label>
    </div>

    <div className="hub-tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>

    {tab === 'Overview' && <TOEICOverview state={state} latest={latest} onOpen={setTab}/>}
    {tab === 'Full Test' && <TOEICFullTest onHistory={() => setTab('History')}/>}
    {tab === 'Listening Practice' && <TOEICPractice questions={toeicListeningQuestions} label="Listening Practice"/>}
    {tab === 'Reading Practice' && <TOEICPractice questions={toeicReading} label="Reading Practice"/>}
    {tab === 'History' && <ExamHistory history={state.toeicHistory || []}/>}
  </div>
}

function TOEICOverview({ state, latest, onOpen }) {
  const listening = latest?.listeningScore || 0
  const reading = latest?.readingScore || 0
  return <>
    <div className="metric-grid exam-metrics">
      <StatisticsCard icon={Target} value={latest?.score || '—'} label="Latest estimated score"/>
      <StatisticsCard icon={Target} value={`${state.toeicTarget}+`} label="Target score"/>
      <StatisticsCard icon={Headphones} value={listening || '—'} label="Listening"/>
      <StatisticsCard icon={BookOpen} value={reading || '—'} label="Reading"/>
      <StatisticsCard icon={Clock3} value={latest ? `${Math.ceil(latest.timeUsed / 60)}m` : '—'} label="Time used"/>
      <StatisticsCard icon={BarChart3} value={latest ? `${latest.accuracy}%` : '—'} label="Accuracy"/>
    </div>

    <section className="exam-primary-cta">
      <div>
        <span className="overline">FULL TEST</span>
        <h2>200 câu · 120 phút</h2>
        <p>Part 1–4 Listening: {toeicFullStats.listening} câu. Part 5–7 Reading: {toeicFullStats.reading} câu. Không hiện đáp án trong lúc thi, hết giờ tự chuyển phần/tự nộp.</p>
      </div>
      <button className="btn large" onClick={() => onOpen('Full Test')}>Bắt đầu Full Test <ChevronRight/></button>
    </section>

    <div className="exam-format-grid">
      {[
        ['Listening','45 phút','100 câu','Part 1: 6 · Part 2: 25 · Part 3: 39 · Part 4: 30',Headphones],
        ['Reading','75 phút','100 câu','Part 5: 30 · Part 6: 16 · Part 7: 54',BookOpen],
      ].map(([title,time,count,detail,Icon]) => <article key={title}><span><Icon/></span><div><h3>{title}</h3><strong>{count} · {time}</strong><p>{detail}</p></div></article>)}
    </div>

    <section className="panel exam-note">
      <h2>Cách tính điểm</h2>
      <p>Ứng dụng hiển thị điểm TOEIC ước tính theo thang 5–495 cho từng kỹ năng và 10–990 tổng. ETS sử dụng quy trình quy đổi/equating theo từng form thi, nên đây là điểm mô phỏng chứ không phải score report chính thức.</p>
    </section>
  </>
}

function TOEICFullTest({ onHistory }) {
  const { saveExamResult, addMistakes } = useApp()
  return <SectionedExamRunner
    title="TOEIC Listening & Reading Full Test"
    subtitle="Mỗi lần bắt đầu sẽ tạo một form khác, giữ đủ 200 câu và đúng phân bố Part 1–7. Part 1 dùng hình minh họa cục bộ; audio hiện là giọng đọc mô phỏng của trình duyệt."
    sections={toeicFullSections}
    sectionsFactory={buildToeicExamSections}
    sessionKey="toeic-full"
    startNotes={[
      'Listening: 100 câu trong 45 phút; khi chuyển sang Reading sẽ không quay lại Listening.',
      'Reading: 100 câu trong 75 phút.',
      'Không hiện đáp án khi đang thi; câu chưa trả lời được tính là bỏ trống.',
      'Part 2 dùng audio-only choices; Part 7 có double/triple-passage và câu suy luận/paraphrase khó hơn.',
    ]}
    buildResult={buildToeicFullResult}
    onComplete={(report, attempt) => {
      saveExamResult('toeic',report)
      addMistakes(buildExamMistakes('TOEIC',attempt.sections,attempt.answers,'/toeic'))
    }}
    renderResult={({ result,restart }) => <section className="practice-result exam-result full-score-report">
      <span>🏅</span>
      <h2>Estimated TOEIC Score</h2>
      <strong>{result.score}</strong>
      <p className="score-scale">thang 10–990</p>
      <div className="result-breakdown">
        <div><b>{result.listeningScore}</b><span>Listening / 495</span><small>{result.listeningCorrect}/100 đúng</small></div>
        <div><b>{result.readingScore}</b><span>Reading / 495</span><small>{result.readingCorrect}/100 đúng</small></div>
        <div><b>{result.accuracy}%</b><span>Accuracy</span><small>{result.correct}/200 đúng</small></div>
        <div><b>{result.unanswered}</b><span>Unanswered</span><small>câu bỏ trống</small></div>
        <div><b>{Math.ceil(result.timeUsed/60)}m</b><span>Time used</span><small>tổng thời gian</small></div>
        <div><b>{result.wrong}</b><span>Wrong</span><small>câu trả lời sai</small></div>
      </div>
      <p><strong>Cần ưu tiên:</strong> {result.weakTopics.join(', ') || 'Không có section nào dưới 70% raw score'}.</p>
      <div className="center-actions">
        <button className="btn secondary" onClick={restart}><RotateCcw/> Thi lại</button>
        <button className="btn" onClick={onHistory}>Xem lịch sử</button>
      </div>
      <small className="exam-disclaimer">Estimated practice score; không phải chứng chỉ hay score report do ETS cấp.</small>
    </section>}
  />
}

function TOEICPractice({ questions, label }) {
  const [part, setPart] = useState('All parts')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [done, setDone] = useState(false)
  const parts = ['All parts', ...new Set(questions.map((item) => `Part ${item.part}`))]
  const filtered = useMemo(() => questions.filter((item) => part === 'All parts' || `Part ${item.part}` === part), [questions, part])
  const correct = filtered.filter((item) => answers[item.id] === item.answer).length

  if (done) return <section className="practice-result exam-result">
    <CheckCircle2/>
    <h2>{label} hoàn thành</h2>
    <strong>{correct}/{filtered.length}</strong>
    <p>{Math.round(correct / Math.max(1,filtered.length) * 100)}% chính xác. Không còn vòng lặp về câu 1 sau câu cuối.</p>
    <button className="btn" onClick={() => { setIndex(0); setAnswers({}); setChecked({}); setDone(false) }}><RotateCcw/> Luyện lại</button>
  </section>

  const q = filtered[index]
  const selected = answers[q.id]
  const isChecked = checked[q.id]
  const isLast = index === filtered.length - 1
  return <section className="exam-practice">
    <div className="filter-bar mini"><label><span>Part</span><select value={part} onChange={(event) => { setPart(event.target.value); setIndex(0); setAnswers({}); setChecked({}); setDone(false) }}>{parts.map((item) => <option key={item}>{item}</option>)}</select></label><span className="filter-result">{filtered.length} câu luyện tập</span></div>
    <div className="practice-head"><div><span>Part {q.part} · {q.type}</span><strong>Câu {index + 1}/{filtered.length}</strong></div><ProgressBar value={index + Number(Boolean(isChecked))} max={filtered.length}/></div>
    {q.audio && <AudioPlayer text={q.audio} label="Phát audio"/>}
    <QuizQuestion question={q} value={selected} onChange={(value) => setAnswers((current) => ({ ...current,[q.id]:value }))} checked={isChecked}/>
    <div className="practice-actions spread">
      <button className="btn ghost" disabled={index===0} onClick={() => setIndex((value) => Math.max(0,value-1))}><ChevronLeft/> Previous</button>
      {!isChecked && <button className="btn" disabled={selected === undefined} onClick={() => setChecked((current) => ({ ...current,[q.id]:true }))}>Kiểm tra</button>}
      {isChecked && !isLast && <button className="btn" onClick={() => setIndex((value) => value + 1)}>Next <ChevronRight/></button>}
      {isChecked && isLast && <button className="btn" onClick={() => setDone(true)}>Xem kết quả</button>}
    </div>
  </section>
}

function ExamHistory({ history }) {
  if (!history.length) return <div className="empty-inline"><History/><h2>Chưa có lịch sử TOEIC</h2><p>Hoàn thành Full Test để lưu kết quả.</p></div>
  return <section className="history-list"><div className="panel-title"><div><h2>TOEIC test history</h2><p>{history.length} lần gần nhất được lưu trên thiết bị.</p></div></div>{history.map((item) => <article key={item.id}><div><strong>{item.score}</strong><span>Estimated score</span></div><div><b>{item.listeningScore}</b><span>Listening</span></div><div><b>{item.readingScore}</b><span>Reading</span></div><div><b>{item.accuracy}%</b><span>Accuracy</span></div><time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(item.date))}</time></article>)}</section>
}
