export const LESSON_CONTENT_VERSION = 2

const languageNames = { english:'tiếng Anh', chinese:'tiếng Trung', japanese:'tiếng Nhật', korean:'tiếng Hàn' }
const listeningTypes = ['Listen & Choose', 'Dictation', 'Fill in the Blank', 'Listen & Answer', 'Conversation Listening']
const quizTypes = ['Multiple Choice', 'Fill Blank', 'Reorder Sentence', 'Matching', 'True False', 'Vocabulary Quiz', 'Grammar Quiz', 'Listening Quiz']

const normalize = (value = '') => String(value).normalize('NFKC').trim().toLocaleLowerCase()
const unique = (items) => [...new Set(items.filter(Boolean))]
const lookupKey = (value) => normalize(value)
const tupleFromWord = (word) => [word.word || '', word.ipa || '', word.partOfSpeech || '', word.meaningVi || word.definition || '', word.example || '', word.translation || '']

function optionSet(correct, distractors, seed, limit = 3) {
  const alternatives = unique(distractors).filter((value) => value !== correct).slice(0, Math.max(0, limit - 1))
  const position = Math.abs(seed) % (alternatives.length + 1)
  const options = [...alternatives]
  options.splice(position, 0, correct)
  return { options, answer:position, correctValue:correct }
}

function sentenceContaining(word) {
  const example = word?.[4] || ''
  return example && normalize(example).includes(normalize(word?.[0])) ? example : ''
}

function fallbackStudyText(languageId, words) {
  const terms = words.map((word) => word[0]).filter(Boolean)
  if (languageId === 'chinese') return '本课学习“' + terms.join('”“') + '”。请注意这些词的意思和用法。'
  if (languageId === 'japanese') return 'このレッスンでは「' + terms.join('」「') + '」を学びます。意味と使い方を確認しましょう。'
  if (languageId === 'korean') return '이 수업에서는 ‘' + terms.join('’, ‘') + '’을 배웁니다. 뜻과 쓰임을 확인해 보세요.'
  return 'This lesson focuses on ' + terms.join(', ') + '. Notice how each word contributes a different meaning in context.'
}

function targetFor(languageId, words, seed) {
  const ordered = Array.from({ length:words.length }, (_, offset) => words[(seed + offset) % words.length])
  const sourced = ordered.map(sentenceContaining).find(Boolean)
  if (sourced) return sourced
  const first = words[seed % words.length]?.[0] || ''
  const second = words[(seed + 1) % words.length]?.[0] || ''
  if (languageId === 'chinese') return '今天我练习“' + first + '”和“' + second + '”的用法。'
  if (languageId === 'japanese') return '今日は「' + first + '」と「' + second + '」の使い方を練習します。'
  if (languageId === 'korean') return '오늘은 ‘' + first + '’, ‘' + second + '’의 쓰임을 연습합니다.'
  return 'Today I will use “' + first + '” and “' + second + '” in a clear response.'
}

function buildReading(lesson, words, seed) {
  const examples = unique(words.map((word) => word[4]))
  const text = examples.length >= 2 ? examples.slice(0, 3).join(' ') : (fallbackStudyText(lesson.languageId, words) + ' ' + (examples[0] || '')).trim()
  const visibleWords = words.filter((word) => normalize(text).includes(normalize(word[0])))
  const focusPool = visibleWords.length ? visibleWords : words
  const focus = focusPool[seed % focusPool.length]
  const mode = seed % 3
  if (mode === 1) {
    const answer = optionSet(focus[0], words.filter((word) => word !== focus).map((word) => word[0]), seed)
    return { title:lesson.topic + ' · Reading ' + lesson.number, text, question:'Từ nào trong đoạn có nghĩa là “' + focus[3] + '”?', type:'Multiple Choice', evidence:focus[0], ...answer }
  }
  if (mode === 2) {
    const wrongMeaning = words[(seed + 1) % words.length]?.[3] || focus[3]
    const statementTrue = seed % 2 === 0
    const claimed = statementTrue ? focus[3] : wrongMeaning
    const options = ['Đúng','Sai']
    const answer = statementTrue ? 0 : 1
    return { title:lesson.topic + ' · Reading ' + lesson.number, text, question:'Đúng hay sai: “' + focus[0] + '” có nghĩa là “' + claimed + '”.', options, answer, correctValue:options[answer], type:'True / False', evidence:focus[0] }
  }
  const answer = optionSet(focus[3], words.filter((word) => word !== focus).map((word) => word[3]), seed)
  return { title:lesson.topic + ' · Reading ' + lesson.number, text, question:'Trong đoạn đọc, “' + focus[0] + '” gần nghĩa nhất với đáp án nào?', type:'Multiple Choice', evidence:focus[0], ...answer }
}

function buildListening(lesson, words, seed) {
  const type = listeningTypes[(seed - 1) % listeningTypes.length]
  const focus = words[seed % words.length]
  const second = words[(seed + 1) % words.length]
  const focusSentence = sentenceContaining(focus)
  const secondSentence = sentenceContaining(second)
  const baseAudio = focusSentence || focus[0]
  if (type === 'Dictation') return { type, audio:baseAudio, prompt:'Nghe và chép lại chính xác nội dung bạn nghe được.', expected:baseAudio, correctValue:baseAudio, evidence:focus[0], explanation:'Nội dung đúng: “' + baseAudio + '”' }
  if (type === 'Fill in the Blank') {
    if (focusSentence) {
      const escaped = focus[0].replace(/[.*+?^$()|[\]\\]/g, '\\$&')
      return { type, audio:focusSentence, prompt:focusSentence.replace(new RegExp(escaped, 'i'), '_____'), expected:focus[0], correctValue:focus[0], evidence:focus[0], explanation:'Từ còn thiếu là “' + focus[0] + '”.' }
    }
    return { type, audio:focus[0], prompt:'Nghe và nhập chính xác từ bạn vừa nghe.', expected:focus[0], correctValue:focus[0], evidence:focus[0], explanation:'Từ đúng là “' + focus[0] + '” (' + focus[3] + ').' }
  }
  if (type === 'Conversation Listening') {
    const audio = unique([baseAudio, secondSentence || second[0]]).join(' ')
    return { type, audio, prompt:'Từ nào chắc chắn xuất hiện trong đoạn hội thoại?', evidence:focus[0], explanation:'Bạn có thể nghe thấy “' + focus[0] + '” trong đoạn.', ...optionSet(focus[0], words.filter((word) => word !== focus).map((word) => word[0]), seed) }
  }
  if (type === 'Listen & Answer') return { type, audio:baseAudio, prompt:'Từ “' + focus[0] + '” trong nội dung vừa nghe có nghĩa là gì?', evidence:focus[0], explanation:focus[0] + ': ' + focus[3] + '.', ...optionSet(focus[3], words.filter((word) => word !== focus).map((word) => word[3]), seed) }
  return { type, audio:baseAudio, prompt:'Bạn vừa nghe từ/cụm từ trọng tâm nào?', evidence:focus[0], explanation:'Từ trọng tâm là “' + focus[0] + '”.', ...optionSet(focus[0], words.filter((word) => word !== focus).map((word) => word[0]), seed) }
}

function reorderTask(sentence, fallback) {
  const clean = String(sentence || '').trim()
  const tokens = clean.replace(/[.!?。！？]+$/g, '').split(/\s+/).filter(Boolean)
  if (tokens.length >= 3) return { type:'Reorder Sentence', question:'Sắp xếp thành câu hoàn chỉnh.', expected:clean, correctValue:clean, tokens:[...tokens].sort((a,b)=>a.localeCompare(b)) }
  return { type:'Fill Blank', question:'Viết từ phù hợp với nghĩa “' + fallback[3] + '”.', expected:fallback[0], correctValue:fallback[0] }
}

function buildQuiz(lesson, words, seed, target, listening) {
  const requested = quizTypes[(seed - 1) % quizTypes.length]
  const focus = words[(seed + 1) % words.length]
  if (requested === 'Fill Blank') {
    const example = sentenceContaining(focus)
    if (example) {
      const escaped = focus[0].replace(/[.*+?^$()|[\]\\]/g, '\\$&')
      return { type:requested, question:example.replace(new RegExp(escaped, 'i'), '_____'), expected:focus[0], correctValue:focus[0], explanation:'Từ phù hợp là “' + focus[0] + '” (' + focus[3] + ').' }
    }
    return { type:requested, question:'Viết từ phù hợp với nghĩa “' + focus[3] + '”.', expected:focus[0], correctValue:focus[0], explanation:focus[0] + ': ' + focus[3] + '.' }
  }
  if (requested === 'Reorder Sentence') {
    const task = reorderTask(sentenceContaining(focus) || target, focus)
    return { ...task, explanation:task.type === 'Reorder Sentence' ? 'Câu đúng: “' + task.expected + '”' : focus[0] + ': ' + focus[3] + '.' }
  }
  if (requested === 'Matching') return { type:requested, question:'Ghép từng từ với đúng nghĩa của nó.', pairs:words.map((word)=>[word[0],word[3]]), correctValue:words.map((word)=>word[0] + '→' + word[3]).join('|'), explanation:'Mỗi cặp được lấy trực tiếp từ từ vựng của bài.' }
  if (requested === 'True False') {
    const wrongMeaning = words[(seed + 2) % words.length]?.[3] || focus[3]
    const statementTrue = seed % 2 === 0
    const claimed = statementTrue ? focus[3] : wrongMeaning
    const options = ['True','False']
    const answer = statementTrue ? 0 : 1
    return { type:requested, question:'“' + focus[0] + '” có nghĩa là “' + claimed + '”.', options, answer, correctValue:options[answer], explanation:focus[0] + ' có nghĩa là “' + focus[3] + '”.' }
  }
  if (requested === 'Grammar Quiz') {
    const correct = lesson.grammar?.structure || lesson.grammar?.name
    return { type:requested, question:'Cấu trúc nào là trọng tâm ngữ pháp của bài “' + lesson.title + '”?', explanation:(lesson.grammar?.name || '') + ': ' + correct + '.', ...optionSet(correct, [target, focus[0], words[(seed + 2) % words.length]?.[0]], seed) }
  }
  if (requested === 'Listening Quiz') {
    const correct = listening.correctValue || listening.expected || listening.options?.[listening.answer] || focus[0]
    return { type:requested, audio:listening.audio, question:'Đáp án nào khớp với nội dung nghe trọng tâm?', explanation:'Đáp án đúng được suy ra trực tiếp từ audio của bài.', ...optionSet(correct, [focus[0], focus[3], words[(seed + 2) % words.length]?.[0]], seed) }
  }
  return { type:requested === 'Vocabulary Quiz' ? requested : 'Multiple Choice', question:'“' + focus[0] + '” có nghĩa là gì?', explanation:focus[0] + ': ' + focus[3] + '.', ...optionSet(focus[3], words.filter((word)=>word !== focus).map((word)=>word[3]), seed) }
}

function buildPractice(words, target, languageId) {
  const first = words[0]
  const second = words[1] || first
  const sourceExample = sentenceContaining(second)
  const translation = second[5]
  const reorder = reorderTask(target, first)
  return {
    fill:{ prompt:'Viết từ phù hợp với nghĩa “' + first[3] + '”.', answer:first[0] },
    reorder:{ tokens:reorder.tokens || [first[0]], answer:reorder.expected || first[0] },
    translation:sourceExample && translation
      ? { label:'Dịch sang ' + (languageNames[languageId] || 'ngôn ngữ đích'), prompt:translation, answer:sourceExample }
      : { label:'Gợi nhớ từ', prompt:first[3], answer:first[0] },
  }
}

export function buildLessonRuntimeContent(rawLesson, vocabulary = [], languageId, level) {
  if (!rawLesson) return rawLesson
  const lookup = new Map(vocabulary.map((word) => [lookupKey(word.word), word]))
  const words = (rawLesson.vocab || []).map((row) => lookup.has(lookupKey(row[0])) ? tupleFromWord(lookup.get(lookupKey(row[0]))) : row)
  if (!words.length) return rawLesson
  const seed = Number(rawLesson.number) || 1
  const lesson = { ...rawLesson, languageId, level, vocab:words }
  const target = targetFor(languageId, words, seed)
  const listening = buildListening(lesson, words, seed)
  const reading = buildReading(lesson, words, seed)
  const quiz = buildQuiz(lesson, words, seed, target, listening)
  const practice = buildPractice(words, target, languageId)
  return { ...lesson, target, listen:listening.audio, listening, reading, quiz, practice }
}

export function lessonContentFingerprint(lesson) {
  return [
    lesson.vocab?.map((word)=>word[0]).join('|'),
    lesson.grammar?.name,
    lesson.listening?.audio,
    lesson.reading?.text,
    lesson.quiz?.question,
    lesson.target,
  ].map((value)=>normalize(value)).join('::')
}

export function hasValidChoiceAnswer(item) {
  if (!item?.options) return true
  return Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length && item.options[item.answer] === item.correctValue && new Set(item.options).size === item.options.length
}
