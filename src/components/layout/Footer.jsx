import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'

const groups = [
  ['Languages',[['English','/learn-english'],['Chinese','/learn-chinese'],['Japanese','/learn-japanese'],['Korean','/learn-korean']]],
  ['Resources',[['Vocabulary','/english-vocabulary'],['Grammar','/english-grammar'],['TOEIC','/toeic'],['IELTS','/ielts']]],
  ['Creator',[['About Me','/about'],['Engineering Blog','/blog'],['Contact','/contact']]],
  ['Legal',[['Privacy Policy','/privacy'],['Terms of Service','/terms']]],
]

export default function Footer() {
  return <footer className="footer"><div className="footer-inner"><div className="footer-brand"><Link className="brand" to="/"><BrandLogo/><span>NT Language Learning</span></Link><p>Học ngoại ngữ theo level · TOEIC · IELTS</p><small>Được phát triển bởi <Link to="/about">Nguyễn Ngọc Tâm (Ngọc Tâm Dev)</Link>. Hồ sơ kỹ thuật và kinh nghiệm nghề nghiệp được tách riêng tại trang About.</small></div><nav className="footer-groups" aria-label="Liên kết cuối trang">{groups.map(([title,links]) => <section key={title}><h2>{title}</h2>{links.map(([label,to]) => <Link key={to} to={to}>{label}</Link>)}</section>)}</nav></div><div className="footer-bottom"><small>© 2026 NT Language Learning · Developed by Nguyễn Ngọc Tâm.</small><a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a></div></footer>
}
