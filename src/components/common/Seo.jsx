import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, getSeoForPath, SITE_NAME } from '../../data/seo'
import { AUTHOR } from '../../data/author'
import { buildStructuredData } from '../../utils/structuredData'

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) { element = document.createElement('meta'); document.head.appendChild(element) }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

const removeMeta = (selector) => document.head.querySelector(selector)?.remove()

export default function Seo() {
  const location = useLocation()
  useEffect(() => {
    const meta = getSeoForPath(location.pathname, location.search)
    const configured = String(import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')
    const siteUrl = configured || (window.location.origin.startsWith('http') ? window.location.origin : DEFAULT_SITE_URL)
    const canonical = `${siteUrl}${meta.path}`
    const image = `${siteUrl}${DEFAULT_OG_IMAGE}`
    document.title = meta.title
    upsertMeta('meta[name="description"]', { name:'description', content:meta.description })
    upsertMeta('meta[name="keywords"]', { name:'keywords', content:meta.keywords || 'Nguyễn Ngọc Tâm developer, Ngọc Tâm Dev, PHP Developer, Laravel, MongoDB, Redis, WebSocket, WebRTC' })
    upsertMeta('meta[name="robots"]', { name:'robots', content:meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
    upsertMeta('meta[name="author"]', { name:'author', content:AUTHOR.name })
    upsertMeta('meta[property="og:title"]', { property:'og:title', content:meta.ogTitle || meta.title })
    upsertMeta('meta[property="og:description"]', { property:'og:description', content:meta.description })
    upsertMeta('meta[property="og:type"]', { property:'og:type', content:meta.pageType === 'article' ? 'article' : 'website' })
    upsertMeta('meta[property="og:url"]', { property:'og:url', content:canonical })
    upsertMeta('meta[property="og:image"]', { property:'og:image', content:image })
    upsertMeta('meta[property="og:site_name"]', { property:'og:site_name', content:SITE_NAME })
    upsertMeta('meta[name="twitter:card"]', { name:'twitter:card', content:'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name:'twitter:title', content:meta.ogTitle || meta.title })
    upsertMeta('meta[name="twitter:description"]', { name:'twitter:description', content:meta.description })
    upsertMeta('meta[name="twitter:image"]', { name:'twitter:image', content:image })
    if (meta.pageType === 'article') {
      upsertMeta('meta[property="article:published_time"]', { property:'article:published_time', content:meta.article.datePublished })
      upsertMeta('meta[property="article:modified_time"]', { property:'article:modified_time', content:meta.article.dateModified })
      upsertMeta('meta[property="article:author"]', { property:'article:author', content:`${siteUrl}/about` })
    } else {
      removeMeta('meta[property="article:published_time"]')
      removeMeta('meta[property="article:modified_time"]')
      removeMeta('meta[property="article:author"]')
    }
    let canonicalTag = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalTag) { canonicalTag = document.createElement('link'); canonicalTag.rel = 'canonical'; document.head.appendChild(canonicalTag) }
    canonicalTag.href = canonical
    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
    if (verification) upsertMeta('meta[name="google-site-verification"]', { name:'google-site-verification', content:verification })
    let jsonLd = document.head.querySelector('#nt-json-ld')
    if (!jsonLd) { jsonLd = document.createElement('script'); jsonLd.type = 'application/ld+json'; jsonLd.id = 'nt-json-ld'; document.head.appendChild(jsonLd) }
    jsonLd.textContent = JSON.stringify(buildStructuredData({ siteUrl, meta, path:meta.path }))
  }, [location.pathname, location.search])
  return null
}
