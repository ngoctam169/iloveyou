import { ArrowRight, BookOpen, CheckCircle2, Headphones, RotateCcw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { getRoadmap } from '../data/courses'
import { getLanguage } from '../data/languages'
import { useVocabularyData } from '../hooks/useVocabularyData'
import { getLevelProgress } from '../utils/progress'
import { isDue, isMastered, isWeakVocabulary, wordKey } from '../utils/srs'
import { lessonPath, vocabularyPath } from '../utils/routes'
import { trackEvent } from '../utils/analytics'

export default function Review() {
  const { state } = useApp()
  const language = getLanguage(state.selectedLanguage) || getLanguage('english')
  const level = language.levels.some(([name]) => name === state.selectedLevel) ? state.selectedLevel : language.levels[0][0]
  const { words } = useVocabularyData(state, language.id, level)
  const due = words.filter((word) => isDue(state.flashcardProgress[wordKey(word)]))
  const fresh = words.filter((word) => !state.flashcardProgress[wordKey(word)] && !state.vocabularyMeta?.[wordKey(word)]?.started)
  const weak = words.filter((word) => isWeakVocabulary(state.flashcardProgress[wordKey(word)], state.vocabularyMeta?.[wordKey(word)]?.difficult))
  const mastered = words.filter((word) => isMastered(state.flashcardProgress[wordKey(word)]))
  const recentlyWrongKeys = new Set((state.vocabularyActivity || []).filter((entry) => !entry.correct && Date.now() - Date.parse(entry.reviewedAt || entry.date) <= 14 * 86400000).map((entry) => entry.key))
  const recentlyWrong = words.filter((word) => recentlyWrongKeys.has(wordKey(word)))
  const dueSkills = Object.values(state.skillReview || {}).filter((item) => item?.languageId === language.id && item?.level === level && isDue(item))
  const sectionForSkill = { Grammar:'grammar', Listening:'listening', Speaking:'speaking', Reading:'reading', Writing:'writing' }
  const grammar = state.mistakes.filter((item) => item.type === 'Grammar')
  const listening = state.mistakes.filter((item) => item.type === 'Listening')
  const reading = state.mistakes.filter((item) => item.type === 'Reading')
  const writing = state.mistakes.filter((item) => item.type === 'Writing')
  const speaking = state.mistakes.filter((item) => item.type === 'Speaking')
  const toeic = state.mistakes.filter((item) => item.type === 'TOEIC')
  const ielts = state.mistakes.filter((item) => item.type === 'IELTS')
  const lessons = getRoadmap(language.id, level).flatMap((unit) => unit.lessons)
  const progress = getLevelProgress(state, language.id, level)
  const nextLesson = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id))
  const cards = [
    due.length && { id: 'due', title: `Ôn ${due.length} từ đến hạn`, detail: 'Flashcards và luyện từ vựng theo lịch SRS', icon: 'Aa', path: `${vocabularyPath(language.id,level)}?status=review` },
    fresh.length && { id: 'new', title: `Khám phá ${fresh.length} từ mới`, detail: 'Chọn từ và học theo chủ đề trước khi luyện', icon: '+', path: vocabularyPath(language.id,level) },
    weak.length && { id: 'weak', title: `Luyện ${weak.length} từ yếu`, detail: 'Từ khó hoặc thường trả lời sai', icon: '!', path: `${vocabularyPath(language.id,level)}?status=weak` },
    recentlyWrong.length && { id: 'wrong', title: `Xem lại ${recentlyWrong.length} từ vừa sai`, detail: 'Các từ trả lời sai trong 14 ngày gần đây', icon: '×', path: `${vocabularyPath(language.id,level)}?status=wrong` },
    mastered.length && { id: 'mastered', title: `${mastered.length} từ đã thuộc`, detail: 'Ôn thưa theo lịch SRS', icon: '✓', path: `${vocabularyPath(language.id,level)}?status=mastered` },
    ...dueSkills.slice(0, 8).map((item) => ({ id:`skill-${item.lessonId}-${item.skill}`, title:`Ôn lại ${item.skill}: ${item.score}% lần gần nhất`, detail:'Đến hạn theo lịch ôn kỹ năng; làm lại hoạt động trong bài để cập nhật lịch tiếp theo.', icon:'↻', path:`${lessonPath(language.id,level,item.lessonId)}?section=${sectionForSkill[item.skill] || 'review'}` })),
    grammar.length && { id: 'grammar', title: `${grammar.length} lỗi ngữ pháp cần xem lại`, detail: 'Mở Sổ lỗi sai', icon: '⌘', path: '/mistakes' },
    listening.length && { id: 'listening', title: `${listening.length} lỗi nghe cần luyện lại`, detail: 'Làm lại câu nghe trước khi xem đáp án', icon: '◉', path: '/mistakes' },
    reading.length && { id: 'reading', title: `${reading.length} lỗi đọc hiểu cần xem lại`, detail: 'Ôn câu hỏi, bằng chứng trong bài và suy luận', icon: 'R', path: '/mistakes' },
    writing.length && { id: 'writing', title: `${writing.length} bài viết chưa đạt tiêu chí`, detail: 'Viết lại sau khi xem checklist còn thiếu', icon: '✎', path: '/mistakes' },
    speaking.length && { id: 'speaking', title: `${speaking.length} bài nói dưới ngưỡng luyện tập`, detail: 'Nghe mẫu, thu lại và so transcript lần nữa', icon: 'S', path: '/mistakes' },
    toeic.length && { id: 'toeic', title: `${toeic.length} câu TOEIC đã sai`, detail: 'Mở Sổ lỗi sai', icon: 'T', path: '/mistakes' },
    ielts.length && { id: 'ielts', title: `${ielts.length} câu IELTS đã sai`, detail: 'Mở Sổ lỗi sai', icon: 'I', path: '/mistakes' },
    nextLesson && { id: nextLesson.id, title: `Tiếp tục: ${nextLesson.title}`, detail: `${language.name} · ${level}`, icon: nextLesson.icon, path: lessonPath(language.id,level,nextLesson.id) },
  ].filter(Boolean)
  return <div className="inner-page section-shell learning-hub review-center"><div className="hub-hero review-hero"><div><span className="overline">DAILY REVIEW</span><h1>Ôn đúng thứ đang cần nhớ</h1><p>Các mục dưới đây lấy từ lịch ôn, lỗi sai và bài học dang dở của bạn.</p></div><div className="hub-kpi"><strong>{due.length}</strong><span>từ đến hạn trong {language.name} · {level}</span></div></div><div className="metric-grid compact-metrics"><StatisticsCard icon={Sparkles} value={due.length} label="Từ cần ôn"/><StatisticsCard icon={BookOpen} value={fresh.length} label="Từ mới"/><StatisticsCard icon={BookOpen} value={weak.length} label="Từ yếu"/><StatisticsCard icon={RotateCcw} value={recentlyWrong.length} label="Vừa trả lời sai"/><StatisticsCard icon={CheckCircle2} value={mastered.length} label="Đã thuộc"/><StatisticsCard icon={Headphones} value={toeic.length + ielts.length} label="Câu thi sai"/><StatisticsCard icon={CheckCircle2} value={grammar.length + listening.length + reading.length + writing.length + speaking.length} label="Lỗi kỹ năng"/><StatisticsCard icon={RotateCcw} value={dueSkills.length} label="Kỹ năng đến hạn"/></div>{(due.length > 0 || fresh.length > 0) && <section className="panel review-size-picker"><div><h2>Chọn số thẻ ôn</h2><p>Bắt đầu một lượt ngắn hoặc ôn toàn bộ danh sách đến hạn.</p></div><div>{[5, 10, 20, 'all'].map((size) => <Link key={size} className="btn secondary small" to={`/flashcards?language=${language.id}&level=${encodeURIComponent(level)}&limit=${size}`} onClick={() => trackEvent('review_started', { language:language.id, level, mode:'scheduled', size:String(size) })}>{size === 'all' ? 'Tất cả' : `${size} từ`}</Link>)}</div></section>}<section className="panel review-size-picker"><div><h2>Smart Review</h2><p>Gom từ đến hạn, từ khó, từ vừa sai và từ lâu chưa ôn.</p></div><div>{[[5, '5 phút'], [10, '10 phút'], [20, '20 phút']].map(([size, label]) => <Link key={size} className="btn secondary small" to={`/flashcards?language=${language.id}&level=${encodeURIComponent(level)}&mode=smart&limit=${size}`} onClick={() => trackEvent('review_started', { language:language.id, level, mode:'smart', size })}>{label}</Link>)}</div></section><section className="review-plan"><div className="panel-title"><div><h2>Gợi ý hôm nay</h2><p>Mở một mục để luyện; Review giờ gom cả từ vựng, ngữ pháp, nghe, nói, đọc và viết thay vì chỉ tập trung vào flashcard.</p></div></div>{cards.length ? cards.map((card, index) => <article key={card.id}><span className="review-order">{index + 1}</span><span className="round-icon purple">{card.icon}</span><div><strong>{card.title}</strong><small>{card.detail}</small></div><Link to={card.path} aria-label={`Mở ${card.title}`} onClick={() => trackEvent('review_started', { language:language.id, level, mode:'recommendation', item_id:card.id })}><ArrowRight/></Link></article>) : <div className="empty-inline"><h2>Hôm nay chưa có mục đến hạn</h2><p>Bạn có thể học từ mới hoặc tự tạo bài luyện.</p></div>}<div className="review-quick-links"><Link className="btn secondary" to="/vocabulary">Học từ mới</Link><Link className="btn ghost" to="/self-study">Tự tạo bài luyện</Link></div></section></div>
}
