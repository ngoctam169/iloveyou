import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, getSeoForPath, SITE_NAME } from '../../data/seo'

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) { element = document.createElement('meta'); document.head.appendChild(element) }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

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
    upsertMeta('meta[name="keywords"]', { name:'keywords', content:meta.keywords || 'học ngôn ngữ online, từ vựng, ngữ pháp, luyện nghe nói đọc viết' })
    upsertMeta('meta[name="robots"]', { name:'robots', content:'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
    upsertMeta('meta[property="og:title"]', { property:'og:title', content:meta.title })
    upsertMeta('meta[property="og:description"]', { property:'og:description', content:meta.description })
    upsertMeta('meta[property="og:type"]', { property:'og:type', content:'website' })
    upsertMeta('meta[property="og:url"]', { property:'og:url', content:canonical })
    upsertMeta('meta[property="og:image"]', { property:'og:image', content:image })
    upsertMeta('meta[property="og:site_name"]', { property:'og:site_name', content:SITE_NAME })
    upsertMeta('meta[name="twitter:card"]', { name:'twitter:card', content:'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name:'twitter:title', content:meta.title })
    upsertMeta('meta[name="twitter:description"]', { name:'twitter:description', content:meta.description })
    upsertMeta('meta[name="twitter:image"]', { name:'twitter:image', content:image })
    let canonicalTag = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalTag) { canonicalTag = document.createElement('link'); canonicalTag.rel = 'canonical'; document.head.appendChild(canonicalTag) }
    canonicalTag.href = canonical
    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
    if (verification) upsertMeta('meta[name="google-site-verification"]', { name:'google-site-verification', content:verification })
    let jsonLd = document.head.querySelector('#nt-json-ld')
    if (!jsonLd) { jsonLd = document.createElement('script'); jsonLd.type = 'application/ld+json'; jsonLd.id = 'nt-json-ld'; document.head.appendChild(jsonLd) }
    const graph = [{ '@type':'WebSite', '@id':`${siteUrl}/#website`, url:`${siteUrl}/`, name:SITE_NAME, inLanguage:['vi','en'], potentialAction:{ '@type':'SearchAction', target:`${siteUrl}/search?q={search_term_string}`, 'query-input':'required name=search_term_string' } }, { '@type':'EducationalOrganization', '@id':`${siteUrl}/#organization`, name:SITE_NAME, url:`${siteUrl}/`, logo:`${siteUrl}/icon-512.png` }]
    if (meta.path !== '/') graph.push({ '@type':'WebPage', '@id':`${canonical}#webpage`, url:canonical, name:meta.title, description:meta.description, isPartOf:{ '@id':`${siteUrl}/#website` }, inLanguage:'vi' })
    jsonLd.textContent = JSON.stringify({ '@context':'https://schema.org', '@graph':graph })
  }, [location.pathname, location.search])
  return null
}

