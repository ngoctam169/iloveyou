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
assert(aboutHtml.includes('<h1>Nguyễn Ngọc Tâm – Full-stack Developer</h1>'),'About prerender is missing the required H1')

const titles = new Set()
for (const post of blogPosts) {
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

const sitemap = read('dist/sitemap.xml')
for (const path of ['/about','/blog',...blogPosts.map((post) => `/blog/${post.slug}`)]) assert(sitemap.includes(`<loc>${DEFAULT_SITE_URL}${path}</loc>`),`Sitemap is missing ${path}`)
const robots = read('dist/robots.txt')
assert(robots.includes(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`) && !/Disallow:\s*\//.test(robots),'robots.txt blocks crawling or has a wrong sitemap')
const notFound = read('dist/404.html')
assert(notFound.includes('noindex, follow'),'404 output is indexable')
const builtHome = read('dist/index.html')
assert(builtHome.includes('/iloveyou/assets/') && builtHome.includes('Nguyễn Ngọc Tâm'),'Production base path or homepage author signal is missing')
for (const output of [builtHome,aboutHtml,sitemap,robots]) assert(!output.includes('nt-learning.example.com') && !output.includes('https://DOMAIN'),'Placeholder domain remains in production output')

console.log(`SEO PASS: ProfilePage, Person and ${blogPosts.length} BlogPosting graphs validated; sitemap and GitHub Pages output are ready`)
