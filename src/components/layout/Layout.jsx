import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from '../common/Toast'

export default function Layout() {
  const location = useLocation()
  const focusedLesson = /\/lessons\//.test(location.pathname)

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top:0, behavior:'auto' })
      return undefined
    }

    const id = decodeURIComponent(location.hash.slice(1))
    let frame = 0
    let attempts = 0
    const scrollWhenReady = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior:'smooth', block:'start' })
        return
      }
      attempts += 1
      if (attempts < 180) frame = window.requestAnimationFrame(scrollWhenReady)
    }
    scrollWhenReady()
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return <div className="app-shell"><Header /><main className="page" key={location.pathname}><Outlet /></main>{!focusedLesson && <Footer />}<Toast /></div>
}
