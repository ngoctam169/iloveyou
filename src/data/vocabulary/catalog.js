import { getRoadmap } from '../courses.js'
import { languages, levelSlug } from '../languages.js'
import { vocabulary as editorialWords } from './index.js'
import { extendedVocabulary } from './extended.js'
import { multilingualVocabulary } from './multilingual.js'
import { generatedVocabulary } from './generated/index.js'
import { topicVocabulary } from './topics.js'

export const vocabularyId = (word) => String(word).normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g, '-')

const catalogue = new Map()
const multilingualAuthoredWords = new Set(multilingualVocabulary.map((word) => `${word.languageId}:${vocabularyId(word.word)}`))
const setAuthoredWord = (key, word) => {
  const generated = catalogue.get(key)
  if (!generated) return catalogue.set(key, word)
  const merged = { ...generated, ...word }
  for (const field of ['ipa', 'partOfSpeech', 'definition', 'example', 'translation', 'topic', 'exam']) {
    if (!word[field] && generated[field]) merged[field] = generated[field]
  }
  catalogue.set(key, merged)
}
for (const word of generatedVocabulary) {
  if (word.languageId !== 'english' && multilingualAuthoredWords.has(`${word.languageId}:${vocabularyId(word.word)}`)) continue
  const key = `${word.languageId}:${word.level}:${vocabularyId(word.word)}`
  catalogue.set(key, word)
}
for (const word of editorialWords) {
  const languageId = 'english'
  const id = vocabularyId(word.word)
  setAuthoredWord(`${languageId}:${word.level}:${id}`, { ...word, languageId, id, lessonIds: [], lessons: [] })
}
for (const word of topicVocabulary) {
  const key = `${word.languageId}:${word.level}:${vocabularyId(word.word)}`
  setAuthoredWord(key, word)
}
for (const word of extendedVocabulary) {
  const key = `${word.languageId}:${word.level}:${vocabularyId(word.word)}`
  setAuthoredWord(key, word)
}
for (const word of multilingualVocabulary) {
  const key = `${word.languageId}:${word.level}:${vocabularyId(word.word)}`
  setAuthoredWord(key, word)
}

for (const language of languages) {
  for (const [level] of language.levels) {
    for (const unit of getRoadmap(language.id, level)) {
      for (const lesson of unit.lessons) {
        for (const row of lesson.vocab || []) {
          const id = vocabularyId(row[0])
          const key = `${language.id}:${level}:${id}`
          const source = { id: lesson.id, title: lesson.title, path: `/${language.id}/${levelSlug(level)}/lessons/${lesson.id}` }
          const existing = catalogue.get(key)
          if (existing) {
            if (!existing.lessonIds.includes(lesson.id)) catalogue.set(key, { ...existing, lessonIds: [...existing.lessonIds, lesson.id], lessons: [...existing.lessons, source] })
          } else {
            catalogue.set(key, {
              id, languageId: language.id, level, word: row[0], ipa: row[1] || '', partOfSpeech: row[2] || '',
              meaningVi: row[3] || '', definition: '', example: row[4] || '', translation: row[5] || '',
              topic: lesson.topic || unit.title, exam: 'General', collocations: [], synonyms: [], antonyms: [],
              wordFamily: [], phrases: [], lessonIds: [lesson.id], lessons: [source],
            })
          }
        }
      }
    }
  }
}

const normalizedLevelWord = (word) => ({
  ...word,
  appLevel: word.appLevel || word.level,
  sourceLevel: word.sourceLevel || word.level,
  levelStatus: word.levelStatus || 'editorial',
})

const deduplicated = new Map()
for (const rawWord of catalogue.values()) {
  const word = normalizedLevelWord(rawWord)
  const meaningKey = vocabularyId(word.meaningVi || '')
  const key = word.languageId === 'english'
    ? `${word.languageId}:${vocabularyId(word.word)}:${meaningKey}`
    : `${word.languageId}:${vocabularyId(word.word)}`
  const existing = deduplicated.get(key)
  if (!existing || (!existing.lessonIds?.length && word.lessonIds?.length)) deduplicated.set(key, word)
}

export const vocabularyCatalog = [...deduplicated.values()]
export const vocabularyFor = (languageId, level) => vocabularyCatalog.filter((word) => word.languageId === languageId && (!level || word.level === level))
export const findVocabulary = (languageId, level, word) => catalogue.get(`${languageId}:${level}:${vocabularyId(word)}`)
