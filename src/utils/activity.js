import { localDate } from './srs'

export function applyActivity(state, event) {
  const now = new Date()
  const today = localDate(now)
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate()-1)
  const seconds = Math.max(0,Math.min(14400,Number(event.seconds)||0))
  const streak = state.lastStudyDate === today ? state.streak : state.lastStudyDate === localDate(yesterday) ? state.streak+1 : 1
  const daily = state.dailyActivity?.[today] || { seconds:state.todayDate === today ? Math.round((Number(state.todayMinutes) || 0) * 60) : 0, attempts:0, correct:0, vocabulary:0 }
  const counted = Number.isFinite(event.total) ? event.total : typeof event.correct === 'boolean' ? 1 : 0
  const correct = typeof event.correct === 'boolean' ? Number(event.correct) : Math.max(0,Number(event.correct)||0)
  const entry = { ...event, id:event.eventId || `${now.getTime()}-${Math.random().toString(36).slice(2,8)}`, date:now.toISOString(), day:today, seconds }
  const dailyActivity = { ...state.dailyActivity, [today]:{ ...daily, seconds:daily.seconds+seconds, attempts:daily.attempts+counted, correct:daily.correct+correct, vocabulary:daily.vocabulary+(event.type==='Vocabulary'?1:0) } }
  return { ...state, streak, longestStreak:Math.max(streak,state.longestStreak||0), lastStudyDate:today, todayDate:today, todayMinutes:Math.round(dailyActivity[today].seconds/60*10)/10, totalStudySeconds:(state.totalStudySeconds||0)+seconds, dailyActivity, learningHistory:[entry,...(state.learningHistory||[])].slice(0,5000), activityHistory:Array.from({length:28},(_,i)=>{const date=new Date(now);date.setDate(date.getDate()-(27-i));return Math.round((dailyActivity[localDate(date)]?.seconds||0)/60)}) }
}
