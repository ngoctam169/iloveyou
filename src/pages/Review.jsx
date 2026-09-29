import { ArrowRight, BookOpen, CheckCircle2, Headphones, RotateCcw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { getRoadmap } from '../data/courses'
import { getLanguage } from '../data/languages'
import { vocabularyForState } from '../services/vocabularyService'
import { getLevelProgress } from '../utils/progress'
import { isDue, isMastered, isWeakVocabulary, wordKey } from '../utils/srs'
import { lessonPath, vocabularyPath } from '../utils/routes'

export default function Review() {
  const { state } = useApp()
  const language = getLanguage(state.selectedLanguage) || getLanguage('english')
  const level = language.levels.some(([name]) => name === state.selectedLevel) ? state.selectedLevel : language.levels[0][0]
  const words = vocabularyForState(state, language.id, level)
  const due = words.filter((word) => isDue(state.flashcardProgress[wordKey(word)]))
  const fresh = words.filter((word) => !state.flashcardProgress[wordKey(word)] && !state.vocabularyMeta?.[wordKey(word)]?.started)
  const weak = words.filter((word) => isWeakVocabulary(state.flashcardProgress[wordKey(word)], state.vocabularyMeta?.[wordKey(word)]?.difficult))
  const mastered = words.filter((word) => isMastered(state.flashcardProgress[wordKey(word)]))
  const recentlyWrongKeys = new Set((state.vocabularyActivity || []).filter((entry) => !entry.correct && Date.now() - Date.parse(entry.reviewedAt || entry.date) <= 14 * 86400000).map((entry) => entry.key))
  const recentlyWrong = words.filter((word) => recentlyWrongKeys.has(wordKey(word)))
  const dueMistakes = state.mistakes.filter((item) => !item.reviewSchedule || isDue(item.reviewSchedule))
  const grammar = dueMistakes.filter((item) => item.type === 'Grammar')
  const toeic = dueMistakes.filter((item) => item.type === 'TOEIC')
  const ielts = dueMistakes.filter((item) => item.type === 'IELTS')
  const skillMistakes = dueMistakes.filter((item) => ['Listening','Speaking','Reading','Writing'].includes(item.type))
  const lessons = getRoadmap(language.id, level).flatMap((unit) => unit.lessons)
  const progress = getLevelProgress(state, language.id, level)
  const nextLesson = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id))
  const cards = [
    due.length && { id: 'due', title: `Ôn ${due.length} từ đến hạn`, detail: 'Flashcards và luyện từ vựng theo lịch SRS', icon: 'Aa', path: `${vocabularyPath(language.id,level)}?status=review` },
    fresh.length && { id: 'new', title: `Khám phá ${fresh.length} từ mới`, detail: 'Chọn từ và học theo chủ đề trước khi luyện', icon: '+', path: vocabularyPath(language.id,level) },
    weak.length && { id: 'weak', title: `Luyện ${weak.length} từ yếu`, detail: 'Từ khó hoặc thường trả lời sai', icon: '!', path: `${vocabularyPath(language.id,level)}?status=weak` },
    recentlyWrong.length && { id: 'wrong', title: `Xem lại ${recentlyWrong.length} từ vừa sai`, detail: 'Các từ trả lời sai trong 14 ngày gần đây', icon: '×', path: `${vocabularyPath(language.id,level)}?status=wrong` },
    mastered.length && { id: 'mastered', title: `${mastered.length} từ đã thuộc`, detail: 'Ôn thưa theo lịch SRS', icon: '✓', path: `${vocabularyPath(language.id,level)}?status=mastered` },
    grammar.length && { id: 'grammar', title: `${grammar.length} lỗi ngữ pháp cần xem lại`, detail: 'Mở Sổ lỗi sai', icon: '⌘', path: '/mistakes' },
    toeic.length && { id: 'toeic', title: `${toeic.length} câu TOEIC đã sai`, detail: 'Mở Sổ lỗi sai', icon: 'T', path: '/mistakes' },
    ielts.length && { id: 'ielts', title: `${ielts.length} câu IELTS đến hạn ôn`, detail: 'Mở Sổ lỗi sai và làm lại trước khi giãn lịch', icon: 'I', path: '/mistakes' },
    skillMistakes.length && { id: 'skills', title: `${skillMistakes.length} lỗi kỹ năng đến hạn ôn`, detail: 'Listening, Speaking, Reading hoặc Writing cần được làm lại', icon: '↻', path: '/mistakes' },
    nextLesson && { id: nextLesson.id, title: `Tiếp tục: ${nextLesson.title}`, detail: `${language.name} · ${level}`, icon: nextLesson.icon, path: lessonPath(language.id,level,nextLesson.id) },
  ].filter(Boolean)
  return <div className="inner-page section-shell learning-hub review-center"><div className="hub-hero review-hero"><div><span className="overline">DAILY REVIEW</span><h1>Ôn đúng thứ đang cần nhớ</h1><p>Các mục dưới đây lấy từ lịch ôn, lỗi sai và bài học dang dở của bạn.</p></div><div className="hub-kpi"><strong>{due.length + dueMistakes.length}</strong><span>mục đến hạn trong {language.name} · {level}</span></div></div><div className="metric-grid compact-metrics"><StatisticsCard icon={Sparkles} value={due.length} label="Từ cần ôn"/><StatisticsCard icon={BookOpen} value={fresh.length} label="Từ mới"/><StatisticsCard icon={BookOpen} value={weak.length} label="Từ yếu"/><StatisticsCard icon={RotateCcw} value={recentlyWrong.length} label="Vừa trả lời sai"/><StatisticsCard icon={CheckCircle2} value={mastered.length} label="Đã thuộc"/><StatisticsCard icon={Headphones} value={toeic.length + ielts.length} label="Câu thi đến hạn"/><StatisticsCard icon={CheckCircle2} value={grammar.length + skillMistakes.length} label="Lỗi kỹ năng đến hạn"/></div>{(due.length > 0 || fresh.length > 0) && <section className="panel review-size-picker"><div><h2>Chọn số thẻ ôn</h2><p>Bắt đầu một lượt ngắn hoặc ôn toàn bộ danh sách đến hạn.</p></div><div>{[5, 10, 20, 'all'].map((size) => <Link key={size} className="btn secondary small" to={`/flashcards?language=${language.id}&level=${encodeURIComponent(level)}&limit=${size}`}>{size === 'all' ? 'Tất cả' : `${size} từ`}</Link>)}</div></section>}<section className="panel review-size-picker"><div><h2>Smart Review</h2><p>Gom từ đến hạn, từ khó, từ vừa sai và từ lâu chưa ôn.</p></div><div>{[[5, '5 phút'], [10, '10 phút'], [20, '20 phút']].map(([size, label]) => <Link key={size} className="btn secondary small" to={`/flashcards?language=${language.id}&level=${encodeURIComponent(level)}&mode=smart&limit=${size}`}>{label}</Link>)}</div></section><section className="review-plan"><div className="panel-title"><div><h2>Gợi ý hôm nay</h2><p>Mở một mục để luyện; kết quả được ghi lại khi bạn thực sự làm bài.</p></div></div>{cards.length ? cards.map((card, index) => <article key={card.id}><span className="review-order">{index + 1}</span><span className="round-icon purple">{card.icon}</span><div><strong>{card.title}</strong><small>{card.detail}</small></div><Link to={card.path} aria-label={`Mở ${card.title}`}><ArrowRight/></Link></article>) : <div className="empty-inline"><h2>Hôm nay chưa có mục đến hạn</h2><p>Bạn có thể học từ mới hoặc tự tạo bài luyện.</p></div>}<div className="review-quick-links"><Link className="btn secondary" to="/vocabulary">Học từ mới</Link><Link className="btn ghost" to="/self-study">Tự tạo bài luyện</Link></div></section></div>
}
