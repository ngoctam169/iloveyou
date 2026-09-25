import { languages } from '../data/languages.js'

export function normalizePersonalWord(input, existingId) {
  const language = languages.find((item) => item.id === input.languageId)
  if (!language || !language.levels.some(([level]) => level === input.level)) throw new Error('Chọn ngôn ngữ và level hợp lệ.')
  const word = String(input.word || '').trim().replace(/\s+/g, ' ')
  const meaningVi = String(input.meaningVi || '').trim()
  if (!word || !meaningVi) throw new Error('Nhập từ và nghĩa tiếng Việt.')
  const list = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
  return {
    id: existingId || `personal-${crypto.randomUUID()}`, personal: true,
    languageId: language.id, level: input.level, word, meaningVi,
    ipa: String(input.ipa || '').trim(), partOfSpeech: String(input.partOfSpeech || '').trim(),
    definition: String(input.definition || '').trim(), example: String(input.example || '').trim(),
    translation: String(input.translation || '').trim(), topic: String(input.topic || 'Personal').trim() || 'Personal',
    collocations: list(input.collocations), synonyms: list(input.synonyms), antonyms: list(input.antonyms),
    wordFamily: [], phrases: [], lessonIds: [], lessons: [],
  }
}
