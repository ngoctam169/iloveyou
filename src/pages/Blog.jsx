import '../styles/blog.css'
import { BookOpenText, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'
import { findBlogPost } from '../data/blogPosts'
import { latestBlogPosts } from '../data/blogMeta'

function StoryBlock({ block }) {
  if (block.type === 'h2') return <h2 id={block.id}>{block.text}</h2>
  if (block.type === 'h3') return <h3 id={block.id}>{block.text}</h3>
  if (block.type === 'list') return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
  return <p>{block.text}</p>
}

export default function Blog() {
  const story = findBlogPost('nguyen-ngoc-tam-ninh-thuan')
  const formattedDate = new Intl.DateTimeFormat('vi-VN',{ dateStyle:'long' }).format(new Date(`${story.datePublished}T00:00:00`))

  return <div className="inner-page section-shell blog-index">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'Engineering Blog' }]}/>
    <header className="blog-hero"><div><span className="overline">ENGINEERING NOTES · BACKEND · REALTIME · PRODUCTION</span><h1>Những ghi chú kỹ thuật mình muốn giữ lại</h1><p>Mình ghi lại các case đã gặp khi làm PHP/Laravel, MongoDB, Redis, WebSocket, WebRTC, queue và performance.</p><div className="blog-author-line"><BookOpenText aria-hidden="true"/><span>Nguyễn Ngọc Tâm · {AUTHOR.jobTitle} tại South Telecom</span></div></div><div className="blog-topic-cloud" aria-label="Chủ đề chính">{['PHP','Laravel','MongoDB','Redis','WebSocket','WebRTC','Performance'].map((topic) => <span key={topic}>{topic}</span>)}</div></header>

    <section className="blog-list" aria-labelledby="all-articles-title"><div className="section-intro left"><span className="overline">TECHNICAL ARTICLES</span><h2 id="all-articles-title">Những thứ mình từng phải tìm hiểu khi đi làm</h2><p>Có bài bắt đầu từ một bug, có bài từ một thứ mình phải tự đọc thêm để xử lý công việc.</p></div><div className="blog-grid">{latestBlogPosts.map((post) => <BlogCard key={post.slug} post={post}/>)}</div></section>

    <section className="inline-story" id="nguyen-ngoc-tam-ninh-thuan" aria-labelledby="personal-story-title">
      <header className="article-header">
        <span className="article-category">{story.category}</span>
        <h2 id="personal-story-title">{story.title}</h2>
        <p className="article-lead">{story.description}</p>
        <div className="article-byline"><span>Viết bởi <Link to="/about">{AUTHOR.name}</Link></span><span><CalendarDays aria-hidden="true"/><time dateTime={story.datePublished}>{formattedDate}</time></span><span><Clock3 aria-hidden="true"/>{story.readingTime}</span></div>
        <div className="article-tags" aria-label="Thẻ bài viết">{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>
      <div className="article-layout"><div className="article-content">{story.content.map((block,index) => <StoryBlock key={`${block.type}-${block.id || index}`} block={block}/>)}</div><aside className="article-toc" aria-label="Mục lục"><strong>Trong câu chuyện này</strong><ol>{story.content.filter((block) => block.type === 'h2').map((block) => <li key={block.id}><a href={`#${block.id}`}>{block.text}</a></li>)}</ol></aside></div>
    </section>
  </div>
}
