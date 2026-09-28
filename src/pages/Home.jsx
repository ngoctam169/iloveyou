import { ArrowRight, BriefcaseBusiness, Code2, Database, ExternalLink, GraduationCap, Radio, Server, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/blog/BlogCard'
import { AUTHOR } from '../data/author'
import { latestBlogPosts } from '../data/blogMeta'

const expertise = [
  [Code2,'PHP & Backend','PHP 7.x/8.x, Laravel, CodeIgniter, RESTful APIs, PHPUnit, JWT và Guzzle.'],
  [Database,'Data & Caching','MongoDB, PostgreSQL, SQL Server, Redis và thiết kế luồng dữ liệu cho hệ thống production.'],
  [Radio,'Realtime Systems','WebSocket, WebRTC, signaling, Janus, Jitsi và các kênh communication realtime.'],
  [Server,'Cloud & DevOps','AWS EC2/S3, Docker, Kubernetes, GitLab CI/CD, GitHub Actions, Nginx và Linux.'],
]

const projects = [
  {
    title:'Worldfone4X',
    description:'Omnichannel Contact Center kết hợp voice, social messaging và CRM. Tham gia phát triển tính năng, tích hợp Salesforce/HubSpot, xử lý production issue và tối ưu luồng realtime.',
    stack:['PHP','MongoDB','Redis','Beanstalkd','JavaScript','WebSocket'],
  },
  {
    title:'Shinhan Life',
    description:'Xử lý SonarQube và XSS, bổ sung unit test, tích hợp API nội bộ và triển khai nền tảng communication theo yêu cầu enterprise.',
    stack:['PHP','MongoDB','Redis','WebSocket','Unit Test','Security'],
  },
  {
    title:'PVcomBank',
    description:'Phát triển module communication realtime có video call WebRTC, custom signaling, session management, logging và tối ưu message delivery cho môi trường tải cao.',
    stack:['PHP','WebRTC','WebSocket','MongoDB','Redis','API Integration'],
  },
  {
    title:'Video Room Integration System',
    description:'Thiết kế backend Laravel tích hợp Janus và Jitsi, xử lý event bất đồng bộ bằng Redis Queue, đồng bộ metadata phòng và cleanup session tự động.',
    stack:['Laravel','Janus','Jitsi','MongoDB','Redis','WebSocket'],
  },
]

export default function Home() {
  return <>
    <section className="about-hero section-shell" aria-labelledby="home-title">
      <div>
        <span className="overline">NGỌC TÂM DEV · FULL-STACK DEVELOPER</span>
        <h1 id="home-title">Nguyễn Ngọc Tâm – Full-stack Developer</h1>
        <p className="about-summary">Nguyễn Ngọc Tâm (Nguyen Ngoc Tam), còn sử dụng developer branding Ngọc Tâm Dev và Tâm Dev, là Full-stack Developer tại TP.HCM. Tâm tập trung vào PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và các hệ thống backend/realtime.</p>
        <div className="about-actions">
          <Link className="btn" to="/about">Xem hồ sơ kỹ thuật <ArrowRight/></Link>
          <Link className="btn secondary" to="/blog">Đọc Blog</Link>
          <a className="btn ghost" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a>
          <a className="btn ghost" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a>
        </div>
      </div>
      <div className="about-identity-card">
        <div className="author-monogram large" aria-hidden="true">NT</div>
        <strong>{AUTHOR.name}</strong>
        <span>{AUTHOR.jobTitle}</span>
        <small>Ngọc Tâm Dev · Ho Chi Minh City, Vietnam</small>
      </div>
    </section>

    <section className="stats-strip" aria-label="Professional highlights">
      <div><strong>07/2022</strong><span>Full-stack Developer</span></div>
      <div><strong>PHP</strong><span>Laravel & Backend</span></div>
      <div><strong>Realtime</strong><span>WebSocket & WebRTC</span></div>
      <div><strong>85%</strong><span>code smells reduced on Shinhan Life</span></div>
    </section>

    <section className="section-shell about-section" id="profile" aria-labelledby="profile-title">
      <div className="about-section-heading"><BriefcaseBusiness/><div><span className="overline">PROFESSIONAL PROFILE</span><h2 id="profile-title">Xây dựng sản phẩm backend, realtime và tích hợp enterprise</h2></div></div>
      <div className="about-prose">
        <p>Từ tháng 07/2022, Nguyễn Ngọc Tâm làm việc tại South Telecom với vai trò Full-stack Developer. Công việc tập trung vào phát triển tính năng, xử lý production issue, tối ưu hiệu năng và chi phí cloud, tích hợp CRM/API và xây dựng các kênh giao tiếp realtime.</p>
        <p>Trước đó, Tâm là Backend Developer Intern tại R-Digital từ 04/2022 đến 07/2022. Trong quá trình làm việc, Tâm cũng hỗ trợ đào tạo developer mới, phối hợp Product/QA/Support và điều phối các hoạt động Scrum.</p>
      </div>
      <div className="experience-timeline">
        <article><time>07/2022 – Present</time><h3>Full-stack Developer</h3><strong>South Telecom</strong><p>Product development, CRM/API integrations, performance troubleshooting, cloud cost optimization và realtime communication.</p></article>
        <article><time>04/2022 – 07/2022</time><h3>Backend Developer Intern</h3><strong>R-Digital</strong><p>Phối hợp phát triển backend, cải thiện chức năng sản phẩm và theo dõi tiến độ dự án.</p></article>
      </div>
    </section>

    <section className="section-shell about-section" id="expertise" aria-labelledby="expertise-title">
      <div className="section-intro left"><span className="overline">TECHNICAL EXPERTISE</span><h2 id="expertise-title">Nguyễn Ngọc Tâm làm tốt những gì?</h2><p>Trọng tâm chuyên môn là PHP/backend, dữ liệu, realtime communication và vận hành hệ thống production.</p></div>
      <div className="skill-home-grid">{expertise.map(([Icon,title,text]) => <article key={title}><span><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="section-shell about-section" id="projects" aria-labelledby="projects-title">
      <div className="about-section-heading"><ShieldCheck/><div><span className="overline">SELECTED EXPERIENCE</span><h2 id="projects-title">Dự án và bài toán kỹ thuật đã tham gia</h2></div></div>
      <div className="about-projects">{projects.map((project) => <article key={project.title}><h3>{project.title}</h3><p>{project.description}</p><div>{project.stack.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>
      <p className="about-summary">Các mô tả chỉ sử dụng thông tin nghề nghiệp công khai trong hồ sơ cá nhân và không công bố source code, credential hoặc dữ liệu nội bộ.</p>
    </section>

    <section className="section-shell about-section education-card" aria-labelledby="education-title">
      <GraduationCap/>
      <div><span className="overline">EDUCATION</span><h2 id="education-title">Industrial University of Ho Chi Minh City</h2><p>Information Technology · 09/2019 – 02/2022</p></div>
    </section>

    <section className="section-shell home-blog" aria-labelledby="latest-articles-title">
      <div className="home-blog-heading">
        <div className="section-intro"><span className="overline">ENGINEERING NOTES</span><h2 id="latest-articles-title">Bài viết kỹ thuật của Nguyễn Ngọc Tâm</h2><p>Các bài viết về PHP, MongoDB, Laravel, Redis, WebSocket, WebRTC và cách xử lý bài toán production thực tế.</p></div>
        <Link className="btn secondary" to="/blog">Xem toàn bộ Blog <ArrowRight/></Link>
      </div>
      <div className="blog-grid">{latestBlogPosts.slice(0,3).map((post) => <BlogCard key={post.slug} post={post} compact/>)}</div>
    </section>

    <section className="section-shell about-blog-cta">
      <div><span className="overline">NGỌC TÂM DEV</span><h2>Tìm hiểu thêm về Nguyễn Ngọc Tâm</h2><p>Xem đầy đủ kinh nghiệm, technical stack, dự án và các bài viết kỹ thuật.</p></div>
      <div className="about-actions"><Link className="btn light" to="/about">About Nguyễn Ngọc Tâm</Link><Link className="btn light" to="/blog">Technical Blog</Link></div>
    </section>
  </>
}
