import { BarChart3, BookOpen, ChevronDown, Flame, Home, Languages, Menu, RotateCcw, Search, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import BrandLogo from '../common/BrandLogo'

const learnItems = [
  ['/languages','Tất cả ngôn ngữ'],
  ['/learn-english','English'],
  ['/learn-chinese','Chinese'],
  ['/learn-japanese','Japanese'],
  ['/learn-korean','Korean'],
  ['/vocabulary','Vocabulary'],
  ['/grammar','Grammar'],
  ['/my-vocabulary','My Vocabulary'],
]

const practiceItems = [
  ['/self-study','Practice Lab'],
  ['/review','Review'],
  ['/flashcards','Flashcards'],
  ['/mistakes','Mistakes'],
  ['/mock-tests','Mock Tests'],
]

const examItems = [
  ['/toeic','TOEIC'],
  ['/ielts','IELTS'],
]

const moreItems = [
  ['/progress','Progress'],
  ['/history','History'],
  ['/saved','Saved'],
  ['/blog','Blog'],
  ['/about','About'],
  ['/contact','Contact'],
  ['/settings','Settings'],
]

const desktopItems = [
  { to:'/dashboard', label:'Dashboard' },
  { label:'Học', items:learnItems },
  { label:'Luyện tập', items:practiceItems },
  { label:'Kỳ thi', items:examItems },
  { label:'Thêm', items:moreItems },
]

const mobileSections = [
  ['Học',learnItems],
  ['Luyện tập',practiceItems],
  ['Kỳ thi',examItems],
  ['Khác',moreItems],
]

function pathActive(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function Header() {
  const { state } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const navRef = useRef(null)
  const location = useLocation()
  const publicLanding = location.pathname === '/' || location.pathname.startsWith('/learn-') || location.pathname.startsWith('/blog') || ['/languages','/english-vocabulary','/english-grammar','/about','/contact','/privacy','/terms'].includes(location.pathname)
  const initials = String(state.profile.displayName || 'Learner').split(' ').filter(Boolean).map((part) => part[0]).slice(-2).join('').toUpperCase()

  useEffect(() => {
    setMenuOpen(false)
    setOpenGroup(null)
  }, [location.pathname])

  useEffect(() => {
    const close = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setOpenGroup(null)
    }
    const escape = (event) => {
      if (event.key === 'Escape') setOpenGroup(null)
    }
    document.addEventListener('pointerdown',close)
    document.addEventListener('keydown',escape)
    return () => {
      document.removeEventListener('pointerdown',close)
      document.removeEventListener('keydown',escape)
    }
  }, [])

  return <>
    <header className="site-header stable-header">
      <Link className="brand" to="/" aria-label="NT Language Learning - Trang chủ"><BrandLogo compact/><span>NT</span></Link>

      <nav className="desktop-nav" aria-label="Điều hướng chính" ref={navRef}>
        {desktopItems.map((item) => item.to
          ? <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
          : <div className={`nav-group ${item.items.some(([to]) => pathActive(location.pathname,to)) ? 'active' : ''} ${openGroup === item.label ? 'open' : ''}`} key={item.label}>
              <button className="nav-group-button" type="button" aria-expanded={openGroup === item.label} onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}>
                {item.label}<ChevronDown/>
              </button>
              {openGroup === item.label && <div className="nav-popover" role="menu">
                {item.items.map(([to,label]) => <NavLink role="menuitem" key={to} to={to}>{label}</NavLink>)}
              </div>}
            </div>
        )}
      </nav>

      <div className="header-actions">
        <Link className="icon-btn search-link" to="/search" aria-label="Tìm kiếm"><Search size={19}/></Link>
        <div className="header-session-slot">
          {publicLanding
            ? <Link to="/languages" className="btn small">Start Learning</Link>
            : <><span className="stat-chip flame"><Flame size={17}/>{state.streak}</span><span className="stat-chip"><Star size={17}/>{state.xp.toLocaleString()} XP</span><Link className="avatar small-avatar" to="/profile" aria-label="Hồ sơ">{initials}</Link></>}
        </div>
        <button className="icon-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    {menuOpen && <nav className="mobile-menu grouped-mobile-menu" id="mobile-menu" aria-label="Điều hướng di động">
      <Link className="mobile-dashboard-link" to="/dashboard">Dashboard</Link>
      {mobileSections.map(([title,items]) => <section key={title}>
        <strong>{title}</strong>
        <div>{items.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</div>
      </section>)}
    </nav>}

    {!publicLanding && <nav className="bottom-nav" aria-label="Điều hướng ứng dụng">
      <NavLink to="/dashboard"><Home/>Home</NavLink>
      <NavLink to="/languages"><Languages/>Learn</NavLink>
      <NavLink to="/vocabulary"><BookOpen/>Words</NavLink>
      <NavLink to="/review"><RotateCcw/>Review</NavLink>
      <NavLink to="/progress"><BarChart3/>Stats</NavLink>
    </nav>}
  </>
}
