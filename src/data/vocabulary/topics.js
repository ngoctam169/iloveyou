const make = (level, topic, word, ipa, partOfSpeech, meaningVi, definition, example, translation, collocations = []) => ({
  id: word.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  languageId: 'english', level, topic, word, ipa, partOfSpeech, meaningVi, definition, example, translation,
  exam: topic === 'TOEIC' || topic === 'IELTS' ? topic : 'General', collocations,
  synonyms: [], antonyms: [], wordFamily: [], phrases: collocations, lessonIds: [], lessons: [], source: 'NT editorial vocabulary',
})

export const topicVocabulary = [
  make('B1', 'TOEIC', 'invoice', '/ˈɪnvɔɪs/', 'noun', 'hóa đơn', 'a document listing goods or services and the amount due', 'Please send the invoice before Friday.', 'Vui lòng gửi hóa đơn trước thứ Sáu.', ['issue an invoice', 'pay an invoice']),
  make('B1', 'TOEIC', 'shipment', '/ˈʃɪpmənt/', 'noun', 'lô hàng; việc vận chuyển', 'goods sent together from one place to another', 'The shipment will arrive tomorrow morning.', 'Lô hàng sẽ đến vào sáng mai.', ['track a shipment', 'delay a shipment']),
  make('B1', 'TOEIC', 'warehouse', '/ˈwerhaʊs/', 'noun', 'nhà kho', 'a large building used for storing goods', 'The products are stored in a nearby warehouse.', 'Các sản phẩm được lưu trong một nhà kho gần đó.', ['warehouse staff', 'distribution warehouse']),
  make('B2', 'TOEIC', 'agenda', '/əˈdʒendə/', 'noun', 'chương trình nghị sự', 'a list of matters to discuss at a meeting', 'Budget planning is the first item on the agenda.', 'Lập ngân sách là mục đầu tiên trong chương trình nghị sự.', ['meeting agenda', 'set the agenda']),
  make('B2', 'TOEIC', 'reimbursement', '/ˌriːɪmˈbɜːrsmənt/', 'noun', 'khoản hoàn trả chi phí', 'money paid back for expenses already incurred', 'Submit your receipts to request reimbursement.', 'Hãy nộp biên lai để yêu cầu hoàn trả chi phí.', ['travel reimbursement', 'claim reimbursement']),
  make('B1', 'TOEIC', 'deadline', '/ˈdedlaɪn/', 'noun', 'hạn chót', 'the latest time by which something must be completed', 'We must meet the project deadline.', 'Chúng ta phải kịp hạn chót của dự án.', ['meet a deadline', 'tight deadline']),

  make('B2', 'IELTS', 'paraphrase', '/ˈpærəfreɪz/', 'verb', 'diễn đạt lại', 'to express the same idea using different words', 'Paraphrase the question in your introduction.', 'Hãy diễn đạt lại câu hỏi trong phần mở bài.', ['paraphrase an idea', 'accurate paraphrase']),
  make('C1', 'IELTS', 'cohesion', '/koʊˈhiːʒn/', 'noun', 'tính liên kết', 'the way parts of a text connect clearly', 'Pronouns can improve cohesion between sentences.', 'Đại từ có thể tăng tính liên kết giữa các câu.', ['lexical cohesion', 'cohesive device']),
  make('C1', 'IELTS', 'coherence', '/koʊˈhɪrəns/', 'noun', 'tính mạch lạc', 'the quality of being logical and easy to understand', 'Clear topic sentences improve coherence.', 'Câu chủ đề rõ ràng giúp bài viết mạch lạc hơn.', ['logical coherence', 'maintain coherence']),
  make('B2', 'IELTS', 'counterargument', '/ˈkaʊntərˌɑːrɡjəmənt/', 'noun', 'lập luận phản biện', 'an argument opposing an earlier argument', 'A strong essay addresses a counterargument.', 'Một bài luận tốt sẽ đề cập đến lập luận phản biện.', ['address a counterargument', 'present a counterargument']),
  make('C1', 'IELTS', 'criterion', '/kraɪˈtɪriən/', 'noun', 'tiêu chí', 'a standard used to judge or decide something', 'Task response is one assessment criterion.', 'Mức độ đáp ứng đề bài là một tiêu chí đánh giá.', ['assessment criterion', 'meet a criterion']),

  make('B2', 'Academic Vocabulary', 'hypothesis', '/haɪˈpɑːθəsɪs/', 'noun', 'giả thuyết', 'an idea proposed as a possible explanation to be tested', 'The experiment supports the original hypothesis.', 'Thí nghiệm ủng hộ giả thuyết ban đầu.', ['test a hypothesis', 'support a hypothesis']),
  make('C1', 'Academic Vocabulary', 'methodology', '/ˌmeθəˈdɑːlədʒi/', 'noun', 'phương pháp luận', 'a system of methods used in a field of study', 'The paper explains its research methodology.', 'Bài báo giải thích phương pháp nghiên cứu của mình.', ['research methodology', 'robust methodology']),
  make('C1', 'Academic Vocabulary', 'empirical', '/ɪmˈpɪrɪkl/', 'adjective', 'dựa trên thực nghiệm', 'based on observation or experiment', 'The claim requires empirical evidence.', 'Nhận định này cần bằng chứng thực nghiệm.', ['empirical evidence', 'empirical research']),
  make('C1', 'Academic Vocabulary', 'synthesize', '/ˈsɪnθəsaɪz/', 'verb', 'tổng hợp', 'to combine information into a connected whole', 'Students must synthesize evidence from several sources.', 'Sinh viên phải tổng hợp bằng chứng từ nhiều nguồn.', ['synthesize information', 'synthesize findings']),
  make('B2', 'Academic Vocabulary', 'citation', '/saɪˈteɪʃn/', 'noun', 'trích dẫn', 'a reference to the source of information', 'Every direct quotation needs a citation.', 'Mỗi câu trích dẫn trực tiếp đều cần ghi nguồn.', ['in-text citation', 'citation style']),

  make('B2', 'Business English', 'stakeholder', '/ˈsteɪkhoʊldər/', 'noun', 'bên liên quan', 'a person or group affected by a project or organization', 'The team consulted every major stakeholder.', 'Nhóm đã tham vấn mọi bên liên quan chính.', ['key stakeholder', 'stakeholder meeting']),
  make('B2', 'Business English', 'revenue', '/ˈrevənuː/', 'noun', 'doanh thu', 'income received by a business', 'Online sales increased annual revenue.', 'Doanh số trực tuyến đã làm tăng doanh thu hằng năm.', ['generate revenue', 'annual revenue']),
  make('B2', 'Business English', 'negotiate', '/nɪˈɡoʊʃieɪt/', 'verb', 'đàm phán', 'to discuss terms in order to reach an agreement', 'They negotiated a better contract.', 'Họ đã đàm phán một hợp đồng tốt hơn.', ['negotiate a contract', 'negotiate terms']),
  make('B2', 'Business English', 'quarterly', '/ˈkwɔːrtərli/', 'adjective', 'theo quý', 'happening once every three months', 'The company published its quarterly report.', 'Công ty đã công bố báo cáo quý.', ['quarterly report', 'quarterly results']),
  make('C1', 'Business English', 'procurement', '/prəˈkjʊrmənt/', 'noun', 'hoạt động thu mua', 'the process of obtaining goods or services for an organization', 'The procurement team compared three suppliers.', 'Nhóm thu mua đã so sánh ba nhà cung cấp.', ['procurement process', 'public procurement']),

  make('B1', 'Phrasal Verbs', 'carry out', '/ˈkæri aʊt/', 'phrasal verb', 'thực hiện', 'to perform or complete a task', 'The researchers carried out a detailed survey.', 'Các nhà nghiên cứu đã thực hiện một khảo sát chi tiết.', ['carry out research', 'carry out a task']),
  make('B2', 'Phrasal Verbs', 'look into', '/lʊk ˈɪntuː/', 'phrasal verb', 'điều tra; xem xét', 'to investigate or examine something', 'We will look into the delivery problem.', 'Chúng tôi sẽ xem xét vấn đề giao hàng.', ['look into a complaint', 'look into the matter']),
  make('A2', 'Phrasal Verbs', 'set up', '/set ʌp/', 'phrasal verb', 'thiết lập; thành lập', 'to arrange or create something for use', 'She set up a meeting for Monday.', 'Cô ấy đã sắp xếp một cuộc họp vào thứ Hai.', ['set up a meeting', 'set up a business']),
  make('B1', 'Phrasal Verbs', 'follow up', '/ˈfɑːloʊ ʌp/', 'phrasal verb', 'theo dõi; liên hệ lại', 'to take further action after an earlier step', 'I will follow up with the client tomorrow.', 'Tôi sẽ liên hệ lại với khách hàng vào ngày mai.', ['follow up on a request', 'follow up with someone']),
  make('B1', 'Phrasal Verbs', 'turn down', '/tɜːrn daʊn/', 'phrasal verb', 'từ chối; vặn nhỏ', 'to refuse an offer or reduce volume', 'He turned down the job offer.', 'Anh ấy đã từ chối lời mời làm việc.', ['turn down an offer', 'turn down the volume']),

  make('A2', 'Collocations', 'make a decision', '/meɪk ə dɪˈsɪʒn/', 'collocation', 'đưa ra quyết định', 'to choose what to do after considering options', 'We need to make a decision today.', 'Chúng ta cần đưa ra quyết định hôm nay.', ['make a difficult decision', 'make a final decision']),
  make('B1', 'Collocations', 'take responsibility', '/teɪk rɪˌspɑːnsəˈbɪləti/', 'collocation', 'chịu trách nhiệm', 'to accept responsibility for an action or result', 'Managers should take responsibility for their decisions.', 'Quản lý nên chịu trách nhiệm về quyết định của mình.', ['take full responsibility', 'take personal responsibility']),
  make('B1', 'Collocations', 'meet a deadline', '/miːt ə ˈdedlaɪn/', 'collocation', 'kịp hạn chót', 'to finish work by the required time', 'The team worked late to meet the deadline.', 'Nhóm đã làm muộn để kịp hạn chót.', ['meet a strict deadline', 'fail to meet a deadline']),
  make('A2', 'Collocations', 'heavy traffic', '/ˌhevi ˈtræfɪk/', 'collocation', 'giao thông đông đúc', 'a large amount of traffic on a road', 'Heavy traffic delayed the bus.', 'Giao thông đông đúc đã làm xe buýt trễ.', ['heavy traffic congestion', 'avoid heavy traffic']),
  make('B2', 'Collocations', 'highly effective', '/ˈhaɪli ɪˈfektɪv/', 'collocation', 'rất hiệu quả', 'producing very good results', 'The new training method is highly effective.', 'Phương pháp đào tạo mới rất hiệu quả.', ['highly effective strategy', 'highly effective treatment']),

  make('A2', 'Idioms', 'a piece of cake', '/ə piːs əv keɪk/', 'idiom', 'dễ như ăn bánh', 'something that is very easy to do', 'The first exercise was a piece of cake.', 'Bài tập đầu tiên rất dễ.', ['be a piece of cake']),
  make('B1', 'Idioms', 'break the ice', '/breɪk ði aɪs/', 'idiom', 'phá tan sự ngượng ngùng', 'to make people feel more relaxed when they first meet', 'A short game helped break the ice.', 'Một trò chơi ngắn đã giúp mọi người bớt ngượng ngùng.', ['help break the ice']),
  make('B2', 'Idioms', 'hit the nail on the head', '/hɪt ðə neɪl ɑːn ðə hed/', 'idiom', 'nói chính xác vấn đề', 'to describe the exact cause or truth of a situation', 'You hit the nail on the head with that explanation.', 'Lời giải thích đó đã nói trúng vấn đề.', ['really hit the nail on the head']),
  make('B1', 'Idioms', 'under the weather', '/ˌʌndər ðə ˈweðər/', 'idiom', 'cảm thấy không khỏe', 'feeling slightly ill', 'I am feeling under the weather today.', 'Hôm nay tôi cảm thấy không được khỏe.', ['feel under the weather']),
  make('B2', 'Idioms', 'once in a blue moon', '/wʌns ɪn ə bluː muːn/', 'idiom', 'rất hiếm khi', 'very rarely', 'We eat at that expensive restaurant once in a blue moon.', 'Chúng tôi rất hiếm khi ăn ở nhà hàng đắt tiền đó.', ['happen once in a blue moon']),

  make('A2', 'Common Expressions', 'by the way', '/baɪ ðə weɪ/', 'expression', 'nhân tiện', 'used to introduce an additional thought', 'By the way, did you call Anna?', 'Nhân tiện, bạn đã gọi cho Anna chưa?', ['oh, by the way']),
  make('A2', 'Common Expressions', 'that makes sense', '/ðæt meɪks sens/', 'expression', 'điều đó hợp lý', 'used to say that an explanation is logical', 'That makes sense now that you explain it.', 'Điều đó nghe hợp lý khi bạn giải thích.', ['it makes sense']),
  make('A1', 'Common Expressions', 'no worries', '/noʊ ˈwɜːriz/', 'expression', 'không sao đâu', 'used to say that something is not a problem', 'No worries, I can wait a few minutes.', 'Không sao đâu, tôi có thể đợi vài phút.', ['no worries at all']),
  make('A1', 'Common Expressions', 'sounds good', '/saʊndz ɡʊd/', 'expression', 'nghe được đấy', 'used to agree with a suggestion or plan', 'Lunch at noon sounds good.', 'Ăn trưa lúc mười hai giờ nghe được đấy.', ['that sounds good']),
  make('B1', 'Common Expressions', 'it depends', '/ɪt dɪˈpendz/', 'expression', 'còn tùy', 'used when an answer changes according to the situation', 'It depends on how much time we have.', 'Còn tùy vào việc chúng ta có bao nhiêu thời gian.', ['it depends on']),

  make('A2', 'Sports', 'tournament', '/ˈtʊrnəmənt/', 'noun', 'giải đấu', 'a series of games that determines a winner', 'Our school will host a football tournament.', 'Trường chúng tôi sẽ tổ chức một giải bóng đá.', ['enter a tournament', 'win a tournament']),
  make('B1', 'Sports', 'referee', '/ˌrefəˈriː/', 'noun', 'trọng tài', 'the official who makes sure players follow the rules', 'The referee stopped the match.', 'Trọng tài đã dừng trận đấu.', ['assistant referee', 'referee a match']),
  make('A2', 'Sports', 'scoreboard', '/ˈskɔːrbɔːrd/', 'noun', 'bảng tỷ số', 'a board that displays the score in a game', 'The final score appeared on the scoreboard.', 'Tỷ số cuối cùng hiện trên bảng tỷ số.', ['digital scoreboard', 'check the scoreboard']),
]

