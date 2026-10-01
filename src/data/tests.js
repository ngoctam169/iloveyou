import { getRoadmap } from './courses.js'
import { getLanguage } from './languages.js'

const normalize = (value = '') => String(value).normalize('NFKC').trim()
const unique = (values) => [...new Set(values.map(normalize).filter(Boolean))]

function choices(correct, distractors, shift = 0) {
  const values = unique([correct, ...distractors]).slice(0, 4)
  while (values.length < 4) values.push(`— ${values.length + 1} —`)
  const amount = ((shift % values.length) + values.length) % values.length
  const options = [...values.slice(amount), ...values.slice(0, amount)]
  return { options, answer:options.indexOf(normalize(correct)) }
}

export function buildPlacementQuestions(languageId = 'english') {
  const language = getLanguage(languageId) || getLanguage('english')
  const levelLessons = language.levels.map(([level]) => getRoadmap(language.id, level).flatMap((unit) => unit.lessons))
  const grammarPool = unique(levelLessons.flatMap((lessons) => lessons.slice(0, 5).map((lesson) => lesson.grammar?.structure)))
  const meaningPool = unique(levelLessons.flatMap((lessons) => lessons.slice(0, 8).flatMap((lesson) => lesson.vocab?.map((word) => word[3]) || [])))

  return language.levels.flatMap(([level], levelIndex) => {
    const lessons = levelLessons[levelIndex]
    const pick = (fraction) => lessons[Math.min(lessons.length - 1, Math.floor((lessons.length - 1) * fraction))]
    const vocabLesson = pick(.12)
    const grammarLesson = pick(.38)
    const readingLesson = pick(.64)
    const listeningLesson = pick(.86)
    const word = vocabLesson.vocab[0]
    const listenWord = listeningLesson.vocab[0]

    const vocab = choices(word[3], meaningPool.filter((item) => item !== word[3]).slice(levelIndex * 2, levelIndex * 2 + 5), levelIndex)
    const grammar = choices(grammarLesson.grammar.structure, grammarPool.filter((item) => item !== grammarLesson.grammar.structure).slice(levelIndex, levelIndex + 5), levelIndex + 1)
    const reading = readingLesson.reading
    const listening = choices(
      listenWord[3],
      listeningLesson.vocab.slice(1).map((item) => item[3]).concat(meaningPool.filter((item) => item !== listenWord[3]).slice(0, 3)),
      levelIndex + 2,
    )

    return [
      { id:`${language.id}-${levelIndex}-vocab`, level, levelIndex, category:'Vocabulary', question:`“${word[0]}” gần nghĩa nhất với đáp án nào?`, options:vocab.options, answer:vocab.answer },
      { id:`${language.id}-${levelIndex}-grammar`, level, levelIndex, category:'Grammar', question:`Cấu trúc nào thuộc “${grammarLesson.grammar.name}”?`, options:grammar.options, answer:grammar.answer },
      { id:`${language.id}-${levelIndex}-reading`, level, levelIndex, category:'Reading', passage:reading.text, question:reading.question, options:reading.options, answer:reading.answer },
      { id:`${language.id}-${levelIndex}-listening`, level, levelIndex, category:'Listening', audio:listenWord[4] || listeningLesson.listening?.audio || listenWord[0], question:`Trong câu vừa nghe, “${listenWord[0]}” có nghĩa gần nhất là gì?`, options:listening.options, answer:listening.answer },
    ]
  })
}

export function placementResult(languageId, questions, answers) {
  const language = getLanguage(languageId) || getLanguage('english')
  const correct = questions.filter((question, index) => answers[index] === question.answer).length
  const byLevel = language.levels.map(([,], levelIndex) => {
    const indexes = questions.map((question,index) => [question,index]).filter(([question]) => question.levelIndex === levelIndex)
    const hits = indexes.filter(([question,index]) => answers[index] === question.answer).length
    return { levelIndex, correct:hits, total:indexes.length, rate:indexes.length ? hits / indexes.length : 0 }
  })
  let recommended = 0
  for (let levelIndex = 0; levelIndex < byLevel.length; levelIndex += 1) {
    const current = byLevel[levelIndex]
    const cumulativeIndexes = questions.map((question,index) => [question,index]).filter(([question]) => question.levelIndex <= levelIndex)
    const cumulativeCorrect = cumulativeIndexes.filter(([question,index]) => answers[index] === question.answer).length
    const cumulativeRate = cumulativeIndexes.length ? cumulativeCorrect / cumulativeIndexes.length : 0
    if (current.rate >= .5 && cumulativeRate >= .55) recommended = levelIndex
  }
  const categories = ['Vocabulary','Grammar','Reading','Listening'].map((category) => {
    const indexes = questions.map((question,index) => [question,index]).filter(([question]) => question.category === category)
    return [category,indexes.filter(([question,index]) => answers[index] === question.answer).length,indexes.length]
  })
  return { correct, total:questions.length, level:language.levels[recommended], levelIndex:recommended, categories, byLevel }
}

export const placementQuestions = buildPlacementQuestions('english')
