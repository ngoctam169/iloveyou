import { ArrowRight, CheckCircle2, Circle, Clock3, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressBar from '../common/ProgressBar'
import { levelStatus } from '../../utils/progress'
import { levelPath } from '../../utils/routes'
import { trackEvent } from '../../utils/analytics'

export default function LevelCard({ language, level, roadmap, progress, meta }) {
  const [name, label] = level
  const lessonIds = roadmap.flatMap((unit) => unit.lessons.map((lesson) => lesson.id))
  const completed = progress.completedLessons.filter((id) => lessonIds.includes(id)).length
  const percent = lessonIds.length ? Math.round((completed / lessonIds.length) * 100) : 0
  const status = levelStatus(completed, lessonIds.length)
  const StatusIcon = status === 'Completed' ? CheckCircle2 : status === 'In Progress' ? PlayCircle : Circle
  return (
    <Link className="level-card" to={levelPath(language.id, name)} aria-label={`${completed ? 'Tiếp tục' : 'Bắt đầu'} level ${name} ${label}`} onClick={() => trackEvent('select_level', { language:language.id, level:name, status:status.toLowerCase().replaceAll(' ','_') })}>
      <div className="level-card-head"><span className="level-badge" style={{ '--accent': language.color }}>{name}</span><span className={`status ${completed ? 'active' : ''}`}><StatusIcon size={15} />{status}</span></div>
      <h3>{label}</h3><p>{meta?.description || 'Phát triển khả năng giao tiếp qua từ vựng, ngữ pháp và bài luyện đủ bốn kỹ năng.'}</p>
      <div className="level-meta"><span>{roadmap.length} units · {lessonIds.length} lessons</span><span><Clock3 size={14} /> {meta?.estimatedHours || Math.max(18, roadmap.length * 3)} giờ</span></div>
      <ProgressBar value={percent} label={`${completed}/${lessonIds.length} bài`} />
      <span className="card-link">{completed ? 'Continue' : 'Start'} <ArrowRight size={17} /></span>
    </Link>
  )
}
