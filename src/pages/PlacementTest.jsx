import { ArrowRight, Check, ChevronLeft, Headphones, Target } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/common/ProgressBar'
import { getLanguage } from '../data/languages'
import { languagePath, levelPath } from '../utils/routes'
import { placementQuestions } from '../data/tests'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speech'

export default function PlacementTest() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const { chooseCourse, setToast } = useApp()
  const navigate = useNavigate()
  const language = getLanguage('english')
  if (!started) return <div className="inner-page section-shell placement-intro"><Link to="/" className="back-link"><ChevronLeft/> Trang chủ</Link><div className="test-heading"><span className="test-icon"><Target/></span><span className="overline">PLACEMENT TEST</span><h1>Kiểm tra trình độ tiếng Anh</h1><p>15 câu hỏi · Khoảng 10 phút · Kết quả mang tính gợi ý</p></div><p>Bộ câu hỏi hiện chỉ có nội dung tiếng Anh. Với tiếng Trung, Nhật và Hàn, bạn có thể chọn level trực tiếp trong lộ trình.</p><div className="test-language-grid"><button onClick={() => setStarted(true)}><span>{language.flag}</span><strong>{language.nativeName}</strong><small>{language.framework}</small><ArrowRight/></button></div><Link className="text-link" to="/languages">Chọn level thủ công</Link></div>
  if (index >= placementQuestions.length) {
    const correct = answers.filter((answer, i) => answer === placementQuestions[i].answer).length
    const ratio = correct / placementQuestions.length
    const levelIndex = Math.min(language.levels.length - 1, Math.floor(ratio * language.levels.length))
    const level = language.levels[levelIndex]
    return <div className="test-result section-shell"><div className="result-icon">🎯</div><span className="overline">RECOMMENDED LEVEL</span><h1>{language.flag} {language.name} <em>{level[0]}</em></h1><p>Bạn trả lời đúng <strong>{correct}/{placementQuestions.length}</strong> câu. {ratio < .4 ? 'Bạn nên bắt đầu từ nền tảng để xây phản xạ vững chắc.' : `Bạn có thể thử bắt đầu ở ${level[0]}.`} Đây chỉ là gợi ý từ bộ câu hỏi ngắn, không giới hạn level bạn được học.</p><div className="score-breakdown">{['Vocabulary', 'Grammar', 'Reading', 'Listening simulation'].map((cat) => { const questions = placementQuestions.map((q, i) => [q, i]).filter(([q]) => q.category === cat); const value = questions.filter(([q, i]) => answers[i] === q.answer).length; return <div key={cat}><span>{cat}</span><strong>{value}/{questions.length}</strong></div> })}</div><button className="btn large" onClick={() => { chooseCourse(language.id, level[0]); navigate(levelPath(language.id,level[0])) }}>Học level {level[0]} được gợi ý <ArrowRight/></button><button className="btn secondary" onClick={() => navigate(languagePath(language.id))}>Choose Another Level</button><button className="btn ghost" onClick={() => { setIndex(0); setAnswers([]); setSelected(null); setStarted(false) }}>Làm lại</button></div>
  }
  const question = placementQuestions[index]
  const submit = () => { if (selected === null) return; setAnswers([...answers, selected]); setSelected(null); setIndex(index + 1) }
  return <div className="test-page section-shell"><div className="test-top"><button className="icon-btn" aria-label="Quay lại" onClick={() => setStarted(false)}><ChevronLeft/></button><div><span>Câu {index + 1} / {placementQuestions.length}</span><ProgressBar value={index + 1} max={placementQuestions.length}/></div><span className="type-tag">{question.category}</span></div><section className="question-card">{question.audio && <button className="audio-button" aria-label="Nghe câu mẫu" onClick={() => speak(question.audio, 'english', 1, setToast)}><Headphones/></button>}<h1>{question.question}</h1><div className="answer-list large">{question.options.map((option, optionIndex) => <button key={option} className={selected === optionIndex ? 'selected' : ''} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{selected === optionIndex && <Check/>}</button>)}</div><button className="btn large" disabled={selected === null} onClick={submit}>Xác nhận <ArrowRight/></button></section></div>
}

