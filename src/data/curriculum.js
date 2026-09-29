const grammar = (name, structure, explanation, examples, mistake) => ({ name, structure, explanation, examples, mistake })

export const topicBands = [
  ['Chào hỏi & danh tính','Gia đình & con người','Số đếm & thời gian','Ăn uống','Thói quen hằng ngày','Mua sắm','Địa điểm & chỉ đường','Sở thích','Trường học & công việc','Ôn tập nền tảng'],
  ['Trải nghiệm gần đây','Kế hoạch & lời mời','Sức khỏe & lời khuyên','Du lịch & di chuyển','So sánh lựa chọn','Công việc thường ngày','Quan hệ xã hội','Dịch vụ & yêu cầu','Mô tả sự thay đổi','Ôn tập giao tiếp'],
  ['Kể chuyện & trải nghiệm','Học tập & mục tiêu','Công việc & trách nhiệm','Công nghệ đời sống','Môi trường & cộng đồng','Ý kiến & lý do','Tin tức & thông tin','Giải quyết vấn đề','Văn hóa & khác biệt','Ôn tập trung cấp'],
  ['Lập luận & phản biện','Công việc chuyên nghiệp','Truyền thông & độ tin cậy','Khoa học & giải thích','Văn hóa & xã hội','Ra quyết định','Thuyết trình & thảo luận','Nguyên nhân & hệ quả','Sắc thái & hàm ý','Ôn tập nâng cao'],
  ['Học thuật & nghiên cứu','Chính sách & xã hội','Phân tích quan điểm','Văn phong trang trọng','Lập luận nhiều chiều','Tổng hợp nguồn','Thuyết trình chuyên sâu','Ngôn ngữ trừu tượng','Sắc thái diễn đạt','Ôn tập học thuật'],
  ['Lập luận tinh tế','Hàm ý & ngữ dụng','Phân tích diễn ngôn','Văn phong chuyên môn','Phản biện nguồn','Tổng hợp quan điểm','Biến đổi sắc thái','Ngôn ngữ học thuật cao','Diễn đạt chính xác','Ôn tập thành thạo'],
]

export const topicsForLevel = (levelIndex) => topicBands[Math.min(Math.max(levelIndex, 0), topicBands.length - 1)]

export const levelGrammarBanks = {
  chinese: {
    'HSK 1': [
      grammar('Câu với 是','Chủ ngữ + 是 + danh từ','Dùng 是 để xác định danh tính hoặc phân loại.',['我是学生。','她是老师。'],'Không dùng 是 trực tiếp trước tính từ đơn giản.'),
      grammar('Câu hỏi với 吗','Câu trần thuật + 吗？','Thêm 吗 cuối câu để tạo câu hỏi yes/no.',['你是学生吗？','他忙吗？'],'Không dùng 吗 cùng từ để hỏi như 什么 hoặc 谁.'),
      grammar('Sở hữu với 的','Người / đại từ + 的 + danh từ','Dùng 的 để nối người sở hữu với danh từ.',['这是我的书。','他是我的朋友。'],'Trong quan hệ thân thuộc, 的 đôi khi có thể lược bỏ nhưng người mới học nên giữ để rõ nghĩa.'),
    ],
    'HSK 2': [
      grammar('因为…所以…','因为 + nguyên nhân，所以 + kết quả','Nối nguyên nhân với kết quả rõ ràng.',['因为下雨，所以我们在家学习。','因为她很忙，所以今天不能来。'],'Không đảo ngược quan hệ nguyên nhân và kết quả.'),
      grammar('Đã xảy ra với 了','Động từ + 了','Đánh dấu hành động đã hoàn tất hoặc tình huống thay đổi.',['我吃饭了。','天气冷了。'],'Không coi 了 như dấu quá khứ bắt buộc trong mọi câu.'),
      grammar('Đang diễn ra với 在','Chủ ngữ + 在 + động từ','Nói một hành động đang diễn ra.',['我在看书。','他们在开会。'],'Không đặt 在 sau động từ chính trong mẫu này.'),
    ],
    'HSK 3': [
      grammar('So sánh với 比','A + 比 + B + tính từ','So sánh hai đối tượng theo một đặc điểm.',['今天比昨天冷。','坐火车比坐飞机便宜。'],'Tránh dùng 很 ngay sau tính từ trong so sánh thông thường.'),
      grammar('Bổ ngữ kết quả','Động từ + 完 / 好 / 到 / 见','Cho biết kết quả của hành động.',['我写完作业了。','我听见他的声音了。'],'Phân biệt hành động với kết quả đạt được.'),
      grammar('Cấu trúc 一边…一边…','一边 + V1，一边 + V2','Diễn tả hai hành động xảy ra đồng thời.',['她一边听音乐，一边学习。','我一边走，一边打电话。'],'Hai hành động thường cùng một chủ thể.'),
    ],
    'HSK 4': [
      grammar('Câu với 把','Chủ ngữ + 把 + tân ngữ + động từ + kết quả','Đưa tân ngữ xác định lên trước động từ khi nhấn mạnh cách xử lý và kết quả.',['请把门关上。','我把作业写完了。'],'Sau động từ thường cần bổ ngữ, phương hướng hoặc kết quả.'),
      grammar('Câu bị động với 被','Chủ ngữ + 被 + tác nhân + động từ','Nhấn mạnh đối tượng chịu tác động.',['我的手机被他拿走了。','问题被大家解决了。'],'Không phải mọi câu bị động tiếng Việt đều cần 被.'),
      grammar('Không chỉ…mà còn…','不但…而且…','Kết nối hai đặc điểm hoặc hành động tăng tiến.',['他不但会中文，而且会日文。','这个方法不但快，而且很实用。'],'Hai vế nên có cấu trúc song song.'),
    ],
    'HSK 5': [
      grammar('Nhượng bộ với 尽管…还是…','尽管 + tình huống，还是 + hành động','Thừa nhận khó khăn rồi nêu điều vẫn xảy ra.',['尽管下雨，我们还是出发了。','尽管很累，她还是完成了报告。'],'Không dùng 所以 để nối hai vế nhượng bộ.'),
      grammar('Ngay cả…cũng…','连…都 / 也…','Nhấn mạnh một trường hợp cực đoan để củng cố nhận định.',['连孩子都知道这个道理。','他连饭也没时间吃。'],'Thành phần được nhấn mạnh đứng sau 连.'),
      grammar('Càng…càng…','越 + V/Adj，越 + V/Adj','Diễn tả hai xu hướng thay đổi đồng thời.',['越练越熟练。','天气越冷，人越少。'],'Hai vế cần thể hiện quan hệ tăng hoặc giảm theo nhau.'),
    ],
    'HSK 6': [
      grammar('Lựa chọn với 与其…不如…','与其 + phương án A，不如 + phương án B','Nêu phương án kém phù hợp rồi đề xuất phương án tốt hơn.',['与其等别人，不如现在开始。','与其抱怨，不如寻找解决办法。'],'Phương án được ưu tiên nằm sau 不如.'),
      grammar('Huống chi với 更何况','Mệnh đề A，更何况 + mệnh đề B','Đưa thêm một lý do mạnh hơn để củng cố lập luận.',['这个问题很复杂，更何况时间还不够。','他连基础任务都没完成，更何况高级任务。'],'Vế sau phải làm lập luận mạnh hơn, không chỉ lặp lại ý trước.'),
      grammar('Xét từ góc độ…','从…来看','Đặt khung góc nhìn trước khi đưa nhận định.',['从长期来看，这个决定更合理。','从数据来看，趋势已经改变。'],'Góc nhìn sau 从 cần liên quan trực tiếp đến kết luận.'),
    ],
  },
  japanese: {
    N5: [
      grammar('Câu danh từ với です','A は B です','Nêu danh tính hoặc đặc điểm cơ bản theo lối lịch sự.',['わたしは学生です。','田中さんは先生です。'],'Trợ từ は trong cấu trúc này đọc là wa.'),
      grammar('Câu hỏi với か','Câu lịch sự + か','Biến câu lịch sự thành câu hỏi.',['学生ですか。','ベトナム人ですか。'],'Không cần đảo trật tự từ như tiếng Anh.'),
      grammar('Tân ngữ với を','Danh từ + を + động từ','Đánh dấu đối tượng trực tiếp của hành động.',['パンを食べます。','日本語を勉強します。'],'を đọc là o khi làm trợ từ.'),
    ],
    N4: [
      grammar('Hai hành động với 〜ながら','Thể ます bỏ ます + ながら + hành động chính','Diễn tả hai hành động xảy ra đồng thời và cùng chủ thể.',['音楽を聞きながら勉強します。','歩きながら電話しないでください。'],'Chủ thể của hai hành động thường là một người.'),
      grammar('Kinh nghiệm với 〜たことがある','Động từ thể た + ことがある','Nói đã từng có một trải nghiệm.',['日本へ行ったことがあります。','その映画を見たことがあります。'],'Không dùng cho một sự kiện cụ thể có thời điểm rõ ràng.'),
      grammar('Dự định với 〜つもりだ','Động từ thể từ điển + つもりだ','Nói kế hoạch hoặc ý định đã tương đối rõ.',['来年日本へ行くつもりです。','今日は早く寝るつもりです。'],'Khác với hành động tức thời vừa quyết định.'),
    ],
    N3: [
      grammar('Thói quen với 〜ようにする','Động từ thể từ điển / phủ định + ようにする','Nói về nỗ lực tạo hoặc bỏ một thói quen.',['毎日日本語を読むようにしています。','夜遅く食べないようにします。'],'Phân biệt thói quen với một hành động đơn lẻ.'),
      grammar('Thay đổi với 〜ようになる','Động từ + ようになる','Diễn tả khả năng hoặc thói quen đã thay đổi theo thời gian.',['日本語が話せるようになりました。','早く起きるようになりました。'],'Không dùng khi chủ thể chủ động quyết định tức thời.'),
      grammar('Trong khi / trái lại với 〜一方で','Mệnh đề + 一方で','Đặt hai xu hướng hoặc đặc điểm tương phản cạnh nhau.',['便利な一方で、費用が高いです。','働く人が増える一方で、人口は減っています。'],'Hai vế cần có quan hệ đối chiếu rõ ràng.'),
    ],
    N2: [
      grammar('Phủ định một phần với 〜わけではない','Mệnh đề thông thường + わけではない','Phủ nhận cách hiểu quá tuyệt đối.',['嫌いなわけではありません。','すべてが簡単なわけではない。'],'Không hiểu mẫu này là phủ định hoàn toàn.'),
      grammar('Không thể tránh với 〜ざるを得ない','Động từ thể ない bỏ ない + ざるを得ない','Diễn tả buộc phải làm dù không mong muốn.',['計画を変更せざるを得ない。','今回は断念せざるを得ません。'],'する đổi thành せざるを得ない.'),
      grammar('Không hẳn là không với 〜ないことはない','Động từ / tính từ phủ định + ことはない','Nói rằng điều gì đó có thể đúng nhưng còn điều kiện hoặc dè dặt.',['食べられないことはない。','理解できないことはない。'],'Sắc thái yếu hơn khẳng định trực tiếp.'),
    ],
    N1: [
      grammar('Nhấn mạnh bản chất với 〜にほかならない','Danh từ / mệnh đề + にほかならない','Khẳng định điều được nêu chính là nguyên nhân hoặc bản chất.',['成功は努力の結果にほかならない。','この変化は技術革新の表れにほかならない。'],'Dùng chủ yếu trong văn phong trang trọng.'),
      grammar('Không gì khác ngoài với 〜にすぎない','Danh từ / mệnh đề + にすぎない','Giới hạn mức độ của một nhận định, thường mang tính hạ thấp hoặc thận trọng.',['これは一つの仮説にすぎない。','数字は結果の一部を示すにすぎない。'],'Không dùng khi muốn nhấn mạnh giá trị rất lớn.'),
      grammar('Xét đến với 〜を踏まえて','Danh từ + を踏まえて','Đưa dữ liệu, bối cảnh hoặc tiền đề làm cơ sở cho quyết định.',['結果を踏まえて方針を見直す。','現状を踏まえて議論する必要がある。'],'Phần sau phải là kết luận hoặc hành động dựa trên thông tin trước.'),
    ],
  },
  korean: {
    'TOPIK 1': [
      grammar('Danh từ + 이에요/예요','Danh từ có patchim + 이에요; không patchim + 예요','Nói “là” trong văn nói lịch sự.',['학생이에요.','의사예요.'],'Chọn dạng theo phụ âm cuối của danh từ.'),
      grammar('Chủ đề 은/는','Danh từ + 은/는','Đánh dấu chủ đề đang được nói đến.',['저는 학생이에요.','민수는 선생님이에요.'],'Dùng 은 sau phụ âm cuối, 는 sau nguyên âm.'),
      grammar('Tân ngữ 을/를','Danh từ + 을/를 + động từ','Đánh dấu đối tượng của hành động.',['책을 읽어요.','커피를 마셔요.'],'Dùng 을 sau phụ âm cuối, 를 sau nguyên âm.'),
    ],
    'TOPIK 2': [
      grammar('Ý định với -(으)려고 하다','Gốc động từ + (으)려고 하다','Diễn tả dự định thực hiện một hành động.',['주말에 친구를 만나려고 해요.','한국어를 배우려고 합니다.'],'Chọn 으려고 sau gốc kết thúc bằng phụ âm.'),
      grammar('Nguyên nhân với -아/어서','Gốc động/tính từ + 아/어서','Nối nguyên nhân tự nhiên với kết quả.',['비가 와서 집에 있었어요.','피곤해서 일찍 잤어요.'],'Không thường dùng với mệnh lệnh trực tiếp ở vế sau.'),
      grammar('Kinh nghiệm với -(으)ㄴ 적이 있다','Gốc động từ + (으)ㄴ 적이 있다','Nói đã từng có trải nghiệm.',['제주도에 간 적이 있어요.','한복을 입은 적이 있어요.'],'Không dùng để mô tả thói quen lặp lại.'),
    ],
    'TOPIK 3': [
      grammar('Kinh nghiệm với -아/어 본 적이 있다','Gốc động từ + 아/어 본 적이 있다','Nhấn mạnh đã thử hoặc trải nghiệm một việc.',['한국에 가 본 적이 있어요.','이 음식을 먹어 본 적이 있습니다.'],'Không dùng cho hành động đang diễn ra.'),
      grammar('Mặc dù với -지만','Mệnh đề 1 + 지만 + mệnh đề 2','Nối hai ý tương phản.',['비싸지만 품질이 좋아요.','피곤하지만 계속 공부했어요.'],'Hai vế cần có quan hệ đối lập hợp lý.'),
      grammar('Trong khi với -는 동안','Động từ + 는 동안','Nói điều xảy ra trong khoảng thời gian một hành động khác diễn ra.',['기다리는 동안 책을 읽었어요.','여행하는 동안 사진을 많이 찍었어요.'],'Không nhầm với thời điểm tức thời.'),
    ],
    'TOPIK 4': [
      grammar('Mức độ tăng theo với -(으)ㄹ수록','Gốc động/tính từ + (으)ㄹ수록','Diễn tả khi một mức độ tăng thì mức độ kia cũng thay đổi.',['연습할수록 발음이 좋아져요.','생각할수록 어렵습니다.'],'Hai vế cần có quan hệ thay đổi theo mức độ.'),
      grammar('Lý do suy luận với -기 때문에','Động/tính từ + 기 때문에','Trình bày nguyên nhân theo lối rõ và tương đối trang trọng.',['교통이 복잡하기 때문에 지하철을 이용합니다.','자료가 부족하기 때문에 결론을 내리기 어렵습니다.'],'Không dùng như danh từ độc lập nếu chưa hoàn chỉnh cấu trúc.'),
      grammar('Dù cho với -더라도','Gốc động/tính từ + 더라도','Nêu tình huống giả định không làm thay đổi kết quả chính.',['비가 오더라도 갈 거예요.','어렵더라도 끝까지 해 보세요.'],'Kết quả sau thường thể hiện ý chí hoặc kết luận không đổi.'),
    ],
    'TOPIK 5': [
      grammar('Đối chiếu với -는 반면에','Động từ + 는 반면에; tính từ + (으)ㄴ 반면에','Đặt hai đặc điểm hoặc xu hướng trái nhau cạnh nhau.',['이 방법은 빠른 반면에 비용이 많이 듭니다.','도시는 편리한 반면에 복잡합니다.'],'Kiểm tra dạng định ngữ trước 반면에.'),
      grammar('Theo như / dựa vào -에 따르면','Danh từ + 에 따르면','Dẫn nguồn thông tin trước khi nêu nhận định.',['보고서에 따르면 수요가 증가했습니다.','조사 결과에 따르면 만족도가 높았습니다.'],'Nên nêu rõ nguồn để tránh nhận định mơ hồ.'),
      grammar('Không chỉ… mà còn… -(으)ㄹ 뿐만 아니라','Mệnh đề + (으)ㄹ 뿐만 아니라','Mở rộng một luận điểm bằng thông tin bổ sung mạnh hơn.',['가격이 저렴할 뿐만 아니라 품질도 좋습니다.','환경을 보호할 뿐만 아니라 비용도 줄일 수 있습니다.'],'Hai vế nên song song về chức năng và ý nghĩa.'),
    ],
    'TOPIK 6': [
      grammar('Trước khi thực hiện với -기에 앞서','Gốc động từ + 기에 앞서','Nêu việc phải làm trước một hành động chính trong văn phong trang trọng.',['결론을 내리기에 앞서 자료를 검토해야 합니다.','출발하기에 앞서 계획을 확인합시다.'],'Tránh dùng khi hai sự việc xảy ra đồng thời.'),
      grammar('Xét trên phương diện -라는 점에서','Mệnh đề + 라는 점에서','Đánh giá một vấn đề dựa trên một khía cạnh cụ thể.',['지속 가능하다는 점에서 의미가 큽니다.','실용적이라는 점에서 주목할 만합니다.'],'Khía cạnh nêu ra phải liên quan trực tiếp đến kết luận.'),
      grammar('Không thể chỉ… -는 데 그치지 않고','Động từ + 는 데 그치지 않고','Nói tác động không dừng ở một điểm mà còn mở rộng thêm.',['비용을 줄이는 데 그치지 않고 효율성도 높였습니다.','문제를 지적하는 데 그치지 않고 대안을 제시해야 합니다.'],'Vế sau cần bổ sung tác động hoặc hành động vượt ra ngoài vế trước.'),
    ],
  },
}

export function grammarBankFor(languageId, level, fallback) {
  const bank = levelGrammarBanks[languageId]?.[level]
  return bank?.length ? bank : fallback ? [fallback] : []
}
