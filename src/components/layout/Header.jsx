import { ChevronDown, ClipboardCheck, Home, Languages, Menu, MoreHorizontal, RotateCcw, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { trackEvent } from '../../utils/analytics'

const languageItems = [
  ['/learn-english','Tiếng Anh','A1 → C2'],
  ['/learn-chinese','Tiếng Trung','HSK 1 → 6'],
  ['/learn-japanese','Tiếng Nhật','N5 → N1'],
  ['/learn-korean','Tiếng Hàn','TOPIK 1 → 6'],
]

const learningTools = [
  ['/vocabulary','Từ vựng'],
  ['/grammar','Ngữ pháp'],
  ['/my-vocabulary','Từ của tôi'],
]

const practiceItems = [
  ['/review','Ôn tập hôm nay'],
  ['/flashcards','Flashcards'],
  ['/mistakes','Sổ lỗi sai'],
  ['/self-study','Tự luyện'],
]

const examItems = [
  ['/toeic','TOEIC'],
  ['/ielts','IELTS'],
]

const accountItems = [
  ['/progress','Tiến độ học'],
  ['/saved','Nội dung đã lưu'],
  ['/settings','Cài đặt'],
  ['/contact','Liên hệ'],
]

const pathActive = (pathname, to) => to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`)
const learningPathActive = (pathname) => (
  pathname === '/languages'
  || pathname.startsWith('/learn-')
  || /^\/(english|chinese|japanese|korean)(\/|$)/.test(pathname)
  || ['/vocabulary','/grammar','/my-vocabulary'].some((to) => pathActive(pathname,to))
)
const practicePathActive = (pathname) => practiceItems.some(([to]) => pathActive(pathname,to))
const examPathActive = (pathname) => examItems.some(([to]) => pathActive(pathname,to))
const accountPathActive = (pathname) => accountItems.some(([to]) => pathActive(pathname,to))

export default function Header() {
  const { state } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState('all')
  const [openGroup, setOpenGroup] = useState(null)
  const headerRef = useRef(null)
  const location = useLocation()
  const publicLanding = location.pathname === '/' || location.pathname.startsWith('/learn-') || location.pathname.startsWith('/blog') || ['/languages','/english-vocabulary','/english-grammar','/about','/contact','/privacy','/terms'].includes(location.pathname)
  const initials = String(state.profile.displayName || 'Learner').split(' ').filter(Boolean).map((part) => part[0]).slice(-2).join('').toUpperCase()
  const profileName = String(state.profile.displayName || 'Người học').trim()
  const brandTarget = publicLanding ? '/' : '/dashboard'

  useEffect(() => {
    setMenuOpen(false)
    setOpenGroup(null)
    setMobilePanel('all')
  }, [location.pathname])

  useEffect(() => {
    const close = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setOpenGroup(null)
    }
    const escape = (event) => {
      if (event.key === 'Escape') {
        setOpenGroup(null)
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown',close)
    document.addEventListener('keydown',escape)
    return () => {
      document.removeEventListener('pointerdown',close)
      document.removeEventListener('keydown',escape)
    }
  }, [])

  const toggleGroup = (group) => setOpenGroup(openGroup === group ? null : group)
  const toggleMobilePanel = (panel) => {
    if (menuOpen && mobilePanel === panel) {
      setMenuOpen(false)
      return
    }
    setMobilePanel(panel)
    setMenuOpen(true)
  }

  return <>
    <header className="site-header stable-header editorial-global-header" ref={headerRef}>
      <Link className="brand editorial-wordmark" to={brandTarget} aria-label={publicLanding ? 'NT Learning - Trang chủ' : 'NT Learning - Hôm nay'}><span>NT Learning</span></Link>

      <nav className="desktop-nav simplified-desktop-nav" aria-label="Điều hướng chính">
        <div className={`nav-group ${learningPathActive(location.pathname) ? 'active' : ''} ${openGroup === 'learn' ? 'open' : ''}`}>
          <button className="nav-group-button" type="button" aria-haspopup="menu" aria-expanded={openGroup === 'learn'} onClick={() => toggleGroup('learn')}>
            Học<ChevronDown/>
          </button>
          {openGroup === 'learn' && <div className="nav-popover learning-nav-popover" role="menu">
            <div className="nav-popover-section" role="none">
              <div className="nav-popover-heading"><strong>Chọn ngôn ngữ</strong><Link role="menuitem" to="/languages">Xem tất cả</Link></div>
              <div className="nav-language-grid">
                {languageItems.map(([to,label,level]) => <NavLink role="menuitem" key={to} to={to} onClick={() => trackEvent('select_language', { language:to.replace('/learn-',''), source:'header_menu' })}><span>{label}</span><small>{level}</small></NavLink>)}
              </div>
            </div>
            <div className="nav-popover-section nav-learning-tools" role="none">
              {learningTools.map(([to,label]) => <NavLink role="menuitem" key={to} to={to}>{label}</NavLink>)}
            </div>
          </div>}
        </div>

        <div className={`nav-group ${practicePathActive(location.pathname) ? 'active' : ''} ${openGroup === 'practice' ? 'open' : ''}`}>
          <button className="nav-group-button" type="button" aria-haspopup="menu" aria-expanded={openGroup === 'practice'} onClick={() => toggleGroup('practice')}>
            Luyện tập<ChevronDown/>
          </button>
          {openGroup === 'practice' && <div className="nav-popover" role="menu">
            {practiceItems.map(([to,label]) => <NavLink role="menuitem" key={to} to={to}>{label}</NavLink>)}
          </div>}
        </div>

        <div className={`nav-group ${examPathActive(location.pathname) ? 'active' : ''} ${openGroup === 'exam' ? 'open' : ''}`}>
          <button className="nav-group-button" type="button" aria-haspopup="menu" aria-expanded={openGroup === 'exam'} onClick={() => toggleGroup('exam')}>
            Thi thử<ChevronDown/>
          </button>
          {openGroup === 'exam' && <div className="nav-popover" role="menu">
            {examItems.map(([to,label]) => <NavLink role="menuitem" key={to} to={to}>{label}</NavLink>)}
          </div>}
        </div>

        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/about">About Me</NavLink>
      </nav>

      <div className="header-actions">
        <Link className="icon-btn search-link" to="/search" aria-label="Tìm kiếm"><Search size={19}/></Link>
        <div className="header-session-slot">
          {publicLanding
            ? <Link to="/languages" className="btn small header-start-learning">Bắt đầu học</Link>
            : <div className={`account-menu-wrap ${accountPathActive(location.pathname) ? 'active' : ''}`}>
                <button className="avatar small-avatar account-button" type="button" aria-label="Mở menu tài khoản" aria-haspopup="menu" aria-expanded={openGroup === 'account'} onClick={() => toggleGroup('account')}>{initials}</button>
                {openGroup === 'account' && <div className="nav-popover account-popover" role="menu">
                  <div className="account-popover-head" role="none"><strong>{profileName}</strong><small>Tài khoản học tập</small></div>
                  {accountItems.map(([to,label]) => <NavLink role="menuitem" key={to} to={to}>{label}</NavLink>)}
                </div>}
              </div>}
        </div>
        <button className={`icon-btn menu-toggle ${publicLanding ? '' : 'app-menu-toggle'}`} onClick={() => toggleMobilePanel(publicLanding ? 'all' : 'more')} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    {menuOpen && <nav className="mobile-menu grouped-mobile-menu simplified-mobile-menu" id="mobile-menu" aria-label="Điều hướng di động">
      <button className="mobile-menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng menu"><X size={18}/></button>

      {mobilePanel === 'exams' ? <section className="mobile-focus-panel">
        <strong>Thi thử</strong>
        <div>{examItems.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</div>
      </section> : mobilePanel === 'more' ? <>
        <section>
          <strong>Cá nhân</strong>
          <div>
            <Link to="/my-vocabulary">Từ của tôi</Link>
            <Link to="/progress">Tiến độ học</Link>
            <Link to="/saved">Nội dung đã lưu</Link>
            <Link to="/search">Tìm kiếm</Link>
          </div>
        </section>
        <section>
          <strong>Thông tin</strong>
          <div>
            <Link to="/blog">Blog</Link>
            <Link to="/about">About Me</Link>
            <Link to="/settings">Cài đặt</Link>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </section>
      </> : <>
        <section>
          <strong>Học</strong>
          <div>
            <Link to="/languages">Chọn ngôn ngữ</Link>
            <Link to="/vocabulary">Từ vựng</Link>
            <Link to="/grammar">Ngữ pháp</Link>
            <Link to="/my-vocabulary">Từ của tôi</Link>
          </div>
        </section>
        <section>
          <strong>Luyện tập</strong>
          <div>{practiceItems.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</div>
        </section>
        <section>
          <strong>Thi thử</strong>
          <div>{examItems.map(([to,label]) => <Link key={to} to={to}>{label}</Link>)}</div>
        </section>
        <section>
          <strong>Khác</strong>
          <div>
            <Link to="/blog">Blog</Link>
            <Link to="/about">About Me</Link>
            <Link to="/search">Tìm kiếm</Link>
            <Link to="/settings">Cài đặt</Link>
          </div>
        </section>
      </>}
    </nav>}

    {!publicLanding && <nav className="bottom-nav simplified-bottom-nav" aria-label="Điều hướng ứng dụng">
      <NavLink to="/dashboard"><Home/>Hôm nay</NavLink>
      <NavLink to="/languages"><Languages/>Học</NavLink>
      <NavLink to="/review"><RotateCcw/>Ôn tập</NavLink>
      <button type="button" className={examPathActive(location.pathname) ? 'active' : ''} onClick={() => toggleMobilePanel('exams')} aria-expanded={menuOpen && mobilePanel === 'exams'}><ClipboardCheck/>Thi thử</button>
      <button type="button" className={accountPathActive(location.pathname) || ['/blog','/about','/my-vocabulary'].some((to) => pathActive(location.pathname,to)) ? 'active' : ''} onClick={() => toggleMobilePanel('more')} aria-expanded={menuOpen && mobilePanel === 'more'}><MoreHorizontal/>Thêm</button>
    </nav>}
  </>
}
