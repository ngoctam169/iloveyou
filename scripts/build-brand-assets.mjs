import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const logo = await readFile(new URL('../public/logo.svg', import.meta.url), 'utf8')
const browser = await chromium.launch({ channel:'chrome', headless:true })
try {
  for (const [size, name] of [[192,'icon-192.png'],[512,'icon-512.png'],[180,'apple-touch-icon.png'],[64,'favicon-64.png']]) {
    const page = await browser.newPage({ viewport:{ width:size, height:size }, deviceScaleFactor:1 })
    await page.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:${size}px;height:${size}px;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${logo}`)
    await page.locator('svg').screenshot({ path:new URL(`../public/${name}`, import.meta.url).pathname.slice(1), omitBackground:true })
    await page.close()
  }
  const page = await browser.newPage({ viewport:{ width:1200, height:630 }, deviceScaleFactor:1 })
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:Arial,sans-serif;color:#242130;background:linear-gradient(145deg,#faf9fc,#eeeafd)}.orb{position:absolute;border-radius:50%}.one{width:450px;height:450px;right:-90px;top:-150px;background:#ded4ff}.two{width:360px;height:360px;left:-170px;bottom:-210px;background:#f7dfad}.wrap{position:relative;z-index:1;padding:86px 94px}.brand{display:flex;align-items:center;gap:30px}.brand svg{width:180px;height:180px}.brand strong{font-size:94px;letter-spacing:-6px}.tagline{margin:42px 0 18px;font-size:58px;line-height:1.08;letter-spacing:-2px}.languages{font-size:29px;color:#665d78}.pill{display:inline-block;margin-top:32px;padding:16px 29px;border-radius:99px;color:#fff;background:#7157d9;font-size:23px;font-weight:700}</style></head><body><span class="orb one"></span><span class="orb two"></span><main class="wrap"><div class="brand">${logo}<strong>NT</strong></div><h1 class="tagline">Learn Languages Smarter</h1><div class="languages">English · Chinese · Japanese · Korean</div><div class="pill">Vocabulary · Grammar · Four Skills</div></main></body></html>`)
  await page.screenshot({ path:new URL('../public/og-image.png', import.meta.url).pathname.slice(1) })
  await page.close()
} finally { await browser.close() }

const png = await readFile(new URL('../public/favicon-64.png', import.meta.url))
const header = Buffer.alloc(22)
header.writeUInt16LE(0,0); header.writeUInt16LE(1,2); header.writeUInt16LE(1,4)
header.writeUInt8(64,6); header.writeUInt8(64,7); header.writeUInt8(0,8); header.writeUInt8(0,9)
header.writeUInt16LE(1,10); header.writeUInt16LE(32,12); header.writeUInt32LE(png.length,14); header.writeUInt32LE(22,18)
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header,png]))
console.log('NT logo assets generated')
