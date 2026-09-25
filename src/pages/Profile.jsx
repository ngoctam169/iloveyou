import { Award, Clock3, Edit3, Flame, Languages as LanguagesIcon, Save, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getLanguage } from '../data/languages'
import { languagePath } from '../utils/routes'
import { allVocabulary } from '../services/vocabularyService'
import { summarizeProgress, totalStudyMinutes } from '../utils/progress'
import { wordKey } from '../utils/srs'

export default function Profile() {
  const { state, update, setToast } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(state.profile.displayName)
  const language = getLanguage(state.selectedLanguage)
  const totals = summarizeProgress(state)
  const vocabularyLearned = allVocabulary(state).filter((word) => state.flashcardProgress[wordKey(word)] || state.vocabularyMeta?.[wordKey(word)]?.learned).length
  const achievements = [totals.completedLessons >= 1, state.streak >= 7, vocabularyLearned >= 100]
  const studyMinutes = totalStudyMinutes(state, totals.studyMinutes)
  const learningTime = `${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`
  const save = () => { if (!name.trim()) return; update({ profile: { ...state.profile, displayName: name.trim() } }); setEditing(false); setToast('Đã cập nhật hồ sơ') }
  return <div className="inner-page section-shell profile-page"><section className="profile-hero"><div className="profile-avatar">{state.profile.displayName.split(' ').map((part)=>part[0]).slice(-2).join('')}</div><div>{editing ? <div className="name-edit"><label htmlFor="display-name">Tên hiển thị</label><input id="display-name" value={name} onChange={(e)=>setName(e.target.value)} autoFocus /><button className="btn small" onClick={save}><Save /> Lưu</button></div> : <><h1>{state.profile.displayName}</h1><p>Người học kiên trì · Mục tiêu: {state.profile.goal}</p><button className="btn ghost small" onClick={()=>setEditing(true)}><Edit3 /> Chỉnh sửa tên</button></>} </div><Link className="btn secondary" to="/settings">Cài đặt</Link></section><div className="profile-stats">{[[Star,state.xp.toLocaleString(),'Total XP'],[Flame,state.streak,'Day streak'],[Clock3,learningTime,'Learning time'],[Award,achievements.filter(Boolean).length,'Achievements']].map(([Icon,value,label])=><article key={label}><Icon/><strong>{value}</strong><span>{label}</span></article>)}</div><div className="profile-grid"><section className="panel"><div className="panel-title"><div><h2>Khóa học hiện tại</h2><p>Hành trình đang theo đuổi</p></div></div><div className="profile-course"><span>{language.flag}</span><div><h3>{language.name} · {state.selectedLevel}</h3><p>{language.framework} learning path</p></div><Link to={languagePath(language.id)}>Đổi</Link></div></section><section className="panel"><div className="panel-title"><div><h2>Languages</h2><p>Ngôn ngữ của bạn</p></div></div><div className="language-pills"><span>{language.flag} {language.name}</span><Link to="/languages"><LanguagesIcon/> Thêm/đổi ngôn ngữ</Link></div></section></div><section className="achievements"><div className="section-intro left"><span className="overline">BADGE CASE</span><h2>Achievements</h2></div><div className="achievement-grid">{[['🌱','First Step','Complete your first lesson',achievements[0]],['🔥','On Fire','Reach a 7 day streak',achievements[1]],['📚','Word Collector','Learn 100 words',achievements[2]]].map(([icon,title,description,earned])=><article className={earned?'earned':''} key={title}><span>{icon}</span><div><h3>{title}</h3><p>{description}</p></div>{earned&&<small>Earned</small>}</article>)}</div></section></div>
}

