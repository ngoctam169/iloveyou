import { ArrowRightLeft, BookOpen, CheckCircle2, Clock3, GraduationCap, Headphones, MessageCircle, PenLine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import ProgressBar from '../components/common/ProgressBar'
import Roadmap from '../components/course/Roadmap'
import { useApp } from '../context/AppContext'
import { getRoadmap } from '../data/courses'
import { findLevel, getLanguage } from '../data/languages'
import { getLevelMeta } from '../data/levels'
import { getLevelProgress } from '../utils/progress'
import { grammarPath, languagePath, levelPath, vocabularyPath } from '../utils/routes'
import NotFound from './NotFound'

export default function Course() {
  const { languageId, levelSlug } = useParams()
  const language = getLanguage(languageId)
  const level = findLevel(language, levelSlug)
  const { state, chooseCourse } = useApp()
  const navigate = useNavigate()
  const [topicFilter, setTopicFilter] = useState('All topics')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [difficultyFilter, setDifficultyFilter] = useState('All activities')
  useEffect(() => {
    if (level && (state.selectedLanguage !== languageId || state.selectedLevel !== level[0])) chooseCourse(languageId, level[0])
  }, [languageId, level?.[0], state.selectedLanguage, state.selectedLevel])
  if (!language || !level) return <NotFound compact/>
  const units = getRoadmap(languageId, level[0])
  const meta = getLevelMeta(languageId, level[0])
  const progress = getLevelProgress(state, languageId, level[0])
  const lessonIds = units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id))
  const complete = lessonIds.filter((id) => progress.completedLessons.includes(id)).length
  const percent = Math.round((complete / Math.max(1, lessonIds.length)) * 100)
  const firstTopic = meta?.topics?.[0] || units[0]?.title || 'giao tiếp cơ bản'
  const suggestedWeeks = Math.max(4, Math.ceil((meta?.estimatedHours || lessonIds.length * .5) / 3))
  const shownUnits = units.map((unit) => ({ ...unit, lessons:unit.lessons.filter((lesson) => {
    const topicMatch = topicFilter === 'All topics' || unit.title === topicFilter
    const difficultyMatch = !meta || difficultyFilter === 'All activities' || lesson.title.includes(difficultyFilter)
    const isComplete = progress.completedLessons.includes(lesson.id)
    const statusMatch = statusFilter === 'All status' || (statusFilter === 'Completed' && isComplete) || (statusFilter === 'New' && !isComplete && !state.lessonSessions?.[lesson.id]) || (statusFilter === 'Learning' && !isComplete && state.lessonSessions?.[lesson.id]) || (statusFilter === 'Bookmarked' && state.savedItems.some((item) => item.id === `lesson-${lesson.id}`))
    return topicMatch && difficultyMatch && statusMatch
  }) })).filter((unit) => unit.lessons.length)
  return <div className="inner-page section-shell course-page">
    <Breadcrumbs items={[{ label:'Trang chủ', to:'/' },{ label:language.name, to:languagePath(language.id) },{ label:level[0] }]}/>
    <div className="course-top-actions"><Link to={languagePath(languageId)} className="btn secondary"><ArrowRightLeft/> Đổi level</Link></div>
    <header className="course-hero" style={{ '--accent':language.color }}><div><span className="course-pill">{language.flag} {language.framework}</span><h1>{language.name} <em>{level[0]}</em></h1><p>{level[1]} · {meta?.description || `Phát triển nền tảng ${firstTopic} và sử dụng ngôn ngữ trong tình huống thực tế.`}</p><div className="course-facts"><span><GraduationCap/> {units.length} units · {lessonIds.length} lessons</span><span><Clock3/> Khoảng {meta?.estimatedHours || Math.round(lessonIds.length * 25 / 60)} giờ</span></div></div><div className="course-progress-card"><strong>{percent}%</strong><span>đã hoàn thành</span><ProgressBar value={percent}/><small>{complete} / {lessonIds.length} bài học</small></div></header>
    <article className="level-seo-content" aria-labelledby="level-overview-title"><div className="section-intro left"><span className="overline">TỔNG QUAN LEVEL</span><h2 id="level-overview-title">{language.name} {level[0]} là gì?</h2><p>{level[0]} là chặng {level[1].toLowerCase()} trong lộ trình {language.framework}. Ở level này, bạn học theo các chủ đề như {units.slice(0,4).map((unit) => unit.title).join(', ')} và vận dụng kiến thức trong bài luyện tổng hợp.</p></div><div className="level-learning-grid"><section><BookOpen/><h3>Vocabulary & Grammar</h3><p>Tích lũy từ theo chủ đề, học mẫu câu và lỗi thường gặp. Mỗi mục đều liên kết tới kho luyện riêng của level.</p></section><section><Headphones/><h3>Listening & Speaking</h3><p>Nghe câu hoặc hội thoại theo level, trả lời câu hỏi và luyện nói lại câu mục tiêu.</p></section><section><PenLine/><h3>Reading & Writing</h3><p>Đọc nội dung có ngữ cảnh rồi viết theo yêu cầu từ câu đơn đến đoạn có lập luận.</p></section></div><div className="level-outcomes"><section><h3>Thời gian học gợi ý</h3><p>Khoảng {meta?.estimatedHours || Math.round(lessonIds.length * 25 / 60)} giờ, tương đương {suggestedWeeks}–{suggestedWeeks + 3} tuần nếu học 3 giờ mỗi tuần. Bạn có thể điều chỉnh theo lịch cá nhân.</p></section><section><h3>Mục tiêu sau khi hoàn thành</h3><ul><li><CheckCircle2/> Hiểu và dùng kiến thức trọng tâm trong các chủ đề của level.</li><li><CheckCircle2/> Hoàn thành hoạt động nghe, nói, đọc và viết theo yêu cầu bài học.</li><li><CheckCircle2/> Nhận biết từ yếu và lỗi sai để tạo kế hoạch ôn tiếp theo.</li></ul></section></div></article>
    <nav className="course-resource-links" aria-label={`Tài nguyên ${language.name} ${level[0]}`}><Link className="btn secondary small" to={vocabularyPath(language.id,level[0])}>Từ vựng {level[0]}</Link><Link className="btn secondary small" to={grammarPath(language.id,level[0])}>Ngữ pháp {level[0]}</Link></nav>
    <div className="filter-bar lesson-filters"><label><span>Language</span><select value={language.id} onChange={(event)=>navigate(languagePath(event.target.value))}>{['english','chinese','japanese','korean'].map((id)=><option key={id} value={id}>{getLanguage(id).name}</option>)}</select></label><label><span>Level</span><select value={level[0]} onChange={(event)=>navigate(levelPath(language.id,event.target.value))}>{language.levels.map(([name])=><option key={name}>{name}</option>)}</select></label><label><span>Topic</span><select value={topicFilter} onChange={(event)=>setTopicFilter(event.target.value)}><option>All topics</option>{units.map((unit)=><option value={unit.title} key={unit.title}>Topic: {unit.title}</option>)}</select></label>{meta && <label><span>Hoạt động</span><select value={difficultyFilter} onChange={(event)=>setDifficultyFilter(event.target.value)}>{['All activities','Core Language','Skills Lab','Review & Challenge'].map((item)=><option key={item}>{item}</option>)}</select></label>}<label><span>Status</span><select value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value)}>{['All status','New','Learning','Completed','Bookmarked'].map((item)=><option key={item}>{item}</option>)}</select></label></div>
    <div className="roadmap-layout"><aside className="roadmap-side"><span className="overline">LỘ TRÌNH</span><h2>Chọn nội dung bạn cần</h2><p>Thứ tự chỉ là gợi ý. Mọi unit và bài học trong level này luôn sẵn sàng.</p><div className="legend"><span><i className="dot done"/> Đã xong</span><span><i className="dot current"/> Gợi ý tiếp theo</span><span><i className="dot"/> Sẵn sàng</span></div></aside>{shownUnits.length ? <Roadmap language={language} level={level[0]} units={shownUnits} completedLessons={progress.completedLessons}/> : <div className="empty-inline"><span>⌕</span><h2>Không có bài phù hợp</h2><p>Hãy đổi bộ lọc để xem thêm bài học.</p></div>}</div>
  </div>
}
