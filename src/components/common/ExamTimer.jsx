import { AlarmClock } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Use a deadline so background tabs catch up; callbacks stay outside state updaters.
export default function ExamTimer({ seconds, onChange, running = true, onEnd, deadline, resetKey }) {
  const callbacks = useRef({ onChange, onEnd, seconds })
  callbacks.current = { onChange, onEnd, seconds }
  useEffect(() => {
    if (!running) return undefined
    const end = Number.isFinite(deadline) ? deadline : Date.now() + Math.max(0, callbacks.current.seconds) * 1000
    let finished = false
    let previous = callbacks.current.seconds
    const tick = () => {
      if (finished) return
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      if (remaining !== previous) { previous = remaining; callbacks.current.onChange?.(remaining) }
      if (remaining === 0) { finished = true; callbacks.current.onEnd?.() }
    }
    const timer = window.setInterval(tick, 250)
    const onVisible = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', onVisible)
    tick()
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [running, deadline, resetKey])
  const remaining = Math.max(0, Number(seconds) || 0)
  return <span className={`exam-timer ${remaining < 60 ? 'danger' : ''}`} aria-label={`Thời gian còn lại ${Math.floor(remaining / 60)} phút ${remaining % 60} giây`}><AlarmClock /> {String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</span>
}
