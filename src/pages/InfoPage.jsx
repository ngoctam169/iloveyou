import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import { AUTHOR } from '../data/author'

const pages = {
  about: {
    eyebrow:'VỀ NT', title:'NT có gì?', lead:'Mình gom bài học, từ vựng, ngữ pháp và phần luyện thi vào một chỗ để học cho tiện.',
    sections:[
      ['Mục tiêu','Làm một web học ngoại ngữ dễ dùng, chia rõ theo level và có đủ phần để tự học.'],
      ['Phương pháp','Mỗi lộ trình kết nối từ vựng, ngữ pháp và bốn kỹ năng. Flashcard dùng lịch ôn dựa trên phản hồi ghi nhớ; kết quả luyện tập được lưu trên chính thiết bị.'],
      ['Nguyên tắc nội dung','NT ưu tiên ví dụ có ngữ cảnh, mô tả trung thực nguồn dữ liệu và không trình bày điểm luyện tập tự động như một chứng nhận chính thức.'],
    ],
  },
  contact: {
    eyebrow:'LIÊN HỆ', title:'Góp ý cho NT', lead:'Nếu thấy lỗi hoặc có góp ý, có thể gửi trực tiếp cho mình.',
    sections:[
      ['Hỗ trợ sử dụng','Khi báo lỗi, hãy gửi đường dẫn trang, thiết bị, trình duyệt và mô tả ngắn các bước đã thực hiện.'],
      ['Góp ý học liệu','Nếu phát hiện nghĩa, ví dụ hoặc đáp án chưa chính xác, hãy ghi rõ ngôn ngữ, level và tên bài để dễ kiểm tra.'],
    ],
  },
  privacy: {
    eyebrow:'PHÁP LÝ', title:'Chính sách quyền riêng tư', lead:'Bạn có thể dùng phần lớn tính năng của NT mà không cần tạo tài khoản.',
    sections:[
      ['Dữ liệu lưu trên thiết bị','Tiến độ bài học, lịch ôn, mục tiêu, từ cá nhân và cài đặt được lưu trong localStorage của trình duyệt. Xóa dữ liệu trình duyệt hoặc dùng chức năng Reset Progress sẽ xóa phần dữ liệu này.'],
      ['Microphone và giọng nói','Tính năng luyện nói chỉ yêu cầu microphone sau thao tác của người dùng. Bản ghi được tạo trong phiên trình duyệt; NT không có backend để tải bản ghi lên máy chủ. Nhận dạng giọng nói phụ thuộc dịch vụ của trình duyệt.'],
      ['Lựa chọn của bạn','Bạn có thể chặn quyền microphone, tắt JavaScript của bên thứ ba hoặc xóa tiến độ bất kỳ lúc nào trong phần Cài đặt.'],
    ],
  },
  terms: {
    eyebrow:'PHÁP LÝ', title:'Điều khoản sử dụng', lead:'Bằng việc sử dụng NT, bạn đồng ý dùng nội dung và công cụ học tập cho mục đích hợp pháp.',
    sections:[
      ['Mục đích giáo dục','Bài học, quiz và thống kê hỗ trợ tự học. Kết quả luyện tập, TOEIC hoặc IELTS trên NT không phải chứng chỉ hay kết quả thi chính thức.'],
      ['Trách nhiệm nội dung','NT cố gắng duy trì nội dung chính xác và ghi nguồn dữ liệu mở. Người học nên đối chiếu tài liệu chính thức khi chuẩn bị cho kỳ thi hoặc quyết định quan trọng.'],
      ['Quyền sử dụng','Không sao chép hoặc phân phối lại tài sản nhận diện NT và nội dung biên soạn riêng như một sản phẩm khác nếu chưa được cho phép. Dữ liệu nguồn mở vẫn tuân theo giấy phép gốc được ghi trong dự án.'],
      ['Thay đổi dịch vụ','Tính năng và nội dung có thể được cập nhật để sửa lỗi, cải thiện chất lượng hoặc đáp ứng yêu cầu vận hành.'],
    ],
  },
}

export default function InfoPage({ page }) {
  const content = pages[page]
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL || AUTHOR.email
  const analyticsEnabled = Boolean(import.meta.env.VITE_GA_ID)
  const linkedIn = AUTHOR.sameAs.find((item) => item.includes('linkedin.com'))
  const github = AUTHOR.sameAs.find((item) => item.includes('github.com'))

  return <article className="inner-page section-shell info-page">
    <Breadcrumbs items={[{ label:'Trang chủ', to:'/' }, { label:content.title }]}/>
    <header>
      <span className="overline">{content.eyebrow}</span>
      <h1>{content.title}</h1>
      <p>{content.lead}</p>
      {page === 'contact' && configuredEmail && <a className="btn" href={`mailto:${configuredEmail}`}>Gửi email</a>}
    </header>

    <div className="legal-content">
      {content.sections.map(([title,text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}

      {page === 'contact' && <section className="contact-section">
        <h2>Kênh liên hệ</h2>
        <p>Gửi mail hoặc nhắn qua các kênh bên dưới nếu muốn góp ý hay trao đổi công việc.</p>
        <div className="contact-channels">
          {configuredEmail && <a href={`mailto:${configuredEmail}`}><strong>Email</strong><span>{configuredEmail}</span></a>}
          {github && <a href={github} target="_blank" rel="noreferrer"><strong>GitHub</strong><span>@ngoctam169</span></a>}
          {linkedIn && <a href={linkedIn} target="_blank" rel="noreferrer"><strong>LinkedIn</strong><span>Nguyễn Ngọc Tâm</span></a>}
        </div>
      </section>}

      {page === 'privacy' && <section>
        <h2>Đo lường truy cập</h2>
        <div className={`analytics-status ${analyticsEnabled ? 'enabled' : ''}`}>
          <strong>{analyticsEnabled ? 'Google Analytics đang được bật' : 'Google Analytics hiện chưa được bật'}</strong>
          <p>{analyticsEnabled ? 'Website dùng Google Analytics để đo page view và một số thao tác như chọn ngôn ngữ/level, bắt đầu hoặc hoàn thành bài học, lưu từ vựng, bắt đầu ôn tập, nộp bài thi thử, đọc blog và bấm kênh liên hệ. NT không gửi nội dung microphone, bản ghi giọng nói hay nội dung bài viết của người học vào các event này. Dữ liệu kỹ thuật có thể được xử lý theo chính sách của Google.' : 'Hiện website không tải Google Analytics. Khi chủ website bật đo lường, mục này sẽ tự cập nhật trạng thái.'}</p>
        </div>
      </section>}
    </div>

    <aside className="info-cta"><h2>Bắt đầu học</h2><p>Chọn ngôn ngữ rồi mở level muốn học.</p><Link className="btn" to="/languages">Chọn ngôn ngữ</Link></aside>
  </article>
}
