import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const basePath = '/iloveyou/'
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

assert(existsSync(join(dist, 'index.html')), 'Missing dist/index.html')
assert(existsSync(join(dist, '404.html')), 'Missing dist/404.html')

function collectHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return collectHtml(full)
    return name.endsWith('.html') ? [full] : []
  })
}

function resolvesInDist(url) {
  const withoutQuery = url.split(/[?#]/, 1)[0]
  if (!withoutQuery.startsWith(basePath)) return true
  const rel = withoutQuery.slice(basePath.length)
  if (!rel) return existsSync(join(dist, 'index.html'))

  const exact = join(dist, rel)
  return existsSync(exact) || existsSync(join(exact, 'index.html'))
}

const htmlFiles = collectHtml(dist)
assert(htmlFiles.length > 3, 'Prerender output is unexpectedly small')

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const label = relative(root, file)

  assert(!html.includes('src="/src/main.jsx"'), `${label} still references the Vite source entry`)
  assert(!html.includes('src="/assets/'), `${label} contains an asset URL that ignores the GitHub Pages base path`)
  assert(!html.includes('href="/assets/'), `${label} contains an asset URL that ignores the GitHub Pages base path`)

  const moduleScripts = [...html.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map((match) => match[1])
  assert(moduleScripts.length > 0, `${label} has no production module script`)
  assert(moduleScripts.every((url) => url.startsWith(`${basePath}assets/`)), `${label} has a module script outside ${basePath}assets/`)

  const localRefs = [...html.matchAll(/\b(?:src|href)="(\/iloveyou\/[^"]*)"/g)].map((match) => match[1])
  for (const url of localRefs) {
    assert(resolvesInDist(url), `${label} references a missing production file or route: ${url}`)
  }
}

console.log(`DEPLOY PASS: validated ${htmlFiles.length} prerendered HTML files and GitHub Pages asset paths`)
