import { ArrowRight, Check, ChevronLeft, Headphones, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/common/ProgressBar'
import { languages, getLanguage } from '../data/languages'
import { languagePath, levelPath } from '../utils/routes'
import { buildPlacementQuestions, placementResult } from '../data/tests'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speech'

export default function PlacementTest() {
  const [started, setStarted] = useState(false)
  const [languageId, setLanguageId] = useState('english')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const { chooseCourse, setToast } = useApp()
  const navigate = useNavigate()
  const language = getLanguage(languageId) || getLanguage('english')
  const questions = useMemo(() => buildPlacementQuestions(language.id), [language.id])

  const start = (id) => {
    setLanguageId(id)
    setIndex(0)
    setAnswers([])
    setSelected(null)
    setStarted(true)
  }

  if (!started) return <div className="inner-page section-shell placement-intro">
    <Link to="/" className="back-link"><ChevronLeft/> Trang chủ</Link>
    <div className="test-heading"><span className="test-icon"><Target/></span><span className="overline">PLACEMENT TEST</span><h1>Kiểm tra level trước khi học</h1><p>Mỗi level có câu Vocabulary, Grammar, Reading và Listening. Kết quả chỉ dùng để gợi ý điểm bắt đầu.</p></div>
    <div className="test-language-grid">{languages.map((item) => <button key={item.id} onClick={() => start(item.id)}><span>{item.flag}</span><strong>{item.nativeName}</strong><small>{item.framework} · {item.levels.length * 4} câu</small><ArrowRight/></button>)}</div>
    <Link className="text-link" to="/languages">Hoặc chọn level thủ công</Link>
  </div>

  if (index >= questions.length) {
    const result = placementResult(language.id, questions, answers)
    const level = result.level
    return <div className="test-result section-shell">
      <div className="result-icon">🎯</div><span className="overline">LEVEL GỢI Ý</span>
      <h1>{language.flag} {language.name} <em>{level[0]}</em></h1>
      <p>Bạn trả lời đúng <strong>{result.correct}/{result.total}</strong> câu. Bộ test này trải từ level đầu đến level cao nhất và chỉ gợi ý điểm bắt đầu; bạn vẫn có thể mở bất kỳ level nào.</p>
      <div className="score-breakdown">{result.categories.map(([category,value,total]) => <div key={category}><span>{category}</span><strong>{value}/{total}</strong></div>)}</div>
      <button className="btn large" onClick={() => { chooseCourse(language.id, level[0]); navigate(levelPath(language.id,level[0])) }}>Học {level[0]} <ArrowRight/></button>
      <button className="btn secondary" onClick={() => navigate(languagePath(language.id))}>Xem tất cả level</button>
      <button className="btn ghost" onClick={() => { setIndex(0);setAnswers([]);setSelected(null);setStarted(false) }}>Làm lại</button>
    </div>
  }

  const question = questions[index]
  const submit = () => {
    if (selected === null) return
    setAnswers((current) => [...current, selected])
    setSelected(null)
    setIndex((current) => current + 1)
  }

  return <div className="test-page section-shell">
    <div className="test-top">
      <button className="icon-btn" aria-label="Quay lại" onClick={() => setStarted(false)}><ChevronLeft/></button>
      <div><span>{language.flag} {question.level} · Câu {index + 1}/{questions.length}</span><ProgressBar value={index + 1} max={questions.length}/></div>
      <span className="type-tag">{question.category}</span>
    </div>
    <section className="question-card">
      {question.audio && <button className="audio-button" aria-label="Nghe câu mẫu" onClick={() => speak(question.audio, language.id, 1, setToast)}><Headphones/></button>}
      {question.passage && <article className="exam-passage"><p>{question.passage}</p></article>}
      <h1>{question.question}</h1>
      <div className="answer-list large">{question.options.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} className={selected === optionIndex ? 'selected' : ''} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{selected === optionIndex && <Check/>}</button>)}</div>
      <button className="btn large" disabled={selected === null} onClick={submit}>Xác nhận <ArrowRight/></button>
    </section>
  </div>
}
