import { Bell, Moon, RotateCcw, Save, Sun, UserRound, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { languages } from '../data/languages'

export default function Settings() {
  const { state, update, chooseCourse, reset, setToast } = useApp()
  const [confirmReset, setConfirmReset] = useState(false)
  const [displayName, setDisplayName] = useState(state.profile.displayName)
  const [goal, setGoal] = useState(state.profile.goal || '')
  const setting = (partial) => update({ settings: { ...state.settings, ...partial } })
  const language = languages.find((item) => item.id === state.selectedLanguage) || languages[0]

  useEffect(() => {
    setDisplayName(state.profile.displayName)
    setGoal(state.profile.goal || '')
  }, [state.profile.displayName, state.profile.goal])

  const saveProfile = () => {
    if (!displayName.trim()) return
    update({ profile:{ ...state.profile,displayName:displayName.trim(),goal:goal.trim() || 'Tự học ngoại ngữ' } })
    setToast('Đã cập nhật hồ sơ')
  }

  return <div className="inner-page section-shell settings-page">
    <div className="page-heading"><span className="overline">PREFERENCES</span><h1>Cài đặt</h1><p>Hồ sơ, khóa học và cách NT hỗ trợ phiên học của bạn được gom về một chỗ.</p></div>

    <section className="settings-section vertical" id="profile">
      <div className="settings-title"><span><UserRound/></span><div><h2>Hồ sơ người học</h2><p>Tên và mục tiêu này được dùng trên Dashboard và các gợi ý học tập.</p></div></div>
      <div className="setting-selects">
        <label>Tên hiển thị<input value={displayName} onChange={(event)=>setDisplayName(event.target.value)} maxLength={60}/></label>
        <label>Mục tiêu học<input value={goal} onChange={(event)=>setGoal(event.target.value)} placeholder="Ví dụ: Giao tiếp, TOEIC 750, JLPT N3…"/></label>
      </div>
      <div><button className="btn small" onClick={saveProfile}><Save/> Lưu hồ sơ</button></div>
    </section>

    <section className="settings-section vertical"><div className="settings-title"><span>🌐</span><div><h2>Khóa học đang chọn</h2><p>Đổi tự do; tiến độ từng level được lưu riêng.</p></div></div><div className="setting-selects"><label>Ngôn ngữ<select value={language.id} onChange={(event) => { const next = languages.find((item) => item.id === event.target.value); chooseCourse(next.id, next.levels[0][0]) }}>{languages.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Level<select value={state.selectedLevel} onChange={(event) => chooseCourse(language.id, event.target.value)}>{language.levels.map(([level]) => <option key={level}>{level}</option>)}</select></label></div></section>

    <section className="settings-section"><div className="settings-title"><span><Sun/></span><div><h2>Theme</h2><p>Giao diện sáng hoặc tối</p></div></div><div className="segmented"><button aria-pressed={state.theme === 'light'} className={state.theme === 'light' ? 'active' : ''} onClick={() => update({ theme: 'light' })}><Sun/> Light</button><button aria-pressed={state.theme === 'dark'} className={state.theme === 'dark' ? 'active' : ''} onClick={() => update({ theme: 'dark' })}><Moon/> Dark</button></div></section>

    <section className="settings-section vertical"><div className="settings-title"><span><Bell/></span><div><h2>Daily Goal</h2><p>Mục tiêu học mỗi ngày; không dùng để khóa bài.</p></div></div><div className="goal-options">{[[15, 'Casual'], [30, 'Regular'], [45, 'Serious'], [60, 'Intense']].map(([minutes, label]) => <button key={minutes} aria-pressed={state.dailyGoal === minutes} className={state.dailyGoal === minutes ? 'active' : ''} onClick={() => update({ dailyGoal: minutes })}><strong>{minutes}</strong><span>phút</span><small>{label}</small></button>)}</div></section>

    <section className="settings-section vertical"><div className="settings-title"><span><Bell/></span><div><h2>Mục tiêu từ vựng</h2><p>Số từ gợi ý luyện mỗi ngày; có thể học nhiều hoặc ít hơn.</p></div></div><div className="segmented small">{[5, 10, 20, 30].map((count) => <button key={count} aria-pressed={state.dailyVocabularyGoal === count} className={state.dailyVocabularyGoal === count ? 'active' : ''} onClick={() => update({ dailyVocabularyGoal: count })}>{count} từ</button>)}</div></section>

    <section className="settings-section vertical"><div className="settings-title"><span><Volume2/></span><div><h2>Audio & Speech</h2><p>Thiết lập phát âm dùng chung trong bài học.</p></div></div><div className="setting-row"><div><strong>Auto Play Audio</strong><span>Tự động phát câu mẫu khi mở phần Listening</span></div><button role="switch" aria-checked={state.settings.autoplay} className={`toggle ${state.settings.autoplay ? 'on' : ''}`} onClick={() => setting({ autoplay: !state.settings.autoplay })} aria-label="Tự động phát audio"><span/></button></div><div className="setting-row"><div><strong>Speech Speed</strong><span>Tốc độ giọng đọc mặc định</span></div><div className="segmented small">{[['slow','0.75x'],['normal','1x'],['fast','1.25x']].map(([speed,label]) => <button key={speed} aria-pressed={state.settings.speechSpeed === speed} className={state.settings.speechSpeed === speed ? 'active' : ''} onClick={() => setting({ speechSpeed: speed })}>{label}</button>)}</div></div></section>

    <section className="danger-zone"><div><RotateCcw/><div><h2>Reset Progress</h2><p>Xóa bài đã hoàn thành, XP, streak và toàn bộ lịch sử ôn tập.</p></div></div><button className="btn danger" onClick={() => setConfirmReset(true)}>Đặt lại tiến độ</button></section>
    <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Đặt lại toàn bộ tiến độ?"><p>Hành động này không thể hoàn tác. Tên hiển thị cũng sẽ trở về mặc định.</p><div className="modal-actions"><button className="btn secondary" onClick={() => setConfirmReset(false)}>Hủy</button><button className="btn danger" onClick={() => { reset(); setConfirmReset(false) }}>Xác nhận đặt lại</button></div></Modal>
  </div>
}
