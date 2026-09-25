import { languages } from '../data/languages'
import LanguageCard from '../components/course/LanguageCard'
import Breadcrumbs from '../components/common/Breadcrumbs'

export default function Languages() {
  return <div className="inner-page section-shell"><Breadcrumbs items={[{ label:'Trang chủ', to:'/' }, { label:'Ngôn ngữ' }]}/><div className="page-heading centered"><span className="overline">CHỌN NGÔN NGỮ</span><h1>Bạn muốn chinh phục ngôn ngữ nào?</h1><p>Mỗi khóa học có lộ trình theo chuẩn quốc tế, trang riêng cho từng level và bài thực hành đủ bốn kỹ năng.</p></div><div className="language-grid big-cards">{languages.map((language) => <LanguageCard language={language} key={language.id} />)}</div><section className="languages-guide"><h2>Cách chọn lộ trình</h2><p>Nếu mới bắt đầu, hãy chọn level đầu tiên của ngôn ngữ. Nếu đã có nền tảng, bài kiểm tra trình độ giúp bạn xác định điểm bắt đầu. Bạn có thể chuyển level bất kỳ lúc nào; tiến độ được lưu riêng theo từng khóa học.</p></section></div>
}
