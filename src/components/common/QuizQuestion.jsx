import { CheckCircle2 } from 'lucide-react'

export const normalizeAnswer = (value) => String(value ?? '').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '')
export const hasAnswer = (value) => value !== undefined && value !== null && String(value).trim() !== ''
export const answerText = (question, value) => question.options ? (question.options[value] ?? 'Chưa trả lời') : (hasAnswer(value) ? String(value) : 'Chưa trả lời')
export const correctAnswerText = (question) => question.options ? question.options[question.answer] : question.correct
export const isCorrectAnswer = (question, value) => hasAnswer(value) && (question.options ? value === question.answer : [question.correct, ...(question.acceptedAnswers || [])].some((answer) => normalizeAnswer(value) === normalizeAnswer(answer)))

export default function QuizQuestion({ question, value, onChange, checked = false, reveal = true }) {
  const correct = isCorrectAnswer(question, value)
  return <div className="quiz-question">
    <span className="exercise-type">{question.type?.toUpperCase()}</span><h2>{question.question}</h2>
    {question.instructions && <p className="question-instructions">{question.instructions}</p>}
    {!question.options ? <label className="text-answer"><span>Câu trả lời</span><input value={value ?? ''} disabled={checked} onChange={(event) => onChange(event.target.value)} placeholder="Nhập đáp án…" autoComplete="off" spellCheck={false}/></label> : question.input === 'select' ? <label className="text-answer"><span>Ghép đáp án</span><select value={value ?? ''} disabled={checked} onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))}><option value="">Chọn đáp án…</option>{question.options.map((option, index) => <option key={`${option}-${index}`} value={index}>{option}</option>)}</select></label> : <div className="answer-list">{question.options.map((option, index) => <button key={`${option}-${index}`} disabled={checked} aria-pressed={value === index} className={`${value === index ? 'selected' : ''} ${checked && reveal ? (index === question.answer ? 'correct' : value === index ? 'wrong' : '') : ''}`} onClick={() => onChange(index)}><span>{String.fromCharCode(65 + index)}</span>{question.audioOnlyChoices ? `Choice ${String.fromCharCode(65 + index)}` : option}{checked && reveal && index === question.answer && <CheckCircle2/>}</button>)}</div>}
    {checked && reveal && <div className={`feedback ${correct ? 'correct' : 'wrong'}`} role="status"><strong>{correct ? '✓ Chính xác' : `✕ Đáp án: ${correctAnswerText(question)}`}</strong><p>{question.explanation}</p></div>}
  </div>
}
