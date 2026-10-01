import { BarChart3, Check, CheckCircle2, Clock3, Copy, Mic, PenLine, RefreshCw, Save, Sparkles, Square, Target } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { createSelfStudyPrompt, selfStudySkills, selfStudyTopics } from '../data/selfStudyPrompts'
import { getLanguage } from '../data/languages'
import { analyzeSelfStudy, selfStudyRubric } from '../utils/selfStudy'
import { recognitionFor } from '../utils/speech'

const challengeOptions = ['Precision', 'Fluency', 'Nuance']

export default function SelfStudy() {
  const { state, addMistake, recordSelfStudy, setToast } = useApp()
  const language = getLanguage(state.selectedLanguage) || getLanguage('english')
  const level = language.levels.some(([name]) => name === state.selectedLevel) ? state.selectedLevel : language.levels[0][0]
  const [skill, setSkill] = useState('Speaking')
  const [topic, setTopic] = useState(selfStudyTopics[0].id)
  const [challenge, setChallenge] = useState('Precision')
  const [seed, setSeed] = useState(0)
  const [response, setResponse] = useState('')
  const [rubric, setRubric] = useState({ task: 3, accuracy: 3, range: 3, naturalness: 3 })
  const [checked, setChecked] = useState(null)
  const [recording, setRecording] = useState(false)
  const recognition = useRef(null)
  const startedAt = useRef(Date.now())
  const prompt = useMemo(() => createSelfStudyPrompt({ skill, level, language: language.name, topic, challenge, seed }), [skill, level, language.name, topic, challenge, seed])

  useEffect(() => {
    setResponse('')
    setChecked(null)
    setRubric({ task: 3, accuracy: 3, range: 3, naturalness: 3 })
    startedAt.current = Date.now()
  }, [prompt.id])

  useEffect(() => () => recognition.current?.abort(), [])

  const history = (state.selfStudyHistory || []).slice(0, 6)
  const latestBySkill = selfStudySkills.map((item) => {
    const entries = (state.selfStudyHistory || []).filter((entry) => entry.skill === item)
    const average = entries.length ? Math.round(entries.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / entries.length) : 0
    return { skill: item, count: entries.length, average }
  })

  const regenerate = () => setSeed((value) => value + 1)
  const copyPrompt = async (includeResponse = false) => {
    try {
      await navigator.clipboard.writeText(includeResponse ? prompt.coachPrompt.replace('[PASTE MY RESPONSE HERE]', response.trim()) : prompt.coachPrompt)
      setToast(includeResponse ? 'Đã copy prompt kèm bài làm; hãy dán vào công cụ AI bạn chọn.' : 'Đã copy coach prompt. Bạn có thể dán sang công cụ AI hoặc dùng như checklist.')
    } catch {
      setToast('Không copy tự động được; hãy bôi đen phần prompt rồi copy thủ công.')
    }
  }

  const toggleRecording = () => {
    if (recording) {
      recognition.current?.stop()
      setRecording(false)
      return
    }
    const speech = recognitionFor(language.id)
    if (!speech) {
      setToast('Trình duyệt không hỗ trợ nhận dạng giọng nói. Bạn vẫn có thể gõ transcript để tự check.')
      return
    }
    recognition.current = speech
    speech.onresult = (event) => {
      const transcript = Array.from(event.results || []).map((result) => result[0].transcript).join(' ')
      setResponse((current) => `${current}${current ? ' ' : ''}${transcript}`.trim())
    }
    speech.onerror = () => setRecording(false)
    speech.onend = () => setRecording(false)
    try {
      speech.start()
      setRecording(true)
    } catch {
      setRecording(false)
      setToast('Không thể khởi động microphone lúc này.')
    }
  }

  const checkResponse = () => {
    const analysis = analyzeSelfStudy(response, prompt)
    const rubricScore = Math.round(Object.values(rubric).reduce((sum, value) => sum + Number(value), 0) / 4 / 5 * 100)
    const score = Math.round(analysis.score * .75 + rubricScore * .25)
    const result = { ...analysis, rubricScore, score }
    setChecked(result)
    recordSelfStudy({
      promptId: prompt.id,
      skill: prompt.skill,
      mode: prompt.mode,
      topic: prompt.topic,
      level,
      score,
      words: analysis.wordCount,
      seconds: Math.max(30, Math.round((Date.now() - startedAt.current) / 1000)),
      rubric,
      response: response.slice(0, 5000),
    })
    if (score < 70) addMistake({ id: `self-study-${prompt.id}`, type: prompt.skill, prompt: prompt.task, yourAnswer: response.slice(0, 280), answer: 'Đạt ít nhất 70/100 và hoàn thành các tiêu chí tự check.', explanation: 'Lưu lại để bạn thử lại sau khi xem lại một lỗi lớn nhất trong bài.', topic: prompt.topic, path: '/self-study' })
  }

  return <div className="inner-page section-shell self-study-page">
    <div className="self-study-hero"><div><span className="overline">PRACTICE LAB · SELF-DIRECTED</span><h1>Tự tạo bài, tự check, rồi chọn phần cần luyện lại</h1><p>Chọn kỹ năng và chủ đề. NT tạo một nhiệm vụ mới theo {language.name} · {level}, sau đó chạy một checklist local trước khi bạn tự sửa hoặc nhờ AI/giáo viên góp ý.</p></div><div className="self-study-hero-mark"><Sparkles/><strong>{(state.selfStudyHistory || []).length}</strong><span>phiên đã lưu</span></div></div>

    <section className="self-study-builder panel">
      <div className="panel-title"><div><span className="panel-icon purple"><Target /></span><div><h2>1. Tạo nhiệm vụ</h2><p>Prompt được sinh local, không gửi dữ liệu của bạn đi đâu.</p></div></div><button className="btn secondary small" onClick={regenerate}><RefreshCw /> Prompt mới</button></div>
      <div className="self-study-filters">
        <label><span>Kỹ năng</span><select value={skill} onChange={(event) => { setSkill(event.target.value); setSeed(0) }}>{selfStudySkills.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Chủ đề</span><select value={topic} onChange={(event) => { setTopic(event.target.value); setSeed(0) }}>{selfStudyTopics.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label><span>Kiểu thử thách</span><select value={challenge} onChange={(event) => { setChallenge(event.target.value); setSeed(0) }}>{challengeOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="generated-prompt"><div className="prompt-label"><span>{prompt.skill} · {prompt.mode}</span><small>{prompt.level} · {prompt.challenge}</small></div><h2>{prompt.title}</h2><p>{prompt.task}</p><div className="prompt-guidance"><strong>Level guardrail:</strong> {prompt.guidance}</div></div>
      <div className="prompt-actions"><button className="btn secondary" onClick={() => copyPrompt()}><Copy /> Copy coach prompt</button><span>Prompt có sẵn rubric để dán sang AI mà không cần viết lại yêu cầu.</span></div>
    </section>

    <div className="self-study-workspace">
      <section className="self-study-response panel"><div className="panel-title"><div><span className="panel-icon blue">{prompt.skill === 'Speaking' ? <Mic /> : <PenLine />}</span><div><h2>2. Làm bài</h2><p>{prompt.skill === 'Speaking' ? 'Nói tự nhiên rồi dùng transcript để tự rà.' : 'Tự làm trước, chưa xem feedback ngoài.'}</p></div></div><span className="self-study-time"><Clock3 /> {Math.max(1, Math.round(prompt.minWords / 12))}–{Math.max(3, Math.round(prompt.minWords / 7))} phút</span></div><textarea value={response} onChange={(event) => setResponse(event.target.value)} placeholder={prompt.skill === 'Speaking' ? 'Bấm Record để lấy transcript, hoặc gõ lại những gì bạn vừa nói…' : 'Viết câu trả lời của bạn ở đây…'} rows="13" aria-label="Câu trả lời tự luyện"/><div className="response-toolbar"><span>{response.trim() ? response.trim().split(/\s+/u).length : 0} từ · {prompt.minWords}+ từ gợi ý</span>{prompt.skill === 'Speaking' && <button className={`btn ${recording ? 'danger' : 'secondary'} small`} onClick={toggleRecording}>{recording ? <><Square /> Dừng ghi</> : <><Mic /> Record transcript</>}</button>}</div></section>

      <section className="self-check panel"><div className="panel-title"><div><span className="panel-icon orange"><CheckCircle2 /></span><div><h2>3. Tự check</h2><p>Đừng chỉ hỏi “đúng chưa”; hãy chấm theo tiêu chí.</p></div></div></div><div className="rubric-list">{selfStudyRubric.map(([id, label]) => <label key={id}><span>{label}</span><select value={rubric[id]} onChange={(event) => setRubric((current) => ({ ...current, [id]: Number(event.target.value) }))}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select></label>)}</div><ul className="self-check-list">{prompt.checks.map((item) => <li key={item}><span>•</span>{item}</li>)}</ul><button className="btn large full" disabled={!response.trim()} onClick={checkResponse}><Check /> Tự check và lưu</button>{checked && <div className="self-check-result"><div className="self-score"><strong>{checked.score}</strong><span>/100 self-check</span></div><div><strong>{checked.score >= 75 ? 'Có thể chuyển sang feedback sâu hơn' : 'Chọn một lỗi lớn nhất và thử lại'}</strong><p>Checklist đạt {checked.checks.filter((item) => item.passed).length}/{checked.checks.length} · lexical diversity {checked.lexicalDiversity}% · {checked.connectors} từ nối.</p></div></div>}</section>
    </div>

    {checked && <section className="self-analysis panel"><div className="panel-title"><div><span className="panel-icon green"><BarChart3 /></span><div><h2>Self-check report</h2><p>Đây là tín hiệu để chọn bài kế tiếp, không phải chứng chỉ năng lực.</p></div></div><span className="self-report-score">{checked.score}/100</span></div><div className="analysis-grid">{checked.checks.map((item) => <div className={item.passed ? 'passed' : 'needs-work'} key={item.label}><span>{item.passed ? <Check /> : '!'}</span><strong>{item.label}</strong><small>{item.passed ? 'Đạt ở mức kiểm tra local' : 'Cần xem lại và thử lại'}</small></div>)}</div>{checked.repeated.length > 0 && <p className="notice warning">Từ lặp nhiều: {checked.repeated.map(([word, count]) => `${word} (${count})`).join(', ')}. Hãy thay một vài từ bằng collocation chính xác hơn.</p>}<div className="self-analysis-actions"><button className="btn" onClick={() => copyPrompt(true)}><Copy /> Copy bài + prompt cho AI</button><button className="btn secondary" onClick={regenerate}><RefreshCw /> Tạo thử thách tiếp</button></div></section>}

    <section className="self-history panel"><div className="panel-title"><div><span className="panel-icon purple"><Save /></span><div><h2>Skill loop</h2><p>Điểm self-check được lưu trên thiết bị để so sánh các lần luyện.</p></div></div><Link to="/progress" className="text-link">Xem thống kê</Link></div><div className="skill-loop-grid">{latestBySkill.map((item) => <div key={item.skill}><strong>{item.average || '—'}<small>{item.average ? '/100 self-check' : ''}</small></strong><span>{item.skill}</span><small>{item.count ? `${item.count} phiên` : 'Chưa luyện'}</small></div>)}</div>{history.length > 0 && <div className="self-history-list">{history.map((item) => <article key={item.id}><span>{item.skill}</span><strong>{item.score}/100</strong><small>{item.topic} · {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(item.date))}</small></article>)}</div>}</section>
  </div>
}

