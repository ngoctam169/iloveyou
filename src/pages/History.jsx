import { BookOpen, CalendarDays, CheckCircle2, Clock3, Headphones, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { localDate } from '../utils/srs'

const labels = {
  Vocabulary: ['Đã ôn từ vựng', RotateCcw], Lesson: ['Đã hoàn thành bài học', BookOpen],
  Grammar: ['Đã luyện ngữ pháp', CheckCircle2], Listening: ['Đã luyện nghe', Headphones],
  Reading: ['Đã luyện đọc', BookOpen], Writing: ['Đã luyện viết', BookOpen],
  Quiz: ['Đã hoàn thành quiz', CheckCircle2], 'Self Study': ['Đã hoàn thành tự học', CheckCircle2],
}

export default function History() {
  const { state } = useApp()
  const [range, setRange] = useState('week')
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0, 0, 0, 0)
  const history = (state.learningHistory || []).filter((entry) => {
    if (range === 'today') return entry.day === localDate(today)
    if (range === 'yesterday') return entry.day === localDate(yesterday)
    return Date.parse(entry.date) >= weekStart.getTime()
  })

  return <div className="inner-page section-shell history-page">
    <div className="page-heading"><span className="overline">STUDY HISTORY</span><h1>Lịch sử học tập</h1><p>Các hoạt động được ghi khi bạn thực sự làm bài, ôn từ hoặc hoàn thành một phiên luyện tập.</p></div>
    <div className="segmented history-range" role="group" aria-label="Khoảng thời gian">{[['today', 'Hôm nay'], ['yesterday', 'Hôm qua'], ['week', '7 ngày']].map(([value, label]) => <button key={value} className={range === value ? 'active' : ''} onClick={() => setRange(value)}>{label}</button>)}</div>
    {history.length ? <section className="panel learning-history-list">{history.map((entry) => {
      const [label, Icon] = labels[entry.type] || [`Đã luyện ${entry.skill || entry.type}`, CalendarDays]
      const detail = entry.topic || entry.wordKey?.split(':').at(-1)?.replaceAll('-', ' ') || entry.skill || 'Hoạt động học tập'
      return <article key={entry.id}><span className="round-icon purple"><Icon/></span><div><strong>{label}</strong><p>{detail}</p></div><div className="history-meta">{entry.seconds > 0 && <span><Clock3/> {Math.max(1, Math.round(entry.seconds / 60))} phút</span>}{typeof entry.correct === 'boolean' && <span>{entry.correct ? 'Đúng' : 'Cần ôn lại'}</span>}<time>{new Intl.DateTimeFormat('vi-VN', { dateStyle:'medium', timeStyle:'short' }).format(new Date(entry.date))}</time></div></article>
    })}</section> : <div className="empty-inline"><CalendarDays/><h2>Chưa có hoạt động trong khoảng này</h2><p>Bắt đầu một bài học hoặc lượt ôn để tạo lịch sử thực tế.</p><Link className="btn" to="/review">Bắt đầu ôn tập</Link></div>}
  </div>
}
