import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { AUTHOR } from '../src/data/author.js'
import { blogPosts, findBlogPost } from '../src/data/blogPosts.js'
import { getLesson, getRoadmap } from '../src/data/courses.js'
import { grammarEntries } from '../src/data/grammar.js'
import { findLevel, getLanguage, languages, levelSlug } from '../src/data/languages.js'
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, getSeoForPath, indexableSeoPaths, publicSeoPaths, SITE_NAME } from '../src/data/seo.js'
import { vocabularyCatalog } from '../src/data/vocabulary/catalog.js'
import { buildStructuredData } from '../src/utils/structuredData.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const buildEnv = loadEnv('production',root,'')
const configuredUrl = String(process.env.VITE_SITE_URL || process.env.SITE_URL || buildEnv.VITE_SITE_URL || '').trim().replace(/\/$/, '')
const siteUrl = /^https?:\/\//.test(configuredUrl) ? configuredUrl : DEFAULT_SITE_URL
if (!configuredUrl) console.warn(`VITE_SITE_URL is not set; SEO files use ${DEFAULT_SITE_URL}. Set it for the production build.`)

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]))
const stripTags = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const lessonRoutes = languages.flatMap((language) => language.levels.flatMap(([level]) => getRoadmap(language.id, level).flatMap((unit) => unit.lessons.map((lesson) => ({ path:`/${language.id}/${levelSlug(level)}/lessons/${lesson.id}`, language, level, unit, lesson })))))
const routes = [...new Set([...publicSeoPaths(), ...lessonRoutes.map((item) => item.path)])]
const inlineStory = blogPosts.find((item) => item.inline)
const standaloneBlogPosts = blogPosts.filter((item) => !item.inline)

function replaceMeta(html, selector, content) {
  const escaped = escapeHtml(content)
  const expression = new RegExp(`<meta\\s+([^>]*${selector}[^>]*)content="[^"]*"([^>]*)>`, 'i')
  return html.replace(expression, (_match, before, after) => `<meta ${before}content="${escaped}"${after}>`)
}

function pageContext(path) {
  const blogPost = path.startsWith('/blog/') ? findBlogPost(path.slice('/blog/'.length)) : null
  if (blogPost) return { blogPost, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:'Blog',path:'/blog' },{ name:blogPost.category,path:'/blog' },{ name:blogPost.title,path }] }
  if (path === '/blog') return { blogIndex:true, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:'Blog',path }] }
  if (path === '/about') return { authorProfile:true, breadcrumbs:[{ name:'Trang chủ',path:'/' },{ name:`About ${AUTHOR.name}`,path }] }
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

function renderStaticArticleBlocks(blocks) {
  return blocks.map((block) => {
    if (block.type === 'h2') return `<h2 id="${escapeHtml(block.id)}">${escapeHtml(block.text)}</h2>`
    if (block.type === 'h3') return `<h3 id="${escapeHtml(block.id)}">${escapeHtml(block.text)}</h3>`
    if (block.type === 'list') return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    if (block.type === 'code') return `<figure><figcaption>${escapeHtml(block.label)} · ${escapeHtml(block.language)}</figcaption><pre><code>${escapeHtml(block.code)}</code></pre></figure>`
    if (block.type === 'note') return `<aside><strong>${escapeHtml(block.title)}</strong><p>${escapeHtml(block.text)}</p></aside>`
    return `<p>${escapeHtml(block.text)}</p>`
  }).join('')
}

function renderStaticBlogCards(posts) {
  return posts.map((post) => `<article><span>${escapeHtml(post.category)} · ${escapeHtml(post.readingTime)}</span><h3><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p><time datetime="${post.datePublished}">${post.datePublished}</time></article>`).join('')
}

function staticBody(path, meta, context) {
  const breadcrumb = context.breadcrumbs.map((item,index) => `${index ? '<span>›</span>' : ''}<a href="${item.path}">${escapeHtml(item.name)}</a>`).join('')
  const pageHeading = path === '/' ? 'NT Language Learning – Học ngoại ngữ theo level' : context.authorProfile ? 'Nguyễn Ngọc Tâm – Engineering Profile · Backend, Realtime & WebRTC' : context.blogIndex ? 'Engineering Blog của Nguyễn Ngọc Tâm' : context.blogPost ? context.blogPost.title : meta.title.replace(/\s*\|\s*NT$/,'').replace(/^NT\s*[–-]\s*/,'')
  let content = ''
  if (context.blogPost) {
    const post=context.blogPost
    content=`<section aria-label="Thông tin bài viết"><p><strong>${escapeHtml(post.category)}</strong></p><p>Viết bởi <a href="/about">${escapeHtml(AUTHOR.name)}</a> · <time datetime="${post.datePublished}">${post.datePublished}</time> · ${escapeHtml(post.readingTime)}</p></section><div>${renderStaticArticleBlocks(post.content)}</div><section><p>Tags: ${post.tags.map(escapeHtml).join(', ')}</p><h2>Về tác giả</h2><p>${escapeHtml(AUTHOR.description)}</p><a href="/about">About ${escapeHtml(AUTHOR.name)}</a></section><section><h2>Bài viết liên quan</h2>${renderStaticBlogCards(standaloneBlogPosts.filter((item)=>item.slug!==post.slug).slice(0,2))}</section>`
  } else if (context.blogIndex) content=`<section><h2>Engineering Blog của ${escapeHtml(AUTHOR.name)}</h2><p>Các ghi chú kỹ thuật rút ra từ công việc thực tế về PHP/Laravel, MongoDB, Redis, WebSocket, WebRTC, queue, performance và production reliability.</p><p>Tác giả: <a href="/about">${escapeHtml(AUTHOR.name)}</a> · Full-stack Developer tại South Telecom từ 07/2022, tập trung vào backend, realtime communication và enterprise integration.</p></section>${inlineStory ? `<section id="${escapeHtml(inlineStory.anchor)}"><h2>${escapeHtml(inlineStory.title)}</h2><p>${escapeHtml(inlineStory.description)}</p>${renderStaticArticleBlocks(inlineStory.content)}</section>` : ''}<section><h2>Bài viết kỹ thuật</h2>${renderStaticBlogCards(standaloneBlogPosts)}</section>`
  else if (context.authorProfile) content=`<section><h2>Engineering Profile</h2><p><strong>${escapeHtml(AUTHOR.name)}</strong> (Nguyen Ngoc Tam / Ngọc Tâm Dev) là Full-stack Developer tại South Telecom từ 07/2022, hiện làm việc tại Ho Chi Minh City, Vietnam. Quê Ninh Thuận là tín hiệu nhận diện; nội dung trang tập trung vào năng lực kỹ thuật và kinh nghiệm dự án.</p><p>${escapeHtml(AUTHOR.description)}</p><p><a href="${AUTHOR.sameAs[0]}">LinkedIn</a> · <a href="${AUTHOR.sameAs[1]}">GitHub</a></p></section><section><h2>Selected Engineering Impact</h2><ul>${AUTHOR.impactHighlights.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section><h2>Technical Stack</h2><p>${AUTHOR.knowsAbout.map(escapeHtml).join(', ')}.</p></section><section><h2>Work Experience</h2><h3>South Telecom · Full-stack Developer</h3><p>07/2022 – Present. Product development, CRM/API integration, realtime messaging/calling, production troubleshooting, cloud-cost optimization, mentoring developer và Scrum facilitation.</p><h3>R-Digital · Backend Developer Intern</h3><p>04/2022 – 07/2022. Phối hợp phát triển backend và cải thiện chức năng sản phẩm.</p></section><section><h2>Selected Project Experience</h2>${AUTHOR.selectedProjects.map((project)=>`<article><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.summary)}</p><p><strong>Technologies:</strong> ${project.technologies.map(escapeHtml).join(', ')}</p></article>`).join('')}</section><section><h2>Education</h2><p>Information Technology, Industrial University of Ho Chi Minh City · 09/2019 – 02/2022.</p></section><section><h2>Engineering Blog</h2><p><a href="/blog">Đọc bài viết kỹ thuật của ${escapeHtml(AUTHOR.name)}</a>.</p></section><section><h2>Let's work together</h2><p>Đang tìm một Full-stack / Backend Developer? Tâm sẵn sàng trao đổi về các vị trí Full-stack, Backend hoặc Realtime Systems tại TP.HCM và cơ hội remote phù hợp.</p><p><a href="mailto:${escapeHtml(AUTHOR.email)}">${escapeHtml(AUTHOR.email)}</a> · <a href="${AUTHOR.sameAs[1]}">GitHub</a> · <a href="${AUTHOR.sameAs[0]}">LinkedIn</a></p></section>`
  else if (path === '/') content = `<section><h2>Học ngoại ngữ theo level</h2><p>NT Language Learning hỗ trợ tiếng Anh, Trung, Nhật và Hàn theo CEFR, HSK, JLPT và TOPIK; kết hợp vocabulary, grammar, listening, speaking, reading, writing và vòng ôn tập.</p><p><a href="/languages">Chọn ngôn ngữ để học</a> · <a href="/toeic">Luyện TOEIC</a> · <a href="/ielts">Luyện IELTS</a></p></section><section><h2>TOEIC và IELTS</h2><p>TOEIC có Full Test 200 câu với timer và lịch sử kết quả; IELTS có Listening, Reading, Writing và Speaking để luyện theo từng kỹ năng.</p></section><section><h2>Từ vựng, ngữ pháp và tiến độ</h2><p>Người học có thể chọn level tự do, học khoảng 1000 từ mỗi level, luyện grammar, flashcard, review lỗi sai và theo dõi tiến độ trên thiết bị.</p></section><section><h2>Người phát triển</h2><p>NT Language Learning được phát triển bởi <a href="/about"><strong>${escapeHtml(AUTHOR.name)} (Ngọc Tâm Dev)</strong></a>, Full-stack Developer. Hồ sơ nghề nghiệp và kinh nghiệm backend/realtime được tách riêng tại trang About để homepage tập trung vào trải nghiệm học.</p></section><section><h2>Engineering Notes</h2><p><a href="/blog">Đọc blog kỹ thuật của ${escapeHtml(AUTHOR.name)}</a> về PHP/Laravel, MongoDB, Redis, WebSocket, WebRTC và production systems.</p></section>`
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
  return `<header class="static-header"><nav><a href="/">NT Language Learning</a><a href="/languages">Ngôn ngữ</a><a href="/blog">Blog</a><a href="/about">About Me</a></nav></header><main class="static-main"><nav aria-label="Breadcrumb">${breadcrumb}</nav><article><header><h1>${escapeHtml(pageHeading)}</h1><p>${escapeHtml(meta.description)}</p></header>${content}</article></main><footer class="static-footer"><strong>NT Language Learning</strong><p>Developed by Nguyễn Ngọc Tâm · Full-stack Developer</p><a href="/about">About Me</a> <a href="/blog">Blog</a> <a href="/contact">Contact</a></footer>`
}

function render(path) {
  const context=pageContext(path)
  const baseMeta=getSeoForPath(path)
  const meta=context.lessonRoute ? { ...baseMeta, title:`${context.lessonRoute.language.name} ${context.lessonRoute.level}: ${context.lessonRoute.lesson.title} | NT`, description:`Bài học ${context.lessonRoute.language.name} ${context.lessonRoute.level} gồm từ vựng, ngữ pháp, nghe, nói, đọc, viết và bài kiểm tra về chủ đề ${context.lessonRoute.lesson.topic || context.lessonRoute.lesson.title}.`, keywords:`${context.lessonRoute.language.name} ${context.lessonRoute.level} lesson, ${context.lessonRoute.lesson.title}, từ vựng, ngữ pháp` } : baseMeta
  const canonical=`${siteUrl}${path}`; const image=`${siteUrl}${DEFAULT_OG_IMAGE}`
  let html=template.replace(/<title>[\s\S]*?<\/title>/i,`<title>${escapeHtml(meta.title)}</title>`)
  html=replaceMeta(html,'name="description"',meta.description)
  html=replaceMeta(html,'name="keywords"',meta.keywords || 'Nguyễn Ngọc Tâm developer, Ngọc Tâm Dev, PHP Developer, Laravel, MongoDB, Redis, WebSocket, WebRTC')
  html=replaceMeta(html,'property="og:title"',meta.ogTitle || meta.title)
  html=replaceMeta(html,'property="og:description"',meta.description)
  html=replaceMeta(html,'property="og:type"',meta.pageType === 'article' ? 'article' : 'website')
  html=replaceMeta(html,'property="og:url"',canonical)
  html=replaceMeta(html,'property="og:image"',image)
  html=replaceMeta(html,'name="twitter:title"',meta.ogTitle || meta.title)
  html=replaceMeta(html,'name="twitter:description"',meta.description)
  html=replaceMeta(html,'name="twitter:image"',image)
  html=replaceMeta(html,'name="robots"',meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  html=replaceMeta(html,'name="author"',AUTHOR.name)
  html=html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i,`<link rel="canonical" href="${canonical}" />`)
  html=html.replace(/<script id="nt-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i,`<script id="nt-json-ld" type="application/ld+json">${JSON.stringify(buildStructuredData({ siteUrl,meta,path,breadcrumbs:context.breadcrumbs })).replace(/</g,'\\u003c')}</script>`)
  if (meta.pageType === 'article') html=html.replace('</head>',`    <meta property="article:published_time" content="${meta.article.datePublished}" />\n    <meta property="article:modified_time" content="${meta.article.dateModified}" />\n    <meta property="article:author" content="${siteUrl}/about" />\n  </head>`)
  const verification=String(process.env.VITE_GOOGLE_SITE_VERIFICATION || buildEnv.VITE_GOOGLE_SITE_VERIFICATION || '').trim()
  if (verification) html=html.replace('</head>',`    <meta name="google-site-verification" content="${escapeHtml(verification)}" />\n  </head>`)
  const staticMarkup=staticBody(path,meta,context).replace(/\b(href|src)="\/(?!\/)/g,(_match,attribute)=>`${attribute}="${siteUrl}/`)
  html=html.replace(/<div id="root">[\s\S]*?<\/div>\s*<noscript>/i,`<div id="root">${staticMarkup}</div>\n    <noscript>`)
  return html
}

for (const path of routes) {
  const target=path==='/' ? join(dist,'index.html') : join(dist,path.slice(1),'index.html')
  await mkdir(dirname(target),{ recursive:true }); await writeFile(target,render(path),'utf8')
}

const sitemapRoutes=indexableSeoPaths()
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((path)=>{ const article=path.startsWith('/blog/') ? findBlogPost(path.slice('/blog/'.length)) : null; return `  <url><loc>${escapeHtml(`${siteUrl}${path}`)}</loc>${article ? `<lastmod>${article.dateModified}</lastmod>` : ''}<changefreq>${path==='/'||path==='/blog'?'weekly':'monthly'}</changefreq><priority>${path==='/'?'1.0':path==='/about'?'0.95':path==='/blog'?'0.9':'0.8'}</priority></url>` }).join('\n')}\n</urlset>\n`
await writeFile(join(dist,'sitemap.xml'),sitemap,'utf8')
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,'utf8')
await writeFile(join(dist,'.nojekyll'),'','utf8')
await writeFile(join(dist,'404.html'),render('/404'),'utf8')
console.log(`Prerendered ${routes.length} public URLs for ${siteUrl}`)
console.log(`Sitemap contains ${sitemapRoutes.length} personal/indexable canonical URLs`)
