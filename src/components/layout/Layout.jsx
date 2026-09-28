import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from '../common/Toast'

export default function Layout() {
  const location = useLocation()
  const focusedLesson = /\/lessons\//.test(location.pathname)

  useEffect(() => {
    const scroll = () => {
      if (location.hash) {
        const id = decodeURIComponent(location.hash.slice(1))
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ behavior:'smooth', block:'start' })
          return true
        }
        return false
      }
      window.scrollTo({ top:0, behavior:'auto' })
      return true
    }

    if (scroll()) return undefined
    const frame = window.requestAnimationFrame(scroll)
    const timer = window.setTimeout(scroll,120)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [location.pathname, location.hash])

  return <div className="app-shell"><Header /><main className="page" key={location.pathname}><Outlet /></main>{!focusedLesson && <Footer />}<Toast /></div>
}
