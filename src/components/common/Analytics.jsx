import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Analytics() {
  const location = useLocation()
  const id = import.meta.env.VITE_GA_ID
  useEffect(() => {
    if (!id || document.querySelector(`script[data-ga-id="${id}"]`)) return
    const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`; script.dataset.gaId = id; document.head.appendChild(script)
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args) => window.dataLayer.push(args)
    window.gtag('js', new Date()); window.gtag('config', id, { send_page_view:false })
  }, [id])
  useEffect(() => { if (id && window.gtag) window.gtag('event', 'page_view', { page_path:`${location.pathname}${location.search}`, page_title:document.title }) }, [id, location.pathname, location.search])
  return null
}
