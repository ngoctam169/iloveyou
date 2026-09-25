import { BookOpen, RotateCcw, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getLanguage } from '../data/languages'
import { vocabularyForState } from '../services/vocabularyService'
import { speak } from '../utils/speech'
import { isDue, isWeakVocabulary, wordKey } from '../utils/srs'

function reviewSet(state, languageId, level, limit = 'all', mode = 'due') {
  const words = vocabularyForState(state, languageId, level)
  const due = words.filter((word) => isDue(state.flashcardProgress[wordKey(word)]))
  const fresh = words.filter((word) => !state.flashcardProgress[wordKey(word)])
  const wrongKeys = new Set((state.vocabularyActivity || []).filter((entry) => !entry.correct).map((entry) => entry.key))
  const smart = words.filter((word) => {
    const schedule = state.flashcardProgress[wordKey(word)]
    return isDue(schedule) || wrongKeys.has(wordKey(word)) || isWeakVocabulary(schedule, state.vocabularyMeta?.[wordKey(word)]?.difficult) || schedule?.lastReview && Date.now() - Date.parse(schedule.lastReview) > 30 * 86400000
  }).sort((a, b) => Number(isDue(state.flashcardProgress[wordKey(b)])) - Number(isDue(state.flashcardProgress[wordKey(a)])) || Number(wrongKeys.has(wordKey(b))) - Number(wrongKeys.has(wordKey(a))))
  const selected = mode === 'smart' && smart.length ? smart : due.length ? due : fresh.length ? fresh : words
  const size = limit === 'all' ? selected.length : Math.max(1, Number(limit) || selected.length)
  return selected.slice(0, size)
}

export default function Flashcards() {
  const { state, reviewVocabulary, setToast } = useApp()
  const [params] = useSearchParams()
  const language = getLanguage(params.get('language') || state.selectedLanguage) || getLanguage('english')
  const requestedLevel = params.get('level') || state.selectedLevel
  const level = language.levels.some(([name]) => name === requestedLevel) ? requestedLevel : language.levels[0][0]
  const limit = params.get('limit') || 'all'
  const mode = params.get('mode') || 'due'
  const [cards, setCards] = useState(() => reviewSet(state, language.id, level, limit, mode))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  useEffect(() => { setCards(reviewSet(state, language.id, level, limit, mode)); setIndex(0); setFlipped(false) }, [language.id, level, limit, mode])
  const card = cards[index]

  const rate = (quality) => {
    reviewVocabulary(card, quality)
    setFlipped(false)
    setIndex((current) => current + 1)
  }
  const restart = () => { setCards(reviewSet(state, language.id, level, limit, mode)); setIndex(0); setFlipped(false) }
  const shuffle = () => { setCards((current) => { const next = [...current]; for (let i = next.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [next[i], next[j]] = [next[j], next[i]] } return next }); setIndex(0); setFlipped(false); setToast('Đã trộn thẻ') }

  if (!cards.length) return <div className="empty-page section-shell"><h1>Chưa có từ trong level này</h1><Link className="btn" to="/vocabulary">Mở kho từ vựng</Link></div>
  if (index >= cards.length) return <div className="empty-page section-shell"><div className="empty-illustration">🎉</div><h1>Đã hoàn thành lượt luyện</h1><p>Những thẻ bạn đã đánh giá được cập nhật lịch ôn.</p><button className="btn" onClick={restart}><RotateCcw/> Luyện thêm</button><Link className="text-link" to="/vocabulary?status=review">Xem từ cần ôn</Link></div>
  return <div className="inner-page section-shell flashcard-page"><div className="page-heading"><span className="overline">VOCABULARY REVIEW</span><h1>Flashcards</h1><p>{language.flag} {language.name} · {level} · {cards.length - index} từ còn lại</p><Link to="/vocabulary" className="text-link">Kho từ vựng</Link></div><div className="flashcard-progress"><span>{index + 1} / {cards.length}</span><div className="progress-track"><span style={{ width: `${index / cards.length * 100}%` }}/></div></div><div className="flashcard-toolbar"><button className="btn secondary small" aria-label={`Nghe ${card.word}`} onClick={() => speak(card.word, language.id, 1, setToast)}><Volume2/> Nghe từ</button><button className="btn secondary small" disabled={index === 0} onClick={() => { setIndex(index - 1); setFlipped(false) }}>← Thẻ trước</button><button className="btn secondary small" disabled={index === cards.length - 1} onClick={() => { setIndex(index + 1); setFlipped(false) }}>Thẻ tiếp →</button><button className="btn secondary small" onClick={shuffle}>Trộn thẻ</button><button className="btn secondary small" onClick={restart}>Bắt đầu lại</button></div><button type="button" className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label={`Flashcard ${card.word}. Nhấn để ${flipped ? 'xem mặt trước' : 'xem nghĩa'}`}><span className="flash-face front"><span className="word-type">{card.partOfSpeech} · {card.topic}</span><strong className="flash-word">{card.word}</strong><span className="flash-pronunciation">{card.ipa}</span><small>Nhấn để lật thẻ</small></span><span className="flash-face back"><span className="overline">NGHĨA</span><strong className="flash-word">{card.meaningVi}</strong><span className="flash-example"><b>{card.example}</b><span>{card.translation}</span>{card.synonyms?.length > 0 && <span>Đồng nghĩa: {card.synonyms.join(', ')}</span>}{card.collocations?.length > 0 && <span>Cụm từ: {card.collocations.join(' · ')}</span>}</span><small>{card.ipa}</small></span></button>{flipped && <div className="rating-row" aria-label="Mức độ ghi nhớ"><button onClick={() => rate('again')}><span>Again</span><small>10 phút</small></button><button onClick={() => rate('hard')}><span>Hard</span><small>Ôn sớm</small></button><button onClick={() => rate('good')} className="good"><span>Good</span><small>Ôn sau</small></button><button onClick={() => rate('easy')}><span>Easy</span><small>Ôn thưa hơn</small></button></div>}<div className="srs-note"><BookOpen/><p>Đánh giá ghi nhớ sẽ cập nhật lịch ôn của cùng từ trong Kho từ vựng.</p></div></div>
}
