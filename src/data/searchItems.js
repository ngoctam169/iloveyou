import { getRoadmap } from './courses.js'
import { getLanguage, levelSlug } from './languages.js'

const languagesForSearch = () => ['english', 'chinese', 'japanese', 'korean'].map(getLanguage).filter(Boolean)

export const allSearchItems = languagesForSearch().flatMap((language) => language.levels.flatMap(([level]) =>
  getRoadmap(language.id, level).flatMap((unit) => unit.lessons.flatMap((lesson) => {
    const path = `/${language.id}/${levelSlug(level)}/lessons/${lesson.id}`
    return [
      { id: `${lesson.id}-lesson`, type:'Lesson', title:lesson.title, subtitle:`${language.name} · ${level} · ${unit.title}`, languageId:language.id, level, topic:unit.title, path },
      { id: `${lesson.id}-grammar`, type:'Grammar', title:lesson.grammar.name, subtitle:`${lesson.grammar.structure} · ${level}`, languageId:language.id, level, topic:unit.title, path },
      ...lesson.vocab.map((word, wordIndex) => ({ id:`${lesson.id}-vocab-${wordIndex}`, type:'Vocabulary', title:word[0], subtitle:`${word[3]} · ${level} · ${unit.title}`, languageId:language.id, level, topic:unit.title, path })),
    ]
  }))
))
