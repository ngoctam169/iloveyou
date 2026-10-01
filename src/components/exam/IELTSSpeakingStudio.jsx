import { ChevronLeft, ChevronRight, Clock3, Mic, RotateCcw, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ExamTimer from '../common/ExamTimer'
import { ieltsSpeaking } from '../../data/ielts'
import { recognitionFor } from '../../utils/speech'
import { useApp } from '../../context/AppContext'

export default function IELTSSpeakingStudio() {
  const { setToast } = useApp()
  const [part,setPart] = useState('All parts')
  const [index,setIndex] = useState(0)
  const [phase,setPhase] = useState('idle')
  const [seconds,setSeconds] = useState(60)
  const [recording,setRecording] = useState(false)
  const [audioUrl,setAudioUrl] = useState('')
  const [transcript,setTranscript] = useState('')
  const recorder=useRef(null)
  const stream=useRef(null)
  const recognition=useRef(null)
  const filtered=ieltsSpeaking.filter((item)=>part==='All parts'||item.part===part)
  const topic=filtered[index % Math.max(1,filtered.length)]

  useEffect(()=>()=>{ stream.current?.getTracks().forEach((track)=>track.stop());recognition.current?.abort();if(audioUrl)URL.revokeObjectURL(audioUrl) },[audioUrl])

  const stop=()=>{ if(recorder.current?.state==='recording')recorder.current.stop();recognition.current?.stop();setRecording(false);setPhase('done') }
  const resetAttempt=()=>{
    stream.current?.getTracks().forEach((track)=>track.stop())
    recognition.current?.abort()
    setRecording(false)
    setTranscript('')
    if(audioUrl)URL.revokeObjectURL(audioUrl)
    setAudioUrl('')
    setPhase('idle')
    setSeconds(topic.part==='Part 2'?60:300)
  }
  const prepare=()=>{ setTranscript('');if(audioUrl)URL.revokeObjectURL(audioUrl);setAudioUrl('');setPhase('preparation');setSeconds(60) }
  const start=async()=>{
    try{
      if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setToast('Trình duyệt không hỗ trợ ghi âm; timer vẫn chạy.');setPhase('speaking');setSeconds(topic.part==='Part 2'?120:300);return}
      stream.current=await navigator.mediaDevices.getUserMedia({audio:true})
      const chunks=[]
      recorder.current=new MediaRecorder(stream.current)
      recorder.current.ondataavailable=(event)=>{if(event.data.size)chunks.push(event.data)}
      recorder.current.onstop=()=>{setAudioUrl(URL.createObjectURL(new Blob(chunks,{type:'audio/webm'})));stream.current?.getTracks().forEach((track)=>track.stop())}
      recorder.current.start();setRecording(true);setPhase('speaking');setSeconds(topic.part==='Part 2'?120:300)
      const speech=recognitionFor('english')
      if(speech){recognition.current=speech;speech.continuous=true;speech.interimResults=true;speech.onresult=(event)=>setTranscript(Array.from(event.results).map((result)=>result[0].transcript).join(' '));try{speech.start()}catch{/* recording still works */}}
    }catch{setToast('Không truy cập được microphone. Hãy cấp quyền rồi thử lại.')}
  }
  const timeout=()=>{ if(phase==='preparation'){setPhase('ready');setSeconds(120)}else stop() }
  const canRecord=topic.part==='Part 2' ? phase==='ready' : phase==='idle'

  return <section className="speaking-studio">
    <div className="filter-bar mini"><label><span>Part</span><select value={part} disabled={recording} onChange={(event)=>{setPart(event.target.value);setIndex(0);resetAttempt()}}>{['All parts','Part 1','Part 2','Part 3'].map((item)=><option key={item}>{item}</option>)}</select></label><span className="filter-result">{filtered.length} topics</span></div>
    <div className="speaking-topic"><span className="type-tag">{topic.part} · {topic.topic}</span><h2>{topic.question}</h2>{topic.part==='Part 2'&&<div className="cue-card"><strong>You should say:</strong>{topic.bullets.map((item)=><p key={item}>• {item}</p>)}</div>}</div>
    <div className="speaking-console">
      <div className={`mic-circle ${recording?'recording':''}`}><Mic/></div>
      <div><span>{phase==='preparation'?'Preparation · 1 phút':phase==='ready'?'Ready · 2 phút nói':phase==='speaking'?'Speaking':phase==='done'?'Recording complete':'Ready'}</span>{['preparation','speaking'].includes(phase)&&<ExamTimer seconds={seconds} onChange={setSeconds} onEnd={timeout} resetKey={`${phase}:${topic.id}`}/>}</div>
      <div className="center-actions">{topic.part==='Part 2'&&phase==='idle'&&<button className="btn secondary" onClick={prepare}><Clock3/> Bắt đầu 1 phút chuẩn bị</button>}{canRecord&&<button className="btn" onClick={start}><Mic/> Record</button>}{recording&&<button className="btn danger" onClick={stop}><Square/> Stop</button>}{phase==='done'&&<button className="btn secondary" onClick={resetAttempt}><RotateCcw/> Retry</button>}</div>
      {audioUrl&&<audio className="recording-player" controls src={audioUrl}/>}
      {transcript&&<div className="speech-transcript"><strong>SpeechRecognition transcript</strong><p>{transcript}</p><small>Transcript tự động chỉ để tự kiểm tra độ rõ; không phải IELTS Speaking score.</small></div>}
    </div>
    <div className="practice-actions spread"><button className="btn ghost" disabled={recording||index===0} onClick={()=>{resetAttempt();setIndex((value)=>Math.max(0,value-1))}}><ChevronLeft/> Previous</button><button className="btn ghost" disabled={recording||index===filtered.length-1} onClick={()=>{resetAttempt();setIndex((value)=>Math.min(filtered.length-1,value+1))}}>Next <ChevronRight/></button></div>
  </section>
}
