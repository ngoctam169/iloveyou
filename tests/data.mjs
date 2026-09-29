import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { allSearchItems, getLesson, getRoadmap } from '../src/data/courses.js'
import { englishLevels } from '../src/data/levels.js'
import { findLevel, getLanguage } from '../src/data/languages.js'
import { averageSkillScores, getLevelProgress, progressKey } from '../src/utils/progress.js'
import { ieltsListening, ieltsReading, ieltsSpeaking, ieltsWriting } from '../src/data/ielts/index.js'
import { vocabulary } from '../src/data/vocabulary/index.js'
import { vocabularyCatalog } from '../src/data/vocabulary/catalog.js'
import { toeicListeningQuestions, toeicMiniTest, toeicReading } from '../src/data/toeic/index.js'
import { toeicFullSections, toeicFullStats } from '../src/data/exams/toeicFull.js'
import { ieltsFullListening, ieltsFullReading, ieltsFullSections, ieltsAcademicWritingTasks } from '../src/data/exams/ieltsFull.js'
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

assert(toeicFullStats.total === 200 && toeicFullStats.listening === 100 && toeicFullStats.reading === 100, 'TOEIC full mock must contain 200 questions split 100/100')
assert(JSON.stringify(toeicFullStats.parts) === JSON.stringify({ 1:6,2:25,3:39,4:30,5:30,6:16,7:54 }), 'TOEIC full mock part distribution is incorrect')
assert(toeicFullSections[0].duration === 45*60 && toeicFullSections[1].duration === 75*60, 'TOEIC full mock timing is incorrect')
assert(ieltsFullListening.length === 40 && ieltsFullReading.length === 40, 'IELTS full mock must have 40 Listening and 40 Reading questions')
assert(ieltsFullSections[0].duration === 30*60 && ieltsFullSections[1].duration === 60*60, 'IELTS objective timing is incorrect')
assert(ieltsAcademicWritingTasks.length === 2 && ieltsAcademicWritingTasks[0].minWords === 150 && ieltsAcademicWritingTasks[1].minWords === 250, 'IELTS Writing full mock must contain Task 1 and Task 2')
assert(new Set([...toeicFullSections.flatMap((section)=>section.questions),...ieltsFullListening,...ieltsFullReading].map((item)=>item.id)).size === 280, 'Full exam question ids must be unique')

for (const level of Object.keys(expectedTopics)) {
  assert(englishLevels[level], `Missing English metadata for ${level}`)
  const roadmap = getRoadmap('english', level)
  assert(JSON.stringify(roadmap.map((unit) => unit.title)) === JSON.stringify(expectedTopics[level]), `${level} roadmap topics are incorrect`)
  const levelLessons = roadmap.flatMap((unit) => unit.lessons)
  assert(levelLessons.length === 60, `${level} must have exactly 60 usable lessons`)
  assert(roadmap.every((unit) => unit.lessons.length >= 6), `${level} units are still too thin`)
  assert(new Set(levelLessons.map((lesson) => lesson.listening.audio)).size >= 30, `${level} listening content is too repetitive`)
  assert(new Set(levelLessons.map((lesson) => lesson.reading.text)).size >= 30, `${level} reading content is too repetitive`)
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

for (const language of ['chinese','japanese','korean']) {
  const languageMeta = getLanguage(language)
  for (const [level] of languageMeta.levels) {
    const roadmap = getRoadmap(language,level)
    const lessons = roadmap.flatMap((unit) => unit.lessons)
    assert(lessons.length === 60, `${language} ${level} must have exactly 60 lessons`)
    assert(roadmap.length === 10 && new Set(roadmap.map((unit) => unit.title)).size === 10, `${language} ${level} must expose 10 distinct curriculum units`)
    assert(new Set(lessons.map((lesson) => lesson.id)).size === 60, `${language} ${level} contains duplicate lesson ids`)
    assert(new Set(lessons.map((lesson) => lesson.grammar?.name)).size >= 3, `${language} ${level} is still recycling a beginner grammar seed`)
    assert(lessons.every((lesson) => lesson.vocab?.length >= 3 && lesson.listening?.audio && lesson.reading?.text && lesson.writing && lesson.quiz), `${language} ${level} has incomplete expanded lessons`)
    const levelIndex = languageMeta.levels.findIndex(([name]) => name === level)
    if (levelIndex >= 3) assert(lessons.some((lesson) => Number(lesson.writing?.minWords) >= 80), `${language} ${level} lacks advanced production tasks`)
  }
}

const independent = { levelProgress: { [progressKey('english', 'B2')]: { completedLessons: ['english-b2-1-1'] } } }
assert(getLevelProgress(independent, 'english', 'B2').completedLessons.length === 1, 'B2 progress lookup failed')
assert(getLevelProgress(independent, 'english', 'A1').completedLessons.length === 0, 'Progress leaked between levels')
assert(averageSkillScores({ one: { Listening: 60 }, two: { Listening: 100 } }).Listening === 80, 'Skill average is incorrect')

assert(vocabularyCatalog.length >= 150, 'Vocabulary catalogue did not include lesson words')
assert(new Set(vocabularyCatalog.map(wordKey)).size === vocabularyCatalog.length, 'Vocabulary catalogue contains duplicate schedule keys')
assert(vocabularyCatalog.every((word) => word.word && word.meaningVi && word.level && word.languageId), 'Vocabulary catalogue contains incomplete core fields')
for (const [language, minimumExampleShare] of [['english', .4], ['chinese', .05], ['japanese', .2], ['korean', .6]]) {
  const entries = vocabularyCatalog.filter((word) => word.languageId === language)
  assert(entries.filter((word) => word.example).length / entries.length >= minimumExampleShare, `${language} has insufficient sourced examples`)
}
for (const language of ['english','chinese','japanese','korean']) {
  for (const [level] of getLanguage(language).levels) {
    const entries = vocabularyCatalog.filter((word) => word.languageId === language && word.level === level)
    assert(entries.length >= 900 && entries.length <= 1100, `${language} ${level} should have about 1000 words; got ${entries.length}`)
    assert(new Set(entries.map((word) => word.word.normalize('NFKC').toLocaleLowerCase())).size === entries.length, `${language} ${level} repeats a word`)
  }
}
assert(grammarEntries.length >= 50 && grammarEntries.every((item) => item.name && item.structure && item.explanation && item.examples.length >= 2 && item.mistake), 'Grammar library has incomplete topics')
for (const language of ['english','chinese','japanese','korean']) for (const [level] of getLanguage(language).levels) assert(grammarEntries.some((item) => item.languageId === language && item.level === level), `${language} ${level} has no grammar topic`)
for (const level of Object.keys(expectedTopics)) {
  const entries = vocabularyCatalog.filter((word) => word.languageId === 'english' && word.level === level)
  assert(entries.length >= 900, `${level} has fewer than about 1000 vocabulary entries`)
}
const custom = normalizePersonalWord({ languageId:'japanese', level:'N3', word:'経験', meaningVi:'kinh nghiệm', example:'経験があります。', translation:'Tôi có kinh nghiệm.', topic:'Work' }, 'personal-test')
const combined = { personalVocabulary:[custom] }
assert(vocabularyForState(combined, 'japanese', 'N3').some((word) => word.id === custom.id), 'Personal vocabulary is missing from its selected level')
assert(allVocabulary(combined).length === vocabularyCatalog.length + 1, 'Personal vocabulary did not join the catalogue')
for (const language of ['english', 'chinese', 'japanese', 'korean']) {
  assert(vocabularyCatalog.some((word) => word.languageId === language), `${language} vocabulary is missing`)
}
for (const language of ['chinese', 'japanese', 'korean']) assert(new Set(vocabularyCatalog.filter((word) => word.languageId === language).map((word) => word.word)).size === vocabularyCatalog.filter((word) => word.languageId === language).length, `${language} vocabulary is duplicated across app levels`)
assert(getVocabularyByLanguage({}, 'english').length >= 5400, 'Language vocabulary helper returned too few words')
assert(getVocabularyByLevel({}, 'chinese', 'HSK 1').every((word) => word.languageId === 'chinese' && word.level === 'HSK 1'), 'Level vocabulary helper leaked another scope')
const topicSample = vocabularyCatalog.find((word) => word.languageId === 'english' && word.topic)
assert(getVocabularyByTopic({}, 'english', topicSample.topic).every((word) => word.topic === topicSample.topic), 'Topic vocabulary helper returned a wrong topic')
assert(searchVocabulary(vocabularyCatalog, topicSample.meaningVi).some((word) => wordKey(word) === wordKey(topicSample)), 'Vocabulary search did not index Vietnamese meanings')
assert(getRandomVocabulary(vocabularyCatalog, { languageId:'japanese' }, 7).length === 7, 'Random vocabulary helper returned the wrong batch size')
const dueWord = vocabularyCatalog.find((word) => word.languageId === 'korean')
assert(getReviewVocabulary({ flashcardProgress:{ [wordKey(dueWord)]:{ nextReview:'2000-01-01T00:00:00.000Z' } } }, 'korean', dueWord.level).some((word) => wordKey(word) === wordKey(dueWord)), 'Review vocabulary helper omitted a due word')
const practiceWord = vocabularyCatalog.find((word) => word.languageId === 'english' && word.level === 'B1' && word.word === 'adapt')
const practice = buildVocabularyPractice(Array(11).fill(practiceWord), vocabularyCatalog)
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
