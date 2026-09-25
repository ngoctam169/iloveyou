import { getRoadmap } from './courses.js'
import { languages, levelSlug } from './languages.js'

const advanced = {
  chinese: {
    'HSK 2': ['因为…所以…','因为 + nguyên nhân， 所以 + kết quả','Nối lý do với kết quả; trong hội thoại có thể lược bỏ 所以 khi ý đã rõ.',['因为下雨，所以我们在家学习。','因为她很忙，所以今天不能来。'],'Không đảo ngược nguyên nhân và kết quả.'],
    'HSK 3': ['So sánh với 比','A + 比 + B + tính từ','Đặt đối tượng được so sánh trước 比, sau đó nói phẩm chất khác nhau.',['今天比昨天冷。','坐火车比坐飞机便宜。'],'Tránh dùng 很 ngay sau tính từ trong so sánh thông thường.'],
    'HSK 4': ['Câu với 把','Chủ ngữ + 把 + tân ngữ + động từ + kết quả','Đưa tân ngữ đã xác định lên trước động từ khi nhấn mạnh kết quả xử lý.',['请把门关上。','我把作业写完了。'],'Câu với 把 thường cần bổ ngữ kết quả hoặc phần theo sau động từ.'],
    'HSK 5': ['Nhượng bộ với 尽管…还是…','尽管 + tình huống， chủ ngữ + 还是 + hành động','Thừa nhận một khó khăn rồi nói điều vẫn diễn ra.',['尽管下雨，我们还是出发了。','尽管很累，她还是完成了报告。'],'Không dùng 所以 để nối vế nhượng bộ.'],
    'HSK 6': ['Lựa chọn với 与其…不如…','与其 + phương án A， 不如 + phương án B','Nêu phương án ít phù hợp rồi đề xuất phương án tốt hơn.',['与其等别人，不如现在开始。','与其抱怨，不如寻找解决办法。'],'Phương án được ưu tiên nằm sau 不如.'],
  },
  japanese: {
    N4: ['Hai hành động với 〜ながら','Thể ます bỏ ます + ながら + hành động chính','Diễn tả hai hành động xảy ra cùng lúc và cùng chủ thể.',['音楽を聞きながら勉強します。','歩きながら電話しないでください。'],'Chủ thể của hai hành động thường là một người.'],
    N3: ['Thói quen với 〜ようにする','Động từ thể từ điển / phủ định + ようにする','Nói về nỗ lực tạo hoặc bỏ một thói quen.',['毎日日本語を読むようにしています。','夜遅く食べないようにします。'],'Phân biệt ý định tạo thói quen với một hành động đơn lẻ.'],
    N2: ['Phủ định một phần với 〜わけではない','Mệnh đề thông thường + わけではない','Phủ nhận cách hiểu quá tuyệt đối, không phủ nhận toàn bộ thông tin.',['嫌いなわけではありません。','すべてが簡単なわけではない。'],'Không hiểu mẫu này là phủ định hoàn toàn.'],
    N1: ['Nhấn mạnh nguyên nhân với 〜にほかならない','Danh từ / mệnh đề + にほかならない','Khẳng định điều được nêu chính là nguyên nhân hoặc bản chất.',['成功は努力の結果にほかならない。','この変化は技術革新の表れにほかならない。'],'Dùng trong văn phong trang trọng; tránh lạm dụng trong hội thoại thân mật.'],
  },
  korean: {
    'TOPIK 2': ['Ý định với -(으)려고 하다','Gốc động từ + (으)려고 하다','Diễn tả dự định thực hiện một hành động.',['주말에 친구를 만나려고 해요.','한국어를 배우려고 합니다.'],'Chọn 으려고 sau gốc kết thúc bằng phụ âm, 려고 sau nguyên âm.'],
    'TOPIK 3': ['Kinh nghiệm với -아/어 본 적이 있다','Gốc động từ + 아/어 본 적이 있다','Nói rằng đã từng trải nghiệm một việc.',['한국에 가 본 적이 있어요.','이 음식을 먹어 본 적이 있습니다.'],'Không dùng mẫu này để nói một thói quen đang lặp lại.'],
    'TOPIK 4': ['Mức độ tăng theo với -(으)ㄹ수록','Gốc động từ / tính từ + (으)ㄹ수록','Diễn tả khi một mức độ tăng thì mức độ kia cũng thay đổi.',['연습할수록 발음이 좋아져요.','생각할수록 어렵습니다.'],'Hai vế cần có quan hệ thay đổi theo mức độ.'],
    'TOPIK 5': ['Đối chiếu với -는 반면에','Gốc động từ + 는 반면에; tính từ + (으)ㄴ 반면에','Đặt hai đặc điểm hoặc xu hướng trái nhau cạnh nhau.',['이 방법은 빠른 반면에 비용이 많이 듭니다.','도시는 편리한 반면에 복잡합니다.'],'Kiểm tra dạng định ngữ của động từ và tính từ trước 반면에.'],
    'TOPIK 6': ['Trước khi thực hiện với -기에 앞서','Gốc động từ + 기에 앞서','Nêu việc phải làm trước một hành động chính; thường dùng trong văn trang trọng.',['결론을 내리기에 앞서 자료를 검토해야 합니다.','출발하기에 앞서 계획을 확인합시다.'],'Tránh dùng khi hai sự việc thực sự xảy ra đồng thời.'],
  },
}

export const grammarEntries = languages.flatMap((language) => language.levels.flatMap(([level], levelIndex) => {
  if (language.id !== 'english' && levelIndex > 0) {
    const row = advanced[language.id][level]
    return [{ id:`${language.id}-${levelSlug(level)}-grammar`, languageId:language.id, level, name:row[0], structure:row[1], explanation:row[2], examples:row[3], mistake:row[4], lessonPath:null }]
  }
  const found = new Map()
  for (const lesson of getRoadmap(language.id, level).flatMap((unit) => unit.lessons)) {
    if (!found.has(lesson.grammar.name)) found.set(lesson.grammar.name, { id:`${language.id}-${levelSlug(level)}-grammar-${found.size + 1}`, languageId:language.id, level, ...lesson.grammar, lessonPath:`/${language.id}/${levelSlug(level)}/lessons/${lesson.id}?section=grammar` })
  }
  return [...found.values()]
}))
