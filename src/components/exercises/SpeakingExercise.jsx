import { Mic, RotateCcw, Square, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { recognitionFor, speak } from '../../utils/speech'
import { speechScore } from '../../utils/text'

export default function SpeakingExercise({ target, languageId, onComplete, setToast }) {
  const [heard, setHeard] = useState('')
  const [recording, setRecording] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const recognitionRef = useRef(null)
  const score = heard ? speechScore(target, heard) : 0

  useEffect(() => () => recognitionRef.current?.abort(), [])

  const record = () => {
    const recognition = recognitionFor(languageId)
    if (!recognition) { setUnsupported(true); return }
    recognitionRef.current?.abort()
    recognitionRef.current = recognition
    setUnsupported(false)
    setHeard('')
    setRecording(true)
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      setHeard(transcript)
      setRecording(false)
      onComplete?.(speechScore(target, transcript))
    }
    recognition.onerror = (event) => {
      setRecording(false)
      if (event.error !== 'aborted') setToast(event.error === 'not-allowed' ? 'Microphone đang bị chặn. Hãy cấp quyền trong trình duyệt rồi thử lại.' : 'Không nhận được giọng nói. Hãy kiểm tra microphone và thử lại.')
    }
    recognition.onend = () => setRecording(false)
    try { recognition.start() } catch { setRecording(false); setToast('Không thể khởi động microphone lúc này. Vui lòng thử lại.') }
  }
  const stop = () => {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  return <div className="speaking-box"><div className="target-sentence"><span>TARGET</span><h2>“{target}”</h2><button className="btn secondary" onClick={() => speak(target, languageId, 1, setToast)}><Volume2 /> Listen</button></div><div className={`mic-circle ${recording ? 'recording' : ''}`} aria-hidden="true"><Mic /></div><p className="centered-text" aria-live="polite">{recording ? 'Đang lắng nghe…' : 'Nhấn Start Speaking rồi đọc câu mẫu thật tự nhiên.'}</p><div className="center-actions">{recording ? <button className="btn danger" onClick={stop}><Square /> Stop</button> : <button className="btn" onClick={record}><Mic /> Start Speaking</button>}{heard && !recording && <button className="btn secondary" onClick={record}><RotateCcw /> Try Again</button>}</div>{unsupported && <div className="notice warning" role="status"><strong>Trình duyệt không hỗ trợ nhận dạng giọng nói.</strong><span>Bạn vẫn có thể nghe câu mẫu và luyện đọc thành tiếng; ứng dụng sẽ không bị gián đoạn.</span></div>}{heard && <div className="speech-result" aria-live="polite"><div><span>Target</span><p>{target}</p></div><div><span>You said</span><p>{heard}</p></div><div className="accuracy"><strong>Pronunciation Match: {score}%</strong><div className="progress-track"><span style={{ width: `${score}%` }} /></div></div></div>}<small className="disclaimer">Điểm chỉ là ước tính dựa trên kết quả speech recognition, không phải đánh giá phát âm chuyên nghiệp.</small></div>
}
