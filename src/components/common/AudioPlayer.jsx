import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { speak } from '../../utils/speech'

export default function AudioPlayer({ text, languageId = 'english', label = 'Phát audio' }) {
  const { setToast } = useApp()
  const [rate, setRate] = useState(1)
  return <div className="audio-player compact-audio"><button className="audio-button" aria-label={label} onClick={() => speak(text, languageId, rate, setToast)}><Volume2 /></button><div><strong>{label}</strong><span>Giọng đọc từ trình duyệt</span></div><div className="rate-buttons">{[.75,1,1.25].map((value) => <button key={value} className={rate === value ? 'active' : ''} aria-pressed={rate === value} onClick={() => setRate(value)}>{value}x</button>)}</div></div>
}
