import ProgressBar from './ProgressBar'
import { hasAnswer } from './QuizQuestion'

export default function QuestionNavigator({ count, index, answers, onSelect }) {
  const answered = Array.from({ length: count }, (_, item) => hasAnswer(answers[item])).filter(Boolean).length
  return <aside className="question-navigator"><span className="overline">QUESTIONS</span><div className="question-nav">{Array.from({ length: count }, (_, item) => <button key={item} aria-label={`Câu ${item + 1}${hasAnswer(answers[item]) ? ', đã trả lời' : ''}`} aria-current={item === index ? 'step' : undefined} className={`${item === index ? 'active' : ''} ${hasAnswer(answers[item]) ? 'answered' : ''}`} onClick={() => onSelect(item)}>{item + 1}</button>)}</div><small>{answered}/{count} đã trả lời</small><ProgressBar value={answered} max={count} /></aside>
}
