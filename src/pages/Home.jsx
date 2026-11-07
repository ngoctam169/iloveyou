import { ArrowRight, BookOpen, Brain, Check, Globe, Headphones, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import Modal from '../components/common/Modal'
import { getLanguage, languages } from '../data/languages'
import { useApp } from '../context/AppContext'
import { getLevelProgress } from '../utils/progress'
import { grammarPath, languagePath, levelPath, vocabularyPath } from '../utils/routes'
import { latestBlogPosts } from '../data/blogMeta'
import { trackEvent } from '../utils/analytics'

export default function Home() {
  const { state, update, chooseCourse, setToast } = useApp()
  const [onboarding, setOnboarding] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ language:state.selectedLanguage || 'english', goal:'Giao tiếp', skill:'beginner', daily:30 })
  const navigate = useNavigate()
  const activeLanguage = getLanguage(state.selectedLanguage) || languages[0]
  const activeLevel = activeLanguage.levels.some(([lvl]) => lvl === state.selectedLevel) ? state.selectedLevel : activeLanguage.levels[0][0]
  const needsInitialPick = !state.languageFocused || showPicker

  const studyFlow = [
    [BookOpen,'01','Vocabulary',`Học từ vựng ${activeLanguage.viName} (${activeLevel}) theo chủ đề, câu ví dụ và SRS.`,vocabularyPath(activeLanguage.id, activeLevel)],
    [Brain,'02','Grammar',`Nắm vững cấu trúc ngữ pháp ${activeLanguage.viName} (${activeLevel}) và luyện ngay trong bài.`,grammarPath(activeLanguage.id, activeLevel)],
    [Headphones,'03','Four Skills',`Kết nối nghe, nói, đọc và viết xuyên suốt lộ trình ${activeLanguage.framework}.`,levelPath(activeLanguage.id, activeLevel)],
    [RotateCcw,'04','Review','Quay lại từ yếu, lỗi sai và nội dung đến hạn ôn tập.', '/review'],
  ]

  const pickFocusLanguage = (langId, customLevel = null) => {
    const langObj = getLanguage(langId) || languages[0]
    const targetLevel = customLevel || state.lastLevelByLanguage?.[langObj.id] || langObj.levels[0][0]
    chooseCourse(langObj.id, targetLevel)
    setForm((current) => ({ ...current, language: langObj.id }))
    setShowPicker(false)
    trackEvent('select_language', { language: langObj.id, level: targetLevel, source: 'home_focus_gate' })
    setToast(`Đang tập trung vào ${langObj.flag} ${langObj.viName} (${targetLevel}). Bạn có thể đổi ngôn ngữ ở góc phải trên cùng.`)
  }

  const finish = () => {
    const language = languages.find((item) => item.id === form.language)
    update({ dailyGoal:form.daily, onboardingComplete:true, languageFocused:true, selectedLanguage:language.id, selectedLevel:language.levels[0][0], profile:{ ...state.profile, goal:form.goal } })
    trackEvent('start_learning', { language:language.id, level:language.levels[0][0], goal:form.goal, daily_minutes:form.daily, placement_test:form.skill === 'test' })
    setOnboarding(false)
    navigate(form.skill === 'test' ? '/placement-test' : languagePath(language.id))
  }

  return <>
    {needsInitialPick && (
      <section className="section-shell focus-language-gate" aria-label="Chọn ngôn ngữ tập trung">
        <div className="focus-gate-card">
          <div className="focus-gate-head">
            <div>
              <span className="overline"><Globe size={13}/> BƯỚC 1 · CHỌN 1 NGÔN NGỮ TẬP TRUNG</span>
              <h2>Bạn muốn tập trung chinh phục ngôn ngữ nào?</h2>
              <p>Chọn 1 ngôn ngữ bên dưới để toàn bộ giao diện, lộ trình, từ vựng và bài luyện chỉ tập trung vào ngôn ngữ đó. Khi cần đổi sang tiếng khác, bạn chỉ cần bấm nút <strong>{activeLanguage.flag} {activeLanguage.viName}</strong> ở góc trên bên phải.</p>
            </div>
            {state.languageFocused && (
              <button type="button" className="btn ghost small" onClick={() => setShowPicker(false)}>Giữ {activeLanguage.viName}</button>
            )}
          </div>
          <div className="focus-gate-grid">
            {languages.map((item) => {
              const isCurrent = item.id === activeLanguage.id && state.languageFocused
              const rememberedLvl = state.lastLevelByLanguage?.[item.id] || item.levels[0][0]
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`focus-lang-card ${isCurrent ? 'selected' : ''}`}
                  onClick={() => pickFocusLanguage(item.id)}
                >
                  <div className="focus-lang-top">
                    <span className="focus-lang-flag">{item.flag}</span>
                    <span className="focus-lang-badge">{item.framework}</span>
                  </div>
                  <strong>{item.viName} <em>({item.nativeName})</em></strong>
                  <p>{item.description}</p>
                  <div className="focus-lang-foot">
                    <small>{item.levels[0][0]} → {item.levels.at(-1)[0]} · Bắt đầu ở {rememberedLvl}</small>
                    <span>Chọn học <ArrowRight size={14}/></span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    )}

    <section className="hero section-shell product-hero huashu-home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14}/> LINGUAFLOW · ĐANG TẬP TRUNG: {activeLanguage.flag} {activeLanguage.viName.toUpperCase()} ({activeLanguage.framework})</div>
        <h1 id="home-title">Chinh phục {activeLanguage.viName} theo <em>từng level.</em></h1>
        <p>Toàn bộ không gian học hiện đang tập trung riêng cho <strong>{activeLanguage.viName} ({activeLanguage.nativeName} · {activeLanguage.framework})</strong> — từ vựng, ngữ pháp, nghe–nói–đọc–viết và ôn tập SRS. Bạn có thể đổi cấp độ hoặc chuyển sang ngôn ngữ khác ngay trên góc phải.</p>
        <div className="hero-actions">
          <button className="btn large" onClick={() => setOnboarding(true)}>Bắt đầu học <ArrowRight size={17}/></button>
          <Link className="btn secondary large" to={levelPath(activeLanguage.id, activeLevel)}>Vào thẳng {activeLanguage.viName} · {activeLevel}</Link>
          <button type="button" className="btn ghost large" onClick={() => setShowPicker(true)}>Đổi ngôn ngữ ({activeLanguage.flag})</button>
        </div>
        <div className="trust-row">
          <span><Check/> Đang khóa mục tiêu: {activeLanguage.viName} ({activeLevel})</span>
          <span><Check/> ~1000 từ / level</span>
          <span><Check/> Lưu tiến độ trên thiết bị</span>
        </div>
        <p className="hero-maker">LinguaFlow là hệ thống học ngoại ngữ tập trung do Nguyễn Ngọc Tâm phát triển. <Link to="/about">About Me →</Link></p>
      </div>

      <div className="hero-visual huashu-learning-index" aria-label={`Lộ trình ${activeLanguage.viName}`}>
        <div className="huashu-index-head">
          <span>{activeLanguage.flag} {activeLanguage.framework} ROADMAP · 2026</span>
          <strong>Lộ trình {activeLanguage.viName}</strong>
        </div>
        <div className="huashu-index-list">
          {activeLanguage.levels.map(([lvl, label], index) => {
            const progress = getLevelProgress(state, activeLanguage.id, lvl)
            const completedCount = progress.completedLessons?.length || 0
            return (
              <Link
                key={lvl}
                to={levelPath(activeLanguage.id, lvl)}
                className={`huashu-index-row ${lvl === activeLevel ? 'active-focus-row' : ''}`}
                onClick={() => {
                  chooseCourse(activeLanguage.id, lvl)
                  trackEvent('select_level', { language: activeLanguage.id, level: lvl, source: 'home_learning_index' })
                }}
              >
                <span className="huashu-index-no">{String(index + 1).padStart(2,'0')}</span>
                <span className="huashu-index-language"><b>{lvl}</b><small>{label}</small></span>
                <span className="huashu-index-levels">{completedCount > 0 ? `Đã hoàn thành ${completedCount} bài` : (lvl === activeLevel ? 'Đang chọn · Vào học ngay' : '60 bài học · Từ vựng & 4 kỹ năng')}</span>
                <ArrowRight/>
              </Link>
            )
          })}
        </div>
        <div className="huashu-exam-rail">
          {activeLanguage.id === 'english' ? (
            <>
              <Link to="/toeic"><span>TOEIC</span><strong>200 câu · Full Test</strong><ArrowRight/></Link>
              <Link to="/ielts"><span>IELTS</span><strong>4 skills · Academic</strong><ArrowRight/></Link>
            </>
          ) : (
            <>
              <Link to={vocabularyPath(activeLanguage.id, activeLevel)}><span>VOCABULARY</span><strong>Kho từ {activeLanguage.viName} · {activeLevel}</strong><ArrowRight/></Link>
              <Link to="/placement-test"><span>PLACEMENT</span><strong>Kiểm tra trình độ {activeLanguage.framework}</strong><ArrowRight/></Link>
            </>
          )}
        </div>
      </div>
    </section>

    <section className="stats-strip" aria-label="Tổng quan LinguaFlow">
      <div><strong>{activeLanguage.levels.length}</strong><span>Cấp độ {activeLanguage.framework} ({activeLanguage.viName})</span></div>
      <div><strong>~1000</strong><span>Từ / level</span></div>
      <div><strong>200</strong><span>TOEIC Full Test</span></div>
      <div><strong>4</strong><span>IELTS skills</span></div>
    </section>

    <section className="home-levels section-block huashu-framework" aria-labelledby="levels-title">
      <div className="section-shell">
        <div className="section-intro left">
          <span className="overline">{activeLanguage.framework} FOCUS FRAMEWORK · {activeLanguage.viName.toUpperCase()}</span>
          <h2 id="levels-title">Các chặng {activeLanguage.framework} của {activeLanguage.viName}</h2>
          <p>Bạn đang ở chế độ tập trung 1 ngôn ngữ ({activeLanguage.flag} {activeLanguage.viName}). Chọn bất kỳ level nào bên dưới để học thẳng vào bài học, từ vựng và ngữ pháp của level đó.</p>
        </div>
        <div className="framework-grid">
          {activeLanguage.levels.slice(0, 4).map(([lvl, label], idx) => (
            <article key={lvl}>
              <strong>{String(idx + 1).padStart(2, '0')} / {activeLanguage.framework}</strong>
              <h3>{activeLanguage.viName} · {lvl} ({label})</h3>
              <p>Lộ trình 60 bài học, kho từ vựng {lvl}, ngữ pháp trọng tâm và luyện 4 kỹ năng cho cấp độ {label.toLowerCase()}.</p>
              <Link to={levelPath(activeLanguage.id, lvl)} onClick={() => chooseCourse(activeLanguage.id, lvl)}>Mở lộ trình {lvl} <ArrowRight/></Link>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section-shell section-block huashu-study-system" aria-labelledby="system-title">
      <div className="section-intro left">
        <span className="overline">STUDY SYSTEM</span>
        <h2 id="system-title">Học, làm bài, xem lỗi rồi ôn lại.</h2>
        <p>Học từ mới, làm bài, xem lại lỗi sai và quay lại ôn khi cần.</p>
      </div>
      <div className="huashu-study-flow">
        {studyFlow.map(([Icon,no,title,text,path]) => <Link to={path} key={title}>
          <span className="huashu-study-no">{no}</span>
          <Icon/>
          <h3>{title}</h3>
          <p>{text}</p>
          <ArrowRight className="huashu-study-arrow"/>
        </Link>)}
      </div>
    </section>

    <section className="exam-home huashu-exam-section" aria-labelledby="exam-title">
      <div className="section-shell">
        <div className="section-intro left">
          <span className="overline">EXAM PREPARATION</span>
          <h2 id="exam-title">Luyện thi như một kỳ thi thật.</h2>
          <p>Timer, full test, lịch sử kết quả và vòng ôn lỗi sai — nhưng điểm luyện tập không được trình bày như chứng chỉ chính thức.</p>
        </div>
        <div className="exam-home-grid">
          <article><span>TOEIC</span><h3>Listening & Reading</h3><p>200 câu · 45 phút Listening · 75 phút Reading · điểm ước tính · review.</p><Link className="btn light" to="/toeic">Luyện TOEIC <ArrowRight/></Link></article>
          <article><span>IELTS</span><h3>Academic · Four Skills</h3><p>Listening · Reading · Writing · Speaking với flow luyện tập và full mock.</p><Link className="btn light" to="/ielts">Luyện IELTS <ArrowRight/></Link></article>
        </div>
      </div>
    </section>

    <section className="section-shell huashu-maker-strip" aria-labelledby="maker-title">
      <div>
        <span className="overline">BUILT BY</span>
        <h2 id="maker-title">Nguyễn Ngọc Tâm · Full-stack Developer</h2>
        <p>Mình làm LinguaFlow để học ngoại ngữ tập trung từng thứ tiếng và thử những thứ mình đang học về product, frontend và backend. Portfolio và blog được để riêng để phần học không bị rối.</p>
      </div>
      <Link className="btn secondary" to="/about">About Me <ArrowRight/></Link>
    </section>

    <section className="section-shell home-blog huashu-home-blog" aria-labelledby="latest-articles-title">
      <div className="home-blog-heading">
        <div className="section-intro left">
          <span className="overline">ENGINEERING NOTES</span>
          <h2 id="latest-articles-title">Những ghi chú kỹ thuật mình muốn giữ lại.</h2>
          <p>Mình viết lại cách mình nhìn các bài toán PHP, database, queue, realtime và production để sau này có thể quay lại đối chiếu và cải thiện.</p>
        </div>
        <Link className="btn secondary" to="/blog">Xem Blog <ArrowRight/></Link>
      </div>
      <div className="blog-grid">{latestBlogPosts.slice(0,3).map((post) => <BlogCard key={post.slug} post={post} compact/>)}</div>
    </section>

    <Modal open={onboarding} onClose={() => setOnboarding(false)} title={`Thiết lập học tập · ${step}/4`} size="onboarding-modal">
      <div className="step-dots">{[1,2,3,4].map((item) => <span className={item <= step ? 'active' : ''} key={item}/>)}</div>
      {step === 1 && <OnboardingChoice title="Bạn muốn học ngôn ngữ nào?" options={languages.map((item) => [item.id,`${item.flag} ${item.nativeName}`,item.name])} value={form.language} onChange={(language) => setForm({ ...form, language })}/>}
      {step === 2 && <OnboardingChoice title="Mục tiêu của bạn là gì?" options={['Du lịch','Công việc','Học tập','Giao tiếp','Thi chứng chỉ'].map((item) => [item,item,''])} value={form.goal} onChange={(goal) => setForm({ ...form, goal })}/>}
      {step === 3 && <OnboardingChoice title="Bạn đang ở trình độ nào?" options={[["beginner",'Mình mới bắt đầu','Đi từ nền tảng đầu tiên'],['some','Mình biết một chút','Chọn level sau khi bắt đầu'],['test','Kiểm tra trình độ cho mình','Làm bài đánh giá 15 câu']]} value={form.skill} onChange={(skill) => setForm({ ...form, skill })}/>}
      {step === 4 && <OnboardingChoice title="Mục tiêu học hằng ngày" options={[[15,'Casual','15 phút/ngày'],[30,'Regular','30 phút/ngày'],[45,'Serious','45 phút/ngày'],[60,'Intense','60 phút/ngày']]} value={form.daily} onChange={(daily) => setForm({ ...form, daily })}/>}
      <div className="modal-actions"><button className="btn ghost" onClick={() => setOnboarding(false)}>Để sau</button>{step > 1 && <button className="btn secondary" onClick={() => setStep(step - 1)}>Quay lại</button>}<button className="btn" onClick={() => step < 4 ? setStep(step + 1) : finish()}>{step < 4 ? 'Tiếp tục' : 'Bắt đầu học'} <ArrowRight size={17}/></button></div>
    </Modal>
  </>
}

function OnboardingChoice({ title, options, value, onChange }) {
  return <div className="onboarding-step"><h3>{title}</h3><div className="choice-grid">{options.map(([id,label,sub]) => <button key={id} className={value === id ? 'selected' : ''} onClick={() => onChange(id)}><span>{label}</span>{sub && <small>{sub}</small>}{value === id && <Check size={18}/>}</button>)}</div></div>
}
