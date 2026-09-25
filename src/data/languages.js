export const languages = [
  {
    id: 'english', name: 'English', nativeName: 'English', flag: '🇬🇧', framework: 'CEFR', color: '#7157d9',
    description: 'Giao tiếp tự tin trong học tập, công việc và cuộc sống.',
    levels: [
      ['A1', 'Beginner'], ['A2', 'Elementary'], ['B1', 'Intermediate'],
      ['B2', 'Upper Intermediate'], ['C1', 'Advanced'], ['C2', 'Proficient'],
    ],
  },
  {
    id: 'chinese', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', framework: 'HSK', color: '#df625e',
    description: 'Xây nền tảng Hán ngữ từ thanh điệu đến giao tiếp tự nhiên.',
    levels: [
      ['HSK 1', 'Starter'], ['HSK 2', 'Elementary'], ['HSK 3', 'Intermediate'],
      ['HSK 4', 'Upper Intermediate'], ['HSK 5', 'Advanced'], ['HSK 6', 'Mastery'],
    ],
  },
  {
    id: 'japanese', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', framework: 'JLPT', color: '#da557b',
    description: 'Học chữ, mẫu câu và văn hóa giao tiếp Nhật Bản.',
    levels: [['N5', 'Beginner'], ['N4', 'Elementary'], ['N3', 'Intermediate'], ['N2', 'Advanced'], ['N1', 'Proficient']],
  },
  {
    id: 'korean', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', framework: 'TOPIK', color: '#4583cf',
    description: 'Làm chủ Hangeul và giao tiếp tiếng Hàn từng bước.',
    levels: [
      ['TOPIK 1', 'Starter'], ['TOPIK 2', 'Elementary'], ['TOPIK 3', 'Intermediate'],
      ['TOPIK 4', 'Upper Intermediate'], ['TOPIK 5', 'Advanced'], ['TOPIK 6', 'Mastery'],
    ],
  },
]

export const getLanguage = (id) => languages.find((language) => language.id === id)
export const levelSlug = (level) => level.toLowerCase().replace(/\s+/g, '-')
export const findLevel = (language, slug) => language?.levels.find(([level]) => levelSlug(level) === slug)
