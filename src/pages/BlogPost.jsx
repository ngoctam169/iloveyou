import '../styles/blog.css'
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AuthorBox from '../components/blog/AuthorBox'
import BlogCard from '../components/blog/BlogCard'
import CodeBlock from '../components/blog/CodeBlock'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'
import { blogPosts, findBlogPost } from '../data/blogPosts'
import NotFound from './NotFound'

function ArticleBlock({ block }) {
  if (block.type === 'h2') return <h2 id={block.id}>{block.text}</h2>
  if (block.type === 'h3') return <h3 id={block.id}>{block.text}</h3>
  if (block.type === 'list') return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
  if (block.type === 'code') return <CodeBlock {...block}/>
  if (block.type === 'note') return <aside className="article-note"><strong>{block.title}</strong><p>{block.text}</p></aside>
  return <p>{block.text}</p>
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = findBlogPost(slug)
  if (!post) return <NotFound compact/>
  const related = blogPosts.filter((item) => !item.inline && item.slug !== post.slug).sort((a,b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0,2)
  const formattedDate = new Intl.DateTimeFormat('vi-VN',{ dateStyle:'long' }).format(new Date(`${post.datePublished}T00:00:00`))
  return <article className="inner-page section-shell article-page">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'Blog',to:'/blog' },{ label:post.category },{ label:post.title }]}/>
    <header className="article-header"><span className="article-category">{post.category}</span><h1>{post.title}</h1><p className="article-lead">{post.description}</p><div className="article-byline"><span>Viết bởi <Link to="/about">{AUTHOR.name}</Link></span><span><CalendarDays aria-hidden="true"/><time dateTime={post.datePublished}>{formattedDate}</time></span><span><Clock3 aria-hidden="true"/>{post.readingTime}</span></div><div className="article-tags" aria-label="Thẻ bài viết">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></header>
    <div className="article-layout"><div className="article-content">{post.content.map((block,index) => <ArticleBlock key={`${block.type}-${block.id || index}`} block={block}/>)}</div><aside className="article-toc" aria-label="Mục lục"><strong>Trong bài này</strong><ol>{post.content.filter((block) => block.type === 'h2').map((block) => <li key={block.id}><a href={`#${block.id}`}>{block.text}</a></li>)}</ol></aside></div>
    <AuthorBox/>
    <section className="related-articles" aria-labelledby="related-title"><div className="related-heading"><div><span className="overline">ĐỌC TIẾP</span><h2 id="related-title">Bài viết liên quan</h2></div><Link className="text-link" to="/blog">Xem toàn bộ Blog</Link></div><div className="blog-grid two">{related.map((item) => <BlogCard key={item.slug} post={item} compact/>)}</div></section>
    <Link className="back-link article-back" to="/blog"><ArrowLeft/> Quay lại Blog</Link>
  </article>
}
