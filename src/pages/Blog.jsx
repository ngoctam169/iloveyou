import { BookOpenText } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'
import { latestBlogPosts } from '../data/blogMeta'

export default function Blog() {
  return <div className="inner-page section-shell blog-index">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'Blog' }]}/>
    <header className="blog-hero"><div><span className="overline">ENGINEERING NOTES</span><h1>Blog của Nguyễn Ngọc Tâm</h1><p>PHP, Backend, Realtime Systems &amp; Web Development. Những bài viết tập trung vào cách hệ thống hoạt động, trade-off khi triển khai và lỗi thường gặp trong production.</p><div className="blog-author-line"><BookOpenText aria-hidden="true"/><span>Viết bởi <Link to="/about">{AUTHOR.name}</Link> · {AUTHOR.jobTitle} tại Ho Chi Minh City</span></div></div><div className="blog-topic-cloud" aria-label="Chủ đề chính">{['PHP','Laravel','MongoDB','Redis','WebSocket','WebRTC'].map((topic) => <span key={topic}>{topic}</span>)}</div></header>
    <section className="blog-list" aria-labelledby="all-articles-title"><div className="section-intro left"><span className="overline">BÀI VIẾT KỸ THUẬT</span><h2 id="all-articles-title">Phân tích từ nền tảng đến production</h2><p>Mỗi bài trả lời điều gì đang xảy ra, khi nào nên dùng, trade-off và cách quan sát hệ thống sau khi triển khai.</p></div><div className="blog-grid">{latestBlogPosts.map((post) => <BlogCard key={post.slug} post={post}/>)}</div></section>
  </div>
}
