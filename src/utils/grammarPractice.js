import { grammarEntries } from '../data/grammar.js'

export function grammarEntryFor(languageId, level, name) {
  return grammarEntries.find((item) => item.languageId === languageId && item.level === level && item.name === name)
    || grammarEntries.find((item) => item.languageId === languageId && item.name === name)
}

export function buildGrammarQuestion(entry) {
  const peers = grammarEntries.filter((item) => item.languageId === entry.languageId && item.name !== entry.name)
  const options = [entry.name, ...peers.slice(0, 3).map((item) => item.name)]
  const offset = entry.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length
  const rotated = [...options.slice(offset), ...options.slice(0, offset)]
  return { type:'Grammar Quiz', question:`Câu “${entry.examples[0]}” minh họa cấu trúc nào?`, options:rotated, answer:rotated.indexOf(entry.name), explanation:`${entry.name}: ${entry.structure}. ${entry.explanation}` }
}
