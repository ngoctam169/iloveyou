import { grammarEntries } from '../data/grammar.js'

export function grammarEntryFor(languageId, level, name) {
  return grammarEntries.find((item) => item.languageId === languageId && item.level === level && item.name === name)
    || grammarEntries.find((item) => item.languageId === languageId && item.name === name)
}

export function buildGrammarQuestion(entry) {
  const sameLevel = grammarEntries.filter((item) => item.languageId === entry.languageId && item.level === entry.level && item.name !== entry.name)
  const sameLanguage = grammarEntries.filter((item) => item.languageId === entry.languageId && item.name !== entry.name)
  const distractors = [...sameLevel, ...sameLanguage].map((item) => item.name).filter((name, index, all) => all.indexOf(name) === index).slice(0, 3)
  const options = [entry.name, ...distractors]
  const offset = entry.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length
  const rotated = [...options.slice(offset), ...options.slice(0, offset)]
  return {
    type:'Grammar Quiz',
    question:`Cấu trúc nào phù hợp với mô tả: “${entry.explanation}”?`,
    options:rotated,
    answer:rotated.indexOf(entry.name),
    correctValue:entry.name,
    explanation:`${entry.name}: ${entry.structure}. ${entry.explanation}`,
  }
}
