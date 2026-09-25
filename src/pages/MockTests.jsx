import { AlarmClock, ArrowRight, Check, ChevronLeft, Headphones, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../components/common/Modal'
import ProgressBar from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { getLanguage } from '../data/languages'
import { mockQuestions } from '../data/tests'
import { speak } from '../utils/speech'

export default function MockTests() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [seconds, setSeconds] = useState(15 * 60)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState(null)
  const { setToast } = useApp()
  const language = getLanguage('english')
  useEffect(() => {
    if (!started || result !== null) return undefined
    const timer = setInterval(() => setSeconds((value) => { if (value <= 1) { clearInterval(timer); setConfirm(true); return 0 } return value - 1 }), 1000)
    return () => clearInterval(timer)
  }, [started, result])
  const submit = () => { setResult(mockQuestions.filter((question, i) => answers[i] === question.answer).length); setConfirm(false) }
  const restart = () => { setStarted(false); setResult(null); setIndex(0); setAnswers({}); setSeconds(900) }
  if (result !== null) return <div className="test-result section-shell"><div className="result-icon">🏅</div><span className="overline">PRACTICE RESULT</span><h1>English Practice Test</h1><p>Bạn trả lời đúng <strong>{result}/{mockQuestions.length}</strong> câu. Đây là bài luyện tập ngắn, không phải điểm thi hay đánh giá level.</p><div className="big-score">{result * 10}<span>/100</span></div><button className="btn" onClick={restart}>Luyện thêm</button></div>
  if (started) {
    const q = mockQuestions[index]
    return <div className="mock-active"><header><button className="icon-btn" aria-label="Quay lại" onClick={() => setConfirm(true)}><ChevronLeft/></button><strong>{language.name} · Practice</strong><span className={seconds < 60 ? 'danger' : ''}><AlarmClock/> {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span></header><div className="mock-layout"><aside><span>QUESTIONS</span><div className="question-nav">{mockQuestions.map((_, i) => <button key={i} className={`${i === index ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div><small>{Object.keys(answers).length}/{mockQuestions.length} đã trả lời</small><ProgressBar value={Object.keys(answers).length} max={mockQuestions.length}/></aside><main className="question-card"><span className="type-tag">{q.category}</span>{q.audio && <button className="audio-button" aria-label="Nghe câu mẫu" onClick={() => speak(q.audio, 'english', 1, setToast)}><Headphones/></button>}<h1>{q.question}</h1><div className="answer-list large">{q.options.map((option, i) => <button key={option} className={answers[index] === i ? 'selected' : ''} onClick={() => setAnswers({ ...answers, [index]: i })}><span>{String.fromCharCode(65 + i)}</span>{option}{answers[index] === i && <Check/>}</button>)}</div><div className="mock-actions"><button className="btn secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>Câu trước</button>{index < mockQuestions.length - 1 ? <button className="btn" onClick={() => setIndex(index + 1)}>Câu tiếp <ArrowRight/></button> : <button className="btn" onClick={() => setConfirm(true)}>Nộp bài</button>}</div></main></div><Modal open={confirm} onClose={() => setConfirm(false)} title="Nộp bài luyện tập?"><p>Bạn đã trả lời {Object.keys(answers).length}/{mockQuestions.length} câu. Các câu chưa trả lời sẽ không được tính điểm.</p><div className="modal-actions"><button className="btn secondary" onClick={() => setConfirm(false)}>Tiếp tục làm</button><button className="btn" onClick={submit}>Nộp bài</button></div></Modal></div>
  }
  return <div className="inner-page section-shell"><div className="page-heading"><span className="overline">PRACTICE UNDER PRESSURE</span><h1>English Practice Test</h1><p>10 câu hỏi tiếng Anh · 15 phút. Luyện quản lý thời gian và xem kết quả ngay.</p></div><div className="official-note"><ShieldCheck/><div><strong>Bài luyện tập ngắn, không đánh giá trình độ chính thức.</strong><p>Ngân hàng câu hỏi hiện chỉ dành cho tiếng Anh. Bạn có thể chọn level khác trực tiếp trong lộ trình.</p></div></div><section className="mock-language"><div className="mock-lang-title"><span>{language.flag}</span><div><h2>English General</h2><p>Vocabulary · Grammar · Reading · Listening simulation</p></div></div><div className="mock-grid"><article><span>10</span><div><strong>Timed Practice</strong><small>10 câu · 15 phút</small></div><button className="icon-btn" aria-label="Bắt đầu luyện tập" onClick={() => setStarted(true)}><ArrowRight/></button></article></div></section></div>
}
