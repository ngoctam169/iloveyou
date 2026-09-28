import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'

const langCodes = { english:'en-US', chinese:'zh-CN', japanese:'ja-JP', korean:'ko-KR' }

export default function AudioPlayer({ text, languageId = 'english', label = 'Phát audio' }) {
  const { setToast } = useApp()
  const [rate, setRate] = useState(1)
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const utteranceRef = useRef(null)
  const timerRef = useRef(null)
  const startedAtRef = useRef(0)
  const elapsedRef = useRef(0)
  const boundaryProgressRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  const estimatedDuration = () => {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
    return Math.max(1600, words / Math.max(90,165 * rate) * 60 * 1000)
  }

  const startProgressTimer = () => {
    clearTimer()
    const total = estimatedDuration()
    startedAtRef.current = Date.now()
    timerRef.current = window.setInterval(() => {
      const elapsed = elapsedRef.current + (Date.now() - startedAtRef.current)
      const estimated = Math.min(96, elapsed / total * 100)
      setProgress(Math.max(boundaryProgressRef.current,estimated))
    },180)
  }

  const resetPlayback = () => {
    clearTimer()
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    utteranceRef.current = null
    startedAtRef.current = 0
    elapsedRef.current = 0
    boundaryProgressRef.current = 0
    setProgress(0)
    setStatus('idle')
  }

  useEffect(() => resetPlayback, [text])

  const start = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      setToast('Trình duyệt này không hỗ trợ phát âm.')
      return
    }

    window.speechSynthesis.cancel()
    clearTimer()
    elapsedRef.current = 0
    boundaryProgressRef.current = 0
    setProgress(0)

    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = langCodes[languageId] || 'en-US'
    utterance.rate = rate
    utterance.onboundary = (event) => {
      if (!text?.length || !Number.isFinite(event.charIndex)) return
      boundaryProgressRef.current = Math.min(98,event.charIndex / text.length * 100)
      setProgress((current) => Math.max(current,boundaryProgressRef.current))
    }
    utterance.onend = () => {
      clearTimer()
      elapsedRef.current = 0
      boundaryProgressRef.current = 100
      setProgress(100)
      setStatus('ended')
    }
    utterance.onerror = () => {
      clearTimer()
      setStatus('idle')
      setProgress(0)
      setToast('Không thể phát âm lúc này. Vui lòng thử lại.')
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setStatus('playing')
    startProgressTimer()
  }

  const toggle = () => {
    if (status === 'idle' || status === 'ended') {
      start()
      return
    }
    if (status === 'playing') {
      elapsedRef.current += Date.now() - startedAtRef.current
      clearTimer()
      window.speechSynthesis.pause()
      setStatus('paused')
      return
    }
    window.speechSynthesis.resume()
    setStatus('playing')
    startProgressTimer()
  }

  const changeRate = (value) => {
    if (value === rate) return
    if (status === 'playing' || status === 'paused') resetPlayback()
    setRate(value)
  }

  const stateLabel = status === 'playing' ? 'Đang phát' : status === 'paused' ? 'Đã tạm dừng' : status === 'ended' ? 'Đã phát xong' : 'Sẵn sàng'

  return <div className="audio-player compact-audio audio-player-modern">
    <button className="audio-button" aria-label={status === 'playing' ? 'Tạm dừng audio' : status === 'paused' ? 'Tiếp tục audio' : label} onClick={toggle}>
      {status === 'playing' ? <Pause/> : status === 'ended' ? <RotateCcw/> : <Play/>}
    </button>

    <div className="audio-main">
      <div className="audio-title-row"><strong>{label}</strong><span>{stateLabel}</span></div>
      <div className="audio-progress-row">
        <div className="audio-progress-track" role="progressbar" aria-label="Tiến độ audio" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
          <span style={{ width:`${progress}%` }}/>
        </div>
        <small>{Math.round(progress)}%</small>
      </div>
    </div>

    <div className="rate-buttons" aria-label="Tốc độ phát">{[.75,1,1.25].map((value) => <button key={value} className={rate === value ? 'active' : ''} aria-pressed={rate === value} onClick={() => changeRate(value)}>{value}x</button>)}</div>
  </div>
}
