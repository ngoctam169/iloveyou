import '../styles/blog.css'
import { ArrowRight, BookOpenText, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'
import { findBlogPost } from '../data/blogPosts'
import { latestBlogPosts } from '../data/blogMeta'

export default function Blog() {
  const story = findBlogPost('nguyen-ngoc-tam-ninh-thuan')
  const formattedDate = new Intl.DateTimeFormat('vi-VN',{ dateStyle:'long' }).format(new Date(`${story.datePublished}T00:00:00`))
  const storyPreview = story.content.filter((block) => block.type === 'p').slice(0,2)

  return <div className="inner-page section-shell blog-index">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'Engineering Blog' }]}/>
    <header className="blog-hero"><div><span className="overline">ENGINEERING NOTES · BACKEND · REALTIME · PRODUCTION</span><h1>Những ghi chú kỹ thuật mình muốn giữ lại</h1><p>Mình ghi lại các case đã gặp khi làm PHP/Laravel, MongoDB, Redis, WebSocket, WebRTC, queue và performance.</p><div className="blog-author-line"><BookOpenText aria-hidden="true"/><span>Nguyễn Ngọc Tâm · {AUTHOR.jobTitle} tại South Telecom</span></div></div><div className="blog-topic-cloud" aria-label="Chủ đề chính">{['PHP','Laravel','MongoDB','Redis','WebSocket','WebRTC','Performance'].map((topic) => <span key={topic}>{topic}</span>)}</div></header>

    <section className="blog-story-preview" aria-labelledby="personal-story-preview-title">
      <div className="blog-story-preview-copy">
        <span className="article-category">{story.category}</span>
        <h2 id="personal-story-preview-title">{story.title}</h2>
        <p className="article-lead">{story.description}</p>
        <div className="story-preview-body">{storyPreview.map((block,index) => <p key={index}>{block.text}</p>)}</div>
        <div className="article-byline"><span>Viết bởi <Link to="/about">{AUTHOR.name}</Link></span><span><CalendarDays aria-hidden="true"/><time dateTime={story.datePublished}>{formattedDate}</time></span><span><Clock3 aria-hidden="true"/>{story.readingTime}</span></div>
        <Link className="btn story-read-more" to="/blog/nguyen-ngoc-tam-ninh-thuan">Đọc câu chuyện đầy đủ <ArrowRight/></Link>
      </div>
    </section>

    <section className="blog-list" aria-labelledby="all-articles-title"><div className="section-intro left"><span className="overline">TECHNICAL ARTICLES</span><h2 id="all-articles-title">Những thứ mình từng phải tìm hiểu khi đi làm</h2><p>Có bài bắt đầu từ một bug, có bài từ một thứ mình phải tự đọc thêm để xử lý công việc.</p></div><div className="blog-grid">{latestBlogPosts.map((post) => <BlogCard key={post.slug} post={post}/>)}</div></section>
  </div>
}
