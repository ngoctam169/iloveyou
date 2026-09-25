// Small, original practice sets for higher tracks. Teaching placement is
// indicative and is not a claim that a word belongs to an official exam list.
const rows = {
  chinese: {
    'HSK 2': [
      ['觉得','juéde','động từ','cảm thấy; cho rằng','to feel or think','我觉得这个办法很好。','Tôi thấy cách này rất tốt.','Opinions'],
      ['因为','yīnwèi','liên từ','bởi vì','because','因为下雨，我们在家学习。','Vì trời mưa, chúng tôi học ở nhà.','Communication'],
      ['所以','suǒyǐ','liên từ','cho nên','therefore','我很累，所以早点睡。','Tôi rất mệt nên đi ngủ sớm.','Communication'],
      ['运动','yùndòng','danh từ','vận động; thể thao','physical exercise','每天运动对身体好。','Vận động mỗi ngày tốt cho cơ thể.','Sports'],
      ['帮助','bāngzhù','động từ','giúp đỡ','to help','谢谢你帮助我。','Cảm ơn bạn đã giúp tôi.','Relationships'],
    ],
    'HSK 3': [
      ['经验','jīngyàn','danh từ','kinh nghiệm','experience','她有很多工作经验。','Cô ấy có nhiều kinh nghiệm làm việc.','Work'],
      ['计划','jìhuà','danh từ','kế hoạch','a plan','我们有一个新的学习计划。','Chúng tôi có một kế hoạch học tập mới.','Education'],
      ['重要','zhòngyào','tính từ','quan trọng','important','健康比金钱更重要。','Sức khỏe quan trọng hơn tiền bạc.','Health'],
      ['环境','huánjìng','danh từ','môi trường','the environment','我们应该保护环境。','Chúng ta nên bảo vệ môi trường.','Environment'],
      ['参加','cānjiā','động từ','tham gia','to take part in','我想参加这个活动。','Tôi muốn tham gia hoạt động này.','Daily Life'],
    ],
    'HSK 4': [
      ['交流','jiāoliú','động từ','trao đổi; giao lưu','to exchange ideas','学生们在课堂上交流想法。','Học sinh trao đổi ý tưởng trong lớp.','Communication'],
      ['适合','shìhé','động từ','phù hợp','to be suitable','这份工作很适合她。','Công việc này rất phù hợp với cô ấy.','Work'],
      ['发展','fāzhǎn','động từ','phát triển','to develop','这个城市发展得很快。','Thành phố này phát triển rất nhanh.','Society'],
      ['机会','jīhuì','danh từ','cơ hội','an opportunity','这是一个学习新技能的机会。','Đây là cơ hội học kỹ năng mới.','Career'],
      ['责任','zérèn','danh từ','trách nhiệm','responsibility','每个人都有保护环境的责任。','Mọi người đều có trách nhiệm bảo vệ môi trường.','Environment'],
    ],
    'HSK 5': [
      ['改善','gǎishàn','động từ','cải thiện','to improve','新政策改善了交通状况。','Chính sách mới đã cải thiện giao thông.','Transportation'],
      ['效率','xiàolǜ','danh từ','hiệu suất','efficiency','合理安排时间可以提高效率。','Sắp xếp thời gian hợp lý có thể nâng cao hiệu suất.','Work'],
      ['观点','guāndiǎn','danh từ','quan điểm','a point of view','我理解你的观点。','Tôi hiểu quan điểm của bạn.','Opinions'],
      ['趋势','qūshì','danh từ','xu hướng','a trend','这个趋势值得关注。','Xu hướng này đáng được chú ý.','Business'],
      ['资源','zīyuán','danh từ','tài nguyên','resources','学校需要更多教学资源。','Trường cần thêm tài nguyên giảng dạy.','Education'],
    ],
    'HSK 6': [
      ['权衡','quánhéng','động từ','cân nhắc lợi hại','to weigh competing factors','我们需要权衡成本和收益。','Chúng ta cần cân nhắc chi phí và lợi ích.','Finance'],
      ['倡导','chàngdǎo','động từ','đề xướng','to advocate','专家倡导更可持续的生活方式。','Các chuyên gia đề xướng lối sống bền vững hơn.','Environment'],
      ['诠释','quánshì','động từ','diễn giải','to interpret or explain','作者用故事诠释这个概念。','Tác giả dùng câu chuyện để diễn giải khái niệm này.','Culture'],
      ['深远','shēnyuǎn','tính từ','sâu rộng và lâu dài','far-reaching','这项改革产生了深远影响。','Cuộc cải cách này đã tạo ảnh hưởng sâu rộng.','Society'],
      ['严峻','yánjùn','tính từ','nghiêm trọng','severe','我们面临严峻的环境挑战。','Chúng ta đối mặt với thách thức môi trường nghiêm trọng.','Environment'],
    ],
  },
  japanese: {
    N4: [
      ['予定','よてい','danh từ','dự định; lịch trình','a plan or schedule','明日の予定を教えてください。','Hãy cho tôi biết lịch trình ngày mai.','Daily Life'],
      ['約束','やくそく','danh từ','lời hứa; cuộc hẹn','a promise or appointment','友達と会う約束があります。','Tôi có hẹn gặp bạn.','Relationships'],
      ['心配','しんぱい','danh từ','sự lo lắng','worry','試験のことを心配しています。','Tôi đang lo về kỳ thi.','Emotions'],
      ['必要','ひつよう','tính từ','cần thiết','necessary','旅行にはパスポートが必要です。','Đi du lịch cần có hộ chiếu.','Travel'],
      ['旅行','りょこう','danh từ','chuyến du lịch','a trip','来月、日本へ旅行します。','Tháng sau tôi sẽ đi du lịch Nhật Bản.','Travel'],
    ],
    N3: [
      ['経験','けいけん','danh từ','kinh nghiệm','experience','海外で働いた経験があります。','Tôi có kinh nghiệm làm việc ở nước ngoài.','Work'],
      ['関係','かんけい','danh từ','mối quan hệ','a relationship','二つの問題には関係があります。','Hai vấn đề có liên quan với nhau.','Relationships'],
      ['解決','かいけつ','danh từ','sự giải quyết','a solution','みんなで問題を解決しました。','Mọi người đã cùng giải quyết vấn đề.','Work'],
      ['連絡','れんらく','danh từ','sự liên lạc','contact','着いたら連絡してください。','Khi đến nơi, hãy liên lạc nhé.','Communication'],
      ['環境','かんきょう','danh từ','môi trường','the environment','自然環境を守ることが大切です。','Bảo vệ môi trường tự nhiên là điều quan trọng.','Environment'],
    ],
    N2: [
      ['影響','えいきょう','danh từ','ảnh hưởng','influence','天気は旅行の計画に影響します。','Thời tiết ảnh hưởng đến kế hoạch du lịch.','Travel'],
      ['提案','ていあん','danh từ','đề xuất','a proposal','新しい方法を提案しました。','Tôi đã đề xuất một phương pháp mới.','Work'],
      ['効率','こうりつ','danh từ','hiệu suất','efficiency','この方法は作業の効率を上げます。','Cách này nâng cao hiệu suất làm việc.','Work'],
      ['判断','はんだん','danh từ','sự phán đoán','judgment','十分な情報を集めて判断します。','Tôi sẽ thu thập đủ thông tin rồi phán đoán.','Communication'],
      ['状況','じょうきょう','danh từ','tình hình','a situation','現在の状況を説明してください。','Hãy giải thích tình hình hiện tại.','Daily Life'],
    ],
    N1: [
      ['概念','がいねん','danh từ','khái niệm','a concept','この概念を具体例で説明します。','Tôi giải thích khái niệm này bằng ví dụ cụ thể.','Academic English'],
      ['根拠','こんきょ','danh từ','căn cứ','evidence or grounds','その主張には十分な根拠がありません。','Luận điểm đó không có đủ căn cứ.','Argumentation'],
      ['妥協','だきょう','danh từ','sự thỏa hiệp','a compromise','双方が妥協して合意しました。','Hai bên đã thỏa hiệp và đạt thỏa thuận.','Debate'],
      ['顕著','けんちょ','tính từ','rõ rệt','notable or marked','この地域では人口減少が顕著です。','Sự giảm dân số ở khu vực này rất rõ rệt.','Society'],
      ['精緻','せいち','tính từ','tinh vi; tỉ mỉ','precise and detailed','精緻な分析が求められます。','Cần có một phân tích tỉ mỉ.','Science'],
    ],
  },
  korean: {
    'TOPIK 2': [
      ['약속','yaksok','danh từ','lời hứa; cuộc hẹn','a promise or appointment','친구와 약속이 있어요.','Tôi có hẹn với bạn.','Relationships'],
      ['계획','gyehoek','danh từ','kế hoạch','a plan','주말 여행 계획을 세웠어요.','Tôi đã lập kế hoạch du lịch cuối tuần.','Travel'],
      ['운동','undong','danh từ','vận động; thể thao','exercise','저는 아침마다 운동해요.','Tôi tập thể dục mỗi sáng.','Sports'],
      ['여행','yeohaeng','danh từ','du lịch','travel','가족과 함께 여행을 갔어요.','Tôi đã đi du lịch cùng gia đình.','Travel'],
      ['준비','junbi','danh từ','sự chuẩn bị','preparation','시험 준비를 시작했어요.','Tôi đã bắt đầu chuẩn bị cho kỳ thi.','Education'],
    ],
    'TOPIK 3': [
      ['경험','gyeongheom','danh từ','kinh nghiệm','experience','그 일은 좋은 경험이었어요.','Công việc đó là một kinh nghiệm tốt.','Work'],
      ['관심','gwansim','danh từ','sự quan tâm','interest','저는 환경 문제에 관심이 많아요.','Tôi rất quan tâm đến vấn đề môi trường.','Environment'],
      ['노력','noryeok','danh từ','nỗ lực','effort','꾸준한 노력이 필요해요.','Cần nỗ lực đều đặn.','Education'],
      ['문화','munhwa','danh từ','văn hóa','culture','다른 나라의 문화를 배우고 싶어요.','Tôi muốn học văn hóa của các nước khác.','Culture'],
      ['환경','hwangyeong','danh từ','môi trường','the environment','깨끗한 환경을 지켜야 해요.','Chúng ta phải giữ môi trường sạch.','Environment'],
    ],
    'TOPIK 4': [
      ['영향','yeonghyang','danh từ','ảnh hưởng','influence','날씨가 건강에 영향을 줍니다.','Thời tiết ảnh hưởng đến sức khỏe.','Health'],
      ['책임','chaegim','danh từ','trách nhiệm','responsibility','모두가 자신의 책임을 다해야 합니다.','Mọi người phải làm tròn trách nhiệm của mình.','Work'],
      ['비교','bigyo','danh từ','sự so sánh','comparison','두 결과를 비교해 보세요.','Hãy so sánh hai kết quả.','Education'],
      ['개선','gaeseon','danh từ','sự cải thiện','improvement','서비스 개선이 필요합니다.','Cần cải thiện dịch vụ.','Business'],
      ['발전','baljeon','danh từ','sự phát triển','development','도시의 발전이 빠릅니다.','Sự phát triển của thành phố rất nhanh.','Society'],
    ],
    'TOPIK 5': [
      ['관점','gwanjeom','danh từ','góc nhìn','a point of view','다른 관점에서 문제를 보아야 합니다.','Cần nhìn vấn đề từ góc độ khác.','Opinions'],
      ['효율','hyoyul','danh từ','hiệu suất','efficiency','업무 효율을 높이는 방법을 찾았습니다.','Chúng tôi đã tìm được cách nâng hiệu suất công việc.','Work'],
      ['자원','jawon','danh từ','tài nguyên','resources','한정된 자원을 아껴 써야 합니다.','Cần tiết kiệm tài nguyên hữu hạn.','Environment'],
      ['전략','jeollyak','danh từ','chiến lược','a strategy','새로운 전략을 수립했습니다.','Chúng tôi đã xây dựng chiến lược mới.','Business'],
      ['추세','chuse','danh từ','xu thế','a trend','이 추세는 당분간 계속될 전망입니다.','Xu thế này được dự báo sẽ tiếp tục một thời gian.','Finance'],
    ],
    'TOPIK 6': [
      ['타당성','tadangseong','danh từ','tính hợp lý','validity','그 주장의 타당성을 검토해야 합니다.','Cần xem xét tính hợp lý của luận điểm đó.','Argumentation'],
      ['함의','hamui','danh từ','hàm ý','an implication','이 결과의 사회적 함의를 분석했습니다.','Chúng tôi đã phân tích hàm ý xã hội của kết quả này.','Academic Analysis'],
      ['절충','jeolchung','danh từ','sự dung hòa','a compromise','두 의견 사이에서 절충안을 찾았습니다.','Chúng tôi đã tìm phương án dung hòa giữa hai ý kiến.','Debate'],
      ['상충','sangchung','danh từ','sự xung đột','a conflict','두 목표가 서로 상충할 수 있습니다.','Hai mục tiêu có thể xung đột với nhau.','Business'],
      ['고찰','gochal','danh từ','sự khảo cứu','close examination','연구자는 이 현상을 심층적으로 고찰했습니다.','Nhà nghiên cứu đã khảo cứu hiện tượng này sâu sắc.','Science'],
    ],
  },
}

export const multilingualVocabulary = Object.entries(rows).flatMap(([languageId, levels]) => Object.entries(levels).flatMap(([level, entries]) => entries.map(([word, ipa, partOfSpeech, meaningVi, definition, example, translation, topic]) => ({
  id: word, languageId, level, word, ipa, partOfSpeech, meaningVi, definition, example, translation, topic,
  collocations: [], synonyms: [], antonyms: [], wordFamily: [], phrases: [], lessonIds: [], lessons: [],
  audio: { kind: 'speech-synthesis', text: word, locale: { chinese:'zh-CN', japanese:'ja-JP', korean:'ko-KR' }[languageId], recordingUrl: null },
  provenance: { source:'original authored practice examples', levelBasis:'indicative teaching placement', reviewedByTeacher:false },
}))))
