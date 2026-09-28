import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'

const groups = [
  ['Nguyễn Ngọc Tâm',[['About','/about'],['Technical Blog','/blog'],['Contact','/contact']]],
  ['Expertise',[['PHP & Backend','/about#skills-title'],['Realtime Systems','/about#projects-title'],['Engineering Notes','/blog']]],
  ['Side Project',[['Language Learning Lab','/languages'],['English','/learn-english'],['TOEIC','/toeic']]],
  ['Legal',[['Privacy Policy','/privacy'],['Terms of Service','/terms']]],
]

export default function Footer() {
  return <footer className="footer"><div className="footer-inner"><div className="footer-brand"><Link className="brand" to="/"><BrandLogo/><span>Ngọc Tâm Dev</span></Link><p>Nguyễn Ngọc Tâm · Full-stack Developer.</p><small>PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC và các hệ thống backend/realtime.</small></div><nav className="footer-groups" aria-label="Liên kết cuối trang">{groups.map(([title,links]) => <section key={title}><h2>{title}</h2>{links.map(([label,to]) => <Link key={to} to={to}>{label}</Link>)}</section>)}</nav></div><div className="footer-bottom"><small>© 2026 Nguyễn Ngọc Tâm · Ngọc Tâm Dev.</small><a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a></div></footer>
}
