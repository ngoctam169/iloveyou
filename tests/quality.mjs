import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root=fileURLToPath(new URL('..',import.meta.url))
const read=(path)=>readFileSync(join(root,path),'utf8')
const assert=(condition,message)=>{ if(!condition) throw new Error(message) }

const layout=read('src/components/layout/Layout.jsx')
const globalCss=read('src/styles/global.css')
const seo=read('src/components/common/Seo.jsx')
const structured=read('src/utils/structuredData.js')
const analyticsFiles=[
  'src/pages/Home.jsx',
  'src/components/course/LanguageCard.jsx',
  'src/components/course/LevelCard.jsx',
  'src/pages/Lesson.jsx',
  'src/pages/Vocabulary.jsx',
  'src/pages/Review.jsx',
  'src/components/exam/SectionedExamRunner.jsx',
  'src/pages/BlogPost.jsx',
  'src/pages/About.jsx',
].map(read).join('\n')

assert(layout.includes('className="skip-link"') && layout.includes('id="main-content"'),'Skip-to-content navigation is missing')
assert(globalCss.includes('prefers-reduced-motion:reduce'),'Reduced-motion CSS is missing')
assert(!seo.includes("upsertMeta('meta[name=\"keywords\"]'"),'Runtime SEO still writes meta keywords')
assert(!structured.includes("'@type':'SearchAction'"),'Deprecated SearchAction is still emitted')

for(const event of ['start_learning','select_language','select_level','lesson_started','lesson_completed','vocabulary_saved','review_started','toeic_started','toeic_submitted','ielts_started','ielts_submitted','blog_read','about_contact_click']) {
  assert(analyticsFiles.includes(event) || (event.startsWith('toeic_') || event.startsWith('ielts_')) && analyticsFiles.includes("${analyticsExam}_"),`Analytics event missing: ${event}`)
}

const assetsDir=join(root,'dist/assets')
const assets=readdirSync(assetsDir)
const cssFiles=assets.filter((name)=>name.endsWith('.css'))
const jsFiles=assets.filter((name)=>name.endsWith('.js'))
const largestCss=Math.max(...cssFiles.map((name)=>statSync(join(assetsDir,name)).size))
const largestJs=Math.max(...jsFiles.map((name)=>statSync(join(assetsDir,name)).size))
assert(largestCss < 190*1024,`Largest CSS bundle is ${Math.round(largestCss/1024)} KiB; budget is 190 KiB`)
assert(largestJs < 240*1024,`Largest JS bundle is ${Math.round(largestJs/1024)} KiB; budget is 240 KiB`)

const builtHome=read('dist/index.html')
assert(!/<meta[^>]+name="keywords"/i.test(builtHome),'Production HTML still contains meta keywords')

console.log(`QUALITY PASS: skip link, reduced motion, analytics coverage, modern SEO and bundle budgets (CSS ${Math.round(largestCss/1024)} KiB, JS ${Math.round(largestJs/1024)} KiB)`)
