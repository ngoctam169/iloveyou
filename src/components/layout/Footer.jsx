import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'

const groups = [
  ['Languages',[['English','/learn-english'],['Chinese','/learn-chinese'],['Japanese','/learn-japanese'],['Korean','/learn-korean']]],
  ['Resources',[['Vocabulary','/english-vocabulary'],['Grammar','/english-grammar'],['TOEIC','/toeic'],['IELTS','/ielts']]],
  ['Company',[['About Nguyễn Ngọc Tâm','/about'],['Blog','/blog'],['Contact','/contact']]],
  ['Legal',[['Privacy Policy','/privacy'],['Terms of Service','/terms']]],
]

export default function Footer() {
  return <footer className="footer"><div className="footer-inner"><div className="footer-brand"><Link className="brand" to="/"><BrandLogo/><span>NT</span></Link><p>Learn Languages Smarter.</p><small>Lộ trình thực tế cho tiếng Anh, Trung, Nhật và Hàn; nội dung kỹ thuật bởi Nguyễn Ngọc Tâm.</small></div><nav className="footer-groups" aria-label="Liên kết cuối trang">{groups.map(([title,links]) => <section key={title}><h2>{title}</h2>{links.map(([label,to]) => <Link key={to} to={to}>{label}</Link>)}</section>)}</nav></div><div className="footer-bottom"><small>© 2026 NT. Nội dung luyện tập không thay thế chứng chỉ chính thức.</small><a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a></div></footer>
}
