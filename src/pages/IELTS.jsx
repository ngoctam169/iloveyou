import { BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, Mic, PenLine, Play, RotateCcw, Square, Target } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import AudioPlayer from '../components/common/AudioPlayer'
import ExamTimer from '../components/common/ExamTimer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { ieltsListening, ieltsReading, ieltsSpeaking, ieltsWriting } from '../data/ielts'
import { recognitionFor } from '../utils/speech'

const tabs = ['Overview','Listening','Reading','Writing','Speaking','History']

export default function IELTS() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const latest = state.ieltsHistory?.[0]
  return <div className="inner-page section-shell learning-hub exam-hub">
    <div className="hub-hero ielts-hero"><div><span className="overline">IELTS ACADEMIC</span><h1>Luyện đủ bốn kỹ năng trong một lộ trình</h1><p>Listening · Reading · Writing checklist · Speaking recorder</p></div><label className="target-picker"><span>Target band</span><select value={state.ieltsTarget} onChange={(event) => update({ ieltsTarget:Number(event.target.value) })}>{[4,5,5.5,6,6.5,7,7.5,8].map((score) => <option value={score} key={score}>{score === 8 ? '8.0+' : score.toFixed(1)}</option>)}</select></label></div>
    <div className="hub-tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'Overview' && <IELTSOverview state={state} latest={latest} onOpen={setTab}/>} 
    {tab === 'Listening' && <IELTSListening/>}
    {tab === 'Reading' && <IELTSReading/>}
    {tab === 'Writing' && <IELTSWriting/>}
    {tab === 'Speaking' && <IELTSSpeaking/>}
    {tab === 'History' && <IELTSHistory history={state.ieltsHistory || []}/>} 
  </div>
}

function IELTSOverview({ state, latest, onOpen }) {
  const bands = latest?.bands || {}
  return <><div className="metric-grid exam-metrics"><StatisticsCard icon={Target} value={latest?.practiceScore != null ? `${latest.practiceScore}%` : '—'} label="Writing Check"/><StatisticsCard icon={Target} value={`${Number(state.ieltsTarget).toFixed(1)}+`} label="Target Band"/><StatisticsCard icon={Headphones} value={bands.Listening?.toFixed?.(1) || '—'} label="Listening"/><StatisticsCard icon={BookOpen} value={bands.Reading?.toFixed?.(1) || '—'} label="Reading"/><StatisticsCard icon={PenLine} value={latest?.type === 'Writing' ? 'Đã luyện' : '—'} label="Writing"/><StatisticsCard icon={Mic} value={bands.Speaking?.toFixed?.(1) || '—'} label="Speaking"/></div><div className="skill-launch-grid">{[['Listening','4 sections · 10 câu',Headphones],['Reading','2 passages · 10 câu',BookOpen],['Writing','Task 1 & Task 2',PenLine],['Speaking','Part 1, 2 & 3',Mic]].map(([name,detail,Icon]) => <button key={name} onClick={() => onOpen(name)}><span><Icon/></span><div><strong>{name}</strong><small>{detail}</small></div><ChevronRight/></button>)}</div><section className="panel exam-note"><h2>Vocabulary & Grammar</h2><p>Writing dùng kiểm tra quy tắc minh bạch cho độ dài, bố cục, từ nối và độ đa dạng từ vựng. Đây là checklist tự rà, không phải điểm band IELTS hay đánh giá AI.</p></section></>
}

function IELTSListening() {
  const { addMistake } = useApp()
  const [section, setSection] = useState('All sections')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const filtered = useMemo(() => ieltsListening.filter((item) => section === 'All sections' || item.section === Number(section.at(-1))), [section])
  const q = filtered[index % filtered.length]
  const answer = answers[q.id]
  const check = () => { setChecked({ ...checked, [q.id]:true }); if (answer !== q.answer) addMistake({ id:`ielts-listening-${q.id}`, type:'IELTS', prompt:q.question, yourAnswer:q.options[answer] || 'Chưa trả lời', answer:q.options[q.answer], explanation:q.explanation, topic:`Listening Section ${q.section}`, path:'/ielts' }) }
  const move = (amount) => setIndex((current) => (current + amount + filtered.length) % filtered.length)
  return <section className="exam-practice"><div className="filter-bar mini"><label><span>Section</span><select value={section} onChange={(event) => { setSection(event.target.value); setIndex(0) }}>{['All sections','Section 1','Section 2','Section 3','Section 4'].map((item) => <option key={item}>{item}</option>)}</select></label><span className="filter-result">{filtered.length} câu</span></div><div className="practice-head"><div><span>Section {q.section}</span><strong>{q.type} · {index + 1}/{filtered.length}</strong></div></div><AudioPlayer text={q.audio} label="Play recording"/><QuizQuestion question={q} value={answer} onChange={(value) => setAnswers({ ...answers, [q.id]:value })} checked={checked[q.id]}/>{checked[q.id] && <div className="transcript-panel open"><p><strong>Transcript:</strong> {q.transcript}</p><p><strong>Vocabulary:</strong> {q.vocabulary.join(' · ')}</p></div>}<div className="practice-actions spread"><button className="btn ghost" onClick={() => move(-1)}><ChevronLeft/> Previous</button>{!checked[q.id] ? <button className="btn" disabled={answer === undefined} onClick={check}>Kiểm tra</button> : <button className="btn" onClick={() => move(1)}>Next <ChevronRight/></button>}</div></section>
}

function IELTSReading() {
  const { addMistake, toggleSaved, state } = useApp()
  const [passageId, setPassageId] = useState(ieltsReading[0].id)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const passage = ieltsReading.find((item) => item.id === passageId)
  const q = passage.questions[index]
  const answer = answers[q.id]
  const bookmarked = state.savedItems.some((item) => item.id === `ielts-passage-${passage.id}`)
  const check = () => { setChecked({ ...checked, [q.id]:true }); if (answer !== q.answer) addMistake({ id:`ielts-reading-${q.id}`, type:'IELTS', prompt:q.question, yourAnswer:q.options[answer] || 'Chưa trả lời', answer:q.options[q.answer], explanation:q.explanation, topic:`Reading · ${passage.topic}`, path:'/ielts' }) }
  return <section className="reading-practice"><div className="filter-bar mini"><label><span>Passage</span><select value={passageId} onChange={(event) => { setPassageId(event.target.value); setIndex(0) }}>{ieltsReading.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><span className="filter-result">{passage.topic}</span></div><div className="reading-split"><article className="ielts-passage"><div className="passage-head"><div><span className="overline">READING PASSAGE</span><h2>{passage.title}</h2></div><button className={`icon-btn ${bookmarked ? 'saved' : ''}`} aria-label="Lưu passage" onClick={() => toggleSaved({ id:`ielts-passage-${passage.id}`,type:'IELTS Passage',title:passage.title,subtitle:passage.topic,path:'/ielts' })}>☆</button></div>{passage.passage.map((paragraph) => <p key={paragraph}><strong>{paragraph.slice(0,2)}</strong>{paragraph.slice(2)}</p>)}</article><div className="passage-question"><div className="practice-head"><div><span>Question {index + 1}/{passage.questions.length}</span><strong>{q.type}</strong></div></div><QuizQuestion question={q} value={answer} onChange={(value) => setAnswers({ ...answers, [q.id]:value })} checked={checked[q.id]}/>{checked[q.id] && <div className="evidence-box"><div><span>Đáp án ở đoạn</span><strong>{q.paragraph}</strong></div><p><b>Keyword câu hỏi:</b> {q.questionKeyword}</p><p><b>Keyword passage:</b> {q.passageKeyword}</p><p><b>Paraphrase & lý do:</b> {q.explanation}</p></div>}<div className="practice-actions spread"><button className="btn ghost" disabled={index===0} onClick={() => setIndex(index-1)}><ChevronLeft/> Previous</button>{!checked[q.id] ? <button className="btn" disabled={answer === undefined} onClick={check}>Kiểm tra</button> : <button className="btn" disabled={index === passage.questions.length-1} onClick={() => setIndex(index+1)}>Next <ChevronRight/></button>}</div></div></div></section>
}

function IELTSWriting() {
  const { state, update, saveExamResult, addMistake, setToast } = useApp()
  const [topicId, setTopicId] = useState(ieltsWriting[0].id)
  const [text, setText] = useState('')
  const [seconds, setSeconds] = useState(40 * 60)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const topic = ieltsWriting.find((item) => item.id === topicId)
  const words = text.trim() ? text.trim().split(/\s+/) : []
  const repeated = Object.entries(words.reduce((acc, word) => { const clean=word.toLowerCase().replace(/[^a-z]/g,''); if (clean.length>4) acc[clean]=(acc[clean]||0)+1; return acc }, {})).filter(([,count]) => count >= 4).sort((a,b) => b[1]-a[1]).slice(0,5)
  useEffect(() => { setText(state.writingDrafts?.[`ielts:${topicId}`] || '') }, [topicId])
  useEffect(() => {
    const timer = setTimeout(() => update((current) => ({ writingDrafts:{ ...(current.writingDrafts || {}), [`ielts:${topicId}`]:text } })), 350)
    return () => clearTimeout(timer)
  }, [topicId, text])
  const saveDraft = () => { update((current) => ({ writingDrafts:{ ...(current.writingDrafts || {}), [`ielts:${topicId}`]:text } })); setToast('Đã lưu bản nháp Writing') }
  const clearDraft = () => { setText(''); update((current) => { const writingDrafts={ ...(current.writingDrafts || {}) }; delete writingDrafts[`ielts:${topicId}`]; return { writingDrafts } }); setResult(null); setToast('Đã xóa bản nháp') }
  const submit = () => {
    const lengthScore = Math.min(1, words.length / topic.minWords)
    const paragraphs = text.split(/\n+/).filter((item) => item.trim()).length
    const connectors = (text.match(/\b(however|therefore|overall|whereas|although|moreover|in contrast)\b/gi) || []).length
    const sentences = text.split(/[.!?]+/).filter((item) => item.trim().split(/\s+/).length > 3).length
    const lexical = new Set(words.map((word) => word.toLowerCase().replace(/[^a-z]/g,''))).size / Math.max(1, words.length)
    const criteria = { task:Math.round(lengthScore * 100), cohesion:Math.min(100, Math.round(paragraphs * 20 + connectors * 12)), lexical:Math.min(100, Math.round(lexical * 130)), structure:Math.min(100, Math.round(sentences * 10)) }
    const practiceScore = Math.round(Object.values(criteria).reduce((a,b)=>a+b,0) / 4)
    const report = { practiceScore, metrics:criteria, type:'Writing', topic:topic.title, timeUsed:40*60-seconds }
    saveExamResult('ielts',report); setResult({ practiceScore, criteria })
    if (words.length < topic.minWords) addMistake({ id:`ielts-writing-${topic.id}`, type:'IELTS', prompt:topic.prompt, yourAnswer:`${words.length} từ`, answer:`Ít nhất ${topic.minWords} từ`, explanation:'Bài viết thiếu độ dài cần thiết để phát triển và so sánh các ý.', topic:`Writing ${topic.task}`, path:'/ielts' })
  }
  const changeTopic = (nextTopic) => { setTopicId(nextTopic); setSeconds(40*60); setRunning(false); setResult(null) }
  return <section className="writing-workspace"><div className="writing-toolbar"><label><span>Đề bài</span><select value={topicId} onChange={(event) => changeTopic(event.target.value)}>{ieltsWriting.map((item) => <option value={item.id} key={item.id}>{item.task} · {item.type}</option>)}</select></label><ExamTimer seconds={seconds} onChange={setSeconds} running={running} onEnd={submit}/><button className="btn secondary small" onClick={() => setRunning(!running)}>{running ? 'Tạm dừng' : 'Bắt đầu timer'}</button></div><div className="writing-grid"><aside className="writing-guide"><span className="type-tag">{topic.task} · {topic.type}</span><h2>{topic.title}</h2><p>{topic.prompt}</p><h3>Gợi ý cấu trúc</h3><ol>{topic.structure.map((item) => <li key={item}>{item}</li>)}</ol><h3>Useful vocabulary</h3><div className="vocab-chips">{topic.vocabulary.map((item) => <span key={item}>{item}</span>)}</div><h3>Useful phrases</h3>{topic.phrases.map((item) => <p className="useful-phrase" key={item}>{item}</p>)}</aside><main className="writing-editor"><label htmlFor="ielts-writing">Bài viết của bạn</label><textarea id="ielts-writing" value={text} onChange={(event) => setText(event.target.value)} rows="18" placeholder="Write your response here…"/><div className="writing-count"><span className={words.length < topic.minWords ? 'danger-text' : ''}>{words.length} / {topic.minWords} words</span><span>{text.split(/[.!?]+/).filter((item)=>item.trim()).length} sentences</span></div><div className="writing-draft-actions"><button className="btn ghost" disabled={!text} onClick={clearDraft}>Xóa</button><button className="btn secondary" disabled={!text.trim()} onClick={saveDraft}>Lưu bản nháp</button><button className="btn" disabled={!text.trim()} onClick={submit}>Chạy kiểm tra theo quy tắc</button></div></main></div>{result && <div className="writing-feedback"><div className="band-result"><span>Checklist Score</span><strong>{result.practiceScore}%</strong><small>Điểm kiểm tra quy tắc cục bộ, không phải IELTS band</small></div><div className="criteria-grid">{[['Đủ độ dài',result.criteria.task],['Bố cục & từ nối',result.criteria.cohesion],['Độ đa dạng từ',result.criteria.lexical],['Số câu phát triển',result.criteria.structure]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}%</strong><ProgressBar value={value} max={100}/></div>)}</div><div className="feedback-columns"><div><h3>Grammar checks</h3><p>{text.split(/[.!?]+/).some((item)=>item.trim() && !/^[A-Z]/.test(item.trim())) ? 'Một số câu chưa bắt đầu bằng chữ hoa.' : 'Không phát hiện lỗi viết hoa cơ bản.'}</p></div><div><h3>Repeated words</h3><p>{repeated.length ? repeated.map(([word,count]) => `${word} (${count})`).join(', ') : 'Không có từ nội dung lặp quá nhiều.'}</p></div><div><h3>Suggested vocabulary</h3><p>{topic.vocabulary.join(' · ')}</p></div><div><h3>Suggested sentence</h3><p>Overall, the most significant feature is the clear contrast between the main categories.</p></div></div></div>}</section>
}

function IELTSSpeaking() {
  const { setToast } = useApp()
  const [part, setPart] = useState('All parts')
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [seconds, setSeconds] = useState(60)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const recorder = useRef(null)
  const stream = useRef(null)
  const recognition = useRef(null)
  const filtered = ieltsSpeaking.filter((item) => part === 'All parts' || item.part === part)
  const topic = filtered[index % Math.max(1, filtered.length)]
  useEffect(() => () => { stream.current?.getTracks().forEach((track) => track.stop()); recognition.current?.abort(); if (audioUrl) URL.revokeObjectURL(audioUrl) }, [audioUrl])
  const nextPhase = () => { if (phase === 'preparation') { setPhase('speaking'); setSeconds(120) } else if (phase === 'speaking') stopRecording() }
  const prepare = () => { setPhase('preparation'); setSeconds(60); setTranscript(''); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl('') }
  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setToast('Trình duyệt không hỗ trợ ghi âm. Bạn vẫn có thể luyện với timer.'); setPhase('speaking'); setSeconds(120); return }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio:true })
      const chunks = []
      recorder.current = new MediaRecorder(stream.current)
      recorder.current.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
      recorder.current.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(chunks,{ type:'audio/webm' }))); stream.current?.getTracks().forEach((track) => track.stop()) }
      recorder.current.start(); setRecording(true); setPhase('speaking'); setSeconds(120)
      const speech = recognitionFor('english')
      if (speech) { recognition.current=speech; speech.continuous=true; speech.interimResults=true; speech.onresult=(event) => setTranscript(Array.from(event.results).map((result) => result[0].transcript).join(' ')); try { speech.start() } catch { /* recorder still works */ } }
    } catch { setToast('Không truy cập được microphone. Hãy cấp quyền rồi thử lại.') }
  }
  const stopRecording = () => { if (recorder.current?.state === 'recording') recorder.current.stop(); recognition.current?.stop(); setRecording(false); setPhase('done') }
  return <section className="speaking-studio"><div className="filter-bar mini"><label><span>Part</span><select value={part} onChange={(event) => { setPart(event.target.value); setIndex(0) }}>{['All parts','Part 1','Part 2','Part 3'].map((item) => <option key={item}>{item}</option>)}</select></label><span className="filter-result">{filtered.length} topics</span></div><div className="speaking-topic"><span className="type-tag">{topic.part} · {topic.topic}</span><h2>{topic.question}</h2>{topic.part === 'Part 2' && <div className="cue-card"><strong>You should say:</strong>{(topic.bullets.length ? topic.bullets : ['where it is','how you know about it','why you want to visit it','and explain why it is interesting']).map((item) => <p key={item}>• {item}</p>)}</div>}</div><div className="speaking-console"><div className={`mic-circle ${recording ? 'recording' : ''}`}><Mic/></div><div><span>{phase === 'preparation' ? 'Preparation' : phase === 'speaking' ? 'Speaking' : phase === 'done' ? 'Recording complete' : 'Ready'}</span>{['preparation','speaking'].includes(phase) && <ExamTimer seconds={seconds} onChange={setSeconds} onEnd={nextPhase}/>}</div><div className="center-actions">{phase === 'idle' && <button className="btn secondary" onClick={prepare}><Clock3/> Start preparation</button>}{!recording && ['idle','preparation'].includes(phase) && <button className="btn" onClick={startRecording}><Mic/> Record voice</button>}{recording && <button className="btn danger" onClick={stopRecording}><Square/> Stop</button>}{phase === 'done' && <button className="btn secondary" onClick={prepare}><RotateCcw/> Retry</button>}</div>{audioUrl && <audio className="recording-player" controls src={audioUrl}><Play/> Your browser cannot play this recording.</audio>}{transcript && <div className="speech-transcript"><strong>SpeechRecognition transcript</strong><p>{transcript}</p><small>Transcript tự động có thể sai; hãy dùng để tự kiểm tra độ rõ và độ trôi chảy.</small></div>}</div><div className="practice-actions spread"><button className="btn ghost" onClick={() => setIndex((index-1+filtered.length)%filtered.length)}><ChevronLeft/> Previous</button><button className="btn ghost" onClick={() => setIndex((index+1)%filtered.length)}>Next <ChevronRight/></button></div></section>
}

function IELTSHistory({ history }) {
  if (!history.length) return <div className="empty-inline"><BarChart3/><h2>Chưa có lịch sử IELTS</h2><p>Hoàn thành một bài Writing để lưu kết quả checklist đầu tiên.</p></div>
  return <section className="history-list"><div className="panel-title"><div><h2>Practice history</h2><p>Kết quả checklist được lưu trên thiết bị.</p></div></div>{history.map((item) => <article key={item.id}><div><strong>{item.practiceScore != null ? `${item.practiceScore}%` : 'Đã lưu'}</strong><span>Rule-based check</span></div><div><b>{item.type}</b><span>Practice type</span></div><div><b>{item.topic}</b><span>Topic</span></div><time>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(item.date))}</time></article>)}</section>
}
