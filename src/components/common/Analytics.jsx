import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Analytics() {
  const location = useLocation()
  const id = import.meta.env.VITE_GA_ID?.trim()

  useEffect(() => {
    if (!id || typeof window.gtag !== 'function') return

    window.gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [id, location.pathname, location.search])

  return null
}
