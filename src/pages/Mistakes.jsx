import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Mistakes() {
  const { state, removeMistake, reviewMistake } = useApp()
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing', 'TOEIC', 'IELTS']
  const shown = state.mistakes.filter((entry) => filter === 'All' || entry.type === filter)

  if (!state.mistakes.length) return <div className="empty-page section-shell"><div className="empty-illustration">✓</div><h1>Chưa có lỗi cần ôn</h1><p>Các câu trả lời sai ở Listening, Reading, Writing và Quiz sẽ được lưu tại đây.</p><Link className="btn" to="/dashboard">Tiếp tục học <ArrowRight /></Link></div>

  return <div className="inner-page section-shell"><div className="page-heading"><span className="overline">MISTAKE NOTEBOOK</span><h1>Biến mỗi lỗi sai thành một bước tiến</h1><p>{state.mistakes.length} mục được giữ lại và giãn lịch ôn theo kết quả làm lại.</p></div><div className="filter-tabs" aria-label="Lọc lỗi theo kỹ năng">{types.map((type) => <button aria-pressed={filter === type} className={filter === type ? 'active' : ''} onClick={() => setFilter(type)} key={type}>{type}</button>)}</div>{shown.length ? <div className="mistake-list">{shown.map((entry) => <article key={entry.id}><div><div className="mistake-meta"><span className="type-tag">{entry.type}</span>{entry.topic && <span>{entry.topic}</span>}<span>Sai {entry.mistakeCount || 1} lần</span>{entry.lastAttempted && <span>{new Intl.DateTimeFormat('vi-VN').format(new Date(entry.lastAttempted))}</span>}{entry.reviewSchedule?.nextReview && <span>Ôn lại {new Intl.DateTimeFormat('vi-VN',{dateStyle:'short',timeStyle:'short'}).format(new Date(entry.reviewSchedule.nextReview))}</span>}</div><h3>{entry.prompt}</h3><p><span>Bạn trả lời:</span> {entry.yourAnswer}</p><p className="correct-text"><span>Đáp án / tiêu chí:</span> {entry.answer}</p>{entry.explanation && <p className="mistake-explanation"><span>Giải thích:</span> {entry.explanation}</p>}</div><div className="mistake-actions">{entry.path && <Link className="btn secondary" to={entry.path}><RotateCcw /> Practice Again</Link>}<button className="btn ghost" onClick={() => reviewMistake(entry.id,'again')}><RotateCcw /> Chưa chắc</button><button className="btn ghost" onClick={() => reviewMistake(entry.id,'good')}><CheckCircle2 /> Đã làm đúng</button><button className="btn ghost" onClick={() => removeMistake(entry.id)}>Xóa khỏi sổ</button></div></article>)}</div> : <div className="empty-inline"><span>✓</span><h2>Không có lỗi thuộc nhóm này</h2><p>Chọn một bộ lọc khác để tiếp tục ôn.</p></div>}</div>
}
