import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const port = 4175
const origin = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] })
let browser

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(origin)
      if (response.ok) return
    } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('Vite server did not start')
}

async function seededContext(state = {}) {
  const context = await browser.newContext()
  await context.addInitScript((seed) => {
    if (!localStorage.getItem('nt_state_v1')) localStorage.setItem('nt_state_v1', JSON.stringify({ onboardingComplete: true, selectedLanguage: 'english', selectedLevel: 'B1', ...seed }))
  }, state)
  return context
}

try {
  await waitForServer()
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  console.log('E2E checkpoint: browser started')
  const context = await seededContext()
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const runtimeErrors = []
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`) })

  await page.goto(`${origin}/learn-english`)
  await page.locator('.level-card').first().waitFor()
  assert(await page.locator('.level-card').count() === 6, 'English must expose all six CEFR levels')
  for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
    const card = page.locator('.level-card', { hasText: level }).first()
    assert(await card.isEnabled(), `${level} card should be clickable`)
    assert((await card.getAttribute('href'))?.endsWith(`/english/${level.toLowerCase()}`), `${level} route is incorrect`)
  }

  console.log('E2E checkpoint: level selector')

  await page.locator('.level-card', { hasText: 'B2' }).first().click()
  await page.waitForURL('**/english/b2')
  await page.getByText('Business English', { exact: true }).waitFor()
  assert(await page.locator('.lesson-node').count() === 60, 'B2 roadmap should contain 60 accessible lessons')
  await page.locator('.lesson-node').first().click()
  await page.waitForURL('**/english/b2/lessons/**')
  await page.locator('.vocab-card button[aria-label^="Lưu"]').first().click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('.lesson-grammar-quiz .answer-list button').first().click()
  await page.getByRole('button', { name: 'Kiểm tra ngữ pháp' }).click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('.answer-list button').nth(1).click()
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.getByRole('button', { name: 'Start Speaking' }).click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('.answer-list button').first().click()
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('#writing-answer').fill(Array(85).fill('evidence').join(' ') + '.')
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('.answer-list button').first().click()
  await page.getByRole('button', { name: /Kiểm tra đáp án/ }).click()
  await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.getByRole('button', { name: /Hoàn thành bài học/ }).click()
  await page.getByText('LESSON COMPLETE!').waitFor()
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('nt_state_v1'))?.levelProgress?.['english:B2']?.completedLessons?.includes('english-b2-1-1'))
  const b2State = await page.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')))
  assert(b2State.levelProgress['english:B2'].completedLessons.includes('english-b2-1-1'), 'B2 completion was not saved in its own level bucket')
  assert(b2State.mistakes.some((item) => item.type === 'Listening'), 'Incorrect listening answer was not saved to Mistakes')
  assert(b2State.savedItems.some((item) => item.type === 'Vocabulary' && item.path), 'Saved vocabulary did not retain a return path')

  console.log('E2E checkpoint: B2 lesson completed')

  await page.getByRole('button', { name: /Continue/ }).click()
  await page.waitForURL('**/dashboard')
  const currentLevelText = await page.locator('.level-switcher h2').textContent()
  assert(currentLevelText?.includes('English · B2'), `Dashboard did not retain B2 as current level (rendered: ${currentLevelText})`)
  await page.getByRole('link', { name: /Change Level|Đổi level/ }).click()
  await page.locator('.level-card', { hasText: 'A1' }).first().click()
  await page.waitForURL('**/english/a1')
  await page.getByText('Greetings', { exact: true }).waitFor()
  await page.getByRole('link', { name: /Change Level|Đổi level/ }).click()
  await page.locator('.level-card', { hasText: 'C2' }).first().click()
  await page.waitForURL('**/english/c2')
  await page.getByText('Complex Listening', { exact: true }).waitFor()
  const switchedState = await page.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')))
  assert(switchedState.levelProgress['english:B2'].completedLessons.length === 1, 'Changing A1/C2 erased B2 progress')

  console.log('E2E checkpoint: A1 and C2 switching')

  await page.goto(`${origin}/flashcards`)
  await page.locator('.flashcard').click()
  await page.getByRole('button', { name: /Good/ }).click()
  await page.waitForFunction(() => Object.keys(JSON.parse(localStorage.getItem('nt_state_v1')).flashcardProgress || {}).some((key) => key.startsWith('english:C2:')))
  const srsState = await page.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')))
  const schedule = Object.entries(srsState.flashcardProgress).find(([key]) => key.startsWith('english:C2:'))[1]
  assert(schedule.nextReview && schedule.interval === 2 && schedule.repetitions === 1 && schedule.ease >= 1.3, 'SRS schedule is incomplete')

  console.log('E2E checkpoint: SRS')

  await page.goto(`${origin}/mistakes`)
  await page.getByRole('link', { name: /Practice Again/ }).first().waitFor()
  await page.goto(`${origin}/saved`)
  await page.getByRole('link', { name: /Mở nội dung/ }).waitFor()

  await page.goto(`${origin}/search`)
  await page.locator('.search-box input').fill('business')
  await page.locator('.search-results a').first().waitFor()
  assert(await page.locator('.search-results a').count() > 0, 'Topic search returned no result')
  await page.locator('.search-results a').first().click()
  assert(!(await page.getByText('404', { exact: true }).isVisible().catch(() => false)), 'Search result points to a missing lesson')

  await page.goto(`${origin}/vocabulary?language=english&level=A1`)
  await page.locator('.vocabulary-index').waitFor()
  assert(await page.locator('.vocabulary-index > div > button:not(.vocabulary-load-more)').count() === 50, 'Vocabulary list did not apply its initial render limit')
  await page.locator('.vocabulary-load-more').click()
  assert(await page.locator('.vocabulary-index > div > button:not(.vocabulary-load-more)').count() === 100, 'Vocabulary load-more did not reveal the next page')
  await page.locator('.vocabulary-filters select').nth(5).selectOption('alphabetical')
  await page.locator('.filter-search input').fill('family')
  await page.locator('.vocabulary-index button', { hasText:'family' }).first().click()
  await page.getByRole('heading', { name: 'family', exact: true }).waitFor()

  await page.goto(`${origin}/flashcards?language=english&level=A1&limit=5`)
  await page.locator('.flashcard-progress').getByText('1 / 5', { exact: true }).waitFor()

  await page.goto(`${origin}/settings`)
  await page.getByRole('button', { name: /Dark/ }).click()
  assert(await page.evaluate(() => document.documentElement.dataset.theme === 'dark'), 'Dark mode did not apply')

  console.log('E2E checkpoint: core learning, persistence, review, search and theme')
  const levelBeforePlacement = await page.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')).selectedLevel)
  await page.goto(`${origin}/placement-test`)
  await page.locator('.test-language-grid button').first().click()
  for (let question = 0; question < 24; question += 1) {
    await page.locator('.answer-list button').first().click()
    await page.getByRole('button', { name: /Xác nhận/ }).click()
  }
  await page.getByRole('button', { name: 'Xem tất cả level' }).waitFor()
  const afterPlacement = await page.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')))
  assert(afterPlacement.selectedLevel === levelBeforePlacement, 'Placement recommendation forced the selected level')

  console.log('E2E checkpoint: placement test')
  await page.goto(`${origin}/mock-tests`)
  await page.waitForURL('**/toeic')
  await page.goto(`${origin}/profile`)
  await page.waitForURL('**/settings#profile')
  await page.getByRole('heading', { name:'Hồ sơ người học' }).waitFor()
  await page.goto(`${origin}/history`)
  await page.waitForURL('**/progress#history')
  await page.getByRole('heading', { name:'Lịch sử học tập' }).waitFor()

  console.log('E2E checkpoint: retired routes redirect into core modules')
  for (const route of ['/languages', '/progress', '/settings']) {
    await page.goto(`${origin}${route}`)
    await page.locator('main.page').waitFor()
    assert((await page.locator('main.page').innerText()).trim().length > 20, `${route} rendered an empty page`)
  }

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`${origin}/dashboard`)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    assert(overflow <= 1, `Dashboard overflows horizontally at ${width}px by ${overflow}px`)
  }

  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/about', '/blog', '/vocabulary', '/toeic', '/ielts']) {
      await page.goto(`${origin}${route}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      assert(overflow <= 1, `${route} overflows horizontally at ${width}px by ${overflow}px`)
    }
  }

  await page.setViewportSize({ width:375, height:800 })
  await page.goto(`${origin}/dashboard`)
  await page.locator('nav.bottom-nav').waitFor({ state:'visible' })
  const bottomLinks = await page.locator('nav.bottom-nav a').count()
  assert(bottomLinks === 5, `Mobile bottom navigation should render 5 links, got ${bottomLinks}`)

  await page.evaluate(() => {
    localStorage.setItem('nt_exam_session_v1:test','{"started":true}')
    localStorage.setItem('nt_exam_forms_v1:test','[]')
    localStorage.setItem('nt_ielts_full_flow_v1','{"phase":"writing"}')
  })
  await page.goto(`${origin}/settings`)
  await page.getByRole('button', { name:'Đặt lại tiến độ' }).click()
  await page.getByRole('button', { name:'Xác nhận đặt lại' }).click()
  const remainingNtKeys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('nt_')))
  assert(remainingNtKeys.every((key) => key === 'nt_state_v1'), `Reset left stale app storage: ${remainingNtKeys.join(', ')}`)

  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(`${origin}/dashboard`)
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page.getByRole('navigation', { name: 'Điều hướng di động' }).getByText(/Settings|Cài đặt/).click()
  await page.waitForURL('**/settings')

  await page.goto(`${origin}/english/b2/lessons/english-b2-1-2`)
  for (let step = 0; step < 5; step += 1) await page.getByRole('button', { name: /Tiếp tục/ }).click()
  await page.locator('#writing-answer').fill('This is my saved writing draft for the lesson.')
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('nt_state_v1')).lessonSessions?.['english-b2-1-2']?.answers?.writing?.includes('saved writing draft'))
  await page.reload()
  assert((await page.locator('#writing-answer').inputValue()).includes('saved writing draft'), 'Lesson writing draft was lost on refresh')

  for (const route of ['/', '/languages', '/learn-chinese', '/chinese/hsk-6', '/dashboard', '/vocabulary', '/my-vocabulary', '/grammar', '/flashcards', '/toeic', '/ielts', '/review', '/history', '/self-study', '/mistakes', '/saved', '/progress', '/placement-test', '/mock-tests', '/profile', '/settings', '/search', '/english/b1/lessons/english-b1-1-1']) {
    await page.goto(`${origin}${route}`)
    await page.locator('h1').first().waitFor()
    assert(!(await page.getByText('404', { exact:true }).isVisible().catch(() => false)), `${route} resolved to 404`)
  }
  console.log('E2E checkpoint: all application routes')

  await page.goto(`${origin}/route-that-does-not-exist`)
  await page.getByText('404', { exact: true }).waitFor()
  assert(runtimeErrors.length === 0, `Runtime errors detected:\n${runtimeErrors.join('\n')}`)
  await context.close()

  const migration = await seededContext({ selectedLevel: 'A1', completedLessons: ['english-a1-1'], lessonScores: { 'english-a1-1': 88 } })
  const migrationPage = await migration.newPage()
  await migrationPage.goto(`${origin}/learn-english`)
  await migrationPage.locator('.level-card', { hasText: 'A1' }).getByText('In Progress').waitFor()
  await migrationPage.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem('nt_state_v1'))
    return state?.schemaVersion === 2 && state?.levelProgress?.['english:A1']?.completedLessons?.[0] === 'english-a1-1-1'
  })
  const migrated = await migrationPage.evaluate(() => JSON.parse(localStorage.getItem('nt_state_v1')))
  assert(migrated.schemaVersion === 2 && migrated.levelProgress['english:A1'].completedLessons[0] === 'english-a1-1-1', 'Legacy A1 progress migration failed')
  await migration.close()

  const corrupt = await browser.newContext()
  await corrupt.addInitScript(() => localStorage.setItem('nt_state_v1', '{invalid json'))
  const corruptPage = await corrupt.newPage()
  await corruptPage.goto(`${origin}/dashboard`)
  await corruptPage.getByText(/CURRENT LEVEL|CẤP ĐỘ HIỆN TẠI/, { exact: true }).first().waitFor()
  await corrupt.close()

  const onboarding = await browser.newContext()
  const onboardingPage = await onboarding.newPage()
  await onboardingPage.goto(`${origin}/`)
  await onboardingPage.getByRole('button', { name:'Bắt đầu học' }).first().click()
  await onboardingPage.getByRole('dialog').waitFor()
  await onboardingPage.keyboard.press('Escape')
  assert(await onboardingPage.getByRole('dialog').count() === 0, 'Onboarding modal did not close with Escape')
  await onboarding.close()

  console.log('E2E PASS: free level selection, lesson completion, per-level persistence, search, theme, migration, modal and responsive layouts')
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}

