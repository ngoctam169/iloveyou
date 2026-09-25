import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import QuizQuestion from '../components/common/QuizQuestion'
import { useApp } from '../context/AppContext'
import { grammarEntries } from '../data/grammar'
import { findLevel, languages } from '../data/languages'
import { buildGrammarQuestion } from '../utils/grammarPractice'
import { grammarPath, languagePath, levelPath } from '../utils/routes'

export default function Grammar() {
  const { state, toggleSaved, addMistake, recordGrammarAnswer } = useApp()
  const location = useLocation()
  const routeParams = useParams()
  const params = new URLSearchParams(location.search)
  const pathLanguage = languages.find((item) => item.id === routeParams.languageId)
  const pathLevel = findLevel(pathLanguage, routeParams.levelSlug)?.[0]
  const [languageId, setLanguageId] = useState(pathLanguage?.id || params.get('language') || state.selectedLanguage)
  const [level, setLevel] = useState(pathLevel || params.get('level') || state.selectedLevel)
  const [selectedId, setSelectedId] = useState(params.get('topic') || '')
  const [answer, setAnswer] = useState(null)
  const [checked, setChecked] = useState(false)
  const [sentence, setSentence] = useState('')
  const [showModel, setShowModel] = useState(false)
  useEffect(() => { const route = new URLSearchParams(location.search); if (pathLanguage) setLanguageId(pathLanguage.id); else if (route.has('language')) setLanguageId(route.get('language')); if (pathLevel) setLevel(pathLevel); else if (route.has('level')) setLevel(route.get('level')); if (route.has('topic')) setSelectedId(route.get('topic')) }, [location.search, location.pathname])
  const language = languages.find((item) => item.id === languageId) || languages[0]
  const validLevel = language.levels.some(([name]) => name === level) ? level : language.levels[0][0]
  const topics = grammarEntries.filter((item) => item.languageId === language.id && item.level === validLevel)
  const entry = topics.find((item) => item.id === selectedId) || topics[0]
  const question = useMemo(() => entry && buildGrammarQuestion(entry), [entry?.id])
  const saved = entry && state.savedItems.some((item) => item.id === `grammar-${entry.id}`)
  const resetPractice = () => { setAnswer(null); setChecked(false); setSentence(''); setShowModel(false) }
  const choose = (id) => { setSelectedId(id); resetPractice() }
  const check = () => {
    if (answer === null || checked) return
    const correct = answer === question.answer
    setChecked(true)
    recordGrammarAnswer(entry.name, correct)
    if (!correct) addMistake({ id:`grammar-library-${entry.id}`, type:'Grammar', prompt:question.question, yourAnswer:question.options[answer], answer:entry.name, explanation:question.explanation, topic:entry.name, path:grammarPath(entry.languageId,entry.level,entry.id) })
  }
  const bookmark = () => toggleSaved({ id:`grammar-${entry.id}`, type:'Grammar', title:entry.name, subtitle:`${language.name} · ${entry.level}`, languageId:entry.languageId, level:entry.level, path:grammarPath(entry.languageId,entry.level,entry.id) })

  return <div className="inner-page section-shell grammar-page">{pathLanguage && pathLevel && <Breadcrumbs items={[{ label:'Trang chủ', to:'/' },{ label:pathLanguage.name, to:languagePath(pathLanguage.id) },{ label:pathLevel, to:levelPath(pathLanguage.id,pathLevel) },{ label:'Ngữ pháp' }]}/>}<div className="page-heading"><span className="overline">GRAMMAR LIBRARY</span><h1>{pathLanguage && pathLevel ? `Ngữ pháp ${pathLanguage.name} ${pathLevel}` : 'Ngữ pháp theo ngôn ngữ và level'}</h1><p>{pathLanguage && pathLevel ? `Các cấu trúc trọng tâm của ${pathLanguage.name} ${pathLevel}, kèm giải thích, ví dụ, lỗi thường gặp và bài kiểm tra nhanh.` : 'Đọc cấu trúc, nhận diện qua ví dụ rồi tự viết một câu mới. Bạn có thể mở bất kỳ level nào.'}</p></div><div className="filter-bar grammar-filters"><label><span>Ngôn ngữ</span><select value={language.id} onChange={(event) => { const next = languages.find((item) => item.id === event.target.value); setLanguageId(next.id); setLevel(next.levels[0][0]); setSelectedId(''); resetPractice() }}>{languages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span>Level</span><select value={validLevel} onChange={(event) => { setLevel(event.target.value); setSelectedId(''); resetPractice() }}>{language.levels.map(([name]) => <option key={name}>{name}</option>)}</select></label></div><div className="grammar-layout"><aside className="panel grammar-index"><h2>{language.name} · {validLevel}</h2><p>{topics.length} chủ điểm</p>{topics.map((item) => <button key={item.id} className={entry.id === item.id ? 'active' : ''} onClick={() => choose(item.id)}>{item.name}</button>)}</aside>{entry && <article className="panel grammar-detail"><div className="grammar-detail-head"><div><span className="overline">{language.name.toUpperCase()} · {validLevel}</span><h2>{entry.name}</h2></div><button className="btn secondary small" aria-pressed={saved} onClick={bookmark}>{saved ? '★ Đã lưu' : '☆ Lưu chủ điểm'}</button></div><p>{entry.explanation}</p><div className="grammar-structure"><strong>Cấu trúc</strong><code>{entry.structure}</code></div><div className="grammar-examples"><h3>Ví dụ</h3>{entry.examples.map((example) => <p key={example}>{example}</p>)}</div><div className="notice grammar-mistake"><strong>Lỗi thường gặp:</strong> {entry.mistake}</div><div className="grammar-practice"><h3>Kiểm tra nhanh</h3><QuizQuestion question={question} value={answer} onChange={setAnswer} checked={checked}/>{!checked && <button className="btn" disabled={answer === null} onClick={check}>Kiểm tra đáp án</button>}</div><div className="grammar-output"><h3>Thử dùng cấu trúc</h3><p>Viết một câu khác dựa trên cấu trúc này, sau đó đối chiếu với ví dụ.</p><textarea aria-label="Câu tự viết" rows={3} value={sentence} onChange={(event) => setSentence(event.target.value)} placeholder="Viết câu của bạn…"/><button className="btn secondary small" disabled={!sentence.trim()} onClick={() => setShowModel(true)}>Xem mẫu để tự đối chiếu</button>{showModel && <div className="notice"><strong>Câu mẫu:</strong> {entry.examples[1] || entry.examples[0]}<p>Hãy kiểm tra trật tự từ và lỗi thường gặp ở trên. Phần này là tự rà, không chấm tự động.</p></div>}</div>{entry.lessonPath && <Link className="btn secondary" to={entry.lessonPath}>Mở phần ngữ pháp trong bài học →</Link>}</article>}</div></div>
}

