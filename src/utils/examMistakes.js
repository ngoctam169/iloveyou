import { answerText, correctAnswerText, isCorrectAnswer } from '../components/common/QuizQuestion'

export function buildExamMistakes(kind, sections = [], answers = {}, path = '/') {
  return sections.flatMap((section) => (section.questions || [])
    .filter((question) => !isCorrectAnswer(question, answers[question.id]))
    .map((question) => ({
      id:`${kind.toLowerCase()}-${question.sourceId || question.id}`,
      type:kind,
      prompt:question.audio && question.audioOnlyChoices
        ? `${question.question} · Audio: ${question.audio}`
        : question.question,
      yourAnswer:answerText(question, answers[question.id]),
      answer:correctAnswerText(question),
      explanation:question.explanation || 'Xem lại ngữ cảnh, paraphrase và distractor của câu này.',
      topic:[question.part ? `Part ${question.part}` : section.label, question.type].filter(Boolean).join(' · '),
      path,
      sourceId:question.sourceId || question.id,
    })))
}
