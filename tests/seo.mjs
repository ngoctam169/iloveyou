import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AUTHOR } from '../src/data/author.js'
import { blogPosts } from '../src/data/blogPosts.js'
import { DEFAULT_SITE_URL, getSeoForPath } from '../src/data/seo.js'

const root = fileURLToPath(new URL('..',import.meta.url))
const assert = (condition,message) => { if (!condition) throw new Error(message) }
const read = (path) => readFileSync(join(root,path),'utf8')
const jsonLd = (html) => {
  const match = html.match(/<script id="nt-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert(match,'Missing JSON-LD script')
  return JSON.parse(match[1])
}

assert(DEFAULT_SITE_URL === 'https://ngoctam169.github.io/iloveyou','Production site URL is not the verified GitHub Pages URL')
for (const file of ['dist/index.html','dist/about/index.html','dist/blog/index.html','dist/sitemap.xml','dist/robots.txt','dist/404.html','dist/.nojekyll']) assert(existsSync(join(root,file)),`Missing production file: ${file}`)

const aboutHtml = read('dist/about/index.html')
const aboutGraph = jsonLd(aboutHtml)['@graph']
const profilePage = aboutGraph.find((item) => item['@type'] === 'ProfilePage')
const person = aboutGraph.find((item) => item['@type'] === 'Person')
assert(profilePage?.mainEntity?.['@id'] === `${DEFAULT_SITE_URL}/#person`,'ProfilePage does not reference the shared Person entity')
assert(person?.['@id'] === `${DEFAULT_SITE_URL}/#person` && person.name === AUTHOR.name,'About page has an invalid Person entity')
assert(AUTHOR.alternateNames.every((name) => person.alternateName.includes(name)),'Person alternate names are incomplete')
assert(AUTHOR.sameAs.every((url) => person.sameAs.includes(url)),'Person sameAs links are incomplete')
assert(person.disambiguatingDescription?.includes('Ninh Thuận'),'Person entity is missing Ninh Thuận disambiguation')
assert(aboutHtml.includes('<h1>Nguyễn Ngọc Tâm – Full-stack Developer</h1>'),'About prerender is missing the focused full-stack H1')
assert(aboutHtml.includes('Ninh Thuận'),'About page is missing the Ninh Thuận identity signal')
assert(aboutHtml.includes('85%') && aboutHtml.includes('PVcomBank') && aboutHtml.includes('Shinhan Life'),'About page is missing CV-backed engineering evidence')
assert(person.email === `mailto:${AUTHOR.email}`,'Person entity is missing the public contact email')
assert(aboutHtml.includes(`mailto:${AUTHOR.email}`) && aboutHtml.includes("Let's work together"),'About prerender is missing the recruiter contact CTA')
assert(person.description?.includes('realtime communication') && person.knowsAbout?.includes('WebRTC') && person.knowsAbout?.includes('Salesforce Integration'),'Person entity is missing engineering capability signals')

const personalStory = blogPosts.find((post) => post.slug === 'nguyen-ngoc-tam-ninh-thuan')
const standaloneBlogPosts = blogPosts
assert(personalStory,'Personal story is missing')

const titles = new Set()
for (const post of standaloneBlogPosts) {
  const path = `dist/blog/${post.slug}/index.html`
  assert(existsSync(join(root,path)),`Article was not prerendered: ${post.slug}`)
  const html = read(path)
  const meta = getSeoForPath(`/blog/${post.slug}`)
  assert(!titles.has(meta.title),`Duplicate article title: ${meta.title}`); titles.add(meta.title)
  assert(html.includes(`<title>${meta.title}</title>`),`Wrong title for ${post.slug}`)
  assert(html.includes(`rel="canonical" href="${DEFAULT_SITE_URL}/blog/${post.slug}"`),`Wrong canonical for ${post.slug}`)
  assert(html.includes('property="og:type" content="article"'),'Article Open Graph type is missing')
  assert(html.includes(`article:published_time" content="${post.datePublished}"`),'Article publication time is missing')
  assert(html.includes(`article:modified_time" content="${post.dateModified}"`),'Article modification time is missing')
  assert(html.includes(`<h1>${post.title}</h1>`),`Prerendered article H1 is missing for ${post.slug}`)
  assert(html.includes(`href="${DEFAULT_SITE_URL}/about"`),`Article does not link to the author page: ${post.slug}`)
  const graph = jsonLd(html)['@graph']
  const posting = graph.find((item) => item['@type'] === 'BlogPosting')
  const articlePerson = graph.find((item) => item['@type'] === 'Person')
  assert(posting?.author?.['@id'] === `${DEFAULT_SITE_URL}/#person`,`BlogPosting author is wrong for ${post.slug}`)
  assert(posting?.mainEntityOfPage?.['@id'] === `${DEFAULT_SITE_URL}/blog/${post.slug}#webpage`,`BlogPosting mainEntityOfPage is wrong for ${post.slug}`)
  assert(articlePerson?.['@id'] === person['@id'],`Article uses a different Person entity: ${post.slug}`)
  const words = post.content.flatMap((block) => block.text ? [block.text] : block.items || []).join(' ').split(' ').filter(Boolean).length
  assert(words >= 1000 && words <= 2000,`Article ${post.slug} has ${words} words; expected 1000–2000`)
}

const blogHtml = read('dist/blog/index.html')
assert(blogHtml.includes(personalStory.title),'Main blog page is missing the personal journey preview')
assert(blogHtml.includes('Có những quyết định lúc đưa ra mình chẳng nghĩ nó quan trọng đến vậy.'),'Personal journey preview was not prerendered')
assert(blogHtml.includes(`href="/blog/${personalStory.slug}"`),'Personal journey preview is missing its standalone article link')
const blogGraph = jsonLd(blogHtml)['@graph']
const blogSchema = blogGraph.find((item) => item['@type'] === 'Blog')
assert(blogSchema?.blogPost?.some((item) => item['@id'] === `${DEFAULT_SITE_URL}/blog/${personalStory.slug}#article`),'Blog schema does not reference the standalone personal story')
const personalWords = personalStory.content.flatMap((block) => block.text ? [block.text] : block.items || []).join(' ').split(' ').filter(Boolean).length
assert(personalWords >= 1000 && personalWords <= 2200,`Personal story has ${personalWords} words; expected 1000–2200`)
const personalStoryText = personalStory.content.flatMap((block) => block.text ? [block.text] : block.items || []).join(' ')
assert(!/Ngọc Tâm Dev|Tâm Dev|developer branding/i.test(personalStoryText),'Personal story still contains branding language')
assert(!/Ngọc Tâm Dev|Tâm Dev/i.test(personalStory.description),'Personal story description still contains branding language')
assert(!personalStory.tags.some((tag) => /Ngọc Tâm Dev|Tâm Dev/i.test(tag)),'Personal story tags still contain branding language')

const sitemap = read('dist/sitemap.xml')
for (const path of ['/about','/blog',...standaloneBlogPosts.map((post) => `/blog/${post.slug}`)]) assert(sitemap.includes(`<loc>${DEFAULT_SITE_URL}${path}</loc>`),`Sitemap is missing ${path}`)
const robots = read('dist/robots.txt')
assert(robots.includes(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`) && !/Disallow:\s*\//.test(robots),'robots.txt blocks crawling or has a wrong sitemap')
const notFound = read('dist/404.html')
assert(notFound.includes('noindex, follow'),'404 output is indexable')
const builtHome = read('dist/index.html')
assert(builtHome.includes('/iloveyou/assets/') && builtHome.includes('Nguyễn Ngọc Tâm') && builtHome.includes('Ngọc Tâm Dev'),'Production base path or homepage personal identity signal is missing')
assert(builtHome.includes('<title>NT Language Learning | Học ngoại ngữ · Nguyễn Ngọc Tâm</title>'),'Homepage title is not product-first with author identity')
assert(!/<meta[^>]+name="keywords"/i.test(builtHome) && !/<meta[^>]+name="keywords"/i.test(aboutHtml),'Obsolete meta keywords should not be rendered')
const homeGraph = jsonLd(builtHome)['@graph']
const homeWebsite = homeGraph.find((item) => item['@type'] === 'WebSite')
const homePerson = homeGraph.find((item) => item['@type'] === 'Person')
assert(homeWebsite?.name === 'NT Language Learning' && homeWebsite?.creator?.['@id'] === `${DEFAULT_SITE_URL}/#person`,'WebSite does not identify the language product and Nguyễn Ngọc Tâm as creator')
assert(!homeWebsite?.about,'Product WebSite should not claim Nguyễn Ngọc Tâm is the subject of the whole site')
assert(!homeWebsite?.potentialAction,'Deprecated WebSite SearchAction should not be emitted')
assert(homePerson?.name === AUTHOR.name && homePerson?.worksFor?.name === 'South Telecom','Homepage Person entity is incomplete')
assert(builtHome.includes('Học ngoại ngữ theo level') && builtHome.includes('TOEIC và IELTS'),'Homepage prerender is not language-learning first')
assert(builtHome.includes('Người phát triển') && builtHome.includes('Nguyễn Ngọc Tâm (Ngọc Tâm Dev)'),'Homepage lost the visible author identity/link')
assert(!sitemap.includes(`<loc>${DEFAULT_SITE_URL}/learn-english</loc>`),'Language-learning routes should not be in the personal SEO sitemap')
const languageHtml = read('dist/learn-english/index.html')
assert(languageHtml.includes('noindex, follow'),'Language-learning landing page should remain functional but noindex')
for (const output of [builtHome,aboutHtml,sitemap,robots]) assert(!output.includes('nt-learning.example.com') && !output.includes('https://DOMAIN'),'Placeholder domain remains in production output')

console.log(`SEO PASS: product-first homepage, recruiter-first ProfilePage, engineering Person entity and ${standaloneBlogPosts.length} standalone BlogPosting graphs validated`)
