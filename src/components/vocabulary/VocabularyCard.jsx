import { Bookmark, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { vocabularyPath as buildVocabularyPath } from '../../utils/routes'
import { useApp } from '../../context/AppContext'
import { speak } from '../../utils/speech'
import { wordKey } from '../../utils/srs'

export default function VocabularyCard({ word, languageId, level, index }) {
  const { state, toggleSaved, setToast } = useApp()
  const id = `vocab-${wordKey({ languageId, level, word: word[0] })}`
  const existing = state.savedItems.find((item) => item.id === id || item.id === `vocab-${languageId}-${level}-${word[0]}`)
  const saved = Boolean(existing)
  const vocabularyPath = buildVocabularyPath(languageId, level, word[0])
  return <article className="vocab-card">
    <div className="vocab-number">{String(index + 1).padStart(2, '0')}</div>
    <div className="vocab-main"><div className="vocab-word-row"><div><h3>{word[0]}</h3><span className="pronunciation">{word[1]}</span></div><div><button className="icon-btn" aria-label={`Nghe ${word[0]}`} onClick={() => speak(word[0], languageId, 1, setToast)}><Volume2 /></button><button className={`icon-btn ${saved ? 'saved' : ''}`} aria-label={saved ? `Bỏ lưu ${word[0]}` : `Lưu ${word[0]}`} onClick={() => toggleSaved(existing || { id, type: 'Vocabulary', title: word[0], subtitle: `${word[3]} · ${level}`, languageId, level, path: vocabularyPath })}><Bookmark fill={saved ? 'currentColor' : 'none'} /></button></div></div><span className="word-type">{word[2]}</span><strong className="meaning">{word[3]}</strong><div className="example"><p>{word[4]}</p><span>{word[5]}</span></div><Link className="text-link" to={vocabularyPath}>Xem từ trong kho</Link></div>
  </article>
}
