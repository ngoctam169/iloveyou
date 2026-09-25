import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound({ compact = false }) { return <div className={`not-found section-shell ${compact?'compact':''}`}><span>404</span><h1>Lối này chưa có bài học</h1><p>Trang bạn tìm kiếm không tồn tại hoặc đường dẫn khóa học chưa chính xác.</p><Link className="btn" to="/"><ArrowLeft/> Back to Home</Link></div> }
