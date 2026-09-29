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


const assetsDir = join(dist, 'assets')
const jsAssets = readdirSync(assetsDir).filter((name) => name.endsWith('.js')).map((name) => ({ name, bytes:statSync(join(assetsDir,name)).size }))
assert(!jsAssets.some(({ name }) => name.startsWith('vocabulary-data-')), 'Monolithic vocabulary-data chunk returned')
assert(!jsAssets.some(({ name }) => /^(english-|chinese-|japanese-|korean-|search-index-)/.test(name)), 'Vocabulary JSON leaked back into JavaScript chunks')
const vocabularyDir = join(dist, 'data', 'vocabulary')
assert(existsSync(vocabularyDir), 'Missing dist/data/vocabulary runtime directory')
const vocabularyPayloads = readdirSync(vocabularyDir).filter((name) => /^(english-|chinese-|japanese-|korean-).+\.json$/.test(name)).map((name) => ({ name, bytes:statSync(join(vocabularyDir,name)).size }))
assert(vocabularyPayloads.length >= 23, `Expected per-level vocabulary JSON files, found ${vocabularyPayloads.length}`)
assert(vocabularyPayloads.every(({ bytes }) => bytes < 850 * 1024), 'A per-level vocabulary JSON file exceeded 850 KB')
const searchIndexPath = join(vocabularyDir, 'search-index.json')
assert(existsSync(searchIndexPath) && statSync(searchIndexPath).size < 4 * 1024 * 1024, 'Vocabulary search index is missing or unexpectedly large')
const coursesChunk = jsAssets.find(({ name }) => name.startsWith('courses-'))
assert(coursesChunk && coursesChunk.bytes < 700 * 1024, 'Course runtime bundle exceeded 700 KB')
const appChunks = jsAssets.filter(({ name }) => !name.startsWith('react-vendor-'))
assert(appChunks.every(({ bytes }) => bytes < 500 * 1024), 'A non-vendor application JavaScript chunk exceeded 500 KB')

const htmlFiles = collectHtml(dist)
assert(htmlFiles.length > 3, 'Prerender output is unexpectedly small')

for (const file of htmlFiles) {
  if (/google[a-z0-9]+\.html$/i.test(file)) continue
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

console.log(`DEPLOY PASS: validated ${htmlFiles.length} prerendered HTML files, ${vocabularyChunks.length} lazy vocabulary chunks and GitHub Pages asset paths`)
