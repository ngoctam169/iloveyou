import { ArrowRight, BookOpen, Brain, Check, Headphones, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import Modal from '../components/common/Modal'
import { languages } from '../data/languages'
import { useApp } from '../context/AppContext'
import { languagePath } from '../utils/routes'
import { latestBlogPosts } from '../data/blogMeta'

const studyFlow = [
  [BookOpen,'01','Vocabulary','Học từ theo level, chủ đề và ngữ cảnh thay vì một danh sách rời rạc.','/english-vocabulary'],
  [Brain,'02','Grammar','Hiểu cấu trúc, cách dùng và luyện ngay trong bài học.','/english-grammar'],
  [Headphones,'03','Four Skills','Kết nối nghe, nói, đọc và viết trong cùng một lộ trình.','/learn-english'],
  [RotateCcw,'04','Review','Quay lại từ yếu, lỗi sai và nội dung đến hạn ôn.','/review'],
]

export default function Home() {
  const { state, update } = useApp()
  const [onboarding, setOnboarding] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ language:state.selectedLanguage || 'english', goal:'Giao tiếp', skill:'beginner', daily:30 })
  const navigate = useNavigate()

  const finish = () => {
    const language = languages.find((item) => item.id === form.language)
    update({ dailyGoal:form.daily, onboardingComplete:true, selectedLanguage:language.id, selectedLevel:language.levels[0][0], profile:{ ...state.profile, goal:form.goal } })
    setOnboarding(false)
    navigate(form.skill === 'test' ? '/placement-test' : languagePath(language.id))
  }

  return <>
    <section className="hero section-shell product-hero huashu-home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14}/> LANGUAGE LEARNING · FOUR PATHS</div>
        <h1 id="home-title">Học ngoại ngữ như một <em>hành trình có cấu trúc.</em></h1>
        <p>Tiếng Anh, Trung, Nhật và Hàn theo level. Học từ vựng, ngữ pháp, bốn kỹ năng và luyện TOEIC/IELTS trong cùng một hệ thống.</p>
        <div className="hero-actions">
          <button className="btn large" onClick={() => setOnboarding(true)}>Bắt đầu học <ArrowRight size={17}/></button>
          <Link className="btn secondary large" to="/languages">Xem lộ trình</Link>
        </div>
        <div className="trust-row">
          <span><Check/> Tự chọn level</span>
          <span><Check/> ~1000 từ / level</span>
          <span><Check/> Lưu tiến độ trên thiết bị</span>
        </div>
        <p className="hero-maker">Mình xây project này như một không gian học tập có thể dùng thật. <Link to="/about">About Me →</Link></p>
      </div>

      <div className="hero-visual huashu-learning-index" aria-label="Lộ trình ngôn ngữ">
        <div className="huashu-index-head">
          <span>Learning index · 2026</span>
          <strong>Choose your path</strong>
        </div>
        <div className="huashu-index-list">
          {languages.map((language,index) => <Link key={language.id} to={languagePath(language.id)} className="huashu-index-row">
            <span className="huashu-index-no">{String(index + 1).padStart(2,'0')}</span>
            <span className="huashu-index-language"><b>{language.nativeName}</b><small>{language.name}</small></span>
            <span className="huashu-index-levels">{language.levels.map(([level]) => level).join(' · ')}</span>
            <ArrowRight/>
          </Link>)}
        </div>
        <div className="huashu-exam-rail">
          <Link to="/toeic"><span>TOEIC</span><strong>200 câu · Full Test</strong><ArrowRight/></Link>
          <Link to="/ielts"><span>IELTS</span><strong>4 skills · Academic</strong><ArrowRight/></Link>
        </div>
      </div>
    </section>

    <section className="stats-strip" aria-label="Tổng quan NT Language Learning">
      <div><strong>4</strong><span>Ngôn ngữ</span></div>
      <div><strong>~1000</strong><span>Từ / level</span></div>
      <div><strong>200</strong><span>TOEIC Full Test</span></div>
      <div><strong>4</strong><span>IELTS skills</span></div>
    </section>

    <section className="home-levels section-block huashu-framework" aria-labelledby="levels-title">
      <div className="section-shell">
        <div className="section-intro left">
          <span className="overline">LEARNING FRAMEWORK</span>
          <h2 id="levels-title">Mỗi level là một chương, không phải một màn hình đầy nút.</h2>
          <p>Chọn đúng cấp độ, biết mình đang ở đâu và học tiếp theo vì sao nội dung đó xuất hiện.</p>
        </div>
        <div className="framework-grid">
          <article><strong>01 / CEFR</strong><h3>English A1–C2</h3><p>Từ giao tiếp nền tảng đến diễn đạt học thuật và chuyên nghiệp.</p><Link to="/learn-english">Mở lộ trình <ArrowRight/></Link></article>
          <article><strong>02 / HSK</strong><h3>Chinese HSK 1–6</h3><p>Phát âm, chữ Hán, từ vựng và mẫu câu theo từng chặng.</p><Link to="/learn-chinese">Mở lộ trình <ArrowRight/></Link></article>
          <article><strong>03 / JLPT</strong><h3>Japanese N5–N1</h3><p>Hệ chữ, Kanji, ngữ pháp và đọc hiểu theo cấp độ.</p><Link to="/learn-japanese">Mở lộ trình <ArrowRight/></Link></article>
          <article><strong>04 / TOPIK</strong><h3>Korean TOPIK 1–6</h3><p>Hangeul, cấu trúc câu và năng lực giao tiếp theo level.</p><Link to="/learn-korean">Mở lộ trình <ArrowRight/></Link></article>
        </div>
      </div>
    </section>

    <section className="section-shell section-block huashu-study-system" aria-labelledby="system-title">
      <div className="section-intro left">
        <span className="overline">STUDY SYSTEM</span>
        <h2 id="system-title">Học, dùng, rồi quay lại đúng phần mình còn yếu.</h2>
        <p>Thay vì tách từng tính năng thành những khu vực rời nhau, NT tổ chức chúng thành một vòng học có thể lặp lại.</p>
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
        <p>Mình xây NT Language Learning như một project học ngoại ngữ có thể dùng thật, đồng thời tách portfolio và engineering notes thành các khu vực riêng để luồng học luôn rõ ràng.</p>
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

    <Modal open={onboarding} onClose={() => setOnboarding(false)} title={`Thiết lập hành trình · ${step}/4`} size="onboarding-modal">
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
