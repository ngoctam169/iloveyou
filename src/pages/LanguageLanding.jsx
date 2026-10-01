import { BookOpen, Clock3, Headphones, MessageCircle, PenLine, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import LevelCard from '../components/course/LevelCard'
import { useApp } from '../context/AppContext'
import { getRoadmap } from '../data/courses'
import { getLanguage } from '../data/languages'
import { getLevelMeta } from '../data/levels'
import { getLevelProgress } from '../utils/progress'
import { grammarPath, levelPath, vocabularyPath } from '../utils/routes'
import NotFound from './NotFound'

const landingContent = {
  english: {
    headline:'Học tiếng Anh online theo lộ trình CEFR',
    intro:'Xây nền từ A1 rồi phát triển đến C2 bằng bài học theo chủ đề. Mỗi level có khoảng 60 bài, kết hợp từ vựng, ngữ pháp và hoạt động nghe, nói, đọc, viết.',
    alphabet:'Làm quen âm, trọng âm và cách nối âm trong lời nói tự nhiên.',
    practical:'Giao tiếp trong đời sống, học tập, công việc; sau đó phát triển kỹ năng thảo luận và viết học thuật.',
    exam:'Mở rộng sang TOEIC cho môi trường công việc hoặc IELTS cho mục tiêu học thuật.',
  },
  chinese: {
    headline:'Học tiếng Trung online theo lộ trình HSK',
    intro:'Đi từ thanh điệu, chữ Hán và mẫu câu cơ bản đến đọc hiểu và giao tiếp ở cấp độ HSK cao hơn.',
    alphabet:'Luyện Pinyin, bốn thanh điệu và liên hệ giữa âm đọc với chữ Hán.',
    practical:'Tích lũy từ theo chủ đề, học trật tự câu và phản xạ trong các tình huống thường gặp.',
    exam:'Mỗi level HSK có nhóm từ vựng và ngữ pháp riêng để dễ chọn phần cần học.',
  },
  japanese: {
    headline:'Học tiếng Nhật online từ JLPT N5 đến N1',
    intro:'Học hệ chữ, từ vựng và mẫu câu theo JLPT, kèm bài đọc và hội thoại.',
    alphabet:'Bắt đầu với Hiragana, Katakana; mở rộng Kanji theo từng cấp độ.',
    practical:'Luyện mẫu câu, trợ từ và cách nói theo từng tình huống.',
    exam:'Mục tiêu JLPT giúp tổ chức kiến thức từ N5 nền tảng đến N1 nâng cao.',
  },
  korean: {
    headline:'Học tiếng Hàn online theo lộ trình TOPIK',
    intro:'Bắt đầu từ Hangeul, phát âm và cấu trúc câu rồi phát triển vốn từ, đọc hiểu và diễn đạt theo từng level TOPIK.',
    alphabet:'Đọc và ghép âm Hangeul, luyện 받침 và các biến âm phổ biến.',
    practical:'Học kính ngữ, đuôi câu và từ vựng cho sinh hoạt, học tập và công việc.',
    exam:'Chia lộ trình theo TOPIK để theo dõi rõ vốn từ và cấu trúc cần đạt.',
  },
}

export default function LanguageLanding({ languageId }) {
  const language = getLanguage(languageId)
  const content = landingContent[languageId]
  const { state } = useApp()
  if (!language || !content) return <NotFound compact/>
  const firstLevel = language.levels[0][0]
  return <div className="inner-page section-shell seo-landing">
    <Breadcrumbs items={[{ label:'Trang chủ', to:'/' }, { label:'Ngôn ngữ', to:'/languages' }, { label:language.name }]}/>
    <header className="seo-hero" style={{ '--accent':language.color }}>
      <div><span className="overline">{language.framework} LEARNING PATH</span><h1>{content.headline}</h1><p>{content.intro}</p><div className="hero-actions"><Link className="btn large" to={levelPath(language.id, firstLevel)}>Bắt đầu với {firstLevel}</Link><Link className="btn secondary large" to={vocabularyPath(language.id, firstLevel)}>Xem từ vựng</Link></div></div>
      <div className="seo-hero-badge" aria-hidden="true"><span>{language.flag}</span><strong>{language.framework}</strong><small>{language.levels.length} cấp độ</small></div>
    </header>
    <section className="content-section" aria-labelledby={`${language.id}-method`}><div className="section-intro left"><span className="overline">NỘI DUNG HỌC</span><h2 id={`${language.id}-method`}>Mỗi level có gì?</h2><p>Từ phát âm, từ vựng đến bài luyện đều nằm ngay trong level.</p></div><div className="content-card-grid three"><article><BookOpen/><h3>Nền tảng chữ và âm</h3><p>{content.alphabet}</p></article><article><MessageCircle/><h3>Giao tiếp thực tế</h3><p>{content.practical}</p></article><article><Target/><h3>Mục tiêu cấp độ</h3><p>{content.exam}</p></article></div></section>
    <section className="content-section" aria-labelledby={`${language.id}-levels`}><div className="section-intro left"><span className="overline">CẤP ĐỘ</span><h2 id={`${language.id}-levels`}>Chọn level phù hợp</h2><p>Mở level nào cũng được. Mỗi level có khoảng 60 bài, chia theo unit và có thời lượng gợi ý.</p></div><div className="level-grid">{language.levels.map((level) => <LevelCard language={language} level={level} roadmap={getRoadmap(language.id, level[0])} progress={getLevelProgress(state, language.id, level[0])} meta={getLevelMeta(language.id, level[0])} key={level[0]}/>)}</div></section>
    <section className="content-section"><div className="section-intro left"><span className="overline">BỐN KỸ NĂNG</span><h2>Nghe, nói, đọc, viết trong cùng level</h2></div><div className="skill-content-grid"><article><Headphones/><div><h3>Listening & Speaking</h3><p>Nghe câu mẫu, chỉnh tốc độ và đọc theo.</p></div></article><article><BookOpen/><div><h3>Reading</h3><p>Đọc đoạn văn theo chủ đề, mở nghĩa từ trong ngữ cảnh và trả lời câu hỏi kiểm tra ý chính.</p></div></article><article><PenLine/><div><h3>Writing</h3><p>Viết từ câu ngắn đến đoạn hoàn chỉnh với yêu cầu rõ ràng và checklist tự rà soát.</p></div></article><article><Clock3/><div><h3>Ôn tập có lịch</h3><p>Flashcard và lịch ôn giúp tập trung vào từ đến hạn, từ yếu và lỗi vừa gặp.</p></div></article></div></section>
    <section className="seo-final-cta"><h2>Sẵn sàng bắt đầu {language.name}?</h2><p>Mở level đầu tiên hoặc xem trước kho kiến thức của khóa học.</p><div><Link className="btn light" to={levelPath(language.id, firstLevel)}>Học {firstLevel}</Link><Link className="btn secondary" to={grammarPath(language.id, firstLevel)}>Ngữ pháp {firstLevel}</Link></div></section>
  </div>
}

