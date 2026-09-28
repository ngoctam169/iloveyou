import { ArrowRight, BarChart3, BookOpen, Brain, Check, Headphones, MessageCircle, PenLine, RotateCcw, Search, Sparkles, Target, Trophy } from 'lucide-react'
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
  ['NT có phù hợp với người mới bắt đầu không?','Có. Mỗi ngôn ngữ có level nền tảng riêng: English A1, Chinese HSK 1, Japanese N5 và Korean TOPIK 1. Bạn cũng có thể làm bài kiểm tra trình độ trước khi chọn lộ trình.'],
  ['Tôi có cần tạo tài khoản không?','Không. Phiên bản hiện tại lưu tiến độ, từ cá nhân và lịch ôn trực tiếp trong trình duyệt trên thiết bị của bạn.'],
  ['NT dạy những kỹ năng nào?','Lộ trình kết hợp từ vựng, ngữ pháp, nghe, nói, đọc và viết. Một số hoạt động như ghi âm hoặc nhận dạng giọng nói phụ thuộc khả năng của trình duyệt.'],
  ['Tôi có thể luyện TOEIC và IELTS không?','Có. NT có khu luyện TOEIC Listening và Reading, cùng IELTS Listening, Reading, Writing và Speaking. Kết quả luyện tập không thay thế chứng chỉ chính thức.'],
  ['Lịch ôn từ vựng hoạt động thế nào?','Sau mỗi flashcard, bạn đánh giá mức nhớ. NT dùng phản hồi đó để xác định lần ôn tiếp theo và ưu tiên từ đến hạn hoặc từ còn yếu.'],
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
    <section className="hero section-shell" aria-labelledby="home-title">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={16}/> Nền tảng học ngoại ngữ theo lộ trình</div><h1 id="home-title">Learn Languages Smarter with <em>NT</em></h1><p>Học tiếng Anh, Trung, Nhật và Hàn theo CEFR, HSK, JLPT và TOPIK. Mỗi level kết nối kiến thức với bài luyện nghe, nói, đọc và viết.</p><div className="hero-actions"><button className="btn large" onClick={() => setOnboarding(true)}>Start Learning <ArrowRight size={19}/></button><Link className="btn secondary large" to="/#languages"><Search size={19}/> Explore Languages</Link></div><div className="trust-row"><span><Check/> Không cần đăng ký</span><span><Check/> Tiến độ lưu trên thiết bị</span><span><Check/> Mọi level đều có thể mở</span></div></div>
      <div className="hero-visual" aria-label="Minh họa một bài học trên NT"><div className="orb orb-one"/><div className="orb orb-two"/><div className="visual-card lesson-preview"><span className="preview-label">BÀI HỌC HÔM NAY</span><div className="preview-icon">旅</div><h3>Talking About Travel</h3><p>English · B1 · Vocabulary & Skills</p><div className="mini-progress"><span/></div><strong>12 phút để hoàn thành</strong></div><div className="visual-card streak-float"><span>🔥</span><div><strong>7 ngày</strong><small>Chuỗi học hiện tại</small></div></div><div className="visual-card xp-float"><Trophy/><div><strong>+120 XP</strong><small>Hoàn thành bài học</small></div></div></div>
    </section>
    <section className="stats-strip" aria-label="Quy mô nội dung"><div><strong>4</strong><span>ngôn ngữ</span></div><div><strong>23</strong><span>cấp độ</span></div><div><strong>2.300+</strong><span>từ vựng</span></div><div><strong>6</strong><span>kỹ năng học</span></div></section>
    <section className="section-shell section-block" id="languages" aria-labelledby="languages-title"><div className="section-intro"><span className="overline">LANGUAGES</span><h2 id="languages-title">Chọn ngôn ngữ bạn muốn sử dụng tự tin</h2><p>Mỗi khóa học có URL, level và kho nội dung riêng để bạn đi thẳng đến mục tiêu cần học.</p></div><div className="language-grid">{languages.map((language) => <LanguageCard language={language} key={language.id}/>)}</div></section>
    <section className="home-levels section-block" aria-labelledby="levels-title"><div className="section-shell"><div className="section-intro"><span className="overline">LEARNING LEVELS</span><h2 id="levels-title">Tiến bộ qua từng chặng có mục tiêu rõ</h2><p>Chọn level phù hợp, xem nội dung cần học và chuyển cấp độ bất kỳ lúc nào.</p></div><div className="framework-grid"><article><strong>CEFR</strong><h3>English A1–C2</h3><p>Từ giao tiếp nền tảng đến diễn đạt học thuật và chuyên nghiệp.</p><Link to="/learn-english">Xem lộ trình tiếng Anh <ArrowRight/></Link></article><article><strong>HSK</strong><h3>Chinese HSK 1–6</h3><p>Phát âm, chữ Hán, từ vựng và mẫu câu theo từng chặng.</p><Link to="/learn-chinese">Xem lộ trình tiếng Trung <ArrowRight/></Link></article><article><strong>JLPT</strong><h3>Japanese N5–N1</h3><p>Hệ chữ, Kanji, ngữ pháp và đọc hiểu từ cơ bản đến nâng cao.</p><Link to="/learn-japanese">Xem lộ trình tiếng Nhật <ArrowRight/></Link></article><article><strong>TOPIK</strong><h3>Korean TOPIK 1–6</h3><p>Hangeul, cấu trúc câu và năng lực giao tiếp theo level.</p><Link to="/learn-korean">Xem lộ trình tiếng Hàn <ArrowRight/></Link></article></div></div></section>
    <section className="section-shell section-block" aria-labelledby="skills-title"><div className="section-intro"><span className="overline">LEARNING SKILLS</span><h2 id="skills-title">Kiến thức và kỹ năng trong cùng một vòng học</h2><p>Bạn học nội dung, vận dụng trong bài và quay lại ôn phần còn yếu.</p></div><div className="skill-home-grid">{skills.map(([Icon,title,text,path]) => <article key={title}><span><Icon/></span><h3>{title}</h3><p>{text}</p><Link to={path}>Khám phá {title} <ArrowRight/></Link></article>)}</div></section>
    <section className="exam-home" aria-labelledby="exam-title"><div className="section-shell"><div className="section-intro left"><span className="overline">EXAM PREPARATION</span><h2 id="exam-title">Luyện TOEIC và IELTS theo đúng nhóm kỹ năng</h2><p>Thực hành với dạng câu hỏi, timer, giải thích và lịch sử kết quả. Điểm luyện tập giúp theo dõi tiến bộ, không phải chứng nhận chính thức.</p></div><div className="exam-home-grid"><article><span>TOEIC</span><h3>Listening & Reading</h3><p>Luyện theo Part, xem transcript, từ vựng, giải thích đáp án và làm mini test.</p><Link className="btn light" to="/toeic">Luyện TOEIC <ArrowRight/></Link></article><article><span>IELTS</span><h3>Four Skills Practice</h3><p>Luyện nghe, đọc, viết theo checklist và ghi âm Speaking ngay trong trình duyệt.</p><Link className="btn light" to="/ielts">Luyện IELTS <ArrowRight/></Link></article></div></div></section>
    <section className="section-shell section-block why-nt" aria-labelledby="why-title"><div className="section-intro"><span className="overline">WHY CHOOSE NT</span><h2 id="why-title">Tập trung vào việc học bạn có thể duy trì</h2></div><div className="content-card-grid three"><article><Target/><h3>Đường học rõ ràng</h3><p>Level, unit và lesson được liên kết theo thứ tự gợi ý nhưng không khóa nội dung.</p></article><article><RotateCcw/><h3>Ôn theo mức nhớ</h3><p>Lịch flashcard ưu tiên từ đến hạn, từ yếu và từ bạn vừa trả lời sai.</p></article><article><BarChart3/><h3>Tiến độ minh bạch</h3><p>Xem thời gian học, bài đã hoàn thành và điểm kỹ năng theo từng level.</p></article></div></section>
    <section className="learning-statistics" aria-labelledby="statistics-title"><div className="section-shell"><div><span className="overline">LEARNING STATISTICS</span><h2 id="statistics-title">Biết mình đã học gì và cần ôn gì</h2><p>Dashboard kết hợp mục tiêu hằng ngày, Word of the Day, lịch sử hoạt động, sổ lỗi sai và kế hoạch ôn tập.</p><Link className="text-link" to="/dashboard">Mở Dashboard <ArrowRight/></Link></div><div className="stat-preview"><article><strong>12</strong><span>bài hoàn thành</span></article><article><strong>86%</strong><span>mức nhớ gần đây</span></article><article><strong>24</strong><span>từ cần ôn</span></article><article><strong>7</strong><span>ngày duy trì</span></article></div></div></section>
    <section className="section-shell home-blog" aria-labelledby="latest-articles-title"><div className="home-blog-heading"><div className="section-intro"><span className="overline">LATEST ARTICLES</span><h2 id="latest-articles-title">Ghi chú kỹ thuật từ Nguyễn Ngọc Tâm</h2><p>Các phân tích thực tế về PHP, backend và hệ thống realtime từ <Link className="text-link" to="/about">Full-stack Developer Nguyễn Ngọc Tâm</Link>.</p></div><Link className="btn secondary" to="/blog">Xem toàn bộ Blog <ArrowRight/></Link></div><div className="blog-grid">{latestBlogPosts.slice(0,3).map((post) => <BlogCard key={post.slug} post={post} compact/>)}</div></section>
    <section className="section-shell section-block faq-section" aria-labelledby="faq-title"><div className="section-intro"><span className="overline">FREQUENTLY ASKED QUESTIONS</span><h2 id="faq-title">Câu hỏi thường gặp</h2></div><div className="faq-list">{faqs.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className="section-shell final-home-cta"><div><span className="overline">BẮT ĐẦU HÔM NAY</span><h2>Chọn một ngôn ngữ. Hoàn thành bài đầu tiên.</h2><p>NT giúp bạn biến mục tiêu dài hạn thành từng bước học cụ thể.</p></div><button className="btn light large" onClick={() => setOnboarding(true)}>Start Learning <ArrowRight/></button></section>
    <Modal open={onboarding} onClose={() => setOnboarding(false)} title={`Thiết lập hành trình · ${step}/4`} size="onboarding-modal">
      <div className="step-dots">{[1,2,3,4].map((item) => <span className={item <= step ? 'active' : ''} key={item}/>)}</div>
      {step === 1 && <OnboardingChoice title="Bạn muốn học ngôn ngữ nào?" options={languages.map((item) => [item.id,`${item.flag} ${item.nativeName}`,item.name])} value={form.language} onChange={(language) => setForm({ ...form, language })}/>} 
      {step === 2 && <OnboardingChoice title="Mục tiêu của bạn là gì?" options={['Du lịch','Công việc','Học tập','Giao tiếp','Thi chứng chỉ'].map((item) => [item,item,''])} value={form.goal} onChange={(goal) => setForm({ ...form, goal })}/>} 
      {step === 3 && <OnboardingChoice title="Bạn đang ở trình độ nào?" options={[["beginner",'Tôi mới bắt đầu','Đi từ nền tảng đầu tiên'],['some','Tôi biết một chút','Chọn level sau khi bắt đầu'],['test','Kiểm tra trình độ cho tôi','Làm bài đánh giá 15 câu']]} value={form.skill} onChange={(skill) => setForm({ ...form, skill })}/>} 
      {step === 4 && <OnboardingChoice title="Mục tiêu học hằng ngày" options={[[15,'Casual','15 phút/ngày'],[30,'Regular','30 phút/ngày'],[45,'Serious','45 phút/ngày'],[60,'Intense','60 phút/ngày']]} value={form.daily} onChange={(daily) => setForm({ ...form, daily })}/>} 
      <div className="modal-actions"><button className="btn ghost" onClick={() => setOnboarding(false)}>Để sau</button>{step > 1 && <button className="btn secondary" onClick={() => setStep(step - 1)}>Quay lại</button>}<button className="btn" onClick={() => step < 4 ? setStep(step + 1) : finish()}>{step < 4 ? 'Tiếp tục' : 'Bắt đầu học'} <ArrowRight size={17}/></button></div>
    </Modal>
  </>
}

function OnboardingChoice({ title, options, value, onChange }) {
  return <div className="onboarding-step"><h3>{title}</h3><div className="choice-grid">{options.map(([id,label,sub]) => <button key={id} className={value === id ? 'selected' : ''} onClick={() => onChange(id)}><span>{label}</span>{sub && <small>{sub}</small>}{value === id && <Check size={18}/>}</button>)}</div></div>
}
