import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

const root = new URL('../src', import.meta.url).pathname.replace(/^\/(.:)/, '$1')
const files = []
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes:true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (['.js','.jsx'].includes(extname(entry.name))) files.push(path)
  }
}
walk(root)

const violations = []
for (const path of files) {
  const source = readFileSync(path,'utf8')
  if (/\b(TODO|FIXME|HACK|XXX)\b/.test(source)) violations.push(`${path}: unfinished marker`)
  if (!path.endsWith('src/data/blogPosts.js') && /\bconsole\.log\s*\(/.test(source)) violations.push(`${path}: console.log left in production source`)
  if (/Pronunciation Match/.test(source)) violations.push(`${path}: transcript score is mislabeled as pronunciation`)
  if (/dangerouslySetInnerHTML/.test(source)) violations.push(`${path}: dangerouslySetInnerHTML requires explicit review`)
  const reactImport = source.match(/import\s*\{([^}]*)\}\s*from\s*['"]react['"]/s)?.[1] || ''
  for (const hook of ['useState','useEffect','useMemo','useRef','useCallback','useReducer']) {
    if (new RegExp(`\\b${hook}\\s*\\(`).test(source) && !new RegExp(`\\b${hook}\\b`).test(reactImport)) {
      violations.push(`${path}: ${hook} is used but not imported from react`)
    }
  }
}

const app = readFileSync(new URL('../src/App.jsx', import.meta.url),'utf8')
if (/pages\/Levels/.test(app)) violations.push('App.jsx: retired Levels page is still routed')

const responsive = readFileSync(new URL('../src/styles/responsive.css', import.meta.url),'utf8')
if (!/\.bottom-nav\{[^}]*grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/.test(responsive)) violations.push('responsive.css: bottom nav must have five columns')

const huashu = readFileSync(new URL('../src/styles/huashu.css', import.meta.url),'utf8')
if (/^@import\s+url\(['"]https:\/\/fonts\.googleapis\.com/m.test(huashu)) violations.push('huashu.css: remote font @import blocks CSS loading')
if (/public-editorial-header/.test(huashu)) violations.push('huashu.css: dead public-editorial-header selector remains')

if (violations.length) {
  console.error(violations.join('\n'))
  process.exit(1)
}
console.log(`SOURCE PASS: ${files.length} JS/JSX files checked`)
