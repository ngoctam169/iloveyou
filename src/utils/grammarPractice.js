import { grammarEntries } from '../data/grammar.js'

export function grammarEntryFor(languageId, level, name) {
  return grammarEntries.find((item) => item.languageId === languageId && item.level === level && item.name === name)
    || grammarEntries.find((item) => item.languageId === languageId && item.name === name)
}

export function buildGrammarQuestion(entry) {
  const peers = grammarEntries.filter((item) => item.languageId === entry.languageId && item.level === entry.level && item.name !== entry.name)
  const useStructure = Boolean(entry.referenceOnly)
  const correct = useStructure ? entry.structure : entry.name
  const candidates = peers.map((item) => useStructure ? item.structure : item.name)
  const unique = [correct, ...candidates.filter((value) => value && value !== correct)].slice(0, 4)
  const offset = entry.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % unique.length
  const options = [...unique.slice(offset), ...unique.slice(0, offset)]
  return {
    type:'Grammar Quiz',
    question:useStructure ? `Cấu trúc nào đúng với “${entry.name}”?` : `Câu “${entry.examples[0]}” minh họa cấu trúc nào?`,
    options,
    answer:options.indexOf(correct),
    explanation:`${entry.name}: ${entry.structure}. ${entry.explanation}`,
  }
}
