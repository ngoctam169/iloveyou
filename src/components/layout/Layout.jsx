import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from '../common/Toast'

export default function Layout() {
  const location = useLocation()
  const focusedLesson = /\/lessons\//.test(location.pathname)
  return <div className="app-shell"><Header /><main className="page" key={location.pathname}><Outlet /></main>{!focusedLesson && <Footer />}<Toast /></div>
}
