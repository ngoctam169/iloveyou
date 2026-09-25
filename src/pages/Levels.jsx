import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LevelCard from '../components/course/LevelCard'
import { getRoadmap } from '../data/courses'
import { getLanguage } from '../data/languages'
import { getLevelMeta } from '../data/levels'
import { useApp } from '../context/AppContext'
import { getLevelProgress } from '../utils/progress'
import NotFound from './NotFound'

export default function Levels() {
  const { languageId } = useParams()
  const language = getLanguage(languageId)
  const { state } = useApp()
  if (!language) return <NotFound compact />
  return <div className="inner-page section-shell"><Link to="/languages" className="back-link"><ChevronLeft /> Tất cả ngôn ngữ</Link><div className="course-banner" style={{ '--accent': language.color }}><span className="banner-flag">{language.flag}</span><div><span className="overline">{language.framework} LEARNING PATH</span><h1>{language.nativeName} {language.nativeName !== language.name && <small>{language.name}</small>}</h1><p>{language.description}</p></div></div><div className="level-heading"><div><h2>Chọn cấp độ của bạn</h2><p>Tất cả cấp độ đều mở. Bạn có thể đổi level bất kỳ lúc nào mà không mất tiến độ.</p></div><Link to="/placement-test" className="btn secondary">Chưa biết? Kiểm tra trình độ</Link></div><div className="level-grid">{language.levels.map((level) => <LevelCard key={level[0]} language={language} level={level} roadmap={getRoadmap(language.id, level[0])} progress={getLevelProgress(state, language.id, level[0])} meta={getLevelMeta(language.id, level[0])} />)}</div></div>
}
