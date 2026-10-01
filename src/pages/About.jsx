import '../styles/blog.css'
import { ArrowRight, BriefcaseBusiness, Check, Code2, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const skillGroups = [
  ['Backend',['PHP 7.x / 8.x','Laravel','CodeIgniter','RESTful API','PHPUnit','JWT / Firebase JWT','Guzzle']],
  ['Frontend & client',['JavaScript','TypeScript','Kendo UI','API integration','Realtime client flows']],
  ['Data & async',['MongoDB','PostgreSQL','SQL Server','Redis','Beanstalkd','Laravel Queue']],
  ['Realtime',['WebSocket','WebRTC','Custom signaling','Janus WebRTC Server','Jitsi']],
  ['Enterprise integration',['Salesforce','HubSpot','Internal APIs','Webhooks','Postback','Zalo','WhatsApp','LiveChat','LINE']],
  ['Cloud & delivery',['AWS EC2','AWS S3','Docker','Kubernetes','GitLab CI/CD','GitHub Actions','Nginx','Linux']],
  ['Quality & security',['SonarQube','Unit testing','XSS remediation','Production troubleshooting','Performance optimization']],
]

const capabilityGroups = [
  ['Full-stack delivery','Đi từ yêu cầu sản phẩm, client-side integration và API/business logic đến database, deployment và xử lý vấn đề trên production.'],
  ['Realtime systems','Chat/call realtime, WebSocket, WebRTC, signaling, room events và các luồng cần độ trễ thấp.'],
  ['Performance & reliability','Tối ưu throughput/latency, queue, cache, database; điều tra production issue và các luồng bất đồng bộ.'],
  ['Enterprise & security','CRM/internal API integration, workflow doanh nghiệp, XSS remediation, code quality và unit testing.'],
]

const impactCards = [
  ['PERFORMANCE','Omnichat throughput','Tối ưu module Omnichat để tăng message throughput và giảm peak-time latency.'],
  ['CODE QUALITY','85% code smells','Giảm 85% code smells khi xử lý SonarQube cho dự án enterprise.'],
  ['SECURITY','XSS + regression safety','Khắc phục lỗ hổng XSS và bổ sung unit tests cho các core business functions.'],
  ['REALTIME','Banking video call','Phát triển secure video call bằng WebRTC và custom signaling cho môi trường tài chính.'],
  ['INTEGRATION','CRM + OTT ecosystem','Tích hợp Salesforce, HubSpot cùng Zalo, WhatsApp, LiveChat và LINE.'],
  ['ARCHITECTURE','Janus + Jitsi pipeline','Thiết kế backend video-room với Laravel, Janus, Jitsi, MongoDB, Redis và queue bất đồng bộ.'],
]

const projectFocus = {
  Worldfone4X: 'OMNICHANNEL · CRM · PERFORMANCE',
  'Shinhan Life': 'ENTERPRISE · SECURITY · QUALITY',
  PVcomBank: 'BANKING · REALTIME · WEBRTC',
  'Video Room Integration System': 'ARCHITECTURE · QUEUE · WEBRTC',
}

const stats = [
  ['Full-stack','Primary role'],
  ['2022 → nay','Production experience'],
  ['4','Selected systems'],
  ['85%','Code smells reduced'],
]

export default function About() {
  return <article className="inner-page section-shell about-author portfolio-page">
    <Breadcrumbs items={[{ label:'Trang chủ',to:'/' },{ label:'About Me' }]}/>

    <header className="portfolio-hero">
      <div className="portfolio-hero-copy">
        <div className="portfolio-status"><span aria-hidden="true"/> AVAILABLE FOR THE RIGHT OPPORTUNITY</div>
        <span className="overline">NGUYỄN NGỌC TÂM · FULL-STACK DEVELOPER</span>
        <h1>
          <span className="portfolio-hero-name">Nguyễn Ngọc Tâm</span>
          <strong>Full-stack Developer</strong>
        </h1>
        <p className="portfolio-role-line">PRODUCT · BACKEND · REALTIME · ENTERPRISE SYSTEMS</p>
        <p className="portfolio-lead">Tôi phát triển sản phẩm end-to-end — từ JavaScript/TypeScript ở phía client, API & business logic bằng PHP/Laravel đến database, cache, queue, realtime communication và CI/CD.</p>
        <div className="portfolio-hero-specialties" aria-label="Công nghệ chính">
          {['PHP / Laravel','JavaScript / TypeScript','MongoDB / Redis','WebSocket / WebRTC','AWS / Docker / CI/CD'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <p className="portfolio-intro">Hiện làm việc tại South Telecom từ 07/2022. Tôi đã tham gia các hệ thống omnichannel, CRM integration, banking communication và video-room; đồng thời xử lý performance, application security, production incident và delivery cùng Product / QA / Support.</p>
        <div className="portfolio-actions">
          <a className="btn large" href={`mailto:${AUTHOR.email}`}><Mail/> Liên hệ công việc</a>
          <a className="btn secondary large" href={AUTHOR.sameAs[0]} target="_blank" rel="me noopener noreferrer">LinkedIn <ExternalLink/></a>
          <a className="btn ghost large" href={AUTHOR.sameAs[1]} target="_blank" rel="me noopener noreferrer">GitHub <ExternalLink/></a>
        </div>
        <div className="portfolio-meta">
          <span><MapPin/> Ho Chi Minh City, Vietnam</span>
          <span><BriefcaseBusiness/> South Telecom</span>
          <span><Code2/> Full-stack · Production systems</span>
        </div>
      </div>

      <aside className="portfolio-profile-card" aria-label="Năng lực Full-stack nổi bật">
        <div className="portfolio-profile-card-head">
          <div>
            <span className="portfolio-panel-label">FULL-STACK PROFILE</span>
            <h2>End-to-end product delivery</h2>
          </div>
          <Code2 aria-hidden="true"/>
        </div>
        <p className="portfolio-profile-card-intro">Không chỉ một framework. Tôi làm việc xuyên suốt nhiều lớp của hệ thống và ưu tiên khả năng vận hành thực tế.</p>
        <div className="portfolio-profile-layers">
          <article>
            <span>01</span>
            <div><strong>Client & product</strong><p>JavaScript · TypeScript · Kendo UI</p></div>
          </article>
          <article>
            <span>02</span>
            <div><strong>Backend & APIs</strong><p>PHP · Laravel · REST · CRM integration</p></div>
          </article>
          <article>
            <span>03</span>
            <div><strong>Data & realtime</strong><p>MongoDB · Redis · WebSocket · WebRTC</p></div>
          </article>
          <article>
            <span>04</span>
            <div><strong>Delivery & reliability</strong><p>AWS · Docker · Kubernetes · CI/CD</p></div>
          </article>
        </div>
        <div className="portfolio-profile-card-foot">
          <span>Production-first</span><span>Performance</span><span>Security</span>
        </div>
      </aside>
    </header>

    <section className="portfolio-stats" aria-label="Tổng quan kinh nghiệm">
      {stats.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </section>

    <nav className="portfolio-section-nav" aria-label="Đi nhanh trong hồ sơ">
      <a href="#profile">Profile</a>
      <a href="#impact">Impact</a>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#stack">Stack</a>
      <a href="#contact">Contact</a>
    </nav>

    <section className="portfolio-section portfolio-overview" id="profile" aria-labelledby="overview-title">
      <div className="portfolio-section-kicker"><span>01</span><div><span className="overline">FULL-STACK ENGINEERING PROFILE</span><h2 id="overview-title">Có thể đi từ feature đến production, không bị giới hạn ở một lớp của hệ thống</h2></div></div>
      <div className="portfolio-overview-grid">
        <div className="portfolio-copy">
          <p>Tại South Telecom, Tâm làm Full-stack Developer trên các hệ thống communication: phát triển tính năng sản phẩm, xử lý client-side integration, business logic, database/cache/queue, API/CRM integration và realtime delivery.</p>
          <p>Bên cạnh code feature, Tâm xử lý production issue, performance, security, cloud-cost optimization; phối hợp với Product, QA, Support, hỗ trợ developer mới và từng đảm nhiệm Scrum facilitation khi cần.</p>
        </div>
        <div className="portfolio-capability-list">
          {capabilityGroups.map(([title,description]) => <article key={title}><span><Check/></span><div><h3>{title}</h3><p>{description}</p></div></article>)}
        </div>
      </div>
    </section>

    <section className="portfolio-section" id="impact" aria-labelledby="impact-title">
      <div className="portfolio-section-kicker"><span>02</span><div><span className="overline">SELECTED IMPACT</span><h2 id="impact-title">Bằng chứng kỹ thuật thay cho những tính từ hoa mỹ</h2></div></div>
      <div className="portfolio-impact-grid">
        {impactCards.map(([label,title,description],index) => <article key={title} className={index < 2 ? 'featured' : ''}>
          <div className="portfolio-impact-head"><span className="portfolio-card-index">{String(index + 1).padStart(2,'0')}</span><span>{label}</span></div>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>)}
      </div>
    </section>

    <section className="portfolio-section" id="experience" aria-labelledby="experience-title">
      <div className="portfolio-section-kicker"><span>03</span><div><span className="overline">EXPERIENCE</span><h2 id="experience-title">Kinh nghiệm làm việc</h2></div></div>
      <div className="portfolio-timeline">
        <article>
          <div className="portfolio-timeline-marker"><span/></div>
          <div className="portfolio-timeline-date">07/2022 — Present</div>
          <div className="portfolio-timeline-content">
            <span className="portfolio-company">SOUTH TELECOM</span>
            <h3>Full-stack Developer</h3>
            <p>Phát triển tính năng sản phẩm end-to-end, backend/API, CRM integration, realtime messaging/calling; đồng thời xử lý production troubleshooting, cloud-cost optimization, mentoring developer và Scrum facilitation.</p>
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

    <section className="portfolio-section" id="projects" aria-labelledby="projects-title">
      <div className="portfolio-section-kicker"><span>04</span><div><span className="overline">SELECTED WORK</span><h2 id="projects-title">Các hệ thống tiêu biểu đã tham gia</h2><p>Thông tin được trình bày ở mức trách nhiệm và năng lực, không công bố source code, credential hoặc dữ liệu nội bộ.</p></div></div>
      <div className="portfolio-project-grid">
        {AUTHOR.selectedProjects.map((project,index) => <article key={project.name} className={index === 0 ? 'portfolio-project-featured' : ''}>
          <div className="portfolio-project-head"><span>PROJECT {String(index + 1).padStart(2,'0')}</span><Code2/></div>
          <span className="portfolio-project-focus">{projectFocus[project.name]}</span>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <div className="portfolio-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        </article>)}
      </div>
    </section>

    <section className="portfolio-section" id="stack" aria-labelledby="stack-title">
      <div className="portfolio-section-kicker"><span>05</span><div><span className="overline">FULL-STACK TOOLBOX</span><h2 id="stack-title">Năng lực trải từ client, backend, data đến realtime và delivery</h2></div></div>
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

    <section className="portfolio-section portfolio-bottom-section" id="contact" aria-labelledby="hire-title">
      <div className="portfolio-section-kicker">
        <span>08</span>
        <div>
          <span className="overline">LET'S WORK TOGETHER</span>
          <h2 id="hire-title">Cần một Full-stack Developer có thể theo feature đến tận production?</h2>
          <p>Tôi phù hợp với các bài toán cần phối hợp nhiều lớp: product/client, backend, data, realtime, integration và production reliability.</p>
        </div>
      </div>

      <div className="portfolio-contact-panel">
        <div className="portfolio-contact-copy">
          <span className="portfolio-panel-label">WHAT I CAN CONTRIBUTE</span>
          <h3 className="portfolio-contact-copy-title">Những phần tôi có thể đảm nhận ngay</h3>
          <div className="portfolio-contact-capabilities">
            {[
              'Full-stack feature delivery: client → API → data',
              'Backend application & business logic',
              'Realtime communication: WebSocket / WebRTC',
              'API / CRM / enterprise integration',
              'Performance, security & production reliability',
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
