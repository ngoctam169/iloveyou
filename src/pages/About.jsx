import '../styles/blog.css'
import { ArrowRight, BriefcaseBusiness, Check, Code2, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const projectDetails = {
  Worldfone4X: {
    label: 'Omnichannel platform',
    intro: 'Phát triển sản phẩm contact center hợp nhất voice, social messaging và CRM integration trong một hệ thống vận hành thực tế.',
    highlights: [
      'Tích hợp Salesforce, HubSpot và các kênh Zalo, WhatsApp, LiveChat, LINE.',
      'Tối ưu module Omnichat để tăng message throughput và giảm peak-time latency.',
    ],
  },
  'Shinhan Life': {
    label: 'Enterprise delivery',
    intro: 'Triển khai và cải thiện chất lượng hệ thống trong môi trường doanh nghiệp có yêu cầu cao về security và maintainability.',
    highlights: [
      'Giảm 85% code smells khi xử lý SonarQube, khắc phục XSS và bổ sung unit tests.',
      'Triển khai onsite và tích hợp với internal APIs, phối hợp cùng IT và business phía khách hàng.',
    ],
  },
  PVcomBank: {
    label: 'Banking communication',
    intro: 'Xây dựng module communication độc lập cho môi trường tài chính, tập trung vào realtime interaction và tính ổn định.',
    highlights: [
      'Phát triển secure video call bằng WebRTC và custom signaling.',
      'Tối ưu message delivery, WebSocket handling, load balancing và data serialization.',
    ],
  },
  'Video Room Integration System': {
    label: 'Realtime architecture',
    intro: 'Thiết kế luồng backend cho video-room tích hợp nhiều thành phần realtime và xử lý event bất đồng bộ.',
    highlights: [
      'Kết hợp Laravel, Janus WebRTC Server, Jitsi, Redis Queue và MongoDB.',
      'Xử lý room events, mapping metadata giữa Janus/Jitsi và cleanup session bằng task scheduling.',
    ],
  },
}

const skillGroups = [
  ['Application development',['PHP 7.x / 8.x','Laravel','CodeIgniter','JavaScript','TypeScript','Kendo UI','RESTful API']],
  ['Data & processing',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime & integration',['WebSocket','WebRTC','Janus','Jitsi','Salesforce','HubSpot','Webhooks','OTT integrations']],
  ['Delivery & quality',['AWS EC2 / S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux','PHPUnit','SonarQube']],
]

const strengths = [
  ['Product delivery','Theo feature từ yêu cầu, implementation, integration đến kiểm tra và xử lý khi chạy production.'],
  ['Problem solving','Debug production issue, phân tích bottleneck và chọn giải pháp phù hợp thay vì chỉ xử lý phần triệu chứng.'],
  ['Cross-functional','Làm việc cùng Product, QA, Support và phía khách hàng để đưa thay đổi vào hệ thống ổn định.'],
  ['Ownership','Hỗ trợ developer mới, theo dõi tiến độ và từng đảm nhiệm vai trò Scrum Host / Facilitator khi cần.'],
]

export default function About() {
  return <article className="inner-page section-shell about-author cvp-page">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'About Me' }]}/>

    <header className="cvp-hero">
      <div className="cvp-hero-copy">
        <div className="cvp-availability"><span aria-hidden="true"/> Open to the right opportunity</div>

        <h1>
          <span>Nguyễn Ngọc Tâm</span>
          <strong>Full-stack Developer</strong>
        </h1>

        <p className="cvp-hero-lead">
          Tôi phát triển sản phẩm web end-to-end và ưu tiên những thứ quan trọng khi hệ thống chạy thật:
          code dễ bảo trì, dữ liệu nhất quán, hiệu năng ổn định và delivery rõ ràng.
        </p>

        <div className="cvp-hero-actions">
          <a className="btn large" href="#projects">Xem dự án <ArrowRight/></a>
          <a className="btn secondary large" href={`mailto:${AUTHOR.email}`}><Mail/> Liên hệ</a>
        </div>

        <div className="cvp-social-links">
          <a href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a>
          <a href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a>
        </div>
      </div>

      <aside className="cvp-snapshot" aria-label="Thông tin nhanh">
        <div className="cvp-snapshot-head">
          <span>Quick profile</span>
          <Code2 aria-hidden="true"/>
        </div>

        <dl>
          <div>
            <dt>Role</dt>
            <dd>Full-stack Developer</dd>
          </div>
          <div>
            <dt>Current</dt>
            <dd>South Telecom</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>07/2022 — Present</dd>
          </div>
          <div>
            <dt>Selected work</dt>
            <dd>4 production systems</dd>
          </div>
        </dl>

        <div className="cvp-snapshot-location"><MapPin/> Ho Chi Minh City, Vietnam</div>
      </aside>
    </header>

    <nav className="cvp-nav" aria-label="Đi nhanh trong hồ sơ">
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#strengths">Strengths</a>
      <a href="#stack">Stack</a>
      <a href="#contact">Contact</a>
    </nav>

    <section className="cvp-section cvp-projects" id="projects" aria-labelledby="projects-title">
      <div className="cvp-section-heading">
        <span>Selected projects</span>
        <h2 id="projects-title">Những hệ thống tôi đã trực tiếp tham gia</h2>
        <p>Backend, realtime, integration hay security được đặt đúng ngữ cảnh dự án — không dùng chúng để thay thế identity chính là Full-stack Developer.</p>
      </div>

      <div className="cvp-project-grid">
        {AUTHOR.selectedProjects.map((project,index) => {
          const detail = projectDetails[project.name]
          return <article className="cvp-project-card" key={project.name}>
            <div className="cvp-project-topline">
              <span>{String(index + 1).padStart(2,'0')}</span>
              <small>{detail?.label}</small>
            </div>

            <h3>{project.name}</h3>
            <p className="cvp-project-intro">{detail?.intro || project.summary}</p>

            <ul>
              {(detail?.highlights || [project.summary]).map((item) => <li key={item}><Check/>{item}</li>)}
            </ul>

            <div className="cvp-tags">
              {project.technologies.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        })}
      </div>
    </section>

    <section className="cvp-section cvp-experience" id="experience" aria-labelledby="experience-title">
      <div className="cvp-section-heading">
        <span>Experience</span>
        <h2 id="experience-title">Kinh nghiệm làm việc</h2>
      </div>

      <div className="cvp-experience-list">
        <article>
          <div className="cvp-experience-meta">
            <span>07/2022 — Present</span>
            <small>Ho Chi Minh City</small>
          </div>
          <div className="cvp-experience-body">
            <p className="cvp-company">South Telecom</p>
            <h3>Full-stack Developer</h3>
            <p>Phát triển và duy trì sản phẩm, tích hợp CRM/API, xử lý communication flows, production issue, performance và cloud-cost optimization. Phối hợp với Product, QA, Support; hỗ trợ developer mới và tham gia Scrum facilitation.</p>
            <div className="cvp-tags">
              {['PHP','JavaScript','MongoDB','Redis','WebSocket','WebRTC','CRM integration','CI/CD'].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </article>

        <article>
          <div className="cvp-experience-meta">
            <span>04/2022 — 07/2022</span>
            <small>Internship</small>
          </div>
          <div className="cvp-experience-body">
            <p className="cvp-company">R-Digital</p>
            <h3>Backend Developer Intern</h3>
            <p>Phối hợp với frontend và các thành viên trong nhóm để xây dựng backend, cải thiện chức năng và báo cáo tiến độ dự án.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="cvp-section" id="strengths" aria-labelledby="strengths-title">
      <div className="cvp-section-heading">
        <span>How I work</span>
        <h2 id="strengths-title">Điểm mạnh trong cách làm việc</h2>
      </div>

      <div className="cvp-strength-grid">
        {strengths.map(([title,description],index) => <article key={title}>
          <span>{String(index + 1).padStart(2,'0')}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>)}
      </div>
    </section>

    <section className="cvp-section" id="stack" aria-labelledby="stack-title">
      <div className="cvp-section-heading cvp-section-heading-row">
        <div>
          <span>Technical stack</span>
          <h2 id="stack-title">Công nghệ đã sử dụng trong công việc</h2>
        </div>
        <p>Chỉ liệt kê những công nghệ có trong kinh nghiệm và dự án, không dùng phần trăm kỹ năng.</p>
      </div>

      <div className="cvp-stack-list">
        {skillGroups.map(([group,items]) => <article key={group}>
          <h3>{group}</h3>
          <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
        </article>)}
      </div>
    </section>

    <section className="cvp-section cvp-secondary-grid">
      <article className="cvp-education" aria-labelledby="education-title">
        <GraduationCap/>
        <div>
          <span>Education</span>
          <h2 id="education-title">Industrial University of Ho Chi Minh City</h2>
          <p>Information Technology · 09/2019 — 02/2022</p>
        </div>
      </article>

      <article className="cvp-writing" aria-labelledby="writing-title">
        <div>
          <span>Engineering notes</span>
          <h2 id="writing-title">Ghi lại cách phân tích và giải quyết vấn đề kỹ thuật</h2>
          <p>Các bài viết xoay quanh những vấn đề đã gặp khi làm PHP, MongoDB, Redis, queue, WebSocket, WebRTC và production systems.</p>
        </div>
        <Link to="/blog">Xem Engineering Blog <ArrowRight/></Link>
      </article>
    </section>

    <section className="cvp-contact" id="contact" aria-labelledby="contact-title">
      <div>
        <span>Let's work together</span>
        <h2 id="contact-title">Đang tìm một Full-stack Developer?</h2>
        <p>Tôi sẵn sàng trao đổi về vị trí phù hợp tại TP.HCM hoặc cơ hội remote.</p>
      </div>

      <div className="cvp-contact-actions">
        <a className="btn large" href={`mailto:${AUTHOR.email}`}><Mail/> {AUTHOR.email}</a>
        <a className="btn secondary large" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">
          <BriefcaseBusiness/> LinkedIn
        </a>
      </div>
    </section>
  </article>
}
