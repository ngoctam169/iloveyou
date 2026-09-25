import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getLesson, getRoadmap } from '../src/data/courses.js'
import { grammarEntries } from '../src/data/grammar.js'
import { findLevel, getLanguage, languages, levelSlug } from '../src/data/languages.js'
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, getSeoForPath, publicSeoPaths, SITE_NAME } from '../src/data/seo.js'
import { vocabularyCatalog } from '../src/data/vocabulary/catalog.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const configuredUrl = String(process.env.VITE_SITE_URL || process.env.SITE_URL || '').trim().replace(/\/$/, '')
const siteUrl = /^https?:\/\//.test(configuredUrl) ? configuredUrl : DEFAULT_SITE_URL
if (!configuredUrl) console.warn(`VITE_SITE_URL is not set; SEO files use ${DEFAULT_SITE_URL}. Set it for the production build.`)

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]))
const stripTags = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const lessonRoutes = languages.flatMap((language) => language.levels.flatMap(([level]) => getRoadmap(language.id, level).flatMap((unit) => unit.lessons.map((lesson) => ({ path:`/${language.id}/${levelSlug(level)}/lessons/${lesson.id}`, language, level, unit, lesson })))))
const routes = [...new Set([...publicSeoPaths(), ...lessonRoutes.map((item) => item.path)])]

function replaceMeta(html, selector, content) {
  const escaped = escapeHtml(content)
  const expression = new RegExp(`<meta\\s+([^>]*${selector}[^>]*)content="[^"]*"([^>]*)>`, 'i')
  return html.replace(expression, (_match, before, after) => `<meta ${before}content="${escaped}"${after}>`)
}

function structuredData(meta, path, breadcrumbs = []) {
  const canonical = `${siteUrl}${path}`
  const graph = [
    { '@type':'WebSite', '@id':`${siteUrl}/#website`, url:`${siteUrl}/`, name:SITE_NAME, inLanguage:['vi','en'], potentialAction:{ '@type':'SearchAction', target:`${siteUrl}/search?q={search_term_string}`, 'query-input':'required name=search_term_string' } },
    { '@type':'EducationalOrganization', '@id':`${siteUrl}/#organization`, name:SITE_NAME, url:`${siteUrl}/`, logo:`${siteUrl}/icon-512.png` },
    { '@type':'WebPage', '@id':`${canonical}#webpage`, url:canonical, name:meta.title, description:meta.description, isPartOf:{ '@id':`${siteUrl}/#website` }, inLanguage:'vi' },
  ]
  if (breadcrumbs.length > 1) graph.push({ '@type':'BreadcrumbList', itemListElement:breadcrumbs.map((item,index) => ({ '@type':'ListItem', position:index + 1, name:item.name, item:`${siteUrl}${item.path}` })) })
  if (path === '/') graph.push({ '@type':'FAQPage', mainEntity:[
    ['NT có phù hợp với người mới bắt đầu không?','Có. Mỗi ngôn ngữ có một level nền tảng và toàn bộ level đều có thể mở.'],
    ['Tôi có cần tạo tài khoản không?','Không. Tiến độ học của phiên bản hiện tại được lưu trong trình duyệt.'],
    ['NT có nội dung TOEIC và IELTS không?','Có. NT có khu luyện TOEIC Listening và Reading cùng IELTS bốn kỹ năng.'],
  ].map(([name,text]) => ({ '@type':'Question', name, acceptedAnswer:{ '@type':'Answer', text } })) })
  if (/^\/(english|chinese|japanese|korean)\/[^/]+$/.test(path)) graph.push({ '@type':'Course', name:meta.title.replace(' | NT',''), description:meta.description, provider:{ '@id':`${siteUrl}/#organization` }, url:canonical, inLanguage:'vi' })
  return JSON.stringify({ '@context':'https://schema.org', '@graph':graph }).replace(/</g, '\\u003c')
}

function pageContext(path) {
  const lessonRoute = lessonRoutes.find((item) => item.path === path)
  if (lessonRoute) return { lessonRoute, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:lessonRoute.language.name,path:`/learn-${lessonRoute.language.id}` },{ name:lessonRoute.level,path:`/${lessonRoute.language.id}/${levelSlug(lessonRoute.level)}` },{ name:lessonRoute.lesson.title,path }] }
  const match = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)(?:\/(vocabulary|grammar))?$/)
  if (match) {
    const language=getLanguage(match[1]); const level=findLevel(language,match[2])?.[0]; const resource=match[3]
    return { language, level, resource, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:language.name,path:`/learn-${language.id}` },{ name:level,path:`/${language.id}/${levelSlug(level)}` },...(resource ? [{ name:resource === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp',path }] : [])] }
  }
  const landing = path.match(/^\/learn-(english|chinese|japanese|korean)$/)
  if (landing) { const language=getLanguage(landing[1]); return { language, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:language.name,path }] } }
  return { breadcrumbs:path === '/' ? [{ name:'Trang chủ',path:'/' }] : [{ name:'Trang chủ',path:'/' },{ name:getSeoForPath(path).title.split('|')[0].trim(),path }] }
}

function staticBody(path, meta, context) {
  const breadcrumb = context.breadcrumbs.map((item,index) => `${index ? '<span>›</span>' : ''}<a href="${item.path}">${escapeHtml(item.name)}</a>`).join('')
  let content = ''
  if (path === '/') content = `<section><h2>Languages</h2>${languages.map((language) => `<article><h3><a href="/learn-${language.id}">${escapeHtml(language.name)}</a></h3><p>${escapeHtml(language.description)} Lộ trình ${escapeHtml(language.framework)} có ${language.levels.length} cấp độ.</p></article>`).join('')}</section><section><h2>Vocabulary, Grammar and Four Skills</h2><p>NT kết nối từ vựng, ngữ pháp, listening, speaking, reading và writing trong từng bài học. Flashcard ưu tiên từ đến hạn và từ còn yếu.</p><p><a href="/english-vocabulary">English Vocabulary</a> · <a href="/english-grammar">English Grammar</a> · <a href="/toeic">TOEIC</a> · <a href="/ielts">IELTS</a></p></section><section><h2>Câu hỏi thường gặp</h2><h3>Người mới bắt đầu học từ đâu?</h3><p>Chọn level đầu tiên của ngôn ngữ hoặc làm bài kiểm tra trình độ.</p><h3>Có cần tài khoản không?</h3><p>Không. Tiến độ của phiên bản hiện tại lưu trong trình duyệt.</p></section>`
  else if (context.lessonRoute) {
    const { language,level,lesson }=context.lessonRoute
    content=`<section><h2>Mục tiêu bài học</h2><p>${escapeHtml(lesson.detailedExplanation || `Học từ vựng và ngữ pháp của chủ đề ${lesson.topic || lesson.title}.`)}</p><ul>${(lesson.objectives || [`Nhận biết ${lesson.vocab.length} từ mới.`,`Vận dụng ${lesson.grammar.name}.`]).map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section><h2>Vocabulary</h2>${lesson.vocab.map((word)=>`<article><h3>${escapeHtml(word[0])}</h3><p>${escapeHtml(word[1])} · ${escapeHtml(word[2])} · ${escapeHtml(word[3])}</p><p>${escapeHtml(word[4])} ${escapeHtml(word[5])}</p></article>`).join('')}</section><section><h2>Grammar: ${escapeHtml(lesson.grammar.name)}</h2><p>${escapeHtml(lesson.grammar.explanation)}</p><p><strong>Cấu trúc:</strong> ${escapeHtml(lesson.grammar.structure)}</p></section><nav aria-label="Tài nguyên liên quan"><a href="/${language.id}/${levelSlug(level)}/vocabulary">Từ vựng ${escapeHtml(level)}</a> <a href="/${language.id}/${levelSlug(level)}/grammar">Ngữ pháp ${escapeHtml(level)}</a></nav>`
  } else if (context.language && context.level && context.resource === 'vocabulary') {
    const words=vocabularyCatalog.filter((word)=>word.languageId===context.language.id&&word.level===context.level).slice(0,24)
    content=`<section><h2>Danh sách từ ${escapeHtml(context.level)}</h2><p>Mỗi từ có cấp độ, chủ đề, nghĩa và câu ví dụ để học trong ngữ cảnh.</p>${words.map((word)=>`<article><h3>${escapeHtml(word.word)}</h3><p>${escapeHtml(word.ipa)} · ${escapeHtml(word.partOfSpeech)} · ${escapeHtml(word.topic)}</p><p><strong>${escapeHtml(word.meaningVi)}</strong></p><p>${escapeHtml(word.example)} ${escapeHtml(word.translation)}</p></article>`).join('')}</section>`
  } else if (context.language && context.level && context.resource === 'grammar') {
    const topics=grammarEntries.filter((item)=>item.languageId===context.language.id&&item.level===context.level)
    content=`<section><h2>Chủ điểm ngữ pháp ${escapeHtml(context.level)}</h2>${topics.map((item)=>`<article><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.explanation)}</p><p><strong>Cấu trúc:</strong> ${escapeHtml(item.structure)}</p></article>`).join('')}</section>`
  } else if (context.language && context.level) {
    const units=getRoadmap(context.language.id,context.level); const hours=units.reduce((sum,unit)=>sum+unit.lessons.length,0)
    content=`<section><h2>${escapeHtml(context.language.name)} ${escapeHtml(context.level)} là gì?</h2><p>Đây là một chặng trong lộ trình ${escapeHtml(context.language.framework)}, kết hợp từ vựng, ngữ pháp, nghe, nói, đọc và viết.</p></section><section><h2>Nội dung cần học</h2>${units.map((unit)=>`<article><h3>${escapeHtml(unit.title)}</h3><p>${unit.lessons.length} bài học theo chủ đề. <a href="/${context.language.id}/${levelSlug(context.level)}/lessons/${unit.lessons[0].id}">Mở bài đầu tiên</a>.</p></article>`).join('')}</section><section><h2>Thời gian và mục tiêu</h2><p>Hoàn thành ${hours} bài theo nhịp 3–4 buổi mỗi tuần, kết hợp ôn từ và sửa lỗi sau bài kiểm tra.</p><p><a href="/${context.language.id}/${levelSlug(context.level)}/vocabulary">Từ vựng ${escapeHtml(context.level)}</a> · <a href="/${context.language.id}/${levelSlug(context.level)}/grammar">Ngữ pháp ${escapeHtml(context.level)}</a></p></section>`
  } else if (context.language) content=`<section><h2>Các level ${escapeHtml(context.language.framework)}</h2><p>${escapeHtml(context.language.description)}</p>${context.language.levels.map(([level,label])=>`<article><h3><a href="/${context.language.id}/${levelSlug(level)}">${escapeHtml(level)} · ${escapeHtml(label)}</a></h3><p>Học từ vựng, ngữ pháp và bốn kỹ năng ở cấp độ ${escapeHtml(level)}.</p></article>`).join('')}</section>`
  else content=`<section><h2>Nội dung trên ${SITE_NAME}</h2><p>${escapeHtml(meta.description)}</p><p><a href="/languages">Khám phá ngôn ngữ</a> · <a href="/search">Tìm nội dung</a></p></section>`
  return `<header class="static-header"><nav><a href="/"><img src="/logo.svg" width="40" height="40" alt="NT"></a><a href="/languages">Languages</a><a href="/english-vocabulary">Vocabulary</a><a href="/english-grammar">Grammar</a><a href="/toeic">TOEIC</a><a href="/ielts">IELTS</a></nav></header><main class="static-main"><nav aria-label="Breadcrumb">${breadcrumb}</nav><article><header><h1>${escapeHtml(meta.title.replace(/\s*\|\s*NT$/,'').replace(/^NT\s*[–-]\s*/,''))}</h1><p>${escapeHtml(meta.description)}</p></header>${content}</article></main><footer class="static-footer"><strong>NT</strong><p>Learn Languages Smarter.</p><a href="/about">About</a> <a href="/contact">Contact</a> <a href="/privacy">Privacy</a> <a href="/terms">Terms</a></footer>`
}

function render(path) {
  const meta=getSeoForPath(path); const context=pageContext(path); const canonical=`${siteUrl}${path}`; const image=`${siteUrl}${DEFAULT_OG_IMAGE}`
  let html=template.replace(/<title>[\s\S]*?<\/title>/i,`<title>${escapeHtml(meta.title)}</title>`)
  html=replaceMeta(html,'name="description"',meta.description)
  html=replaceMeta(html,'name="keywords"',meta.keywords || 'học ngôn ngữ online, từ vựng, ngữ pháp, luyện nghe nói đọc viết')
  html=replaceMeta(html,'property="og:title"',meta.title)
  html=replaceMeta(html,'property="og:description"',meta.description)
  html=replaceMeta(html,'property="og:url"',canonical)
  html=replaceMeta(html,'property="og:image"',image)
  html=replaceMeta(html,'name="twitter:title"',meta.title)
  html=replaceMeta(html,'name="twitter:description"',meta.description)
  html=replaceMeta(html,'name="twitter:image"',image)
  html=html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i,`<link rel="canonical" href="${canonical}" />`)
  html=html.replace(/<script id="nt-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i,`<script id="nt-json-ld" type="application/ld+json">${structuredData(meta,path,context.breadcrumbs)}</script>`)
  const verification=String(process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim()
  if (verification) html=html.replace('</head>',`    <meta name="google-site-verification" content="${escapeHtml(verification)}" />\n  </head>`)
  html=html.replace(/<div id="root">[\s\S]*?<\/div>\s*<noscript>/i,`<div id="root">${staticBody(path,meta,context)}</div>\n    <noscript>`)
  return html
}

for (const path of routes) {
  const target=path==='/' ? join(dist,'index.html') : join(dist,path.slice(1),'index.html')
  await mkdir(dirname(target),{ recursive:true }); await writeFile(target,render(path),'utf8')
}

const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((path)=>`  <url><loc>${escapeHtml(`${siteUrl}${path}`)}</loc><changefreq>${path==='/'?'weekly':'monthly'}</changefreq><priority>${path==='/'?'1.0':path.split('/').length<=3?'0.8':'0.6'}</priority></url>`).join('\n')}\n</urlset>\n`
await writeFile(join(dist,'sitemap.xml'),sitemap,'utf8')
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,'utf8')
await cp(join(dist,'index.html'),join(dist,'404.html'))
console.log(`Prerendered ${routes.length} public URLs for ${siteUrl}`)
console.log(`Sitemap contains ${routes.length} canonical URLs`)
