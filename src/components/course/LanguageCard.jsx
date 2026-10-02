import { ArrowRight, Headphones, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { languagePath } from '../../utils/routes'
import { trackEvent } from '../../utils/analytics'

export default function LanguageCard({ language, compact = false }) {
  return (
    <article className={`language-card ${compact ? 'compact' : ''}`} style={{ '--accent': language.color }}>
      <div className="language-top"><span className="flag" aria-hidden="true">{language.flag}</span><span className="framework">{language.framework}</span></div>
      <h3>{language.nativeName}</h3><p className="language-english">{language.name}</p>
      {!compact && <p className="muted">{language.description}</p>}
      <div className="language-meta"><span>{language.levels.length} cấp độ</span><span><Headphones size={14} /> 4 kỹ năng</span><span><MessageCircle size={14} /> Thực hành</span></div>
      <Link className="text-link" to={languagePath(language.id)} onClick={() => trackEvent('select_language', { language:language.id, source:'language_card' })}>Học ngay <ArrowRight size={17} /></Link>
    </article>
  )
}
