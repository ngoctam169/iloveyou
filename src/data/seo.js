import { findLevel, getLanguage, languages, levelSlug } from './languages.js'

export const SITE_NAME = 'NT'
export const DEFAULT_SITE_URL = 'https://nt-learning.example.com'
export const DEFAULT_OG_IMAGE = '/og-image.png'

const languageCopy = {
  english: { vi: 'tiếng Anh', target: 'CEFR A1–C2', keyword: 'learn English online', summary: 'Học tiếng Anh theo CEFR với từ vựng, ngữ pháp và bài luyện nghe, nói, đọc, viết theo từng cấp độ.' },
  chinese: { vi: 'tiếng Trung', target: 'HSK 1–6', keyword: 'learn Chinese HSK', summary: 'Học tiếng Trung theo HSK với từ vựng, mẫu câu, phát âm và lộ trình giao tiếp từ cơ bản đến nâng cao.' },
  japanese: { vi: 'tiếng Nhật', target: 'JLPT N5–N1', keyword: 'learn Japanese N5', summary: 'Học tiếng Nhật theo JLPT từ N5 đến N1 với chữ, từ vựng, ngữ pháp và luyện kỹ năng theo ngữ cảnh.' },
  korean: { vi: 'tiếng Hàn', target: 'TOPIK 1–6', keyword: 'learn Korean TOPIK', summary: 'Học tiếng Hàn theo TOPIK với Hangeul, từ vựng, ngữ pháp và bài luyện giao tiếp có lộ trình.' },
}

export const coreSeoRoutes = [
  '/', '/languages', '/learn-english', '/learn-chinese', '/learn-japanese', '/learn-korean',
  '/english-vocabulary', '/english-grammar', '/toeic', '/ielts', '/about', '/contact', '/privacy', '/terms', '/search',
]

const staticMeta = {
  '/': { title: 'NT – Learn Languages Smarter', description: 'Học tiếng Anh, Trung, Nhật và Hàn theo lộ trình CEFR, HSK, JLPT và TOPIK. Luyện từ vựng, ngữ pháp và đủ bốn kỹ năng trên NT.', keywords: 'học ngoại ngữ online, learn English online, học tiếng Trung HSK, học tiếng Nhật N5, học tiếng Hàn TOPIK' },
  '/languages': { title: 'Khóa học ngôn ngữ online | NT', description: 'Khám phá lộ trình học tiếng Anh, Trung, Nhật và Hàn theo các khung CEFR, HSK, JLPT và TOPIK tại NT.', keywords: 'khóa học ngoại ngữ, học ngôn ngữ online, CEFR, HSK, JLPT, TOPIK' },
  '/english-vocabulary': { title: 'English Vocabulary theo cấp độ | NT', description: 'Học English vocabulary theo CEFR A1–C2 với nghĩa tiếng Việt, phát âm, ví dụ, chủ đề và bài luyện ghi nhớ.', keywords: 'English vocabulary, English A1 vocabulary, TOEIC vocabulary, IELTS vocabulary' },
  '/english-grammar': { title: 'English Grammar từ A1 đến C2 | NT', description: 'Hệ thống English grammar theo CEFR, có cấu trúc, cách dùng, ví dụ, lỗi thường gặp và bài luyện.', keywords: 'English grammar, ngữ pháp tiếng Anh, grammar A1, present perfect' },
  '/toeic': { title: 'Luyện thi TOEIC Listening & Reading | NT', description: 'Luyện TOEIC Listening và Reading theo dạng câu hỏi, xem giải thích, từ vựng và theo dõi kết quả mini test.', keywords: 'luyện thi TOEIC, TOEIC vocabulary, TOEIC Listening, TOEIC Reading' },
  '/ielts': { title: 'Luyện IELTS đủ bốn kỹ năng | NT', description: 'Luyện IELTS Listening, Reading, Writing và Speaking với bài tập theo dạng, checklist rõ ràng và lịch sử luyện tập.', keywords: 'luyện IELTS online, IELTS vocabulary, IELTS Writing, IELTS Speaking' },
  '/about': { title: 'Giới thiệu về NT', description: 'Tìm hiểu sứ mệnh, phương pháp và nguyên tắc xây dựng nền tảng học ngôn ngữ NT.' },
  '/contact': { title: 'Liên hệ NT', description: 'Thông tin liên hệ, góp ý nội dung và hỗ trợ sử dụng nền tảng học ngôn ngữ NT.' },
  '/privacy': { title: 'Chính sách quyền riêng tư | NT', description: 'Cách NT lưu tiến độ học tập trên thiết bị và bảo vệ quyền riêng tư của người học.' },
  '/terms': { title: 'Điều khoản sử dụng | NT', description: 'Điều khoản sử dụng nội dung, tính năng và dữ liệu học tập trên website NT.' },
  '/search': { title: 'Tìm kiếm bài học và từ vựng | NT', description: 'Tìm từ vựng, ngữ pháp, bài học, TOEIC, IELTS và cấp độ trong toàn bộ thư viện NT.' },
  '/dashboard': { title: 'Bảng học tập cá nhân | NT', description: 'Theo dõi mục tiêu, tiến độ, lịch ôn và hoạt động học ngôn ngữ trên NT.' },
  '/vocabulary': { title: 'Kho từ vựng đa ngôn ngữ | NT', description: 'Tra cứu và luyện từ vựng tiếng Anh, Trung, Nhật, Hàn theo cấp độ, chủ đề và trạng thái ghi nhớ.' },
  '/grammar': { title: 'Thư viện ngữ pháp đa ngôn ngữ | NT', description: 'Học cấu trúc ngữ pháp theo ngôn ngữ và cấp độ với ví dụ, lỗi thường gặp và câu hỏi luyện tập.' },
  '/flashcards': { title: 'Flashcards ôn từ thông minh | NT', description: 'Ôn từ vựng bằng flashcard và lịch lặp lại ngắt quãng dựa trên kết quả ghi nhớ của bạn.' },
  '/review': { title: 'Ôn tập hằng ngày | NT', description: 'Ôn từ đến hạn, từ yếu và lỗi gần đây theo lịch học cá nhân trên NT.' },
  '/placement-test': { title: 'Kiểm tra trình độ ngôn ngữ | NT', description: 'Làm bài kiểm tra nhanh để chọn cấp độ học phù hợp trên NT.' },
  '/mock-tests': { title: 'Bài thi thử ngoại ngữ | NT', description: 'Luyện bài thi thử có hẹn giờ và xem kết quả theo từng nhóm kỹ năng.' },
  '/self-study': { title: 'Phòng tự luyện ngoại ngữ | NT', description: 'Tạo bài luyện nói và viết theo ngôn ngữ, cấp độ và chủ đề bạn chọn.' },
  '/my-vocabulary': { title: 'Kho từ vựng cá nhân | NT', description: 'Tạo từ mới, sắp xếp danh sách và luyện lại kho từ vựng cá nhân của bạn.' },
  '/progress': { title: 'Thống kê tiến độ học | NT', description: 'Xem thời gian học, điểm kỹ năng và thành tích học ngôn ngữ của bạn trên NT.' },
  '/history': { title: 'Lịch sử học tập | NT', description: 'Xem lại các hoạt động và thời gian học gần đây trên NT.' },
  '/saved': { title: 'Nội dung đã lưu | NT', description: 'Mở lại từ vựng, ngữ pháp và bài học đã lưu trên NT.' },
  '/mistakes': { title: 'Sổ lỗi sai | NT', description: 'Xem lại câu trả lời sai và luyện lại kiến thức cần củng cố.' },
  '/profile': { title: 'Hồ sơ người học | NT', description: 'Xem hồ sơ, mục tiêu và thành tích học ngôn ngữ của bạn.' },
  '/settings': { title: 'Cài đặt học tập | NT', description: 'Chọn ngôn ngữ, cấp độ, mục tiêu từ vựng, tốc độ phát âm và giao diện NT.' },
}

export function getLanguageSeo(languageId) {
  const language = getLanguage(languageId)
  const copy = languageCopy[languageId]
  if (!language || !copy) return null
  return {
    title: `Học ${copy.vi} online theo ${copy.target} | NT`,
    description: copy.summary,
    keywords: `${copy.keyword}, học ${copy.vi} online, ${language.framework}, từ vựng ${copy.vi}, ngữ pháp ${copy.vi}`,
  }
}

export function getSeoForPath(pathname, search = '') {
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  const direct = staticMeta[path]
  if (direct) return { ...direct, path }
  const languageLanding = path.match(/^\/learn-(english|chinese|japanese|korean)$/)
  if (languageLanding) return { ...getLanguageSeo(languageLanding[1]), path }
  const lessonMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)\/lessons\/([^/]+)$/)
  if (lessonMatch) {
    const language = getLanguage(lessonMatch[1]); const level = findLevel(language, lessonMatch[2]); const lessonName = lessonMatch[3].split('-').slice(-3).join(' ')
    return { title: `${language?.name || 'Language'} ${level?.[0] || ''}: ${lessonName} | NT`, description: `Bài học ${language?.name || ''} ${level?.[0] || ''} trên NT gồm từ vựng, ngữ pháp, nghe, nói, đọc, viết và bài kiểm tra.`, keywords: `${language?.name} ${level?.[0]} lesson, từ vựng, ngữ pháp`, path }
  }
  const resourceMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)\/(vocabulary|grammar)$/)
  if (resourceMatch) {
    const language = getLanguage(resourceMatch[1]); const level = findLevel(language, resourceMatch[2]); const resource = resourceMatch[3]
    const label = resource === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'
    return { title: `${label} ${language?.name || ''} ${level?.[0] || ''} | NT`, description: `Học ${label.toLowerCase()} ${language?.name || ''} cấp độ ${level?.[0] || ''} với nội dung theo ngữ cảnh, ví dụ và bài luyện trên NT.`, keywords: `${language?.name} ${level?.[0]} ${resource}, ${label.toLowerCase()} ${level?.[0]}`, path }
  }
  const levelMatch = path.match(/^\/(english|chinese|japanese|korean)\/([^/]+)$/)
  if (levelMatch) {
    const language = getLanguage(levelMatch[1]); const level = findLevel(language, levelMatch[2]); const copy = languageCopy[levelMatch[1]]
    if (language && level) return { title: `${language.name} ${level[0]}: Lộ trình và bài học | NT`, description: `Học ${copy.vi} ${level[0]} với lộ trình từ vựng, ngữ pháp, nghe, nói, đọc và viết. Xem mục tiêu, thời lượng và toàn bộ bài học.`, keywords: `${language.name} ${level[0]}, ${copy.keyword}, ${language.name} ${level[0]} vocabulary`, path }
  }
  const fallbackName = path.split('/').filter(Boolean).map((part) => part.replaceAll('-', ' ')).join(' · ')
  return { title: `${fallbackName || 'Học ngôn ngữ'} | NT`, description: 'Học ngôn ngữ theo lộ trình, luyện từ vựng, ngữ pháp và đủ bốn kỹ năng trên NT.', path, search }
}

export function publicSeoPaths() {
  return [
    ...coreSeoRoutes,
    ...languages.flatMap((language) => language.levels.flatMap(([level]) => [
      `/${language.id}/${levelSlug(level)}`,
      `/${language.id}/${levelSlug(level)}/vocabulary`,
      `/${language.id}/${levelSlug(level)}/grammar`,
    ])),
  ]
}

