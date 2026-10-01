import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const port = 4182
const origin = `http://127.0.0.1:${port}`
const server = spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port)],{ stdio:['ignore','pipe','pipe'] })
let browser
const assert = (condition,message) => { if (!condition) throw new Error(message) }

async function waitForServer() {
  for (let attempt=0;attempt<60;attempt+=1) {
    try { if ((await fetch(origin)).ok) return } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve,200))
  }
  throw new Error('Blog test server did not start')
}

try {
  await waitForServer()
  browser = await chromium.launch({ channel:'chrome',headless:true })
  const page = await browser.newPage({ viewport:{ width:1440,height:1000 } })
  page.setDefaultTimeout(15000)
  const errors=[]
  page.on('pageerror',(error)=>errors.push(error.message))
  page.on('console',(message)=>{ if(message.type()==='error') errors.push(message.text()) })

  await page.goto(`${origin}/blog`)
  await page.getByRole('heading',{ name:'Những ghi chú kỹ thuật mình muốn giữ lại',exact:true }).waitFor()
  await page.getByRole('heading',{ name:/Từ Ninh Thuận vào Sài Gòn/,level:2 }).waitFor()
  assert(await page.locator('#nguyen-ngoc-tam-ninh-thuan .article-content').count()===1,'Personal journey must be rendered inline inside /blog')
  assert(await page.locator('.blog-list .blog-card').count()===4,'Blog listing must contain four technical articles')
  await page.locator('.blog-list .blog-card').first().locator('h3 a').click()
  await page.waitForURL('**/blog/php-mongodb-performance')
  await page.getByRole('heading',{ name:/Tối ưu hiệu năng PHP và MongoDB/,level:1 }).waitFor()
  assert(await page.locator('.article-content h2').count()>=6,'Article does not have enough semantic sections')
  assert(await page.locator('.article-code pre').count()>=2,'PHP/MongoDB article is missing code examples')
  assert((await page.getByRole('link',{ name:/About Nguyễn Ngọc Tâm/ }).first().getAttribute('href'))==='/about','Article author link must point to /about')
  const articleSchema=await page.locator('#nt-json-ld').textContent().then(JSON.parse)
  assert(articleSchema['@graph'].some((item)=>item['@type']==='BlogPosting'&&item.author?.['@id']===`${origin}/#person`),'Runtime BlogPosting schema is invalid')

  await page.goto(`${origin}/about`)
  await page.getByRole('heading',{ name:/Nguyễn Ngọc Tâm.*Full-stack Developer/,level:1 }).waitFor()
  assert(await page.locator('.desktop-nav > a[href="/blog"]').count()===1,'Blog must be a top-level desktop navigation item')
  assert(await page.locator('.desktop-nav > a[href="/about"]').count()===1,'About Me must be a top-level desktop navigation item')
  assert((await page.locator('.desktop-nav > a[href="/about"]').textContent())==='About Me','About navigation label must be About Me')
  assert(await page.locator('.editorial-global-header').count()===1,'About must use the stable editorial header')
  assert(await page.locator('.nav-popover a[href="/blog"], .nav-popover a[href="/about"]').count()===0,'Public editorial navigation must keep Blog/About as direct links')
  assert(await page.locator('.cvp5-project').count()>=4,'About Me is missing selected project case studies')
  assert(await page.locator('.cvp5-experience article').count()>=2,'About Me is missing work experience')
  assert(await page.locator('.cvp5-stack article').count()>=4,'About Me is missing the technical stack')
  assert(await page.locator('.cvp5-writing').count()===1,'About Me is missing Engineering Notes')
  assert(await page.locator('.cvp5-contact').count()===1,'About Me is missing the recruiter contact section')
  assert(await page.getByRole('heading',{ name:/Nguyễn Ngọc Tâm · Full-stack Developer/ }).count()===1,'Recruiter CTA heading is missing')
  const aboutSchema=await page.locator('#nt-json-ld').textContent().then(JSON.parse)
  assert(aboutSchema['@graph'].some((item)=>item['@type']==='ProfilePage'&&item.mainEntity?.['@id']===`${origin}/#person`),'Runtime ProfilePage schema is invalid')
  assert(await page.locator('a[href="https://linkedin.com/in/ngoctam1609"]').count()>0,'LinkedIn profile link is missing')
  assert(await page.locator('a[href="https://github.com/ngoctam169"]').count()>0,'GitHub profile link is missing')
  assert(await page.locator('a[href="mailto:nguyenngoctam1609@gmail.com"]').count()>0,'Recruiter email CTA is missing')

  await page.goto(`${origin}/`)
  await page.locator('.home-blog .blog-card').first().waitFor()
  assert(await page.locator('.home-blog .blog-card').count()===3,'Homepage must show three latest articles')

  for (const width of [320,375,768,1024,1440]) {
    await page.setViewportSize({ width,height:900 })
    for (const route of ['/blog','/blog/websocket-realtime-system','/about']) {
      await page.goto(`${origin}${route}`)
      await page.locator('main.page').waitFor()
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
      assert(overflow<=1,`${route} overflows at ${width}px by ${overflow}px`)
    }
  }

  await page.goto(`${origin}/blog/nguyen-ngoc-tam-ninh-thuan`)
  await page.waitForURL('**/blog#nguyen-ngoc-tam-ninh-thuan')
  await page.locator('#nguyen-ngoc-tam-ninh-thuan').waitFor()
  assert(await page.locator('#nguyen-ngoc-tam-ninh-thuan').count()===1,'Legacy personal story URL must redirect into the Blog section')

  await page.goto(`${origin}/blog/bai-viet-khong-ton-tai`)
  await page.getByRole('heading',{ name:/Lối này chưa có bài học/ }).waitFor()
  assert((await page.locator('meta[name="robots"]').getAttribute('content')).startsWith('noindex'),'Unknown article route must be noindex')
  assert(errors.length===0,`Runtime errors:\n${errors.join('\n')}`)
  console.log('BLOG PASS: listing, articles, author entity, schemas, 404 and responsive layouts')
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
