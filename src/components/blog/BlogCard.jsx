import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BlogCard({ post, compact = false }) {
  return <article className={`blog-card${compact ? ' compact' : ''}`}>
    <div className="blog-card-meta"><span>{post.category}</span><span><Clock3 aria-hidden="true"/> {post.readingTime}</span></div>
    <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
    <p>{post.excerpt}</p>
    <div className="blog-card-footer"><time dateTime={post.datePublished}>{new Intl.DateTimeFormat('vi-VN',{ dateStyle:'long' }).format(new Date(`${post.datePublished}T00:00:00`))}</time><Link className="text-link" to={`/blog/${post.slug}`} aria-label={`Đọc bài ${post.title}`}>Đọc bài <ArrowRight/></Link></div>
  </article>
}
