import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'

const pages = {
  about: {
    eyebrow:'VỀ NT', title:'Học ngôn ngữ theo một lộ trình có thể hành động', lead:'NT tổ chức kiến thức thành level, bài học ngắn và vòng ôn tập rõ ràng để người học biết mình cần làm gì tiếp theo.',
    sections:[
      ['Sứ mệnh','Giúp người học Việt Nam tiếp cận tài liệu tiếng Anh, Trung, Nhật và Hàn theo chuẩn cấp độ quen thuộc, với giải thích đủ rõ để có thể tự học.'],
      ['Phương pháp','Mỗi lộ trình kết nối từ vựng, ngữ pháp và bốn kỹ năng. Flashcard dùng lịch ôn dựa trên phản hồi ghi nhớ; kết quả luyện tập được lưu trên chính thiết bị.'],
      ['Nguyên tắc nội dung','NT ưu tiên ví dụ có ngữ cảnh, mô tả trung thực nguồn dữ liệu và không trình bày điểm luyện tập tự động như một chứng nhận chính thức.'],
    ],
  },
  contact: {
    eyebrow:'LIÊN HỆ', title:'Góp ý để NT tốt hơn', lead:'Bạn có thể gửi phản hồi về lỗi nội dung, trải nghiệm sử dụng, quyền riêng tư hoặc đề xuất hợp tác.',
    sections:[
      ['Hỗ trợ sử dụng','Khi báo lỗi, hãy gửi đường dẫn trang, thiết bị, trình duyệt và mô tả ngắn các bước đã thực hiện.'],
      ['Góp ý học liệu','Nếu phát hiện nghĩa, ví dụ hoặc đáp án chưa chính xác, hãy ghi rõ ngôn ngữ, level và tên bài để đội ngũ kiểm tra.'],
      ['Kênh liên hệ','Email được cấu hình bằng biến VITE_CONTACT_EMAIL khi triển khai domain chính thức.'],
    ],
  },
  privacy: {
    eyebrow:'PHÁP LÝ', title:'Chính sách quyền riêng tư', lead:'NT được thiết kế để người học có thể sử dụng phần lớn tính năng mà không cần tạo tài khoản.',
    sections:[
      ['Dữ liệu lưu trên thiết bị','Tiến độ bài học, lịch ôn, mục tiêu, từ cá nhân và cài đặt được lưu trong localStorage của trình duyệt. Xóa dữ liệu trình duyệt hoặc dùng chức năng Reset Progress sẽ xóa phần dữ liệu này.'],
      ['Microphone và giọng nói','Tính năng luyện nói chỉ yêu cầu microphone sau thao tác của người dùng. Bản ghi được tạo trong phiên trình duyệt; NT không có backend để tải bản ghi lên máy chủ. Nhận dạng giọng nói phụ thuộc dịch vụ của trình duyệt.'],
      ['Đo lường truy cập','Google Analytics chỉ được tải khi chủ website cấu hình VITE_GA_ID. Khi được bật, dịch vụ có thể xử lý dữ liệu kỹ thuật theo chính sách của Google.'],
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
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL
  return <article className="inner-page section-shell info-page">
    <Breadcrumbs items={[{ label:'Trang chủ', to:'/' }, { label:content.title }]}/>
    <header><span className="overline">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.lead}</p>{page === 'contact' && configuredEmail && <a className="btn" href={`mailto:${configuredEmail}`}>Gửi email đến {configuredEmail}</a>}</header>
    <div className="legal-content">{content.sections.map(([title,text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div>
    <aside className="info-cta"><h2>Bắt đầu học cùng NT</h2><p>Chọn ngôn ngữ và mở level phù hợp với mục tiêu của bạn.</p><Link className="btn" to="/languages">Khám phá ngôn ngữ</Link></aside>
  </article>
}
