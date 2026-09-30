import '../styles/blog.css'
import { BriefcaseBusiness, Code2, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const skillGroups = [
  ['Backend',['PHP 7.x / 8.x','Laravel','CodeIgniter','PHPUnit','JWT / Firebase JWT','Guzzle','RESTful API']],
  ['Data & async processing',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime communication',['WebSocket','WebRTC','Custom signaling','Janus WebRTC Server','Jitsi']],
  ['Enterprise integration',['Salesforce','HubSpot','Internal APIs','Webhooks','Postback','Zalo','WhatsApp','LiveChat','LINE']],
  ['Cloud & DevOps',['AWS EC2','AWS S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux']],
  ['Quality & security',['SonarQube','Unit testing','XSS remediation','Production troubleshooting','Performance optimization']],
]

const capabilityGroups = [
  ['Realtime systems','Thiết kế và phát triển luồng chat/call realtime, WebSocket, WebRTC, signaling, room events và các luồng xử lý cần độ trễ thấp.'],
  ['Performance & reliability','Điều tra production issue, đọc log và dữ liệu thực tế, tối ưu throughput/latency, queue, cache, database và luồng xử lý bất đồng bộ.'],
  ['Enterprise integration','Tích hợp CRM, internal API, webhook và các kênh OTT; xử lý mapping dữ liệu, đồng bộ workflow và các yêu cầu vận hành doanh nghiệp.'],
  ['Security & maintainability','Khắc phục XSS, xử lý SonarQube/code smells, bổ sung unit test và cải thiện khả năng bảo trì của các module business-critical.'],
]

export default function About() {
  return <article className="inner-page section-shell about-author">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'Engineering Profile – Nguyễn Ngọc Tâm' }]}/>
    <header className="about-hero"><div><span className="overline">NGUYỄN NGỌC TÂM · NGỌC TÂM DEV</span><h1>Nguyễn Ngọc Tâm – Full-stack Developer tập trung Backend & Realtime Systems</h1><p className="about-summary">Nguyễn Ngọc Tâm (Nguyen Ngoc Tam / Ngọc Tâm Dev) là Full-stack Developer tại South Telecom từ 07/2022. Trọng tâm công việc là backend, realtime communication, enterprise integration và production reliability với PHP/Laravel, MongoDB, Redis, WebSocket, WebRTC, queue processing, CRM/API integration, cloud và CI/CD.</p><div className="about-actions"><a className="btn" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a><a className="btn secondary" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a><Link className="btn ghost" to="/blog">Đọc Engineering Notes</Link></div></div><div className="about-identity-card"><div className="author-monogram large" aria-hidden="true">NT</div><strong>{AUTHOR.name}</strong><span>{AUTHOR.jobTitle}</span><small><MapPin/> {AUTHOR.location}</small><small>South Telecom · 07/2022 – Present</small><small>Quê Ninh Thuận, Vietnam</small></div></header>

    <section className="about-section" aria-labelledby="profile-title"><div className="about-section-heading"><BriefcaseBusiness/><div><span className="overline">ENGINEERING PROFILE</span><h2 id="profile-title">Kinh nghiệm không chỉ dừng ở việc viết feature</h2></div></div><div className="about-prose"><p>Tại South Telecom, Tâm tham gia phát triển và duy trì các hệ thống communication, tích hợp Salesforce và HubSpot, kết nối các kênh Zalo, WhatsApp, LiveChat, LINE, xử lý production issue và tối ưu các luồng realtime. Công việc trải từ application logic, database/cache/queue đến integration và vận hành production.</p><p>Tâm cũng phối hợp với Product, QA và Support trong môi trường Agile/Scrum; hỗ trợ đào tạo developer mới, điều phối sprint ceremony và xử lý blocker. Trước South Telecom, Tâm thực tập Backend Developer tại R-Digital từ 04/2022 đến 07/2022.</p><p>Điểm tập trung hiện tại là các bài toán backend/realtime cần tính ổn định: message delivery, WebSocket/WebRTC, asynchronous processing, data consistency, API integration, performance troubleshooting, security và khả năng quan sát khi hệ thống chạy thật.</p></div></section>

    <section className="about-section" aria-labelledby="impact-title"><div className="section-intro left"><span className="overline">SELECTED ENGINEERING IMPACT</span><h2 id="impact-title">Những kết quả và bài toán đã trực tiếp tham gia</h2><p>Thay vì tự gắn nhãn “expert”, hồ sơ này tập trung vào các đầu việc và kết quả có thể kiểm chứng từ kinh nghiệm dự án.</p></div><div className="about-projects">{AUTHOR.impactHighlights.map((item,index) => <article key={item}><span className="overline">IMPACT {String(index + 1).padStart(2,'0')}</span><p>{item}</p></article>)}</div></section>

    <section className="about-section" aria-labelledby="experience-title"><div className="about-section-heading"><BriefcaseBusiness/><div><span className="overline">WORK EXPERIENCE</span><h2 id="experience-title">Kinh nghiệm làm việc</h2></div></div><div className="experience-timeline"><article><time>07/2022 – Present</time><h3>Full-stack Developer</h3><strong>South Telecom</strong><p>Phát triển sản phẩm, CRM/API integration, realtime messaging/calling, production troubleshooting, cloud-cost optimization, mentoring developer và Scrum facilitation.</p></article><article><time>04/2022 – 07/2022</time><h3>Backend Developer Intern</h3><strong>R-Digital</strong><p>Phối hợp với frontend và các thành viên trong nhóm để xây dựng backend, cải thiện chức năng và báo cáo tiến độ dự án.</p></article></div></section>

    <section className="about-section" aria-labelledby="skills-title"><div className="about-section-heading"><Code2/><div><span className="overline">TECHNICAL STACK</span><h2 id="skills-title">Công nghệ đã sử dụng trong công việc và dự án</h2></div></div><div className="skill-group-grid">{skillGroups.map(([group,items]) => <article key={group}><h3>{group}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>

    <section className="about-section" aria-labelledby="projects-title"><div className="section-intro left"><span className="overline">SELECTED PROJECT EXPERIENCE</span><h2 id="projects-title">Các hệ thống tiêu biểu đã tham gia</h2><p>Thông tin được tóm tắt ở mức năng lực và trách nhiệm, không công bố source code, credential hay dữ liệu nội bộ của khách hàng.</p></div><div className="about-projects">{AUTHOR.selectedProjects.map((project) => <article key={project.name}><h3>{project.name}</h3><p>{project.summary}</p><div>{project.technologies.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>

    <section className="about-section" aria-labelledby="capability-title"><div className="section-intro left"><span className="overline">WHAT I CAN HANDLE</span><h2 id="capability-title">Nhóm bài toán phù hợp với kinh nghiệm hiện tại</h2></div><div className="skill-group-grid">{capabilityGroups.map(([title,description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="about-section education-card" aria-labelledby="education-title"><GraduationCap/><div><span className="overline">EDUCATION</span><h2 id="education-title">Industrial University of Ho Chi Minh City</h2><p>Information Technology · 09/2019 – 02/2022</p></div></section>

    <section className="about-blog-cta"><div><span className="overline">ENGINEERING NOTES</span><h2>Đọc cách Nguyễn Ngọc Tâm tiếp cận backend và realtime systems</h2><p>Blog tập trung vào PHP, MongoDB, Redis, Laravel Queue, WebSocket, WebRTC, performance và các quyết định kỹ thuật trong production.</p></div><Link className="btn light" to="/blog">Mở Blog</Link></section>

    <section className="about-hire-cta" aria-labelledby="hire-title">
      <div className="about-hire-copy">
        <span className="overline">LET'S WORK TOGETHER</span>
        <h2 id="hire-title">Đang tìm một Full-stack / Backend Developer?</h2>
        <p>Tâm sẵn sàng trao đổi về các vị trí Full-stack, Backend hoặc Realtime Systems tại TP.HCM và cơ hội remote phù hợp.</p>
      </div>
      <div className="about-hire-contact">
        <a className="about-hire-email" href={`mailto:${AUTHOR.email}`} aria-label={`Gửi email cho ${AUTHOR.name}`}>
          <Mail aria-hidden="true"/>
          <span>{AUTHOR.email}</span>
        </a>
        <div className="about-hire-socials" aria-label="Hồ sơ nghề nghiệp">
          <a href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer" aria-label="GitHub Nguyễn Ngọc Tâm"><Code2 aria-hidden="true"/></a>
          <a href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn Nguyễn Ngọc Tâm"><BriefcaseBusiness aria-hidden="true"/></a>
        </div>
      </div>
    </section>
  </article>
}
