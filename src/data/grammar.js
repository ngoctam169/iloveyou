import { getRoadmap } from './courses.js'
import { languages, levelSlug } from './languages.js'

export const grammarEntries = languages.flatMap((language) => language.levels.flatMap(([level]) => {
  const found = new Map()
  for (const lesson of getRoadmap(language.id, level).flatMap((unit) => unit.lessons)) {
    const grammar = lesson.grammar
    if (!grammar?.name || found.has(grammar.name)) continue
    found.set(grammar.name, {
      id:`${language.id}-${levelSlug(level)}-grammar-${found.size + 1}`,
      languageId:language.id,
      level,
      ...grammar,
      examples:Array.isArray(grammar.examples) ? grammar.examples : [],
      lessonPath:`/${language.id}/${levelSlug(level)}/lessons/${lesson.id}?section=grammar`,
    })
  }
  return [...found.values()]
}))
