import { Award, BookOpen, CalendarDays, CheckCircle2, Clock3, Flame, Headphones, RotateCcw, Star, Type } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { getLanguage } from '../data/languages'
import { allVocabulary } from '../services/vocabularyService'
import { getLevelProgress, summarizeProgress, totalStudyMinutes } from '../utils/progress'
import { localDate, wordKey } from '../utils/srs'

const historyLabels = {
  Vocabulary: ['Đã ôn từ vựng', RotateCcw], Lesson: ['Đã hoàn thành bài học', BookOpen],
  Grammar: ['Đã luyện ngữ pháp', CheckCircle2], Listening: ['Đã luyện nghe', Headphones],
  Reading: ['Đã luyện đọc', BookOpen], Writing: ['Đã luyện viết', BookOpen],
  Quiz: ['Đã hoàn thành quiz', CheckCircle2], 'Self Study': ['Đã hoàn thành tự học', CheckCircle2],
}

export default function Progress() {
  const { state } = useApp()
  const [historyRange, setHistoryRange] = useState('week')
  const language = getLanguage(state.selectedLanguage) || getLanguage('english')
  const level = language.levels.some(([name]) => name === state.selectedLevel) ? state.selectedLevel : language.levels[0][0]
  const current = getLevelProgress(state, language.id, level)
  const totals = summarizeProgress(state)
  const vocabularyLearned = allVocabulary(state).filter((word) => state.flashcardProgress[wordKey(word)] || state.vocabularyMeta?.[wordKey(word)]?.learned).length
  const skillNames = ['Listening', 'Speaking', 'Reading', 'Writing', 'Vocabulary', 'Grammar']
  const overall = Math.round(skillNames.reduce((sum, name) => sum + (current.skillScores[name] || 0), 0) / skillNames.length)
  const activity = [...Array(Math.max(0, 7 - state.activityHistory.length)).fill(0), ...state.activityHistory.slice(-7)]
  const weekdays = activity.map((_, index) => { const day = new Date(); day.setDate(day.getDate() - (6 - index)); return new Intl.DateTimeFormat('vi-VN', { weekday:'short' }).format(day) })
  const heatDays = Array.from({ length:56 }, (_, index) => { const day = new Date(); day.setDate(day.getDate() - (55 - index)); return localDate(day) })
  const heatMinutes = heatDays.map((day, index) => Math.round(Number(state.dailyActivity?.[day]?.seconds || (index >= 56 - state.activityHistory.length ? Number(state.activityHistory[index - (56 - state.activityHistory.length)]) * 60 : 0)) / 60) || 0)
  const heat = heatMinutes.map((minutes) => Math.min(4, Math.ceil(minutes / 10)))
  const selfStudy = state.selfStudyHistory || []
  const selfStudyAverage = selfStudy.length ? Math.round(selfStudy.reduce((sum, item) => sum + Number(item.score || 0), 0) / selfStudy.length) : 0

  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0,0,0,0)
  const history = (state.learningHistory || []).filter((entry) => {
    if (historyRange === 'today') return entry.day === localDate(today)
    if (historyRange === 'yesterday') return entry.day === localDate(yesterday)
    return Date.parse(entry.date) >= weekStart.getTime()
  })

  return <div className="inner-page section-shell">
    <div className="page-heading"><span className="overline">YOUR JOURNEY · {language.name} {level}</span><h1>Tiến độ học tập</h1><p>Điểm kỹ năng, lịch học, thành tích và lịch sử hoạt động được gom vào cùng một nơi.</p></div>
    <div className="metric-grid">{[[BookOpen,totals.completedLessons,'Lessons Completed'],[Type,vocabularyLearned,'Words Learned'],[Clock3,totalStudyMinutes(state, totals.studyMinutes),'Minutes Studied'],[Flame,state.streak,'Current Streak'],[Award,Object.keys(state.levelProgress || {}).filter((key) => state.levelProgress[key]?.completedLessons?.length).length,'Active Levels'],[Star,state.xp.toLocaleString(),'Total XP']].map(([Icon,value,label]) => <article key={label}><span><Icon /></span><strong>{value}</strong><small>{label}</small></article>)}</div>

    <div className="progress-layout">
      <section className="panel overall-panel"><div className="panel-title"><div><h2>Skill Progress · {level}</h2><p>Điểm trung bình từ các bài ở level hiện tại</p></div><strong className="overall-number">{overall}%</strong></div>{skillNames.map((name) => <ProgressBar key={name} label={name} value={current.skillScores[name] || 0} />)}</section>
      <section className="panel weekly-chart"><div className="panel-title"><div><h2>Weekly Activity</h2><p>Phút học trong 7 ngày gần nhất</p></div></div><div className="bar-chart">{activity.map((value,index) => <div key={index}><span className="bar-value">{value}</span><i style={{ height: `${Math.max(4, Math.min(100, Number(value || 0) * 5))}%` }} /><small>{weekdays[index]}</small></div>)}</div></section>
    </div>

    <section className="panel self-study-progress"><div className="panel-title"><div><h2>Self-study signal</h2><p>Điểm tự chấm từ Practice Lab, tách biệt với điểm khóa học.</p></div><strong className="overall-number">{selfStudy.length ? `${selfStudyAverage}%` : '—'}</strong></div>{selfStudy.length ? <p className="muted">{selfStudy.length} phiên đã lưu. Hãy chọn kỹ năng có điểm thấp nhất để tạo prompt tiếp theo.</p> : <p className="muted">Chưa có phiên tự học. <Link className="text-link" to="/self-study">Mở Practice Lab</Link> để bắt đầu vòng lặp tự review.</p>}</section>

    <section className="panel heatmap-panel"><div className="panel-title"><div><h2>Learning Calendar</h2><p>8 tuần hoạt động gần đây</p></div><span className="heat-legend">Ít <i /> <i /> <i /> <i /> Nhiều</span></div><div className="heatmap" aria-label="Lịch hoạt động 8 tuần">{heat.map((intensity,index) => <span key={index} data-level={intensity} title={`${heatMinutes[index]} phút`} />)}</div></section>

    <section className="achievements"><div className="section-intro left"><span className="overline">ACHIEVEMENTS</span><h2>Những cột mốc của bạn</h2></div><div className="achievement-grid">{[['🌱','First Step','Hoàn thành bài đầu tiên',totals.completedLessons>=1],['🔥','On Fire','Duy trì chuỗi 7 ngày',state.streak>=7],['📚','Word Collector','Học 100 từ',vocabularyLearned>=100],['🏅','Dedicated Learner','Hoàn thành 25 bài',totals.completedLessons>=25]].map(([icon,name,desc,earned]) => <article className={earned ? 'earned' : ''} key={name}><span>{icon}</span><div><h3>{name}</h3><p>{desc}</p></div>{earned && <small>Đã đạt</small>}</article>)}</div></section>

    <section id="history" className="progress-history-section">
      <div className="section-intro left"><span className="overline">STUDY HISTORY</span><h2>Lịch sử học tập</h2><p>Các hoạt động thực tế trong hôm nay, hôm qua hoặc 7 ngày gần nhất.</p></div>
      <div className="segmented history-range" role="group" aria-label="Khoảng thời gian">{[['today','Hôm nay'],['yesterday','Hôm qua'],['week','7 ngày']].map(([value,label]) => <button key={value} className={historyRange === value ? 'active' : ''} onClick={() => setHistoryRange(value)}>{label}</button>)}</div>
      {history.length ? <div className="panel learning-history-list">{history.map((entry) => {
        const [label, Icon] = historyLabels[entry.type] || [`Đã luyện ${entry.skill || entry.type}`, CalendarDays]
        const detail = entry.topic || entry.wordKey?.split(':').at(-1)?.replaceAll('-', ' ') || entry.skill || 'Hoạt động học tập'
        return <article key={entry.id}><span className="round-icon purple"><Icon/></span><div><strong>{label}</strong><p>{detail}</p></div><div className="history-meta">{entry.seconds > 0 && <span><Clock3/> {Math.max(1,Math.round(entry.seconds/60))} phút</span>}{typeof entry.correct === 'boolean' && <span>{entry.correct ? 'Đúng' : 'Cần ôn lại'}</span>}<time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(entry.date))}</time></div></article>
      })}</div> : <div className="empty-inline"><CalendarDays/><h3>Chưa có hoạt động trong khoảng này</h3><p>Bắt đầu một bài học hoặc lượt ôn để tạo lịch sử.</p><Link className="btn" to="/review">Bắt đầu ôn tập</Link></div>}
    </section>
  </div>
}
