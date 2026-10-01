import '../styles/blog.css'
import { ArrowRight, BriefcaseBusiness, Check, Code2, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const skillGroups = [
  ['Backend',['PHP 7.x / 8.x','Laravel','CodeIgniter','PHPUnit','JWT / Firebase JWT','Guzzle','RESTful API']],
  ['Data & async',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime',['WebSocket','WebRTC','Custom signaling','Janus WebRTC Server','Jitsi']],
  ['Integration',['Salesforce','HubSpot','Internal APIs','Webhooks','Postback','Zalo','WhatsApp','LiveChat','LINE']],
  ['Cloud & DevOps',['AWS EC2','AWS S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux']],
  ['Quality & security',['SonarQube','Unit testing','XSS remediation','Production troubleshooting','Performance optimization']],
]

const capabilityGroups = [
  ['Realtime systems','Chat/call realtime, WebSocket, WebRTC, signaling, room events và các luồng cần độ trễ thấp.'],
  ['Performance & reliability','Điều tra production issue, tối ưu throughput/latency, queue, cache, database và xử lý bất đồng bộ.'],
  ['Enterprise integration','CRM, internal API, webhook, OTT channels, mapping dữ liệu và đồng bộ workflow doanh nghiệp.'],
  ['Security & maintainability','XSS remediation, SonarQube/code smells, unit test và cải thiện khả năng bảo trì module business-critical.'],
]

const stats = [
  ['2022 → nay','Production experience'],
  ['4','Selected systems'],
  ['85%','Code smells reduced'],
  ['Realtime','WebSocket · WebRTC'],
]

export default function About() {
  return <article className="inner-page section-shell about-author portfolio-page">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'About Me' }]}/>

    <header className="portfolio-hero">
      <div className="portfolio-hero-copy">
        <div className="portfolio-status"><span aria-hidden="true"/> AVAILABLE FOR THE RIGHT OPPORTUNITY</div>
        <span className="overline">ABOUT ME · NGUYỄN NGỌC TÂM / NGỌC TÂM DEV</span>
        <h1>Nguyễn Ngọc Tâm – Full-stack Developer tập trung Backend & Realtime Systems</h1>
        <p className="portfolio-lead">Tôi xây và vận hành các hệ thống backend/realtime cho môi trường production — từ business logic, database, cache, queue đến WebSocket, WebRTC, CRM/API integration và CI/CD.</p>
        <p className="portfolio-intro">Hiện làm việc tại South Telecom từ 07/2022. Kinh nghiệm nổi bật nằm ở communication platform, enterprise integration, banking communication, performance troubleshooting, application security và các luồng bất đồng bộ cần tính ổn định cao.</p>
        <div className="portfolio-actions">
          <a className="btn large" href={`mailto:${AUTHOR.email}`}><Mail/> Liên hệ công việc</a>
          <a className="btn secondary large" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a>
          <a className="btn ghost large" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a>
        </div>
        <div className="portfolio-meta">
          <span><MapPin/> Ho Chi Minh City, Vietnam</span>
          <span><BriefcaseBusiness/> South Telecom</span>
          <span><Code2/> Backend · Realtime · Integration</span>
        </div>
      </div>

      <aside className="portfolio-terminal" aria-label="Tóm tắt hồ sơ kỹ thuật">
        <div className="portfolio-terminal-top"><span/><span/><span/><code>profile.ts</code></div>
        <pre><code>{`const developer = {
  name: "Nguyễn Ngọc Tâm",
  role: "Full-stack Developer",
  focus: [
    "Backend systems",
    "Realtime communication",
    "Enterprise integration"
  ],
  stack: [
    "PHP / Laravel",
    "MongoDB / Redis",
    "WebSocket / WebRTC"
  ],
  mindset: "production-first"
}`}</code></pre>
        <div className="portfolio-terminal-foot"><span>● production</span><span>● realtime</span><span>● enterprise</span></div>
      </aside>
    </header>

    <section className="portfolio-stats" aria-label="Tổng quan kinh nghiệm">
      {stats.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </section>

    <section className="portfolio-section portfolio-overview" aria-labelledby="overview-title">
      <div className="portfolio-section-kicker"><span>01</span><div><span className="overline">ENGINEERING PROFILE</span><h2 id="overview-title">Tập trung vào hệ thống chạy thật, không chỉ feature chạy được</h2></div></div>
      <div className="portfolio-overview-grid">
        <div className="portfolio-copy">
          <p>Tại South Telecom, Tâm tham gia phát triển và duy trì các hệ thống communication, tích hợp Salesforce và HubSpot, kết nối Zalo, WhatsApp, LiveChat và LINE, xử lý production issue và tối ưu các luồng realtime.</p>
          <p>Công việc trải từ application logic, database/cache/queue đến API integration, realtime delivery và vận hành. Tâm cũng phối hợp với Product, QA, Support; hỗ trợ developer mới và điều phối Scrum ceremony khi cần.</p>
        </div>
        <div className="portfolio-capability-list">
          {capabilityGroups.map(([title,description]) => <article key={title}><span><Check/></span><div><h3>{title}</h3><p>{description}</p></div></article>)}
        </div>
      </div>
    </section>

    <section className="portfolio-section" aria-labelledby="impact-title">
      <div className="portfolio-section-kicker"><span>02</span><div><span className="overline">SELECTED IMPACT</span><h2 id="impact-title">Bằng chứng kỹ thuật thay cho những tính từ hoa mỹ</h2></div></div>
      <div className="portfolio-impact-grid">
        {AUTHOR.impactHighlights.map((item,index) => <article key={item} className={index < 2 ? 'featured' : ''}>
          <span className="portfolio-card-index">{String(index + 1).padStart(2,'0')}</span>
          <p>{item}</p>
        </article>)}
      </div>
    </section>

    <section className="portfolio-section" aria-labelledby="experience-title">
      <div className="portfolio-section-kicker"><span>03</span><div><span className="overline">EXPERIENCE</span><h2 id="experience-title">Kinh nghiệm làm việc</h2></div></div>
      <div className="portfolio-timeline">
        <article>
          <div className="portfolio-timeline-marker"><span/></div>
          <div className="portfolio-timeline-date">07/2022 — Present</div>
          <div className="portfolio-timeline-content">
            <span className="portfolio-company">SOUTH TELECOM</span>
            <h3>Full-stack Developer</h3>
            <p>Phát triển sản phẩm, CRM/API integration, realtime messaging/calling, production troubleshooting, cloud-cost optimization, mentoring developer và Scrum facilitation.</p>
            <div className="portfolio-tags">{['PHP','MongoDB','Redis','WebSocket','WebRTC','CRM Integration','CI/CD'].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </article>
        <article>
          <div className="portfolio-timeline-marker"><span/></div>
          <div className="portfolio-timeline-date">04/2022 — 07/2022</div>
          <div className="portfolio-timeline-content">
            <span className="portfolio-company">R-DIGITAL</span>
            <h3>Backend Developer Intern</h3>
            <p>Phối hợp với frontend và các thành viên trong nhóm để xây dựng backend, cải thiện chức năng và báo cáo tiến độ dự án.</p>
            <div className="portfolio-tags">{['Backend','API','Team delivery'].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </article>
      </div>
    </section>

    <section className="portfolio-section" aria-labelledby="projects-title">
      <div className="portfolio-section-kicker"><span>04</span><div><span className="overline">SELECTED WORK</span><h2 id="projects-title">Các hệ thống tiêu biểu đã tham gia</h2><p>Thông tin được trình bày ở mức trách nhiệm và năng lực, không công bố source code, credential hoặc dữ liệu nội bộ.</p></div></div>
      <div className="portfolio-project-grid">
        {AUTHOR.selectedProjects.map((project,index) => <article key={project.name} className={index === 0 ? 'portfolio-project-featured' : ''}>
          <div className="portfolio-project-head"><span>PROJECT {String(index + 1).padStart(2,'0')}</span><Code2/></div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <div className="portfolio-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        </article>)}
      </div>
    </section>

    <section className="portfolio-section" aria-labelledby="stack-title">
      <div className="portfolio-section-kicker"><span>05</span><div><span className="overline">TECHNICAL TOOLBOX</span><h2 id="stack-title">Stack dùng để giải quyết bài toán, không phải danh sách để trưng bày</h2></div></div>
      <div className="portfolio-stack-grid">
        {skillGroups.map(([group,items]) => <article key={group}><h3>{group}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}
      </div>
    </section>

    <section className="portfolio-section portfolio-education" aria-labelledby="education-title">
      <div className="portfolio-section-kicker"><span>06</span><div><span className="overline">EDUCATION</span><h2 id="education-title">Nền tảng học tập</h2></div></div>
      <div className="portfolio-education-card">
        <GraduationCap/>
        <div><span>09/2019 — 02/2022</span><h3>Industrial University of Ho Chi Minh City</h3><p>Information Technology</p></div>
      </div>
    </section>

    <section className="portfolio-section portfolio-bottom-section" aria-labelledby="notes-title">
      <div className="portfolio-section-kicker">
        <span>07</span>
        <div>
          <span className="overline">ENGINEERING NOTES</span>
          <h2 id="notes-title">Ghi lại cách tôi giải quyết bài toán kỹ thuật.</h2>
          <p>Ngắn gọn, thực tế và tập trung vào reasoning, trade-off cùng những gì học được từ production.</p>
        </div>
      </div>

      <div className="portfolio-notes-grid">
        <article className="portfolio-note-featured">
          <div className="portfolio-note-heading">
            <span className="portfolio-panel-label">TECHNICAL WRITING</span>
            <Code2 aria-hidden="true"/>
          </div>
          <h3>Không chỉ show kết quả — tôi viết về cách đi đến lời giải.</h3>
          <p>PHP, MongoDB, Redis, Laravel Queue, WebSocket, WebRTC, performance và các quyết định kỹ thuật trong hệ thống production.</p>
          <div className="portfolio-tags">
            {['PHP','MongoDB','Redis','Queue','WebSocket','WebRTC'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>

        <aside className="portfolio-note-action">
          <span className="portfolio-panel-label">ENGINEERING BLOG</span>
          <strong>Case study, debugging và trade-off từ công việc thực tế.</strong>
          <p>Mỗi bài ưu tiên bối cảnh, cách phân tích và lý do chọn giải pháp thay vì chỉ đưa ra đoạn code cuối cùng.</p>
          <Link className="portfolio-inline-action portfolio-inline-action-primary" to="/blog">
            Xem Engineering Blog <ArrowRight/>
          </Link>
        </aside>
      </div>
    </section>

    <section className="portfolio-section portfolio-bottom-section" aria-labelledby="hire-title">
      <div className="portfolio-section-kicker">
        <span>08</span>
        <div>
          <span className="overline">LET'S WORK TOGETHER</span>
          <h2 id="hire-title">Trao đổi về một vị trí Backend / Full-stack phù hợp.</h2>
          <p>Tập trung vào backend, realtime systems, integration và những bài toán production cần độ ổn định cao.</p>
        </div>
      </div>

      <div className="portfolio-contact-panel">
        <div className="portfolio-contact-copy">
          <span className="portfolio-panel-label">WHAT I CAN CONTRIBUTE</span>
          <h3 className="portfolio-contact-copy-title">Những phần tôi có thể đảm nhận ngay</h3>
          <div className="portfolio-contact-capabilities">
            {[
              'Backend application & business logic',
              'Realtime communication: WebSocket / WebRTC',
              'Queue, cache & asynchronous processing',
              'API / CRM / enterprise integration',
              'Performance troubleshooting & maintainability',
            ].map((item) => <div key={item}><span><Check/></span><p>{item}</p></div>)}
          </div>
        </div>

        <aside className="portfolio-contact-card" aria-label="Liên hệ công việc">
          <div className="portfolio-contact-card-top">
            <span className="portfolio-contact-label">CONTACT</span>
            <span className="portfolio-contact-availability"><i aria-hidden="true"/> Available</span>
          </div>
          <h3>Trao đổi trực tiếp về cơ hội phù hợp.</h3>
          <p className="portfolio-contact-intro">Email là kênh nhanh nhất. GitHub và LinkedIn dùng để xem thêm hồ sơ kỹ thuật và kinh nghiệm làm việc.</p>

          <a className="portfolio-mail-link" href={`mailto:${AUTHOR.email}`} aria-label={`Gửi email cho ${AUTHOR.name}`}>
            <Mail aria-hidden="true"/>
            <span>{AUTHOR.email}</span>
            <ArrowRight aria-hidden="true"/>
          </a>

          <div className="portfolio-contact-links">
            <a href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer" aria-label="GitHub Nguyễn Ngọc Tâm">
              <Code2 aria-hidden="true"/><span>GitHub</span><ExternalLink aria-hidden="true"/>
            </a>
            <a href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn Nguyễn Ngọc Tâm">
              <BriefcaseBusiness aria-hidden="true"/><span>LinkedIn</span><ExternalLink aria-hidden="true"/>
            </a>
          </div>
        </aside>
      </div>
    </section>
  </article>
}
