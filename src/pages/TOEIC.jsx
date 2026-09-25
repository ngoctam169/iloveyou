import { BarChart3, Bookmark, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, History, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import AudioPlayer from '../components/common/AudioPlayer'
import ExamTimer from '../components/common/ExamTimer'
import ProgressBar from '../components/common/ProgressBar'
import QuestionNavigator from '../components/common/QuestionNavigator'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { toeicListeningQuestions, toeicMiniTest, toeicReading, toeicParts } from '../data/toeic'

const estimatedScore = (correct, total) => Math.max(10, Math.min(990, Math.round((correct / total * 980 + 10) / 5) * 5))

export default function TOEIC() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const latest = state.toeicHistory?.[0]
  const listening = latest?.listeningScore || 0
  const reading = latest?.readingScore || 0
  return <div className="inner-page section-shell learning-hub exam-hub">
    <div className="hub-hero exam-hero"><div><span className="overline">TOEIC PREPARATION</span><h1>Xây chiến lược, luyện đúng điểm yếu</h1><p>Listening Part 1–4 · Reading Part 5–7 · Mini test có timer và lịch sử kết quả</p></div><label className="target-picker"><span>Target score</span><select value={state.toeicTarget} onChange={(event) => update({ toeicTarget:Number(event.target.value) })}>{[450,550,650,750,850,900].map((score) => <option key={score}>{score}</option>)}</select></label></div>
    <div className="hub-tabs" role="tablist">{toeicParts.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'Overview' && <><div className="metric-grid exam-metrics"><StatisticsCard icon={Target} value={latest?.score || '—'} label="Current score"/><StatisticsCard icon={Target} value={`${state.toeicTarget}+`} label="Target score"/><StatisticsCard icon={Headphones} value={listening || '—'} label="Listening"/><StatisticsCard icon={BookOpen} value={reading || '—'} label="Reading"/><StatisticsCard icon={Clock3} value={latest ? `${Math.ceil(latest.timeUsed / 60)}m` : '0m'} label="Study time"/><StatisticsCard icon={BarChart3} value={latest ? `${latest.accuracy}%` : '—'} label="Accuracy"/></div><div className="exam-overview-grid"><section className="panel"><div className="panel-title"><div><h2>Practice by part</h2><p>Mở tự do, không có prerequisite.</p></div></div><div className="part-list">{[['Listening','Part 1–4','10 câu · audio & transcript',Headphones],['Reading','Part 5–7','15 câu · giải thích chi tiết',BookOpen],['Mini Test','Listening + Reading','20 câu · 20 phút',Clock3]].map(([name,parts,detail,Icon]) => <button key={name} onClick={() => setTab(name)}><span><Icon/></span><div><strong>{name}</strong><small>{parts} · {detail}</small></div><ChevronRight/></button>)}</div></section><section className="panel weak-skills"><h2>Weak skills</h2>{latest?.weakTopics?.length ? latest.weakTopics.map((skill) => <div key={skill}><span>{skill}</span><ProgressBar value={45}/></div>) : <div className="empty-compact"><span>◎</span><p>Hoàn thành mini test để xác định kỹ năng cần cải thiện.</p></div>}</section></div></>}
    {tab === 'Listening' && <TOEICPractice questions={toeicListeningQuestions} kind="toeic-listening"/>}
    {tab === 'Reading' && <TOEICPractice questions={toeicReading} kind="toeic-reading"/>}
    {tab === 'Mini Test' && <TOEICMiniTest onExit={() => setTab('History')}/>} 
    {tab === 'History' && <ExamHistory history={state.toeicHistory || []}/>} 
  </div>
}

function TOEICPractice({ questions, kind }) {
  const { state, toggleSaved, addMistake } = useApp()
  const [part, setPart] = useState('All parts')
  const [status, setStatus] = useState('All')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [showTranscript, setShowTranscript] = useState(false)
  const parts = ['All parts', ...new Set(questions.map((item) => `Part ${item.part}`))]
  const filtered = useMemo(() => questions.filter((item) => (part === 'All parts' || `Part ${item.part}` === part) && (status === 'All' || state.savedItems.some((saved) => saved.id === `${kind}-${item.id}`))), [questions, part, status, state.savedItems, kind])
  const q = filtered[index % Math.max(1, filtered.length)]
  if (!q) return <div className="empty-inline"><span>☆</span><h2>Chưa có câu được bookmark</h2><button className="btn secondary" onClick={() => setStatus('All')}>Xem tất cả</button></div>
  const selected = answers[q.id]
  const isChecked = checked[q.id]
  const item = { id:`${kind}-${q.id}`, type:kind.includes('listening') ? 'TOEIC Listening' : 'TOEIC Reading', title:q.question, subtitle:`Part ${q.part} · ${q.type}`, path:'/toeic' }
  const saved = state.savedItems.some((entry) => entry.id === item.id)
  const check = () => { setChecked({ ...checked, [q.id]:true }); if (selected !== q.answer) addMistake({ id:`mistake-${kind}-${q.id}`, type:'TOEIC', prompt:q.question, yourAnswer:q.options[selected] || 'Chưa trả lời', answer:q.options[q.answer], explanation:q.explanation, topic:`Part ${q.part}`, path:'/toeic' }) }
  const move = (next) => { setIndex((current) => (current + next + filtered.length) % filtered.length); setShowTranscript(false) }
  return <section className="exam-practice"><div className="filter-bar mini"><label><span>Part</span><select value={part} onChange={(event) => { setPart(event.target.value); setIndex(0) }}>{parts.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Trạng thái</span><select value={status} onChange={(event) => { setStatus(event.target.value); setIndex(0) }}><option>All</option><option>Bookmarked</option></select></label><span className="filter-result">{filtered.length} câu luyện tập</span></div><div className="practice-head"><div><span>Part {q.part} · {q.type}</span><strong>Câu {index % filtered.length + 1}/{filtered.length}</strong></div><button className={`icon-btn ${saved ? 'saved' : ''}`} aria-label="Lưu câu hỏi" onClick={() => toggleSaved(item)}><Bookmark fill={saved ? 'currentColor' : 'none'}/></button></div>{q.audio && <AudioPlayer text={q.audio} label="Phát câu hỏi"/>}<QuizQuestion question={q} value={selected} onChange={(value) => setAnswers({ ...answers, [q.id]:value })} checked={isChecked}/>{isChecked && q.transcript && <div className="transcript-panel"><button className="btn ghost small" onClick={() => setShowTranscript(!showTranscript)}>{showTranscript ? 'Ẩn transcript' : 'Hiện transcript'}</button>{showTranscript && <><p><strong>Transcript:</strong> {q.transcript}</p><p><strong>Dịch:</strong> {q.translation}</p><div className="vocab-chips">{q.vocabulary.map((word) => <span key={word}>{word}</span>)}</div></>}</div>}{isChecked && q.grammarPoint && <div className="answer-analysis"><div><strong>Grammar point</strong><p>{q.grammarPoint}</p></div><div><strong>Vocabulary</strong><p>{q.vocabulary.join(' · ')}</p></div><div><strong>Why other answers are wrong</strong><p>{q.whyWrong}</p></div></div>}<div className="practice-actions spread"><button className="btn ghost" onClick={() => move(-1)}><ChevronLeft/> Previous</button>{!isChecked ? <button className="btn" disabled={selected === undefined} onClick={check}>Kiểm tra đáp án</button> : <button className="btn" onClick={() => move(1)}>Next <ChevronRight/></button>}</div></section>
}

function TOEICMiniTest({ onExit }) {
  const { addMistake, saveExamResult } = useApp()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [seconds, setSeconds] = useState(20 * 60)
  const [result, setResult] = useState(null)
  const submit = () => {
    if (result) return
    const listeningItems = toeicMiniTest.filter((item) => item.section === 'Listening')
    const readingItems = toeicMiniTest.filter((item) => item.section === 'Reading')
    const listenCorrect = listeningItems.filter((item) => answers[toeicMiniTest.indexOf(item)] === item.answer).length
    const readCorrect = readingItems.filter((item) => answers[toeicMiniTest.indexOf(item)] === item.answer).length
    const correct = listenCorrect + readCorrect
    const report = { score:estimatedScore(correct,toeicMiniTest.length), listeningScore:Math.round(listenCorrect/listeningItems.length*495/5)*5, readingScore:Math.round(readCorrect/readingItems.length*495/5)*5, accuracy:Math.round(correct/toeicMiniTest.length*100), correct, wrong:toeicMiniTest.length-correct, timeUsed:20*60-seconds, weakTopics:[listenCorrect < listeningItems.length*.7 ? 'Listening details' : null, readCorrect < readingItems.length*.7 ? 'Reading grammar' : null].filter(Boolean) }
    toeicMiniTest.forEach((item,itemIndex) => { if (answers[itemIndex] !== item.answer) addMistake({ id:`toeic-mini-${item.id}`, type:'TOEIC', prompt:item.question, yourAnswer:item.options[answers[itemIndex]] || 'Chưa trả lời', answer:item.options[item.answer], explanation:item.explanation, topic:`${item.section} · Part ${item.part}`, path:'/toeic' }) })
    saveExamResult('toeic',report); setResult(report)
  }
  if (!started) return <section className="exam-start"><span className="exam-start-icon">🎧</span><h2>TOEIC Mini Test</h2><p>20 câu · Listening và Reading · 20 phút. Đáp án và giải thích chỉ hiển thị sau khi nộp bài.</p><ul><li>10 câu Listening Part 1–4</li><li>10 câu Reading Part 5–7</li><li>Tự động lưu điểm và lỗi sai</li></ul><button className="btn large" onClick={() => setStarted(true)}>Bắt đầu thi</button></section>
  if (result) return <section className="practice-result exam-result"><span>🏅</span><h2>Estimated TOEIC Score</h2><strong>{result.score}</strong><div className="result-breakdown"><div><b>{result.listeningScore}</b><span>Listening</span></div><div><b>{result.readingScore}</b><span>Reading</span></div><div><b>{result.accuracy}%</b><span>Accuracy</span></div><div><b>{Math.ceil(result.timeUsed/60)}m</b><span>Time used</span></div><div><b>{result.correct}</b><span>Correct</span></div><div><b>{result.wrong}</b><span>Wrong</span></div></div><p><strong>Weak topics:</strong> {result.weakTopics.join(', ') || 'Không có điểm yếu nổi bật'}.</p><p>Khuyến nghị: ôn lại các câu sai trong Mistake Notebook rồi thử lại sau 2–3 ngày.</p><button className="btn" onClick={onExit}>Xem lịch sử</button></section>
  const q = toeicMiniTest[index]
  return <div className="timed-test"><div className="timed-test-head"><div><span>{q.section}</span><strong>TOEIC Mini Test</strong></div><ExamTimer seconds={seconds} onChange={setSeconds} onEnd={submit}/></div><div className="mock-layout"><QuestionNavigator count={toeicMiniTest.length} index={index} answers={answers} onSelect={setIndex}/><main className="question-card">{q.audio && <AudioPlayer text={q.audio} label="Play once more"/>}<QuizQuestion question={q} value={answers[index]} onChange={(value) => setAnswers({ ...answers, [index]:value })} checked={false} reveal={false}/><div className="mock-actions"><button className="btn secondary" disabled={index===0} onClick={() => setIndex(index-1)}>Previous</button>{index < toeicMiniTest.length-1 ? <button className="btn" onClick={() => setIndex(index+1)}>Next <ChevronRight/></button> : <button className="btn" onClick={submit}>Nộp bài</button>}</div></main></div></div>
}

function ExamHistory({ history }) {
  if (!history.length) return <div className="empty-inline"><History/><h2>Chưa có lịch sử thi</h2><p>Hoàn thành TOEIC Mini Test để theo dõi sự tiến bộ.</p></div>
  return <section className="history-list"><div className="panel-title"><div><h2>Mock test history</h2><p>{history.length} lần gần nhất được lưu trên thiết bị.</p></div></div>{history.map((item) => <article key={item.id}><div><strong>{item.score}</strong><span>Estimated score</span></div><div><b>{item.listeningScore}</b><span>Listening</span></div><div><b>{item.readingScore}</b><span>Reading</span></div><div><b>{item.accuracy}%</b><span>Accuracy</span></div><time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(item.date))}</time></article>)}</section>
}
