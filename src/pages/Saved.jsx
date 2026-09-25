import { ArrowRight, Bookmark, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Saved() {
  const { state, toggleSaved } = useApp()
  if (!state.savedItems.length) return <div className="empty-page section-shell"><div className="empty-illustration"><Bookmark /></div><h1>Chưa có mục đã lưu</h1><p>Nhấn biểu tượng bookmark ở từ vựng, ngữ pháp hoặc bài đọc để xem lại tại đây.</p><Link className="btn" to="/dashboard">Khám phá bài học</Link></div>
  return <div className="inner-page section-shell"><div className="page-heading"><span className="overline">YOUR LIBRARY</span><h1>Mục đã lưu</h1><p>{state.savedItems.length} nội dung để bạn quay lại bất cứ lúc nào.</p></div><div className="saved-grid">{state.savedItems.map((item) => <article key={item.id}><span className="type-tag">{item.type}</span><h2>{item.title}</h2><p>{item.subtitle}</p><div className="saved-actions"><Link className="text-link" to={item.path || '/dashboard'}>Mở nội dung <ArrowRight /></Link><button className="icon-btn" aria-label={`Xóa ${item.title} khỏi mục đã lưu`} onClick={() => toggleSaved(item)}><Trash2 /></button></div></article>)}</div></div>
}
