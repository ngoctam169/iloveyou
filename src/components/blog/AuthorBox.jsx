import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AUTHOR } from '../../data/author'

export default function AuthorBox() {
  return <aside className="author-box" aria-labelledby="article-author-title">
    <div className="author-monogram" aria-hidden="true">NT</div>
    <div><span className="overline">TÁC GIẢ</span><h2 id="article-author-title">{AUTHOR.name}</h2><strong>{AUTHOR.jobTitle}</strong><p>{AUTHOR.description}</p><div className="author-links"><Link className="text-link" to="/about">About Nguyễn Ngọc Tâm <ArrowRight/></Link><a href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn của Nguyễn Ngọc Tâm"><ExternalLink/> LinkedIn</a><a href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer" aria-label="GitHub của Nguyễn Ngọc Tâm"><ExternalLink/> GitHub</a></div></div>
  </aside>
}
