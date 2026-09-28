import { findLevel, getLanguage, languages, levelSlug } from './languages.js'
import { blogPostMeta, findBlogMeta } from './blogMeta.js'

export const SITE_NAME = 'Ngọc Tâm Dev'
export const DEFAULT_SITE_URL = 'https://ngoctam169.github.io/iloveyou'
export const DEFAULT_OG_IMAGE = '/og-image.png'
export const PERSONAL_SEO_KEYWORDS = [
  'Nguyễn Ngọc Tâm developer',
  'Nguyen Ngoc Tam developer',
  'Ngọc Tâm Dev',
  'Tâm Dev',
  'Nguyễn Ngọc Tâm PHP',
  'Nguyễn Ngọc Tâm Laravel',
  'Nguyễn Ngọc Tâm South Telecom',
  'Full-stack Developer Ho Chi Minh City',
  'PHP Developer Vietnam',
  'Laravel Developer Vietnam',
  'MongoDB Developer',
  'WebSocket Developer',
  'WebRTC Developer',
].join(', ')

const noindex = 'noindex, follow'
const appMeta = (meta) => ({ ...meta, robots:noindex })

const languageCopy = {
  english: { vi: 'tiếng Anh', target: 'CEFR A1–C2', keyword: 'learn English online', summary: 'Học tiếng Anh theo CEFR với từ vựng, ngữ pháp và bài luyện nghe, nói, đọc, viết theo từng cấp độ.' },
  chinese: { vi: 'tiếng Trung', target: 'HSK 1–6', keyword: 'learn Chinese HSK', summary: 'Học tiếng Trung theo HSK với từ vựng, mẫu câu, phát âm và lộ trình giao tiếp từ cơ bản đến nâng cao.' },
  japanese: { vi: 'tiếng Nhật', target: 'JLPT N5–N1', keyword: 'learn Japanese N5', summary: 'Học tiếng Nhật theo JLPT từ N5 đến N1 với chữ, từ vựng, ngữ pháp và luyện kỹ năng theo ngữ cảnh.' },
  korean: { vi: 'tiếng Hàn', target: 'TOPIK 1–6', keyword: 'learn Korean TOPIK', summary: 'Học tiếng Hàn theo TOPIK với Hangeul, từ vựng, ngữ pháp và bài luyện giao tiếp có lộ trình.' },
}

export const coreSeoRoutes = [
  '/', '/languages', '/learn-english', '/learn-chinese', '/learn-japanese', '/learn-korean',
  '/english-vocabulary', '/english-grammar', '/toeic', '/ielts', '/about', '/blog', '/contact', '/privacy', '/terms', '/search',
]

const personalIndexRoutes = ['/', '/about', '/blog']

const staticMeta = {
  '/': {
    title: 'Nguyễn Ngọc Tâm (Ngọc Tâm Dev) | Full-stack Developer',
    description: 'Website của Nguyễn Ngọc Tâm (Ngọc Tâm Dev), Full-stack Developer tại TP.HCM chuyên PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và hệ thống realtime.',
    keywords: PERSONAL_SEO_KEYWORDS,
    pageType:'person-home',
  },
  '/about': {
    title: 'Nguyễn Ngọc Tâm – Full-stack PHP Developer | Ngọc Tâm Dev',
    description: 'Hồ sơ Nguyễn Ngọc Tâm (Ngọc Tâm Dev), Full-stack Developer tại South Telecom từ 07/2022, chuyên PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC và backend/realtime.',
    keywords: PERSONAL_SEO_KEYWORDS,
    pageType:'profile',
  },
  '/blog': {
    title: 'Blog Nguyễn Ngọc Tâm | PHP, Laravel, MongoDB, Realtime',
    description: 'Blog kỹ thuật của Nguyễn Ngọc Tâm (Ngọc Tâm Dev) về PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, backend và hệ thống realtime production.',
    keywords: `blog Nguyễn Ngọc Tâm, Ngọc Tâm Dev, PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, backend developer`,
    pageType:'blog',
  },
  '/languages': appMeta({ title: 'Khóa học ngôn ngữ online | NT', description: 'Khám phá lộ trình học tiếng Anh, Trung, Nhật và Hàn theo các khung CEFR, HSK, JLPT và TOPIK tại NT.' }),
  '/english-vocabulary': appMeta({ title: 'English Vocabulary theo cấp độ | NT', description: 'Học English vocabulary theo CEFR A1–C2 với nghĩa tiếng Việt, phát âm, ví dụ, chủ đề và bài luyện ghi nhớ.' }),
  '/english-grammar': appMeta({ title: 'English Grammar từ A1 đến C2 | NT', description: 'Hệ thống English grammar theo CEFR, có cấu trúc, cách dùng, ví dụ, lỗi thường gặp và bài luyện.' }),
  '/toeic': appMeta({ title: 'Luyện thi TOEIC Listening & Reading | NT', description: 'Luyện TOEIC Listening và Reading theo dạng câu hỏi, xem giải thích, từ vựng và theo dõi kết quả mini test.' }),
  '/ielts': appMeta({ title: 'Luyện IELTS đủ bốn kỹ năng | NT', description: 'Luyện IELTS Listening, Reading, Writing và Speaking với bài tập theo dạng, checklist rõ ràng và lịch sử luyện tập.' }),
  '/contact': appMeta({ title: 'Liên hệ | Ngọc Tâm Dev', description: 'Thông tin liên hệ và góp ý cho website của Nguyễn Ngọc Tâm.' }),
  '/privacy': appMeta({ title: 'Chính sách quyền riêng tư | NT', description: 'Cách NT lưu tiến độ học tập trên thiết bị và bảo vệ quyền riêng tư của người học.' }),
  '/terms': appMeta({ title: 'Điều khoản sử dụng | NT', description: 'Điều khoản sử dụng nội dung, tính năng và dữ liệu học tập trên website NT.' }),
  '/search': appMeta({ title: 'Tìm kiếm nội dung | NT', description: 'Tìm nội dung trong ứng dụng học ngôn ngữ NT.' }),
  '/dashboard': appMeta({ title: 'Bảng học tập cá nhân | NT', description: 'Theo dõi mục tiêu, tiến độ, lịch ôn và hoạt động học ngôn ngữ trên NT.' }),
  '/vocabulary': appMeta({ title: 'Kho từ vựng đa ngôn ngữ | NT', description: 'Tra cứu và luyện từ vựng tiếng Anh, Trung, Nhật, Hàn theo cấp độ, chủ đề và trạng thái ghi nhớ.' }),
  '/grammar': appMeta({ title: 'Thư viện ngữ pháp đa ngôn ngữ | NT', description: 'Học cấu trúc ngữ pháp theo ngôn ngữ và cấp độ với ví dụ, lỗi thường gặp và câu hỏi luyện tập.' }),
  '/flashcards': appMeta({ title: 'Flashcards ôn từ thông minh | NT', description: 'Ôn từ vựng bằng flashcard và lịch lặp lại ngắt quãng dựa trên kết quả ghi nhớ của bạn.' }),
  '/review': appMeta({ title: 'Ôn tập hằng ngày | NT', description: 'Ôn từ đến hạn, từ yếu và lỗi gần đây theo lịch học cá nhân trên NT.' }),
  '/placement-test': appMeta({ title: 'Kiểm tra trình độ ngôn ngữ | NT', description: 'Làm bài kiểm tra nhanh để chọn cấp độ học phù hợp trên NT.' }),
  '/mock-tests': appMeta({ title: 'Bài thi thử ngoại ngữ | NT', description: 'Luyện bài thi thử có hẹn giờ và xem kết quả theo từng nhóm kỹ năng.' }),
  '/self-study': appMeta({ title: 'Phòng tự luyện ngoại ngữ | NT', description: 'Tạo bài luyện nói và viết theo ngôn ngữ, cấp độ và chủ đề bạn chọn.' }),
  '/my-vocabulary': appMeta({ title: 'Kho từ vựng cá nhân | NT', description: 'Tạo từ mới, sắp xếp danh sách và luyện lại kho từ vựng cá nhân của bạn.' }),
  '/progress': appMeta({ title: 'Thống kê tiến độ học | NT', description: 'Xem thời gian học, điểm kỹ năng và thành tích học ngôn ngữ của bạn trên NT.' }),
  '/history': appMeta({ title: 'Lịch sử học tập | NT', description: 'Xem lại các hoạt động và thời gian học gần đây trên NT.' }),
  '/saved': appMeta({ title: 'Nội dung đã lưu | NT', description: 'Mở lại từ vựng, ngữ pháp và bài học đã lưu trên NT.' }),
  '/mistakes': appMeta({ title: 'Sổ lỗi sai | NT', description: 'Xem lại câu trả lời sai và luyện lại kiến thức cần củng cố.' }),
  '/profile': appMeta({ title: 'Hồ sơ người học | NT', description: 'Xem hồ sơ, mục tiêu và thành tích học ngôn ngữ của bạn.' }),
  '/settings': appMeta({ title: 'Cài đặt học tập | NT', description: 'Chọn ngôn ngữ, cấp độ, mục tiêu từ vựng, tốc độ phát âm và giao diện NT.' }),
}

export function getLanguageSeo(languageId) {
  const language = getLanguage(languageId)
  const copy = languageCopy[languageId]
  if (!language || !copy) return null
  return {
    title: `Học ${copy.vi} online theo ${copy.target} | NT`,
    description: copy.summary,
    keywords: `${copy.keyword}, học ${copy.vi} online, ${language.framework}, từ vựng ${copy.vi}, ngữ pháp ${copy.vi}`,
    robots:noindex,
  }
}

export function getSeoForPath(pathname, search = '') {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  const direct = staticMeta[path]
  if (direct) return { ...direct, path }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/)
  if (blogMatch) {
    const post = findBlogMeta(blogMatch[1])
    if (post) return {
      title:post.seoTitle,
      ogTitle:post.title,
      description:post.description,
      keywords:`${post.tags.join(', ')}, Nguyễn Ngọc Tâm, Ngọc Tâm Dev, Full-stack Developer`,
      path,
      pageType:'article',
      article:post,
    }
    return { title:'Không tìm thấy bài viết | Ngọc Tâm Dev', description:'Bài viết bạn tìm kiếm không tồn tại hoặc đường dẫn chưa chính xác.', path, robots:noindex }
  }

  const languageLanding = path.match(/^\/learn-(english|chinese|japanese|korean)$/)
  if (languageLanding) return { ...getLanguageSeo(languageLanding[1]), path }

  const lessonMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)\/lessons\/([^/]+)$/)
  if (lessonMatch) {
    const language = getLanguage(lessonMatch[1]); const level = findLevel(language, lessonMatch[2]); const lessonName = lessonMatch[3].split('-').slice(-3).join(' ')
    return { title: `${language?.name || 'Language'} ${level?.[0] || ''}: ${lessonName} | NT`, description: `Bài học ${language?.name || ''} ${level?.[0] || ''} trên NT gồm từ vựng, ngữ pháp, nghe, nói, đọc, viết và bài kiểm tra.`, path, robots:noindex }
  }

  const resourceMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)\/(vocabulary|grammar)$/)
  if (resourceMatch) {
    const language = getLanguage(resourceMatch[1]); const level = findLevel(language, resourceMatch[2]); const resource = resourceMatch[3]
    const label = resource === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'
    return { title: `${label} ${language?.name || ''} ${level?.[0] || ''} | NT`, description: `Học ${label.toLowerCase()} ${language?.name || ''} cấp độ ${level?.[0] || ''} trên NT.`, path, robots:noindex }
  }

  const levelMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)$/)
  if (levelMatch) {
    const language = getLanguage(levelMatch[1]); const level = findLevel(language, levelMatch[2]); const copy = languageCopy[levelMatch[1]]
    if (language && level) return { title: `${language.name} ${level[0]}: Lộ trình và bài học | NT`, description: `Học ${copy.vi} ${level[0]} với lộ trình từ vựng, ngữ pháp, nghe, nói, đọc và viết.`, path, robots:noindex }
  }

  const fallbackName = path.split('/').filter(Boolean).map((part) => part.replaceAll('-', ' ')).join(' · ')
  return { title: `${fallbackName || 'Ngọc Tâm Dev'} | NT`, description: 'Trang bạn tìm kiếm không tồn tại hoặc đường dẫn chưa chính xác.', path, search, robots:noindex }
}

export function publicSeoPaths() {
  return [
    ...coreSeoRoutes,
    ...blogPostMeta.map((post) => `/blog/${post.slug}`),
    ...languages.flatMap((language) => language.levels.flatMap(([level]) => [
      `/${language.id}/${levelSlug(level)}`,
      `/${language.id}/${levelSlug(level)}/vocabulary`,
      `/${language.id}/${levelSlug(level)}/grammar`,
    ])),
  ]
}

export function indexableSeoPaths() {
  return [
    ...personalIndexRoutes,
    ...blogPostMeta.map((post) => `/blog/${post.slug}`),
  ]
}
