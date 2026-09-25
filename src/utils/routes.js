import { levelSlug } from '../data/languages'

export const languagePath = (languageId) => `/learn-${languageId}`
export const levelPath = (languageId, level) => `/${languageId}/${levelSlug(level)}`
export const vocabularyPath = (languageId, level, word = '') => {
  const base = level ? `${levelPath(languageId, level)}/vocabulary` : languageId === 'english' ? '/english-vocabulary' : '/vocabulary'
  return word ? `${base}?word=${encodeURIComponent(word)}` : base
}
export const grammarPath = (languageId, level, topic = '') => {
  const base = level ? `${levelPath(languageId, level)}/grammar` : languageId === 'english' ? '/english-grammar' : '/grammar'
  return topic ? `${base}?topic=${encodeURIComponent(topic)}` : base
}
export const lessonPath = (languageId, level, lessonId) => `${levelPath(languageId, level)}/lessons/${lessonId}`

