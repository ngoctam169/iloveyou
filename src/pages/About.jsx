import '../styles/blog.css'
import { ArrowRight, BriefcaseBusiness, Check, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const projectDetails = {
  Worldfone4X: {
    label: 'Omnichannel platform',
    intro: 'Mình tham gia phát triển sản phẩm contact center hợp nhất voice, social messaging và CRM integration trong một hệ thống vận hành thực tế.',
    highlights: [
      'Mình tích hợp Salesforce, HubSpot và các kênh Zalo, WhatsApp, LiveChat, LINE.',
      'Mình tối ưu module Omnichat để tăng message throughput và giảm peak-time latency.',
    ],
  },
  'Shinhan Life': {
    label: 'Enterprise delivery',
    intro: 'Mình tham gia triển khai và cải thiện chất lượng hệ thống trong môi trường doanh nghiệp có yêu cầu cao về security và maintainability.',
    highlights: [
      'Mình giảm 85% code smells khi xử lý SonarQube, khắc phục XSS và bổ sung unit tests.',
      'Mình triển khai onsite và tích hợp với internal APIs, phối hợp cùng IT và business phía khách hàng.',
    ],
  },
  PVcomBank: {
    label: 'Banking communication',
    intro: 'Mình tham gia xây dựng module communication độc lập cho môi trường tài chính, tập trung vào realtime interaction và tính ổn định.',
    highlights: [
      'Mình phát triển secure video call bằng WebRTC và custom signaling.',
      'Mình tối ưu message delivery, WebSocket handling, load balancing và data serialization.',
    ],
  },
  'Video Room Integration System': {
    label: 'Realtime architecture',
    intro: 'Mình thiết kế luồng backend cho video-room tích hợp nhiều thành phần realtime và xử lý event bất đồng bộ.',
    highlights: [
      'Mình kết hợp Laravel, Janus WebRTC Server, Jitsi, Redis Queue và MongoDB.',
      'Mình xử lý room events, mapping metadata giữa Janus/Jitsi và cleanup session bằng task scheduling.',
    ],
  },
}

const skillGroups = [
  ['Application development',['PHP 7.x / 8.x','Laravel','CodeIgniter','JavaScript','TypeScript','Kendo UI','RESTful API']],
  ['Data & processing',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime & integration',['WebSocket','WebRTC','Janus','Jitsi','Salesforce','HubSpot','Webhooks','OTT integrations']],
  ['Delivery & quality',['AWS EC2 / S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux','PHPUnit','SonarQube']],
]

export default function About() {
  return <article className="inner-page section-shell about-author cvp-page cvp-page-v5">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'About Me' }]}/>

    <header className="cvp5-hero">
      <div className="cvp5-kicker">
        <span>Portfolio</span>
        <span>Ho Chi Minh City, Vietnam</span>
      </div>

      <h1>
        <span>Nguyễn Ngọc Tâm</span>
        <strong>Full-stack Developer</strong>
      </h1>

      <p className="cvp5-lead">
        Mình xây dựng và duy trì sản phẩm web trong môi trường production, từ phát triển feature,
        tích hợp hệ thống đến xử lý các vấn đề phát sinh khi sản phẩm vận hành thực tế.
      </p>

      <div className="cvp5-actions">
        <a className="btn large" href="#projects">Xem dự án <ArrowRight/></a>
        <a className="btn secondary large" href={`mailto:${AUTHOR.email}`}><Mail/> Liên hệ</a>
        <a className="cvp5-text-link" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a>
        <a className="cvp5-text-link" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a>
      </div>

      <div className="cvp5-facts" aria-label="Thông tin nhanh">
        <div><span>Current</span><strong>South Telecom</strong></div>
        <div><span>Role</span><strong>Full-stack Developer</strong></div>
        <div><span>Experience</span><strong>07/2022 — Present</strong></div>
        <div><span>Location</span><strong><MapPin/> Ho Chi Minh City</strong></div>
      </div>
    </header>

    <nav className="cvp5-nav" aria-label="Đi nhanh trong hồ sơ">
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#stack">Stack</a>
      <a href="#contact">Contact</a>
    </nav>

    <section className="cvp5-section" id="projects" aria-labelledby="projects-title">
      <div className="cvp5-section-head">
        <span>Selected work</span>
        <h2 id="projects-title">Dự án tiêu biểu</h2>
        <p>Những điểm mạnh về backend, realtime, integration, security và performance được thể hiện trong chính bối cảnh dự án đã làm.</p>
      </div>

      <div className="cvp5-project-list">
        {AUTHOR.selectedProjects.map((project,index) => {
          const detail = projectDetails[project.name]
          return <article className="cvp5-project" key={project.name}>
            <div className="cvp5-project-title">
              <span>{String(index + 1).padStart(2,'0')}</span>
              <small>{detail?.label}</small>
              <h3>{project.name}</h3>
            </div>

            <div className="cvp5-project-body">
              <p>{detail?.intro || project.summary}</p>

              <ul>
                {(detail?.highlights || [project.summary]).map((item) => <li key={item}><Check/>{item}</li>)}
              </ul>

              <div className="cvp5-tags">
                {project.technologies.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </article>
        })}
      </div>
    </section>

    <section className="cvp5-section" id="experience" aria-labelledby="experience-title">
      <div className="cvp5-section-head">
        <span>Experience</span>
        <h2 id="experience-title">Kinh nghiệm làm việc</h2>
      </div>

      <div className="cvp5-experience">
        <article>
          <div className="cvp5-experience-side">
            <span>07/2022 — Present</span>
            <small>Ho Chi Minh City</small>
          </div>
          <div>
            <p className="cvp5-company">South Telecom</p>
            <h3>Full-stack Developer</h3>
            <p>Mình phát triển và duy trì sản phẩm, tích hợp CRM/API, xử lý communication flows, production issue, performance và cloud-cost optimization. Mình phối hợp với Product, QA, Support; hỗ trợ developer mới và tham gia Scrum facilitation.</p>
          </div>
        </article>

        <article>
          <div className="cvp5-experience-side">
            <span>04/2022 — 07/2022</span>
            <small>Internship</small>
          </div>
          <div>
            <p className="cvp5-company">R-Digital</p>
            <h3>Backend Developer Intern</h3>
            <p>Mình phối hợp với frontend và các thành viên trong nhóm để xây dựng backend, cải thiện chức năng và báo cáo tiến độ dự án.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="cvp5-section" id="stack" aria-labelledby="stack-title">
      <div className="cvp5-section-head cvp5-section-head-split">
        <div>
          <span>Technical stack</span>
          <h2 id="stack-title">Công nghệ đã sử dụng</h2>
        </div>
        <p>Stack được nhóm theo vai trò trong hệ thống để dễ đọc, thay vì biến portfolio thành một danh sách logo hoặc thanh phần trăm kỹ năng.</p>
      </div>

      <div className="cvp5-stack">
        {skillGroups.map(([group,items]) => <article key={group}>
          <h3>{group}</h3>
          <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
        </article>)}
      </div>
    </section>

    <section className="cvp5-section cvp5-meta-grid">
      <article className="cvp5-meta-card">
        <GraduationCap/>
        <div>
          <span>Education</span>
          <h2>Industrial University of Ho Chi Minh City</h2>
          <p>Information Technology · 09/2019 — 02/2022</p>
        </div>
      </article>

      <article className="cvp5-meta-card cvp5-writing">
        <div>
          <span>Engineering notes</span>
          <h2>Cách mình phân tích và xử lý bài toán kỹ thuật</h2>
          <p>Ghi chú về PHP, MongoDB, Redis, queue, WebSocket, WebRTC và các vấn đề production đã gặp trong quá trình làm việc.</p>
        </div>
        <Link to="/blog">Đọc Engineering Blog <ArrowRight/></Link>
      </article>
    </section>

    <section className="cvp5-contact" id="contact" aria-labelledby="contact-title">
      <div>
        <span>Contact</span>
        <h2 id="contact-title">Nguyễn Ngọc Tâm · Full-stack Developer</h2>
        <p>Mình sẵn sàng trao đổi về vị trí phù hợp tại TP.HCM hoặc cơ hội remote.</p>
      </div>
      <div className="cvp5-contact-actions">
        <a className="btn large" href={`mailto:${AUTHOR.email}`}><Mail/> {AUTHOR.email}</a>
        <a className="btn secondary large" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer"><BriefcaseBusiness/> LinkedIn</a>
      </div>
    </section>
  </article>
}
