import { BarChart3, BookOpen, Flame, Home, Languages, Menu, RotateCcw, Search, Star, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import BrandLogo from '../common/BrandLogo'

export default function Header() {
  const { state } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const personalPage = location.pathname === '/' || location.pathname.startsWith('/blog') || ['/about','/contact','/privacy','/terms'].includes(location.pathname)
  const initials = String(state.profile.displayName || 'Learner').split(' ').filter(Boolean).map((part) => part[0]).slice(-2).join('').toUpperCase()
  useEffect(() => setMenuOpen(false), [location.pathname])

  const appNav = [['/dashboard','Dashboard'],['/languages','Learn'],['/vocabulary','Vocabulary'],['/grammar','Grammar'],['/self-study','Practice Lab'],['/toeic','TOEIC'],['/ielts','IELTS'],['/review','Review'],['/blog','Blog']]
  const personalNav = [['/about','About'],['/blog','Technical Blog'],['/languages','Language Lab']]
  const mobileNav = personalPage ? personalNav : [...appNav,['/my-vocabulary','My Vocabulary'],['/progress','Statistics'],['/history','Lịch sử'],['/settings','Cài đặt']]

  return <>
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Ngọc Tâm Dev - Trang chủ"><BrandLogo compact/><span>Ngọc Tâm Dev</span></Link>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{(personalPage ? personalNav : appNav).map(([to,label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <div className="header-actions">
        {!personalPage && <Link className="icon-btn search-link" to="/search" aria-label="Tìm kiếm"><Search size={19}/></Link>}
        {!personalPage && <><span className="stat-chip flame"><Flame size={17}/>{state.streak}</span><span className="stat-chip"><Star size={17}/>{state.xp.toLocaleString()} XP</span></>}
        {personalPage ? <Link to="/about" className="btn small">About me</Link> : <Link className="avatar small-avatar" to="/profile" aria-label="Hồ sơ">{initials}</Link>}
        <button className="icon-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>
    {menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Điều hướng di động">{mobileNav.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</nav>}
    {!personalPage && <nav className="bottom-nav" aria-label="Điều hướng ứng dụng"><NavLink to="/dashboard"><Home/>Home</NavLink><NavLink to="/languages"><Languages/>Learn</NavLink><NavLink to="/vocabulary"><BookOpen/>Words</NavLink><NavLink to="/review"><RotateCcw/>Review</NavLink><NavLink to="/progress"><BarChart3/>Stats</NavLink></nav>}
  </>
}
