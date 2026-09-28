import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { allSearchItems, getLesson, getRoadmap } from '../src/data/courses.js'
import { englishLevels } from '../src/data/levels.js'
import { findLevel, getLanguage } from '../src/data/languages.js'
import { averageSkillScores, getLevelProgress, progressKey } from '../src/utils/progress.js'
import { ieltsListening, ieltsReading, ieltsSpeaking, ieltsWriting } from '../src/data/ielts/index.js'
import { vocabulary } from '../src/data/vocabulary/index.js'
import { vocabularyCatalog } from '../src/data/vocabulary/catalog.js'
import { toeicListeningQuestions, toeicMiniTest, toeicReading } from '../src/data/toeic/index.js'
import { buildVocabularyPractice, checkVocabularyAnswer } from '../src/utils/vocabularyPractice.js'
import { isWeakVocabulary, nextSchedule, vocabularyStatus, wordKey } from '../src/utils/srs.js'
import { allVocabulary, getRandomVocabulary, getReviewVocabulary, getVocabularyByLanguage, getVocabularyByLevel, getVocabularyByTopic, normalizePersonalWord, searchVocabulary, vocabularyForState } from '../src/services/vocabularyService.js'
import { grammarEntries } from '../src/data/grammar.js'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const expectedTopics = {
  A1: ['Greetings', 'Introductions', 'Numbers', 'Family', 'Food', 'Daily Routine', 'Shopping', 'Directions'],
  A2: ['Travel', 'Past Experiences', 'Health', 'Work', 'Plans', 'Comparisons', 'Social Situations'],
  B1: ['Travel', 'Education', 'Career', 'Technology', 'Relationships', 'Environment', 'Opinions'],
  B2: ['Advanced Conversation', 'Debate', 'Business English', 'Media', 'Culture', 'Science', 'Problem Solving'],
  C1: ['Academic English', 'Professional Communication', 'Complex Grammar', 'Argumentation', 'Presentations', 'Advanced Writing'],
  C2: ['Native-level Expressions', 'Advanced Nuance', 'Academic Analysis', 'Professional Writing', 'Debate', 'Literature', 'Complex Listening'],
}

const lessonIds = new Set()
const listeningTypes = new Set()
const quizTypes = new Set()
const writingTypes = new Set()

assert(vocabulary.length >= 50, 'Vocabulary demo must include at least 50 words')
assert(vocabulary.every((word) => word.word && word.ipa && word.meaningVi && word.definition && word.example && word.translation && word.collocations.length), 'Vocabulary cards are incomplete')
assert(toeicListeningQuestions.length >= 10 && toeicReading.length >= 15 && toeicMiniTest.length >= 20, 'TOEIC demo data is incomplete')
assert(toeicListeningQuestions.every((item) => item.audio && item.transcript && item.translation && item.explanation && item.vocabulary.length), 'TOEIC Listening detail is incomplete')
assert(toeicReading.every((item) => item.grammarPoint && item.whyWrong), 'TOEIC Reading explanation is incomplete')
assert(ieltsListening.length >= 10 && ieltsReading.length >= 2 && ieltsWriting.length >= 3 && ieltsSpeaking.length >= 10, 'IELTS demo data is incomplete')
assert(ieltsReading.every((passage) => passage.questions.every((item) => item.paragraph && item.questionKeyword && item.passageKeyword)), 'IELTS Reading evidence is incomplete')

for (const level of Object.keys(expectedTopics)) {
  assert(englishLevels[level], `Missing English metadata for ${level}`)
  const roadmap = getRoadmap('english', level)
  assert(JSON.stringify(roadmap.map((unit) => unit.title)) === JSON.stringify(expectedTopics[level]), `${level} roadmap topics are incorrect`)
  assert(roadmap.every((unit) => unit.lessons.length === 3), `${level} must have three usable lessons per unit`)
  for (const lesson of roadmap.flatMap((unit) => unit.lessons)) {
    assert(!lessonIds.has(lesson.id), `Duplicate lesson id: ${lesson.id}`)
    lessonIds.add(lesson.id)
    assert(getLesson('english', level, lesson.id)?.id === lesson.id, `Lesson route cannot resolve ${lesson.id}`)
    assert(lesson.vocab.length >= 3 && lesson.vocab.every((word) => word.length === 6), `${lesson.id} vocabulary is incomplete`)
    assert(lesson.grammar?.structure && lesson.grammar?.examples?.length, `${lesson.id} grammar is incomplete`)
    assert(lesson.listening?.audio && lesson.listening?.type, `${lesson.id} listening activity is incomplete`)
    assert(lesson.target && lesson.reading?.text && lesson.writing?.type && lesson.quiz?.type, `${lesson.id} is missing a core skill`)
    listeningTypes.add(lesson.listening.type)
    quizTypes.add(lesson.quiz.type)
    writingTypes.add(lesson.writing.type)
  }
}

for (const type of ['Listen & Choose', 'Dictation', 'Fill in the Blank', 'Listen & Answer', 'Conversation Listening']) assert(listeningTypes.has(type), `Missing listening type: ${type}`)
for (const type of ['Multiple Choice', 'Fill Blank', 'Reorder Sentence', 'Matching', 'True False', 'Vocabulary Quiz', 'Grammar Quiz', 'Listening Quiz']) assert(quizTypes.has(type), `Missing quiz type: ${type}`)
for (const type of ['Reorder Sentence', 'Fill Missing Word', 'Write Simple Sentence', 'Email', 'Story', 'Opinion', 'Argumentative Writing', 'Formal Writing', 'Academic-style Writing']) assert(writingTypes.has(type), `Missing writing type: ${type}`)

for (const item of allSearchItems) {
  const [, languageId, slug, route, lessonId] = item.path.split('/')
  const language = getLanguage(languageId)
  const level = findLevel(language, slug)?.[0]
  assert(route === 'lessons' && level && getLesson(languageId, level, lessonId), `Broken search path: ${item.path}`)
}

const independent = { levelProgress: { [progressKey('english', 'B2')]: { completedLessons: ['english-b2-1-1'] } } }
assert(getLevelProgress(independent, 'english', 'B2').completedLessons.length === 1, 'B2 progress lookup failed')
assert(getLevelProgress(independent, 'english', 'A1').completedLessons.length === 0, 'Progress leaked between levels')
assert(averageSkillScores({ one: { Listening: 60 }, two: { Listening: 100 } }).Listening === 80, 'Skill average is incorrect')

assert(vocabularyCatalog.length >= 100, 'Compact authored vocabulary fallback is unexpectedly small')
assert(new Set(vocabularyCatalog.map(wordKey)).size === vocabularyCatalog.length, 'Compact vocabulary fallback contains duplicate schedule keys')
assert(vocabularyCatalog.every((word) => word.word && word.meaningVi && word.level && word.languageId), 'Compact vocabulary fallback contains incomplete core fields')

const vocabularyDataRoot = new URL('../public/vocabulary-data/', import.meta.url)
const vocabularyManifestUrl = new URL('manifest.json', vocabularyDataRoot)
assert(existsSync(vocabularyManifestUrl), 'Generated vocabulary manifest is missing; run npm run build:vocabulary')
const vocabularyManifest = JSON.parse(readFileSync(vocabularyManifestUrl, 'utf8'))
assert(vocabularyManifest.targetPerLevel === 1000, 'Vocabulary target must remain 1000 words per level')
const expectedVocabularyLevels = {
  english:['A1','A2','B1','B2','C1','C2'],
  chinese:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'],
  japanese:['N5','N4','N3','N2','N1'],
  korean:['TOPIK 1','TOPIK 2','TOPIK 3','TOPIK 4','TOPIK 5','TOPIK 6'],
}
const generatedSamples = {}
let generatedVocabularyCount = 0
for (const [languageId, levels] of Object.entries(expectedVocabularyLevels)) {
  for (const level of levels) {
    const meta = vocabularyManifest.languages?.[languageId]?.[level]
    assert(meta?.count === 1000, `${languageId} ${level} must contain exactly 1000 generated words`)
    const words = JSON.parse(readFileSync(new URL(meta.file, vocabularyDataRoot), 'utf8'))
    assert(words.length === 1000, `${languageId} ${level} file does not contain 1000 words`)
    assert(words.every((word) => word.languageId === languageId && word.level === level && word.word && word.meaningVi && word.source && word.officialLevel && word.levelBasis), `${languageId} ${level} contains incomplete generated words`)
    assert(new Set(words.map((word) => word.word.normalize('NFKC').toLocaleLowerCase())).size === words.length, `${languageId} ${level} repeats a word inside the level`)
    generatedSamples[`${languageId}:${level}`] = words
    generatedVocabularyCount += words.length
  }
}
assert(generatedVocabularyCount === 23000, `Expected 23,000 lazy vocabulary records, got ${generatedVocabularyCount}`)

assert(grammarEntries.length >= 50 && grammarEntries.every((item) => item.name && item.structure && item.explanation && item.examples.length >= 2 && item.mistake), 'Grammar library has incomplete topics')
for (const language of ['english','chinese','japanese','korean']) for (const [level] of getLanguage(language).levels) assert(grammarEntries.some((item) => item.languageId === language && item.level === level), `${language} ${level} has no grammar topic`)
for (const [level, minimum] of Object.entries({ A1:50, A2:50, B1:50, B2:50, C1:30, C2:30 })) {
  const entries = vocabularyCatalog.filter((word) => word.languageId === 'english' && word.level === level)
  assert(entries.length >= minimum, `${level} has fewer than ${minimum} vocabulary entries`)
  assert(new Set(entries.map((word) => word.word.toLocaleLowerCase())).size === entries.length, `${level} repeats a word`)
}
const custom = normalizePersonalWord({ languageId:'japanese', level:'N3', word:'経験', meaningVi:'kinh nghiệm', example:'経験があります。', translation:'Tôi có kinh nghiệm.', topic:'Work' }, 'personal-test')
const combined = { personalVocabulary:[custom] }
assert(vocabularyForState(combined, 'japanese', 'N3').some((word) => word.id === custom.id), 'Personal vocabulary is missing from its selected level')
assert(allVocabulary(combined).length === vocabularyCatalog.length + 1, 'Personal vocabulary did not join the catalogue')
for (const language of ['english', 'chinese', 'japanese', 'korean']) {
  assert(vocabularyCatalog.some((word) => word.languageId === language), `${language} compact fallback vocabulary is missing`)
}
assert(generatedSamples['english:A1'].length === 1000 && generatedSamples['korean:TOPIK 6'].length === 1000, 'Generated edge levels are incomplete')
assert(getVocabularyByLevel({}, 'chinese', 'HSK 1').every((word) => word.languageId === 'chinese' && word.level === 'HSK 1'), 'Level vocabulary helper leaked another scope')
const topicSample = vocabularyCatalog.find((word) => word.languageId === 'english' && word.topic)
assert(getVocabularyByTopic({}, 'english', topicSample.topic).every((word) => word.topic === topicSample.topic), 'Topic vocabulary helper returned a wrong topic')
assert(searchVocabulary(vocabularyCatalog, topicSample.meaningVi).some((word) => wordKey(word) === wordKey(topicSample)), 'Vocabulary search did not index Vietnamese meanings')
assert(getRandomVocabulary(vocabularyCatalog, { languageId:'japanese' }, 7).length === 7, 'Random vocabulary helper returned the wrong batch size')
const dueWord = vocabularyCatalog.find((word) => word.languageId === 'korean')
assert(getReviewVocabulary({ flashcardProgress:{ [wordKey(dueWord)]:{ nextReview:'2000-01-01T00:00:00.000Z' } } }, 'korean', dueWord.level).some((word) => wordKey(word) === wordKey(dueWord)), 'Review vocabulary helper omitted a due word')
const practiceCatalogue = generatedSamples['english:B1']
const practiceWord = practiceCatalogue[0]
const practice = buildVocabularyPractice(Array(11).fill(practiceWord), practiceCatalogue)
assert(new Set(practice.map((question) => question.kind)).size === 11, 'Unified vocabulary practice is missing a question type')
assert(practice.every((question) => question.kind === 'match' ? question.pairs.length === 3 && question.pairs.every((word) => question.options.includes(word.meaningVi)) : question.options ? checkVocabularyAnswer(question, question.answer) : checkVocabularyAnswer(question, question.correct)), 'Vocabulary practice has an invalid answer')
const hard = nextSchedule(nextSchedule({}, 'hard'), 'hard')
assert(hard.repetitions === 0 && isWeakVocabulary(hard), 'Repeated Hard ratings must not master a word')
assert(hard.correct === 0 && hard.hardCount === 2, 'Uncertain recall must remain separate from correct recall')
assert(vocabularyStatus({ ...nextSchedule({}, 'good'), nextReview: new Date(0).toISOString() }) === 'Review Today', 'Due words must remain visible in Review Today')

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : ['.js', '.jsx'].includes(extname(entry.name)) ? [join(directory, entry.name)] : [])
}
const source = sourceFiles(new URL('../src', import.meta.url).pathname.replace(/^\/(.:)/, '$1')).map((path) => readFileSync(path, 'utf8')).join('\n')
assert(!/\b(locked|isUnlocked|requiredLevel|previousLevelCompleted)\b/.test(source), 'A level-locking symbol remains in source')

console.log(`DATA PASS: ${lessonIds.size} English lessons, ${listeningTypes.size} listening types, ${quizTypes.size} quiz types, ${allSearchItems.length} searchable items`)
