import { BriefcaseBusiness, Code2, ExternalLink, GraduationCap, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const skillGroups = [
  ['Backend',['PHP 7.x / 8.x','Laravel','CodeIgniter','PHPUnit','JWT / Firebase JWT','Guzzle','RESTful API']],
  ['Data & messaging',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime',['WebSocket','WebRTC','Janus WebRTC Server','Jitsi']],
  ['Frontend',['JavaScript','TypeScript','Kendo UI']],
  ['Cloud & DevOps',['AWS EC2','AWS S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux']],
]

const projects = [
  ['Worldfone4X','Omnichannel Contact Center kết hợp voice, social messaging và CRM. Nguyễn Ngọc Tâm tham gia phát triển tính năng, tích hợp Salesforce/HubSpot và các kênh Zalo, WhatsApp, LiveChat, LINE; đồng thời xử lý sự cố và tối ưu luồng realtime.',['PHP','MongoDB','Redis','Beanstalkd','Kendo UI','WebSocket']],
  ['Enterprise communication integrations','Triển khai và tích hợp nền tảng communication với hệ thống nội bộ, xử lý chất lượng code, unit test, bảo mật XSS, đồng bộ API và các yêu cầu vận hành enterprise.',['PHP','MongoDB','Redis','JavaScript','WebSocket']],
  ['Secure realtime communication','Phát triển module communication có video call WebRTC, signaling, xác thực phiên, phân phối chat, logging và tối ưu WebSocket cho môi trường có yêu cầu bảo mật cao.',['PHP','WebRTC','WebSocket','MongoDB','Redis']],
  ['Video Room Integration System','Thiết kế backend tích hợp Janus WebRTC Server và Jitsi, xử lý event bất đồng bộ bằng Laravel Queue, đồng bộ metadata phòng và dọn session hết hạn.',['Laravel','Janus','Jitsi','MongoDB','Redis','WebSocket']],
]

export default function About() {
  return <article className="inner-page section-shell about-author">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'About Nguyễn Ngọc Tâm' }]}/>
    <header className="about-hero"><div><span className="overline">NGUYỄN NGỌC TÂM · NGỌC TÂM DEV</span><h1>Nguyễn Ngọc Tâm (Ngọc Tâm Dev) – Full-stack Developer</h1><p className="about-summary">Nguyễn Ngọc Tâm (Nguyen Ngoc Tam), còn sử dụng developer branding Ngọc Tâm Dev và Tâm Dev, là Full-stack Developer quê Ninh Thuận, hiện làm việc tại South Telecom ở Ho Chi Minh City, Vietnam từ 07/2022. Tâm tập trung vào PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và các hệ thống backend/realtime.</p><div className="about-actions"><Link className="btn" to="/blog">Đọc Blog kỹ thuật</Link><a className="btn secondary" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a><a className="btn ghost" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a></div></div><div className="about-identity-card"><div className="author-monogram large" aria-hidden="true">NT</div><strong>{AUTHOR.name}</strong><span>{AUTHOR.jobTitle}</span><small><MapPin/> {AUTHOR.location}</small><small>Quê Ninh Thuận, Vietnam</small></div></header>

    <section className="about-section" aria-labelledby="profile-title"><div className="about-section-heading"><BriefcaseBusiness/><div><span className="overline">PROFESSIONAL PROFILE</span><h2 id="profile-title">Kinh nghiệm phát triển sản phẩm và hệ thống realtime</h2></div></div><div className="about-prose"><p>Từ tháng 07/2022, Nguyễn Ngọc Tâm làm việc tại South Telecom với vai trò Full-stack Developer. Công việc gồm phát triển và duy trì tính năng, phân tích sự cố kỹ thuật, tối ưu hiệu năng và chi phí cloud, tích hợp CRM, xử lý production issue và xây dựng các kênh giao tiếp realtime.</p><p>Tâm phối hợp cùng Product, QA và Support trong quy trình Agile/Scrum, đồng thời hỗ trợ đào tạo developer mới và điều phối các hoạt động Scrum. Trước đó, Tâm thực tập Backend Developer tại R-Digital từ 04/2022 đến 07/2022.</p><p>Xuất phát từ Ninh Thuận và vào TP.HCM học tập, Tâm ghi lại hành trình cá nhân trong bài <Link className="text-link" to="/blog/nguyen-ngoc-tam-ninh-thuan">Nguyễn Ngọc Tâm Ninh Thuận – hành trình từ quê nhà đến Full-stack Developer tại Sài Gòn</Link>.</p></div><div className="experience-timeline"><article><time>07/2022 – Present</time><h3>Full-stack Developer</h3><strong>South Telecom</strong><p>Product development, CRM/API integrations, performance troubleshooting, cloud cost optimization và realtime communication.</p></article><article><time>04/2022 – 07/2022</time><h3>Backend Developer Intern</h3><strong>R-Digital</strong><p>Phối hợp với frontend và các thành viên trong nhóm để xây dựng backend, cải thiện chức năng và báo cáo tiến độ dự án.</p></article></div></section>

    <section className="about-section" aria-labelledby="skills-title"><div className="about-section-heading"><Code2/><div><span className="overline">TECHNICAL SKILLS</span><h2 id="skills-title">Công nghệ Nguyễn Ngọc Tâm sử dụng</h2></div></div><div className="skill-group-grid">{skillGroups.map(([group,items]) => <article key={group}><h3>{group}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>

    <section className="about-section" aria-labelledby="projects-title"><div className="section-intro left"><span className="overline">SELECTED EXPERIENCE</span><h2 id="projects-title">Dự án và bài toán đã tham gia</h2><p>Các mô tả dưới đây chỉ sử dụng thông tin nghề nghiệp đã được cung cấp và không công bố source code, credential, dữ liệu khách hàng hoặc kiến trúc nội bộ.</p></div><div className="about-projects">{projects.map(([title,description,technologies]) => <article key={title}><h3>{title}</h3><p>{description}</p><div>{technologies.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>

    <section className="about-section education-card" aria-labelledby="education-title"><GraduationCap/><div><span className="overline">EDUCATION</span><h2 id="education-title">Industrial University of Ho Chi Minh City</h2><p>Information Technology · 09/2019 – 02/2022</p></div></section>

    <section className="about-blog-cta"><div><span className="overline">ENGINEERING NOTES</span><h2>Đọc các phân tích kỹ thuật của Nguyễn Ngọc Tâm</h2><p>Blog chia sẻ cách tiếp cận thực tế với PHP, MongoDB, Redis, Laravel Queue, WebSocket và WebRTC.</p></div><Link className="btn light" to="/blog">Mở Blog</Link></section>
  </article>
}
