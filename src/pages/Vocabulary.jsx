import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Headphones, Search, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import { useApp } from '../context/AppContext'
import { findLevel, languages } from '../data/languages'
import { searchVocabulary, vocabularyForState } from '../services/vocabularyService'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { speak } from '../utils/speech'
import { isDue, isWeakVocabulary, localDate, vocabularyStatus, wordKey } from '../utils/srs'
import { buildVocabularyPractice, checkVocabularyAnswer } from '../utils/vocabularyPractice'
import { languagePath, levelPath, vocabularyPath } from '../utils/routes'

const statuses = ['All', 'New Words', 'Learning', 'Review Today', 'Recently Wrong', 'Mastered', 'Weak Words', 'Favorites', 'Difficult', 'Learned']
const PAGE_SIZE = 50
const statusFromParam = (value) => ({ review:'Review Today', weak:'Weak Words', wrong:'Recently Wrong', mastered:'Mastered', new:'New Words' }[value] || 'All')
const favoriteId = (word) => `vocab-${wordKey(word)}`
const provenanceLabel = (word) => word.levelStatus === 'source' ? 'Khớp level nguồn' : word.levelStatus === 'extended' ? 'Bổ sung từ level lân cận' : word.levelStatus === 'study-band' ? 'Study band của app' : 'Biên tập trong app'
const provenanceTone = (word) => word.levelStatus === 'source' ? 'source' : word.levelStatus === 'extended' ? 'extended' : word.levelStatus === 'study-band' ? 'study-band' : 'editorial'
const provenanceDetail = (word) => word.levelStatus === 'study-band'
  ? `${word.level} là study band của app; nguồn gốc giữ ở ${word.sourceLevel || 'NIKL grade'}.`
  : word.levelStatus === 'extended'
    ? `App level ${word.level}; nguồn gốc ${word.sourceLevel || 'level lân cận'} và được bổ sung để đủ độ phủ luyện tập.`
    : `App level ${word.level}${word.sourceLevel ? ` · source level ${word.sourceLevel}` : ''}.`
const isFavorite = (word, items) => items.some((item) => item.id === favoriteId(word) || item.type === 'Vocabulary' && item.title?.toLocaleLowerCase() === word.word.toLocaleLowerCase() && item.subtitle?.includes(word.level) && (!item.languageId || item.languageId === word.languageId))

export default function Vocabulary() {
  const { state, reviewVocabulary, setVocabularyMeta, toggleSaved, toggleWordInList, setToast, addMistake } = useApp()
  const location = useLocation()
  const routeParams = useParams()
  const params = new URLSearchParams(location.search)
  const pathLanguage = languages.find((item) => item.id === routeParams.languageId)
  const pathLevel = findLevel(pathLanguage, routeParams.levelSlug)?.[0]
  const [languageId, setLanguageId] = useState(pathLanguage?.id || params.get('language') || state.selectedLanguage)
  const [level, setLevel] = useState(pathLevel || params.get('level') || 'All levels')
  const [topic, setTopic] = useState('All topics')
  const [lessonId, setLessonId] = useState('All lessons')
  const [status, setStatus] = useState(statusFromParam(params.get('status')))
  const [query, setQuery] = useState(params.get('word') || '')
  const [sortBy, setSortBy] = useState('level')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [tab, setTab] = useState('Library')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizChecked, setQuizChecked] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [quizMistakes, setQuizMistakes] = useState([])
  const [quizStartedAt, setQuizStartedAt] = useState(Date.now())
  const debouncedQuery = useDebouncedValue(query)

  useEffect(() => {
    if (!location.search) return
    const route = new URLSearchParams(location.search)
    setLanguageId(pathLanguage?.id || route.get('language') || state.selectedLanguage)
    setLevel(pathLevel || route.get('level') || 'All levels')
    setStatus(statusFromParam(route.get('status')))
    setQuery(route.get('word') || '')
    setTopic('All topics'); setLessonId('All lessons'); setCardIndex(0); setFlipped(false); setVisibleCount(PAGE_SIZE); setTab('Library')
  }, [location.search, location.pathname])

  const language = languages.find((item) => item.id === languageId) || languages[0]
  const languageWords = useMemo(() => vocabularyForState(state, language.id), [state.personalVocabulary, language.id])
  const topics = [...new Set(languageWords.filter((word) => level === 'All levels' || word.level === level).map((word) => word.topic))].sort()
  const lessons = [...new Map(languageWords.filter((word) => level === 'All levels' || word.level === level).flatMap((word) => word.lessons).map((lesson) => [lesson.id, lesson])).values()]
  const scope = languageWords.filter((word) => (level === 'All levels' || word.level === level) && (topic === 'All topics' || word.topic === topic) && (lessonId === 'All lessons' || word.lessonIds.includes(lessonId)))
  const metaFor = (word) => state.vocabularyMeta?.[wordKey(word)] || {}
  const scheduleFor = (word) => state.flashcardProgress?.[wordKey(word)]
  const weak = (word) => isWeakVocabulary(scheduleFor(word), metaFor(word).difficult)
  const recentlyWrong = (word) => (state.vocabularyActivity || []).slice(-500).some((entry) => entry.key === wordKey(word) && !entry.correct && Date.now() - Date.parse(entry.reviewedAt || entry.date) <= 14 * 86400000)
  const statusFor = (word) => vocabularyStatus(scheduleFor(word), metaFor(word).started || metaFor(word).learned)
  const matched = scope.filter((word) => {
    if (status === 'Weak Words' && !weak(word)) return false
    if (status === 'Recently Wrong' && !recentlyWrong(word)) return false
    if (status === 'Favorites' && !isFavorite(word, state.savedItems)) return false
    if (status === 'Difficult' && !metaFor(word).difficult) return false
    if (status === 'Learned' && !metaFor(word).learned && !scheduleFor(word)) return false
    if (!['All', 'Weak Words', 'Recently Wrong', 'Favorites', 'Difficult', 'Learned'].includes(status) && statusFor(word) !== status) return false
    return true
  })
  const levelOrder = new Map(language.levels.map(([name], index) => [name, index]))
  const filtered = searchVocabulary(matched, debouncedQuery).sort((a, b) => {
    if (sortBy === 'alphabetical') return a.word.localeCompare(b.word, language.code)
    if (sortBy === 'recent') return Date.parse(scheduleFor(b)?.lastReview || 0) - Date.parse(scheduleFor(a)?.lastReview || 0) || a.word.localeCompare(b.word, language.code)
    if (sortBy === 'difficult') return Number(metaFor(b).difficult) - Number(metaFor(a).difficult) || (scheduleFor(b)?.difficultyScore || 0) - (scheduleFor(a)?.difficultyScore || 0) || a.word.localeCompare(b.word, language.code)
    return (levelOrder.get(a.level) ?? 99) - (levelOrder.get(b.level) ?? 99) || a.word.localeCompare(b.word, language.code)
  })
  const visibleWords = filtered.slice(0, visibleCount)
  const card = filtered[cardIndex % Math.max(1, filtered.length)]
  const summaries = {
    total: scope.length,
    learned: scope.filter((word) => metaFor(word).learned || scheduleFor(word)).length,
    learning: scope.filter((word) => statusFor(word) === 'Learning').length,
    mastered: scope.filter((word) => statusFor(word) === 'Mastered').length,
    due: scope.filter((word) => isDue(scheduleFor(word))).length,
    weak: scope.filter(weak).length,
    source: scope.filter((word) => word.levelStatus === 'source').length,
    extended: scope.filter((word) => word.levelStatus === 'extended').length,
    studyBand: scope.filter((word) => word.levelStatus === 'study-band').length,
  }
  useEffect(() => {
    if (tab !== 'Quiz') return
    setSession(buildVocabularyPractice(filtered, languageWords))
    setQuizIndex(0); setQuizAnswer(null); setQuizChecked(false); setQuizScore(0); setQuizDone(false); setQuizMistakes([]); setQuizStartedAt(Date.now())
  }, [languageId, level, topic, lessonId, status, debouncedQuery, sortBy])
  const resetCard = () => { setCardIndex(0); setFlipped(false); setVisibleCount(PAGE_SIZE) }
  const moveCard = (direction) => { setCardIndex((current) => { const next = (current + direction + filtered.length) % filtered.length; setVisibleCount((count) => Math.max(count, next + 1)); return next }); setFlipped(false) }
  const rate = (quality) => {
    if (!card) return
    reviewVocabulary(card, quality)
    setToast(`Đã lên lịch ôn “${card.word}”`)
    setFlipped(false)
    setCardIndex((current) => ['All', 'Favorites', 'Difficult', 'Learned'].includes(status) ? (current + 1) % Math.max(1, filtered.length) : 0)
  }
  const startPractice = () => {
    const prioritized = [...filtered].sort((a, b) => Number(isDue(scheduleFor(b))) - Number(isDue(scheduleFor(a))) || Number(weak(b)) - Number(weak(a)))
    setSession(buildVocabularyPractice(prioritized, languageWords))
    setQuizIndex(0); setQuizAnswer(null); setQuizChecked(false); setQuizScore(0); setQuizDone(false); setQuizMistakes([]); setQuizStartedAt(Date.now()); setTab('Quiz')
  }
  const practiceCard = () => {
    if (!card) return
    setSession(buildVocabularyPractice([card], languageWords, 6))
    setQuizIndex(0); setQuizAnswer(null); setQuizChecked(false); setQuizScore(0); setQuizDone(false); setQuizMistakes([]); setQuizStartedAt(Date.now()); setTab('Quiz')
  }
  const currentQuiz = session[quizIndex]
  const quizCorrect = currentQuiz && checkVocabularyAnswer(currentQuiz, quizAnswer)
  const checkQuiz = () => {
    if (!currentQuiz || quizAnswer === null || quizAnswer === '' || currentQuiz.kind === 'match' && (!Array.isArray(quizAnswer) || quizAnswer.some((answer) => answer === null))) return
    const correct = checkVocabularyAnswer(currentQuiz, quizAnswer)
    setQuizChecked(true)
    if (correct) setQuizScore((score) => score + 1)
    const ratedWords = currentQuiz.kind === 'match' ? currentQuiz.pairs : [currentQuiz.word]
    if (!correct) setQuizMistakes((current) => [...new Map([...current, ...ratedWords].map((word) => [wordKey(word), word])).values()])
    ratedWords.forEach((word, index) => reviewVocabulary(word, currentQuiz.kind === 'match' ? currentQuiz.options[quizAnswer[index]] === word.meaningVi ? 'good' : 'again' : correct ? 'good' : 'again'))
    if (!correct) addMistake({ id: `vocabulary-practice-${currentQuiz.id}`, type: 'Vocabulary', prompt: currentQuiz.question, yourAnswer: currentQuiz.kind === 'match' ? 'Ghép chưa đúng' : currentQuiz.options ? currentQuiz.options[quizAnswer] : quizAnswer, answer: currentQuiz.kind === 'match' ? currentQuiz.pairs.map((word) => `${word.word}: ${word.meaningVi}`).join(' · ') : currentQuiz.options ? currentQuiz.options[currentQuiz.answer] : currentQuiz.correct, explanation: currentQuiz.explanation, topic: currentQuiz.type, path: vocabularyPath(currentQuiz.word.languageId,currentQuiz.word.level,currentQuiz.word.word) })
  }
  const nextQuiz = () => { if (quizIndex === session.length - 1) setQuizDone(true); else { setQuizIndex((index) => index + 1); setQuizAnswer(null); setQuizChecked(false) } }
  const reviewMistakes = () => { setSession(buildVocabularyPractice(quizMistakes, languageWords)); setQuizIndex(0); setQuizAnswer(null); setQuizChecked(false); setQuizScore(0); setQuizDone(false); setQuizMistakes([]); setQuizStartedAt(Date.now()) }

  return <div className="inner-page section-shell learning-hub vocabulary-page">
    {pathLanguage && pathLevel && <Breadcrumbs items={[{ label:'Trang chủ', to:'/' },{ label:pathLanguage.name, to:languagePath(pathLanguage.id) },{ label:pathLevel, to:levelPath(pathLanguage.id,pathLevel) },{ label:'Từ vựng' }]}/>} 
    <div className="hub-hero"><div><span className="overline">VOCABULARY</span><h1>{pathLanguage && pathLevel ? `Từ vựng ${pathLanguage.name} ${pathLevel}` : 'Học từ vựng theo ngữ cảnh'}</h1><p>{pathLanguage && pathLevel ? `Danh sách từ ${pathLanguage.name} ${pathLevel} có nghĩa, phát âm, câu ví dụ, chủ đề và bài luyện ghi nhớ. Chọn một từ để xem đầy đủ cách dùng.` : 'Chọn từ trong bài học, luyện nhiều dạng và ôn lại đúng lúc. Tiến độ được lưu trên thiết bị này.'}</p></div><div className="hub-kpi"><strong>{summaries.due}</strong><span>từ cần ôn hôm nay</span><ProgressBar value={summaries.mastered} max={Math.max(1, summaries.total)} /></div></div>
    <div className="vocabulary-shortcuts"><Link className="btn secondary small" to="/my-vocabulary">My Vocabulary</Link><Link className="btn secondary small" to="/flashcards">Flashcards</Link><Link className="btn secondary small" to="/review">Ôn hôm nay</Link></div>
    <div className="vocabulary-level-audit" aria-label="Nguồn level từ vựng"><span className="source"><strong>{summaries.source}</strong> khớp level nguồn</span><span className="extended"><strong>{summaries.extended}</strong> từ bổ sung</span>{summaries.studyBand > 0 && <span className="study-band"><strong>{summaries.studyBand}</strong> study band</span>}<small>App level dùng để học/lọc; source level cho biết cấp độ từ nguồn dữ liệu.</small></div>
    <div className="metric-grid compact-metrics vocabulary-metrics"><StatisticsCard icon={Bookmark} value={summaries.total} label="Tổng từ"/><StatisticsCard icon={CheckCircle2} value={summaries.learned} label="Đã học"/><StatisticsCard icon={Headphones} value={summaries.learning} label="Đang học"/><StatisticsCard icon={CheckCircle2} value={summaries.mastered} label="Đã thuộc"/><StatisticsCard icon={Headphones} value={summaries.due} label="Cần ôn"/><StatisticsCard icon={Bookmark} value={summaries.weak} label="Từ yếu"/></div>
    <div className="hub-tabs" role="tablist">{['Library', 'Quiz', 'Statistics'].map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => item === 'Quiz' ? startPractice() : setTab(item)}>{item === 'Library' ? 'Kho từ' : item === 'Statistics' ? 'Tiến độ' : 'Quiz'}</button>)}</div>
    <p className="notice vocabulary-data-note">Kho từ ưu tiên đúng level của nguồn. Khi nguồn không đủ độ phủ, app bổ sung từ level lân cận và gắn nhãn rõ ràng; riêng TOPIK dùng study band vì nguồn NIKL không chia chính thức thành TOPIK 1–6.</p>
    {tab !== 'Statistics' && <div className="filter-bar vocabulary-filters"><label><span>Ngôn ngữ</span><select value={language.id} onChange={(event) => { setLanguageId(event.target.value); setLevel('All levels'); setTopic('All topics'); setLessonId('All lessons'); resetCard() }}>{languages.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label><span>Cấp độ</span><select value={level} onChange={(event) => { setLevel(event.target.value); setTopic('All topics'); setLessonId('All lessons'); resetCard() }}><option>All levels</option>{language.levels.map(([name]) => <option key={name}>{name}</option>)}</select></label><label><span>Chủ đề</span><select value={topic} onChange={(event) => { setTopic(event.target.value); resetCard() }}><option>All topics</option>{topics.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Bài học</span><select value={lessonId} onChange={(event) => { setLessonId(event.target.value); resetCard() }}><option>All lessons</option>{lessons.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label><span>Trạng thái</span><select value={status} onChange={(event) => { setStatus(event.target.value); resetCard() }}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Sắp xếp</span><select value={sortBy} onChange={(event) => { setSortBy(event.target.value); resetCard() }}><option value="level">Theo cấp độ</option><option value="alphabetical">A–Z</option><option value="recent">Học gần đây</option><option value="difficult">Khó nhất</option></select></label><label className="filter-search"><span>Tìm từ</span><div><Search/><input value={query} onChange={(event) => { setQuery(event.target.value); resetCard() }} placeholder="Từ hoặc nghĩa…"/></div></label></div>}
    {tab === 'Library' && (card ? <div className="vocabulary-browser"><div className="vocabulary-index"><p>{filtered.length} từ phù hợp</p><div>{visibleWords.map((word, index) => <button key={wordKey(word)} className={index === cardIndex % filtered.length ? 'active' : ''} onClick={() => { setCardIndex(index); setFlipped(false) }}><strong>{word.word}</strong><span>{word.meaningVi} · {word.level}</span>{isDue(scheduleFor(word)) && <i aria-label="Cần ôn"/>}</button>)}{visibleCount < filtered.length && <button className="btn secondary small vocabulary-load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Hiện thêm {Math.min(PAGE_SIZE, filtered.length - visibleCount)} từ</button>}</div></div><div className="vocabulary-study"><div className="card-counter"><button className="icon-btn" aria-label="Từ trước" onClick={() => moveCard(-1)}><ChevronLeft/></button><span>{cardIndex % filtered.length + 1} / {filtered.length}</span><button className="icon-btn" aria-label="Từ tiếp" onClick={() => moveCard(1)}><ChevronRight/></button></div><div className={`detailed-flashcard ${flipped ? 'flipped' : ''}`} role="button" tabIndex={0} aria-label={`Lật thẻ ${card.word}`} onClick={() => setFlipped((value) => !value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setFlipped((value) => !value) } }}><div className="detailed-face front"><span className="word-type">{card.partOfSpeech} · {card.level} · {card.topic}</span><h2>{card.word}</h2><p>{card.ipa || 'Nhấn nút để nghe phát âm'}</p><button className="round-listen" aria-label={`Nghe ${card.word}`} onClick={(event) => { event.stopPropagation(); speak(card.word, card.languageId, 1, setToast) }}><Volume2/></button><small>Nhấn vào thẻ để xem nghĩa và ví dụ</small></div><div className="detailed-face back"><span className="overline">MEANING</span><h2>{card.meaningVi}</h2>{card.definition && <p className="definition">{card.definition}</p>}<div className="flash-detail"><strong>Ví dụ</strong>{card.example ? <><p>{card.example}</p>{card.translation && <span>{card.translation}</span>}</> : <p className="muted">Chưa có câu ví dụ từ nguồn hiện tại.</p>}</div>{Boolean(card.collocations?.length) && <div className="flash-detail"><strong>Collocations</strong><p>{card.collocations.join(' · ')}</p></div>}{Boolean(card.phrases?.length) && card.phrases.join('|') !== card.collocations?.join('|') && <div className="flash-detail"><strong>Cụm thường gặp</strong><p>{card.phrases.join(' · ')}</p></div>}{Boolean(card.synonyms?.length || card.antonyms?.length || card.wordFamily?.length) && <div className="word-relations">{card.synonyms?.length > 0 && <div><strong>Đồng nghĩa</strong><p>{card.synonyms.join(', ')}</p></div>}{card.antonyms?.length > 0 && <div><strong>Trái nghĩa</strong><p>{card.antonyms.join(', ')}</p></div>}{card.wordFamily?.length > 0 && <div><strong>Họ từ</strong><p>{card.wordFamily.join(', ')}</p></div>}</div>}</div></div><div className="vocabulary-actions"><button className={metaFor(card).learned ? 'active' : ''} aria-pressed={Boolean(metaFor(card).learned)} onClick={() => setVocabularyMeta(card, { learned: !metaFor(card).learned, started: true })}>Đã học</button><button className={isFavorite(card, state.savedItems) ? 'active' : ''} aria-pressed={isFavorite(card, state.savedItems)} onClick={() => toggleSaved({ id: favoriteId(card), type: 'Vocabulary', title: card.word, subtitle: `${card.meaningVi} · ${card.level}`, languageId: card.languageId, level: card.level, path: vocabularyPath(card.languageId,card.level,card.word) })}>Yêu thích</button><button className={metaFor(card).difficult ? 'active' : ''} aria-pressed={Boolean(metaFor(card).difficult)} onClick={() => setVocabularyMeta(card, { difficult: !metaFor(card).difficult, started: true })}>Từ khó</button><button onClick={practiceCard}>Luyện từ này</button></div><label className="vocabulary-note"><span>Ghi chú cá nhân</span><textarea rows={2} value={metaFor(card).note || ''} onChange={(event) => setVocabularyMeta(card, { note: event.target.value })} placeholder="Cách dùng, mẹo nhớ hoặc lỗi hay gặp…"/></label><p className="vocabulary-source">Nguồn: {card.source || 'Editorial'}{card.levelBasis ? ` · ${card.levelBasis}` : ''}</p>{card.lessons.length > 0 && <p className="vocabulary-source">Trong bài: <Link to={card.lessons[0].path}>{card.lessons[0].title}</Link>{card.lessons.length > 1 && ` · và ${card.lessons.length - 1} bài khác`}</p>}{flipped && <div className="memory-rating"><button onClick={() => rate('again')}><b>✕ Không nhớ</b><small>10 phút</small></button><button onClick={() => rate('hard')}><b>Khó</b><small>Ôn sớm</small></button><button onClick={() => rate('good')}><b>Nhớ</b><small>Ôn sau</small></button><button onClick={() => rate('easy')}><b>Rất dễ</b><small>Ôn thưa hơn</small></button></div>}</div></div> : <div className="empty-inline"><span>⌕</span><h2>Không có từ phù hợp</h2><p>Hãy đổi bộ lọc hoặc tìm từ khác.</p></div>)}
    {tab === 'Library' && card && state.vocabularyLists.length > 0 && <div className="vocabulary-list-picker"><strong>Lưu “{card.word}” vào danh sách:</strong>{state.vocabularyLists.map((list) => <button key={list.id} aria-pressed={list.wordKeys.includes(wordKey(card))} onClick={() => toggleWordInList(list.id, card)}>{list.wordKeys.includes(wordKey(card)) ? '✓ ' : '+ '}{list.name}</button>)}</div>}
    {tab === 'Quiz' && <section className="hub-practice">{!session.length ? <div className="empty-inline"><h2>Chưa có từ để luyện</h2><p>Đổi bộ lọc và thử lại.</p></div> : quizDone ? <div className="practice-result"><span>🏆</span><h2>Hoàn thành luyện từ vựng</h2><strong>{quizScore}/{session.length}</strong><p>Đúng {quizScore} · Sai {session.length - quizScore} · Chính xác {Math.round(quizScore / session.length * 100)}% · {Math.max(1, Math.round((Date.now() - quizStartedAt) / 1000))} giây</p><p>Câu sai đã vào Sổ lỗi sai và lịch ôn được cập nhật.</p>{quizMistakes.length > 0 && <button className="btn secondary" onClick={reviewMistakes}>Ôn lại {quizMistakes.length} từ sai</button>}<button className="btn" onClick={startPractice}>Luyện tiếp</button></div> : <><div className="practice-head"><div><span>Câu {quizIndex + 1}/{session.length}</span><strong>{currentQuiz.type}</strong></div><ProgressBar value={quizIndex + (quizChecked ? 1 : 0)} max={session.length}/></div>{currentQuiz.audio && <button className="btn secondary small" onClick={() => speak(currentQuiz.word.word, currentQuiz.word.languageId, 1, setToast)}><Volume2/> Nghe từ</button>}{currentQuiz.kind === 'match' ? <div className="quiz-question"><span className="exercise-type">GHÉP TỪ VỚI NGHĨA</span><h2>{currentQuiz.question}</h2><div className="vocabulary-matching">{currentQuiz.pairs.map((word, index) => <label key={wordKey(word)}><strong>{word.word}</strong><select disabled={quizChecked} value={quizAnswer?.[index] ?? ''} onChange={(event) => setQuizAnswer((current) => { const next = Array.isArray(current) ? [...current] : Array(currentQuiz.pairs.length).fill(null); next[index] = Number(event.target.value); return next })}><option value="">Chọn nghĩa…</option>{currentQuiz.options.map((meaning, option) => <option value={option} key={option}>{meaning}</option>)}</select></label>)}</div>{quizChecked && <div className={`feedback ${quizCorrect ? 'correct' : 'wrong'}`} role="status"><strong>{quizCorrect ? '✓ Chính xác' : '✕ Hãy xem lại các cặp từ'}</strong><p>{currentQuiz.pairs.map((word) => `${word.word}: ${word.meaningVi}`).join(' · ')}</p></div>}</div> : <QuizQuestion question={currentQuiz} value={quizAnswer} onChange={setQuizAnswer} checked={quizChecked}/>}<div className="practice-actions">{!quizChecked ? <button className="btn" disabled={quizAnswer === null || quizAnswer === '' || currentQuiz.kind === 'match' && (!Array.isArray(quizAnswer) || quizAnswer.some((answer) => answer === null))} onClick={checkQuiz}>Kiểm tra</button> : <button className="btn" onClick={nextQuiz}>{quizIndex === session.length - 1 ? 'Xem kết quả' : 'Câu tiếp'} <ChevronRight/></button>}</div></>}</section>}
    {tab === 'Statistics' && <VocabularyStatistics words={scope} state={state} summaries={summaries}/>}
  </div>
}

function VocabularyStatistics({ words, state, summaries }) {
  const [range, setRange] = useState(7)
  const firstDay = new Date(); firstDay.setDate(firstDay.getDate() - range + 1)
  const keys = new Set(words.map(wordKey))
  const recent = (state.vocabularyActivity || []).filter((entry) => keys.has(entry.key) && entry.date >= localDate(firstDay))
  const levels = [...new Set(words.map((word) => word.level))]
  const topics = [...new Set(words.map((word) => word.topic))]
  return <section className="statistics-panel"><div className="statistics-heading"><div><h2>Tiến độ từ vựng</h2><p>Thống kê theo ngôn ngữ, level và chủ đề đang chọn.</p></div><div className="segmented small">{[[7, '7 ngày'], [30, '30 ngày']].map(([days, label]) => <button key={days} className={range === days ? 'active' : ''} onClick={() => setRange(days)}>{label}</button>)}</div></div><div className="metric-grid compact-metrics"><StatisticsCard value={summaries.total} label="Tổng từ"/><StatisticsCard value={summaries.learned} label="Đã học"/><StatisticsCard value={summaries.learning} label="Đang học"/><StatisticsCard value={summaries.mastered} label="Đã thuộc"/><StatisticsCard value={summaries.due} label="Cần ôn"/><StatisticsCard value={summaries.weak} label="Từ yếu"/></div><p className="vocabulary-activity-summary">{recent.length} lượt luyện trong {range} ngày · {recent.filter((entry) => entry.correct).length} lượt nhớ đúng</p><div className="vocabulary-breakdown"><div><h3>Theo level</h3>{levels.map((level) => <p key={level}><strong>{level}</strong><span>{words.filter((word) => word.level === level).length} từ</span></p>)}</div><div><h3>Theo chủ đề</h3>{topics.map((topic) => <p key={topic}><strong>{topic}</strong><span>{words.filter((word) => word.topic === topic).length} từ</span></p>)}</div></div></section>
}

