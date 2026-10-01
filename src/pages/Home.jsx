import { ArrowRight, BarChart3, BookOpen, Brain, Check, Headphones, MessageCircle, PenLine, RotateCcw, Search, Sparkles, Target } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LanguageCard from '../components/course/LanguageCard'
import BlogCard from '../components/blog/BlogCard'
import Modal from '../components/common/Modal'
import { languages } from '../data/languages'
import { useApp } from '../context/AppContext'
import { languagePath } from '../utils/routes'
import { latestBlogPosts } from '../data/blogMeta'

const skills = [
  [BookOpen,'Vocabulary','Học từ theo cấp độ, chủ đề và ngữ cảnh; ôn lại bằng flashcard.','/english-vocabulary'],
  [Brain,'Grammar','Hiểu cấu trúc, cách dùng, lỗi thường gặp và luyện ngay trong bài.','/english-grammar'],
  [Headphones,'Listening','Nghe câu và hội thoại phù hợp với level, điều chỉnh tốc độ khi cần.','/learn-english'],
  [MessageCircle,'Speaking','Nghe mẫu, luyện nói thành tiếng và ghi âm trên thiết bị hỗ trợ.','/learn-english'],
  [BookOpen,'Reading','Đọc đoạn văn theo chủ đề, tra từ trong ngữ cảnh và kiểm tra ý chính.','/learn-english'],
  [PenLine,'Writing','Viết từ câu ngắn đến bài có cấu trúc với checklist tự rà soát.','/ielts'],
]

const faqs = [
  ['NT Language Learning có những ngôn ngữ nào?','Hiện có tiếng Anh, Trung, Nhật và Hàn với lộ trình theo CEFR, HSK, JLPT và TOPIK.'],
  ['Có thể tự chọn level không?','Có. Bạn có thể vào thẳng level phù hợp mà không cần mở khóa tuần tự từ cấp độ thấp nhất.'],
  ['Website có luyện đủ nghe, nói, đọc, viết không?','Có. Lesson kết hợp vocabulary, grammar, listening, speaking, reading, writing và quiz; một số bài dùng microphone hoặc audio của trình duyệt.'],
  ['Có luyện TOEIC và IELTS không?','Có. TOEIC có Full Test 200 câu và IELTS có Listening, Reading, Writing, Speaking với timer, lịch sử kết quả và bài ôn lỗi sai.'],
  ['Tiến độ học được lưu ở đâu?','Tiến độ hiện được lưu trên thiết bị bằng local storage của trình duyệt, không cần tạo tài khoản để bắt đầu học.'],
  ['Ai phát triển NT Language Learning?','NT Language Learning được phát triển bởi Nguyễn Ngọc Tâm (Ngọc Tâm Dev), Full-stack Developer. Hồ sơ kỹ thuật và kinh nghiệm dự án được tách riêng tại trang About.'],
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
    <section className="hero section-shell product-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16}/> NT LANGUAGE LEARNING · 4 NGÔN NGỮ</div>
        <h1 id="home-title">Học ngoại ngữ có lộ trình. <em>Luyện thi như một kỳ thi thật.</em></h1>
        <p>Học tiếng Anh, Trung, Nhật và Hàn theo level; luyện từ vựng, ngữ pháp, nghe–nói–đọc–viết và làm TOEIC/IELTS với timer, lịch sử kết quả và vòng ôn tập rõ ràng.</p>
        <div className="hero-actions">
          <button className="btn large" onClick={() => setOnboarding(true)}>Bắt đầu học <ArrowRight size={19}/></button>
          <Link className="btn secondary large" to="/toeic">TOEIC Full Test</Link>
          <Link className="btn ghost large" to="/ielts">IELTS Full Mock</Link>
        </div>
        <div className="trust-row"><span><Check/> 4 ngôn ngữ</span><span><Check/> ~1000 từ mỗi level</span><span><Check/> Tiến độ lưu trên thiết bị</span></div>
        <p className="hero-maker">Được phát triển bởi <Link to="/about">Nguyễn Ngọc Tâm (Ngọc Tâm Dev)</Link>.</p>
      </div>
      <div className="hero-visual huashu-learning-index" aria-label="NT Language Learning">
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
    <section className="stats-strip" aria-label="Tổng quan NT Language Learning"><div><strong>4</strong><span>Ngôn ngữ</span></div><div><strong>~1000</strong><span>Từ / level</span></div><div><strong>200</strong><span>TOEIC Full Test</span></div><div><strong>4</strong><span>IELTS skills</span></div></section>
    <section className="section-shell section-block" id="languages" aria-labelledby="languages-title"><div className="section-intro"><span className="overline">CHOOSE YOUR LANGUAGE</span><h2 id="languages-title">Chọn ngôn ngữ và level muốn học</h2><p>Không khóa lộ trình. Bạn có thể vào thẳng level phù hợp, học từ vựng, ngữ pháp và luyện đủ bốn kỹ năng.</p></div><div className="language-grid">{languages.map((language) => <LanguageCard language={language} key={language.id}/>)}</div></section>
    <section className="home-levels section-block" aria-labelledby="levels-title"><div className="section-shell"><div className="section-intro"><span className="overline">LEARNING LEVELS</span><h2 id="levels-title">Tiến bộ qua từng chặng có mục tiêu rõ</h2><p>Chọn level phù hợp, xem nội dung cần học và chuyển cấp độ bất kỳ lúc nào.</p></div><div className="framework-grid"><article><strong>CEFR</strong><h3>English A1–C2</h3><p>Từ giao tiếp nền tảng đến diễn đạt học thuật và chuyên nghiệp.</p><Link to="/learn-english">Xem lộ trình tiếng Anh <ArrowRight/></Link></article><article><strong>HSK</strong><h3>Chinese HSK 1–6</h3><p>Phát âm, chữ Hán, từ vựng và mẫu câu theo từng chặng.</p><Link to="/learn-chinese">Xem lộ trình tiếng Trung <ArrowRight/></Link></article><article><strong>JLPT</strong><h3>Japanese N5–N1</h3><p>Hệ chữ, Kanji, ngữ pháp và đọc hiểu từ cơ bản đến nâng cao.</p><Link to="/learn-japanese">Xem lộ trình tiếng Nhật <ArrowRight/></Link></article><article><strong>TOPIK</strong><h3>Korean TOPIK 1–6</h3><p>Hangeul, cấu trúc câu và năng lực giao tiếp theo level.</p><Link to="/learn-korean">Xem lộ trình tiếng Hàn <ArrowRight/></Link></article></div></div></section>
    <section className="section-shell section-block" aria-labelledby="skills-title"><div className="section-intro"><span className="overline">LEARNING SKILLS</span><h2 id="skills-title">Kiến thức và kỹ năng trong cùng một vòng học</h2><p>Bạn học nội dung, vận dụng trong bài và quay lại ôn phần còn yếu.</p></div><div className="skill-home-grid">{skills.map(([Icon,title,text,path]) => <article key={title}><span><Icon/></span><h3>{title}</h3><p>{text}</p><Link to={path}>Khám phá {title} <ArrowRight/></Link></article>)}</div></section>
    <section className="exam-home" aria-labelledby="exam-title"><div className="section-shell"><div className="section-intro left"><span className="overline">EXAM PREPARATION</span><h2 id="exam-title">Luyện TOEIC và IELTS theo đúng nhóm kỹ năng</h2><p>Thực hành với dạng câu hỏi, timer, giải thích và lịch sử kết quả. Điểm luyện tập giúp theo dõi tiến bộ, không phải chứng nhận chính thức.</p></div><div className="exam-home-grid"><article><span>TOEIC</span><h3>Listening & Reading</h3><p>Luyện theo Part hoặc làm Full Test 200 câu với timer, điểm ước tính và lịch sử kết quả.</p><Link className="btn light" to="/toeic">Luyện TOEIC <ArrowRight/></Link></article><article><span>IELTS</span><h3>Four Skills Practice</h3><p>Luyện nghe, đọc, viết theo checklist và ghi âm Speaking ngay trong trình duyệt.</p><Link className="btn light" to="/ielts">Luyện IELTS <ArrowRight/></Link></article></div></div></section>
    <section className="section-shell section-block why-nt" aria-labelledby="why-title"><div className="section-intro"><span className="overline">WHY CHOOSE NT</span><h2 id="why-title">Tập trung vào việc học bạn có thể duy trì</h2></div><div className="content-card-grid three"><article><Target/><h3>Đường học rõ ràng</h3><p>Level, unit và lesson được liên kết theo thứ tự gợi ý nhưng không khóa nội dung.</p></article><article><RotateCcw/><h3>Ôn theo mức nhớ</h3><p>Lịch flashcard ưu tiên từ đến hạn, từ yếu và từ bạn vừa trả lời sai.</p></article><article><BarChart3/><h3>Tiến độ minh bạch</h3><p>Xem thời gian học, bài đã hoàn thành và điểm kỹ năng theo từng level.</p></article></div></section>
    <section className="learning-statistics" aria-labelledby="statistics-title"><div className="section-shell"><div><span className="overline">LEARNING STATISTICS</span><h2 id="statistics-title">Biết mình đã học gì và cần ôn gì</h2><p>Dashboard kết hợp mục tiêu hằng ngày, Word of the Day, lịch sử hoạt động, sổ lỗi sai và kế hoạch ôn tập.</p><Link className="text-link" to="/dashboard">Mở Dashboard <ArrowRight/></Link></div><div className="stat-preview"><article><strong>12</strong><span>bài hoàn thành</span></article><article><strong>86%</strong><span>mức nhớ gần đây</span></article><article><strong>24</strong><span>từ cần ôn</span></article><article><strong>7</strong><span>ngày duy trì</span></article></div></div></section>
    <section className="section-shell section-block" aria-labelledby="maker-title"><div className="section-intro left"><span className="overline">BUILT BY</span><h2 id="maker-title">Mình xây NT Language Learning như một project học ngoại ngữ có thể dùng thật</h2><p>Mình giữ homepage tập trung vào trải nghiệm học; hồ sơ nghề nghiệp và các dự án kỹ thuật được tách riêng để người học không bị phân tâm.</p><Link className="text-link" to="/about">Xem About Me · Nguyễn Ngọc Tâm <ArrowRight/></Link></div></section>
    <section className="section-shell home-blog" aria-labelledby="latest-articles-title"><div className="home-blog-heading"><div className="section-intro"><span className="overline">LATEST ARTICLES</span><h2 id="latest-articles-title">Những ghi chú kỹ thuật mình muốn giữ lại</h2><p>Mình viết lại cách mình nhìn các bài toán PHP, backend, realtime và production để sau này có thể quay lại đối chiếu, cải thiện và chia sẻ với người khác.</p></div><Link className="btn secondary" to="/blog">Xem toàn bộ Blog <ArrowRight/></Link></div><div className="blog-grid">{latestBlogPosts.slice(0,3).map((post) => <BlogCard key={post.slug} post={post} compact/>)}</div></section>
    <section className="section-shell section-block faq-section" aria-labelledby="faq-title"><div className="section-intro"><span className="overline">FREQUENTLY ASKED QUESTIONS</span><h2 id="faq-title">Câu hỏi thường gặp</h2></div><div className="faq-list">{faqs.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className="section-shell final-home-cta"><div><span className="overline">BẮT ĐẦU HÔM NAY</span><h2>Chọn một ngôn ngữ. Hoàn thành bài đầu tiên.</h2><p>NT giúp bạn biến mục tiêu dài hạn thành từng bước học cụ thể.</p></div><button className="btn light large" onClick={() => setOnboarding(true)}>Start Learning <ArrowRight/></button></section>
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
