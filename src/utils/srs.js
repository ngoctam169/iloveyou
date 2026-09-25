export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
export const wordKey = (word) => `${word.languageId || 'english'}:${word.level}:${String(word.id || word.word).normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g, '-')}`
export const isDue = (schedule, now = Date.now()) => Boolean(schedule?.nextReview && Date.parse(schedule.nextReview) <= now)
export const isMastered = (schedule) => (schedule?.repetitions || 0) >= 5 && (schedule?.interval || 0) >= 14 && !['again', 'hard'].includes(schedule?.lastRating)
export const vocabularyStatus = (schedule, started = false) => isDue(schedule) ? 'Review Today' : isMastered(schedule) ? 'Mastered' : schedule || started ? 'Learning' : 'New Words'
export const isWeakVocabulary = (schedule, difficult = false, now = Date.now()) => Boolean(difficult || schedule && (
  (schedule.difficultyScore || 0) >= 2 ||
  (schedule.attempts >= 3 && (schedule.incorrect || 0) / schedule.attempts >= .4) ||
  (isDue(schedule, now) && now - Date.parse(schedule.nextReview) > 7 * 86400000)
))

export function nextSchedule(previous = {}, quality = 'good', now = new Date()) {
  const interval = Math.max(0, Number(previous.interval) || 0)
  const ease = Math.max(1.3, Number(previous.ease) || 2.5)
  const repetitions = Math.max(0, Number(previous.repetitions) || 0)
  const intervals = { again:0, hard:Math.max(1,Math.round(interval*1.2)), good:repetitions ? Math.max(2,Math.round(interval*ease)) : 2, easy:repetitions ? Math.max(4,Math.round(interval*(ease+.4))) : 4 }
  const rating = Object.hasOwn(intervals, quality) ? quality : 'again'
  const next = new Date(now)
  if (rating === 'again') next.setMinutes(next.getMinutes()+10)
  else next.setDate(next.getDate()+intervals[rating])
  const attempts = (Number(previous.attempts) || 0)+1
  const correct = (Number(previous.correct) || 0)+(rating === 'good' || rating === 'easy' ? 1 : 0)
  const nextRepetitions = rating === 'again' ? 0 : rating === 'hard' ? repetitions : repetitions + 1
  return { interval:intervals[rating], ease:Math.max(1.3,ease+({again:-.2,hard:-.15,good:0,easy:.15}[rating])), repetitions:nextRepetitions, nextReview:next.toISOString(), lastReview:now.toISOString(), attempts, correct, incorrect:(Number(previous.incorrect)||0)+(rating==='again'?1:0), hardCount:(Number(previous.hardCount)||0)+(rating==='hard'?1:0), againCount:(Number(previous.againCount)||0)+(rating==='again'?1:0), difficultyScore:Math.max(0,Math.min(10,(Number(previous.difficultyScore)||0)+({again:2,hard:1,good:-1,easy:-2}[rating]))), mastery:Math.min(100,Math.round(nextRepetitions/5*100)), retention:Math.round(correct/attempts*100), lastRating:rating }
}
