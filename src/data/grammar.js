import { getRoadmap } from './courses.js'
import { languages, levelSlug } from './languages.js'
import { levelGrammarBanks } from './curriculum.js'

export const grammarEntries = languages.flatMap((language) => language.levels.flatMap(([level], levelIndex) => {
  if (language.id !== 'english' && levelIndex > 0) {
    const bank = levelGrammarBanks[language.id]?.[level] || []
    const lessons = getRoadmap(language.id, level).flatMap((unit) => unit.lessons)
    return bank.map((row,index) => ({
      id:`${language.id}-${levelSlug(level)}-grammar-${index + 1}`,
      languageId:language.id,
      level,
      ...row,
      lessonPath:lessons.find((lesson) => lesson.grammar.name === row.name)
        ? `/${language.id}/${levelSlug(level)}/lessons/${lessons.find((lesson) => lesson.grammar.name === row.name).id}?section=grammar`
        : null,
    }))
  }
  const found = new Map()
  for (const lesson of getRoadmap(language.id, level).flatMap((unit) => unit.lessons)) {
    if (!found.has(lesson.grammar.name)) found.set(lesson.grammar.name, { id:`${language.id}-${levelSlug(level)}-grammar-${found.size + 1}`, languageId:language.id, level, ...lesson.grammar, lessonPath:`/${language.id}/${levelSlug(level)}/lessons/${lesson.id}?section=grammar` })
  }
  return [...found.values()]
}))
