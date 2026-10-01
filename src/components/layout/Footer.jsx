import { Link } from 'react-router-dom'

const primaryLinks = [
  ['Languages','/languages'],
  ['Practice','/self-study'],
  ['TOEIC','/toeic'],
  ['IELTS','/ielts'],
  ['Blog','/blog'],
  ['About Me','/about'],
]

export default function Footer() {
  return <footer className="footer editorial-footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <Link className="brand editorial-wordmark" to="/">NT Learning</Link>
        <p>Language learning · TOEIC · IELTS</p>
        <small>Mình xây NT Language Learning như một project học ngoại ngữ có thể dùng thật.</small>
      </div>

      <nav className="editorial-footer-nav" aria-label="Liên kết cuối trang">
        {primaryLinks.map(([label,to]) => <Link key={to} to={to}>{label}</Link>)}
      </nav>
    </div>

    <div className="footer-bottom">
      <small>© 2026 Nguyễn Ngọc Tâm · Full-stack Developer</small>
      <div>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a>
      </div>
    </div>
  </footer>
}
