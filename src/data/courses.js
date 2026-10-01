import { getLanguage, levelSlug } from './languages.js'
import { getLevelMeta } from './levels.js'
import lessonPools from './vocabulary/generated/lesson-pools.json' with { type: 'json' }

const packs = {
  english: [
    {
      title: 'Greetings', nativeTitle: 'Chào hỏi tự nhiên', icon: '👋',
      vocab: [
        ['Hello', '/həˈləʊ/', 'interjection', 'Xin chào', 'Hello, nice to meet you.', 'Xin chào, rất vui được gặp bạn.'],
        ['Morning', '/ˈmɔːrnɪŋ/', 'noun', 'Buổi sáng', 'Good morning, Anna.', 'Chào buổi sáng, Anna.'],
        ['Journey', '/ˈdʒɜːrni/', 'noun', 'Chuyến hành trình', 'The journey took three hours.', 'Chuyến đi kéo dài ba giờ.'],
      ],
      grammar: { name: 'The verb “to be”', structure: 'Subject + am / is / are', explanation: 'Dùng “to be” để giới thiệu tên, trạng thái hoặc danh tính.', examples: ['I am Linh.', 'She is my teacher.', 'We are ready.'], mistake: 'Không nói “I is”. Với I, luôn dùng am.' },
      listen: 'Hello, my name is Emma. Nice to meet you.', target: "I'd like a cup of coffee, please.",
      reading: { title: 'A new class', text: 'Mai walks into her new English class. She smiles and says hello to Tom. Tom is from London, and Mai is from Hanoi. They are happy to meet.', question: 'Where is Tom from?', options: ['Hanoi', 'London', 'Tokyo'], answer: 1 },
      writing: { prompt: 'Viết 3 câu ngắn để giới thiệu tên và nơi bạn sống.', keywords: ['am', 'live'] },
      quiz: { question: 'Câu chào nào phù hợp vào buổi sáng?', options: ['Good night', 'Good morning', 'Goodbye'], answer: 1, explanation: '“Good morning” dùng để chào từ sáng đến gần trưa.' },
    },
    {
      title: 'Introductions', nativeTitle: 'Giới thiệu bản thân', icon: '💬',
      vocab: [['Name', '/neɪm/', 'noun', 'Tên', 'What is your name?', 'Bạn tên là gì?'], ['Meet', '/miːt/', 'verb', 'Gặp', 'It is nice to meet you.', 'Rất vui được gặp bạn.'], ['Friend', '/frend/', 'noun', 'Bạn bè', 'Lan is my friend.', 'Lan là bạn của tôi.']],
      grammar: { name: 'Possessive adjectives', structure: 'my / your / his / her + noun', explanation: 'Tính từ sở hữu đứng trước danh từ để chỉ người sở hữu.', examples: ['My name is Leo.', 'What is your name?'], mistake: 'Không thêm “s” vào my hoặc your.' },
      listen: 'Hi, I am Alex. I am a student from Canada.', target: 'My name is Alex and I am from Canada.',
      reading: { title: 'Meet Alex', text: 'Alex is a student. He is twenty years old and lives in Toronto. His new friend is Hana.', question: 'Who is Alex’s new friend?', options: ['Hana', 'Mai', 'Tom'], answer: 0 },
      writing: { prompt: 'Giới thiệu bản thân bằng 3–5 câu.', keywords: ['name', 'from'] },
      quiz: { question: 'Hoàn thành: ___ name is Alex.', options: ['Me', 'My', 'I'], answer: 1, explanation: 'My đứng trước danh từ name.' },
    },
    {
      title: 'Numbers & time', nativeTitle: 'Số đếm và thời gian', icon: '🕘',
      vocab: [['Three', '/θriː/', 'number', 'Số ba', 'I have three books.', 'Tôi có ba quyển sách.'], ['Today', '/təˈdeɪ/', 'adverb', 'Hôm nay', 'Today is Monday.', 'Hôm nay là thứ Hai.'], ['Clock', '/klɒk/', 'noun', 'Đồng hồ', 'The clock is on the wall.', 'Đồng hồ ở trên tường.']],
      grammar: { name: 'Telling time', structure: 'It is + hour + o’clock', explanation: 'Dùng cấu trúc này để nói giờ tròn.', examples: ['It is three o’clock.', 'It is nine o’clock.'], mistake: 'Dùng “o’clock” với giờ tròn, không dùng kèm phút.' },
      listen: 'The class starts at nine o’clock.', target: 'It is seven thirty in the morning.',
      reading: { title: 'A busy morning', text: 'Liam gets up at seven. He has breakfast at seven thirty. His class starts at nine.', question: 'When does the class start?', options: ['Seven', 'Seven thirty', 'Nine'], answer: 2 },
      writing: { prompt: 'Viết lịch buổi sáng của bạn bằng ít nhất 3 câu.', keywords: ['at', 'morning'] },
      quiz: { question: '“It is five o’clock” nghĩa là gì?', options: ['5 giờ đúng', '5 giờ rưỡi', '15 giờ'], answer: 0, explanation: 'O’clock cho biết đây là giờ tròn.' },
    },
  ],
  chinese: [
    {
      title: '你好', nativeTitle: 'Xin chào', icon: '👋',
      vocab: [['你好', 'nǐ hǎo', 'expression', 'Xin chào', '你好！我叫李明。', 'Xin chào! Tôi tên là Lý Minh.'], ['谢谢', 'xièxie', 'expression', 'Cảm ơn', '谢谢你。', 'Cảm ơn bạn.'], ['学习', 'xuéxí', 'verb', 'Học tập', '我学习中文。', 'Tôi học tiếng Trung.']],
      grammar: { name: 'Câu với 是 (shì)', structure: 'Chủ ngữ + 是 + danh từ', explanation: '是 nối chủ ngữ với danh từ chỉ danh tính.', examples: ['我是学生。', '他是老师。'], mistake: 'Không dùng 是 trực tiếp trước tính từ đơn giản như 很好.' },
      listen: '你好，我叫李明。很高兴认识你。', target: '你好，我叫李明。',
      reading: { title: '新朋友', text: '你好！我叫王月。我是学生。我学习中文。这是我的朋友李明。', question: '王月是谁？', options: ['老师', '学生', '医生'], answer: 1 },
      writing: { prompt: 'Dùng 我叫… và 我是… để viết 2–3 câu giới thiệu.', keywords: ['我', '是'] },
      quiz: { question: '“谢谢” có nghĩa là gì?', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn'], answer: 2, explanation: '谢谢 (xièxie) được dùng để cảm ơn.' },
    },
    {
      title: '我叫…', nativeTitle: 'Tôi tên là…', icon: '💬',
      vocab: [['叫', 'jiào', 'verb', 'Tên là / gọi', '我叫小雨。', 'Tôi tên là Tiểu Vũ.'], ['名字', 'míngzi', 'noun', 'Tên', '你叫什么名字？', 'Bạn tên là gì?'], ['朋友', 'péngyou', 'noun', 'Bạn bè', '他是我的朋友。', 'Anh ấy là bạn tôi.']],
      grammar: { name: 'Hỏi tên với 什么', structure: '你 + 叫 + 什么 + 名字？', explanation: '什么 là từ để hỏi “gì”.', examples: ['你叫什么名字？', '我叫安娜。'], mistake: 'Giữ 什么 ở đúng vị trí của thông tin cần hỏi.' },
      listen: '你叫什么名字？我叫安娜。', target: '我叫安娜。你呢？', reading: { title: '自我介绍', text: '我叫安娜。我是英国人。小王是我的朋友。', question: '安娜是哪国人？', options: ['中国人', '英国人', '日本人'], answer: 1 },
      writing: { prompt: 'Viết 3 câu tự giới thiệu bằng tiếng Trung.', keywords: ['我', '叫'] }, quiz: { question: 'Câu nào hỏi tên?', options: ['你好吗？', '你叫什么名字？', '你去哪儿？'], answer: 1, explanation: '叫什么名字 dùng để hỏi tên.' },
    },
    {
      title: '数字', nativeTitle: 'Số đếm', icon: '🔢',
      vocab: [['一', 'yī', 'number', 'Một', '我有一本书。', 'Tôi có một quyển sách.'], ['二', 'èr', 'number', 'Hai', '今天是二号。', 'Hôm nay là ngày mùng hai.'], ['十', 'shí', 'number', 'Mười', '我十岁。', 'Tôi mười tuổi.']],
      grammar: { name: 'Số + lượng từ + danh từ', structure: 'Số + 个 / 本 + danh từ', explanation: 'Tiếng Trung thường cần lượng từ giữa số và danh từ.', examples: ['一个人', '三本书'], mistake: 'Không bỏ lượng từ: nói 三本书, không nói 三书.' },
      listen: '我有三本书和两个朋友。', target: '我有三本中文书。', reading: { title: '我的书', text: '我有五本书。三本是中文书，两本是英文书。', question: 'Có bao nhiêu sách tiếng Trung?', options: ['Hai', 'Ba', 'Năm'], answer: 1 },
      writing: { prompt: 'Viết số từ một đến năm bằng chữ Hán.', keywords: ['一', '三'] }, quiz: { question: 'Số 10 viết thế nào?', options: ['一', '五', '十'], answer: 2, explanation: '十 (shí) là số mười.' },
    },
  ],
  japanese: [
    {
      title: 'あいさつ', nativeTitle: 'Chào hỏi', icon: '👋',
      vocab: [['こんにちは', 'konnichiwa', 'expression', 'Xin chào', 'こんにちは、田中さん。', 'Xin chào anh Tanaka.'], ['ありがとう', 'arigatō', 'expression', 'Cảm ơn', 'どうもありがとう。', 'Cảm ơn bạn rất nhiều.'], ['勉強', 'べんきょう · benkyō', 'noun', 'Học tập', '日本語を勉強します。', 'Tôi học tiếng Nhật.']],
      grammar: { name: 'Câu danh từ với です', structure: 'A は B です', explanation: 'は đánh dấu chủ đề, です kết thúc câu lịch sự.', examples: ['わたしは学生です。', '田中さんは先生です。'], mistake: 'Trợ từ は trong cấu trúc này được đọc là “wa”.' },
      listen: 'こんにちは。はじめまして。わたしはゆきです。', target: 'はじめまして。わたしはゆきです。', reading: { title: 'はじめまして', text: 'わたしはゆきです。学生です。ベトナムから来ました。日本語を勉強します。', question: 'ゆきさんは何を勉強しますか。', options: ['英語', '日本語', '中国語'], answer: 1 },
      writing: { prompt: 'Dùng わたしは…です để viết 2–3 câu.', keywords: ['わたし', 'です'] }, quiz: { question: 'Câu chào ban ngày là gì?', options: ['こんばんは', 'こんにちは', 'おやすみ'], answer: 1, explanation: 'こんにちは là lời chào thường dùng vào ban ngày.' },
    },
    {
      title: '自己紹介', nativeTitle: 'Tự giới thiệu', icon: '💬',
      vocab: [['名前', 'なまえ · namae', 'noun', 'Tên', 'お名前は何ですか。', 'Bạn tên là gì?'], ['学生', 'がくせい · gakusei', 'noun', 'Học sinh', 'わたしは学生です。', 'Tôi là học sinh.'], ['友達', 'ともだち · tomodachi', 'noun', 'Bạn bè', 'アンさんは友達です。', 'An là bạn tôi.']],
      grammar: { name: 'Câu hỏi với か', structure: 'Câu lịch sự + か', explanation: 'Thêm か vào cuối câu lịch sự để tạo câu hỏi.', examples: ['学生ですか。', 'ベトナム人ですか。'], mistake: 'Không cần đảo trật tự từ khi thêm か.' },
      listen: 'お名前は何ですか。わたしはハナです。', target: 'わたしはハナです。学生です。', reading: { title: '田中さん', text: '田中さんは先生です。東京に住んでいます。英語を教えます。', question: '田中さんの仕事は何ですか。', options: ['学生', '先生', '医者'], answer: 1 },
      writing: { prompt: 'Viết 3 câu tự giới thiệu đơn giản.', keywords: ['です', 'わたし'] }, quiz: { question: 'Trợ từ nào tạo câu hỏi?', options: ['を', 'か', 'に'], answer: 1, explanation: 'か đặt cuối câu để biểu thị câu hỏi.' },
    },
    {
      title: '数字', nativeTitle: 'Số đếm', icon: '🔢',
      vocab: [['一', 'いち · ichi', 'number', 'Một', 'りんごが一つあります。', 'Có một quả táo.'], ['三', 'さん · san', 'number', 'Ba', '三人です。', 'Có ba người.'], ['十', 'じゅう · jū', 'number', 'Mười', '十時です。', 'Bây giờ là mười giờ.']],
      grammar: { name: 'Hỏi số lượng', structure: 'いくつ + ですか', explanation: 'いくつ dùng để hỏi có bao nhiêu đồ vật.', examples: ['りんごはいくつですか。', '三つです。'], mistake: 'Số đếm đồ vật có cách đọc riêng như ひとつ, ふたつ.' },
      listen: 'りんごが三つあります。', target: 'いまは七時です。', reading: { title: 'くだもの', text: 'りんごが三つ、みかんが二つあります。くだものは全部で五つです。', question: 'みかんはいくつありますか。', options: ['一つ', '二つ', '三つ'], answer: 1 },
      writing: { prompt: 'Viết các số 1, 3, 5 và 10 bằng chữ Nhật.', keywords: ['一', '三'] }, quiz: { question: '三 đọc là gì?', options: ['ichi', 'san', 'go'], answer: 1, explanation: '三 được đọc là さん (san).' },
    },
  ],
  korean: [
    {
      title: '인사', nativeTitle: 'Chào hỏi', icon: '👋',
      vocab: [['안녕하세요', 'annyeonghaseyo', 'expression', 'Xin chào', '안녕하세요, 민수 씨.', 'Xin chào bạn Minsu.'], ['감사합니다', 'gamsahamnida', 'expression', 'Cảm ơn', '정말 감사합니다.', 'Thật sự cảm ơn bạn.'], ['공부', 'gongbu', 'noun', 'Học tập', '한국어를 공부해요.', 'Tôi học tiếng Hàn.']],
      grammar: { name: 'Danh từ + 이에요/예요', structure: 'Danh từ có patchim + 이에요; không patchim + 예요', explanation: 'Mẫu câu lịch sự thân thiện dùng để nói “là”.', examples: ['학생이에요.', '의사예요.'], mistake: 'Chọn 이에요 hay 예요 theo phụ âm cuối của danh từ.' },
      listen: '안녕하세요. 저는 수진이에요. 반갑습니다.', target: '안녕하세요. 저는 수진이에요.', reading: { title: '새 친구', text: '저는 수진이에요. 베트남 사람이에요. 한국어를 공부해요.', question: '수진 씨는 무엇을 공부해요?', options: ['영어', '한국어', '일본어'], answer: 1 },
      writing: { prompt: 'Dùng 저는…이에요/예요 để viết 2–3 câu.', keywords: ['저는', '예요'] }, quiz: { question: '“감사합니다” có nghĩa là gì?', options: ['Xin lỗi', 'Cảm ơn', 'Xin chào'], answer: 1, explanation: '감사합니다 là cách cảm ơn lịch sự.' },
    },
    {
      title: '자기소개', nativeTitle: 'Tự giới thiệu', icon: '💬',
      vocab: [['이름', 'ireum', 'noun', 'Tên', '이름이 뭐예요?', 'Bạn tên là gì?'], ['학생', 'haksaeng', 'noun', 'Học sinh', '저는 학생이에요.', 'Tôi là học sinh.'], ['친구', 'chingu', 'noun', 'Bạn bè', '민수는 제 친구예요.', 'Minsu là bạn tôi.']],
      grammar: { name: 'Chủ đề 은/는', structure: 'Danh từ + 은/는', explanation: '은/는 đánh dấu chủ đề đang được nói đến.', examples: ['저는 학생이에요.', '민수는 선생님이에요.'], mistake: 'Dùng 은 sau phụ âm cuối, 는 sau nguyên âm.' },
      listen: '제 이름은 하나예요. 저는 학생이에요.', target: '저는 하나예요. 만나서 반가워요.', reading: { title: '하나의 소개', text: '하나는 학생이에요. 서울에 살아요. 베트남어를 공부해요.', question: '하나는 어디에 살아요?', options: ['부산', '서울', '하노이'], answer: 1 },
      writing: { prompt: 'Viết 3 câu tự giới thiệu bằng tiếng Hàn.', keywords: ['저는', '이에요'] }, quiz: { question: 'Từ nào có nghĩa là “bạn bè”?', options: ['친구', '이름', '학생'], answer: 0, explanation: '친구 (chingu) nghĩa là bạn bè.' },
    },
    {
      title: '숫자', nativeTitle: 'Số đếm', icon: '🔢',
      vocab: [['하나', 'hana', 'number', 'Một', '사과 하나 주세요.', 'Cho tôi một quả táo.'], ['둘', 'dul', 'number', 'Hai', '친구가 둘 있어요.', 'Tôi có hai người bạn.'], ['열', 'yeol', 'number', 'Mười', '열 시예요.', 'Bây giờ là mười giờ.']],
      grammar: { name: 'Số thuần Hàn + đơn vị', structure: 'Số + 개 / 명 / 시', explanation: 'Số thuần Hàn thường đi với đơn vị đếm đồ vật, người và giờ.', examples: ['사과 세 개', '학생 두 명'], mistake: '하나, 둘, 셋 đổi thành 한, 두, 세 trước một số đơn vị.' },
      listen: '사과 세 개하고 물 하나 주세요.', target: '지금은 아홉 시예요.', reading: { title: '시장', text: '지수는 사과 세 개와 바나나 두 개를 사요. 과일은 모두 다섯 개예요.', question: '바나나는 몇 개예요?', options: ['한 개', '두 개', '세 개'], answer: 1 },
      writing: { prompt: 'Viết số một đến năm bằng chữ Hàn.', keywords: ['하나', '셋'] }, quiz: { question: '둘 có nghĩa là số mấy?', options: ['Một', 'Hai', 'Ba'], answer: 1, explanation: '둘 (dul) là số hai thuần Hàn.' },
    },
  ],
}

const genericUnits = ['Nền tảng giao tiếp', 'Con người & gia đình', 'Thói quen mỗi ngày', 'Đồ ăn & thức uống', 'Mua sắm thông minh', 'Thành phố & chỉ đường', 'Du lịch', 'Sức khỏe', 'Công việc & học tập', 'Tổng ôn']
const listeningTypes = ['Listen & Choose', 'Dictation', 'Fill in the Blank', 'Listen & Answer', 'Conversation Listening']
const quizTypes = ['Multiple Choice', 'Fill Blank', 'Reorder Sentence', 'Matching', 'True False', 'Vocabulary Quiz', 'Grammar Quiz', 'Listening Quiz']
const lessonFocuses = ['Core Language', 'Vocabulary Lab', 'Listening & Speaking', 'Grammar in Context', 'Reading & Writing', 'Review & Challenge']
const TARGET_LESSONS_PER_LEVEL = 60

const levelCurriculum = {
  chinese: {
    'HSK 1': { themes:['Greetings','Family','Numbers','Daily routine','Food','Places','Basic requests'], grammar:[['是 sentences','Subject + 是 + noun','Giới thiệu danh tính và phân loại.'],['有 / 没有','Subject + 有 / 没有 + object','Nói có hoặc không có.'],['吗 questions','Statement + 吗？','Tạo câu hỏi yes/no.'],['在 location','Subject + 在 + place','Nói vị trí.']] },
    'HSK 2': { themes:['Schedules','Shopping','Transport','Weather','Health','Invitations','Comparisons'], grammar:[['了 completion','Verb + 了','Diễn tả hành động đã hoàn tất.'],['正在 progressive','正在 + verb','Diễn tả hành động đang xảy ra.'],['比 comparison','A + 比 + B + adjective','So sánh hai đối tượng.'],['因为…所以…','因为 + cause， 所以 + result','Nối nguyên nhân và kết quả.']] },
    'HSK 3': { themes:['Travel planning','Study habits','Work','Relationships','Services','Experiences','Opinions'], grammar:[['把 sentence','Subject + 把 + object + verb + result','Nhấn mạnh cách xử lý một đối tượng.'],['被 passive','Subject + 被 + agent + verb','Câu bị động cơ bản.'],['过 experience','Verb + 过','Nói trải nghiệm đã từng có.'],['虽然…但是…','虽然 + concession，但是 + result','Diễn tả nhượng bộ.']] },
    'HSK 4': { themes:['Problem solving','Media','Culture','Environment','Career','Public services','Debate'], grammar:[['既然…就…','既然 + premise，就 + result','Nêu tiền đề rồi kết luận hợp lý.'],['不仅…而且…','不仅 + A，而且 + B','Bổ sung hai đặc điểm/hành động.'],['无论…都…','无论 + condition，都 + result','Khái quát bất kể điều kiện.'],['连…都…','连 + focus + 都 + predicate','Nhấn mạnh trường hợp bất ngờ.']] },
    'HSK 5': { themes:['Academic study','Professional communication','Social issues','Technology','Economy','Narrative','Argument'], grammar:[['一方面…另一方面…','一方面 + A，另一方面 + B','Trình bày hai mặt của vấn đề.'],['与其…不如…','与其 + A，不如 + B','Ưu tiên phương án B hơn A.'],['之所以…是因为…','之所以 + result，是因为 + cause','Đảo thứ tự nguyên nhân-kết quả để nhấn mạnh.'],['即使…也…','即使 + concession，也 + result','Nhượng bộ giả định.']] },
    'HSK 6': { themes:['Abstract argument','Public policy','Literature','Research','Ethics','Negotiation','Nuance'], grammar:[['并非…而是…','并非 + A，而是 + B','Bác bỏ cách hiểu A và thay bằng B.'],['倘若…则…','倘若 + condition，则 + result','Điều kiện trang trọng trong văn viết.'],['毋庸置疑','毋庸置疑 + clause','Khẳng định điều khó phủ nhận trong văn phong trang trọng.'],['就…而言','就 + topic + 而言','Giới hạn phạm vi lập luận.']] },
  },
  japanese: {
    N5: { themes:['Greetings','Self introduction','Time','Daily routine','Food','Shopping','Directions'], grammar:[['です / ます','Noun + です / Verb + ます','Mẫu lịch sự nền tảng.'],['Particles は / が','Topic + は / subject + が','Phân biệt chủ đề và chủ ngữ.'],['Particles を / に','Object + を / destination-time + に','Đánh dấu tân ngữ, đích đến và thời điểm.'],['〜ませんか','Verb ませんか','Mời hoặc đề nghị lịch sự.']] },
    N4: { themes:['Plans','Experiences','Requests','Travel','Health','Work','Comparison'], grammar:[['〜たことがある','Verb た + ことがある','Nói về trải nghiệm.'],['〜ながら','Verb stem + ながら','Hai hành động diễn ra đồng thời.'],['〜なければならない','Negative stem + なければならない','Diễn tả nghĩa vụ.'],['〜そうです','Stem + そうです','Suy đoán dựa trên dấu hiệu.']] },
    N3: { themes:['News','Workplace','Education','Relationships','Services','Opinions','Problem solving'], grammar:[['〜ようにする','Verb + ようにする','Cố gắng tạo thành thói quen.'],['〜ことになっている','Clause + ことになっている','Quy định hoặc lịch đã được quyết định.'],['〜わけではない','Clause + わけではない','Phủ định một cách hiểu quá rộng.'],['〜ために','Noun / Verb + ために','Mục đích hoặc nguyên nhân.']] },
    N2: { themes:['Professional communication','Social issues','Media','Culture','Research','Negotiation','Debate'], grammar:[['〜に違いない','Clause + に違いない','Suy đoán với độ chắc chắn cao.'],['〜にもかかわらず','Clause + にもかかわらず','Nhượng bộ trang trọng.'],['〜ことから','Clause + ことから','Suy ra nguyên nhân hoặc căn cứ.'],['〜に基づいて','Noun + に基づいて','Dựa trên dữ liệu/căn cứ.']] },
    N1: { themes:['Abstract analysis','Policy','Literature','Academic argument','Ethics','Corporate strategy','Nuance'], grammar:[['〜を踏まえて','Noun + を踏まえて','Xem xét dựa trên bối cảnh/căn cứ.'],['〜に至るまで','Noun + に至るまで','Nhấn mạnh phạm vi kéo dài đến cả trường hợp cuối.'],['〜を余儀なくされる','Noun + を余儀なくされる','Bị buộc phải làm do hoàn cảnh.'],['〜とはいえ','Clause + とはいえ','Nhượng bộ rồi điều chỉnh nhận định.']] },
  },
  korean: {
    'TOPIK 1': { themes:['Greetings','Family','Numbers','Daily routine','Food','Places','Basic requests'], grammar:[['이에요/예요','Noun + 이에요/예요','Nói “là” ở mức lịch sự thân thiện.'],['은/는','Noun + 은/는','Đánh dấu chủ đề.'],['을/를','Noun + 을/를','Đánh dấu tân ngữ.'],['아요/어요','Verb stem + 아요/어요','Hiện tại lịch sự thông dụng.']] },
    'TOPIK 2': { themes:['Plans','Shopping','Transport','Weather','Health','Invitations','Experiences'], grammar:[['-(으)ㄹ 거예요','Stem + (으)ㄹ 거예요','Kế hoạch hoặc dự đoán tương lai.'],['-아/어서','Stem + 아/어서','Nối nguyên nhân hoặc chuỗi hành động.'],['-고 싶어요','Stem + 고 싶어요','Diễn tả mong muốn.'],['-(으)ㄹ 수 있어요','Stem + (으)ㄹ 수 있어요','Diễn tả khả năng.']] },
    'TOPIK 3': { themes:['Work','Education','Relationships','Services','Travel','Opinions','Problem solving'], grammar:[['-(으)면서','Stem + (으)면서','Hai hành động đồng thời.'],['-기 때문에','Stem + 기 때문에','Nguyên nhân rõ ràng.'],['-(으)ㄴ 적이 있다','Stem + (으)ㄴ 적이 있다','Nói trải nghiệm.'],['-아/어야 하다','Stem + 아/어야 하다','Nghĩa vụ.']] },
    'TOPIK 4': { themes:['Media','Culture','Environment','Career','Technology','Public issues','Debate'], grammar:[['-는 반면에','Clause + 는 반면에','Đối chiếu hai mặt.'],['-(으)ㄹ 뿐만 아니라','Clause + (으)ㄹ 뿐만 아니라','Không chỉ A mà còn B.'],['-도록','Stem + 도록','Mục tiêu hoặc mức độ.'],['-다고 볼 수 있다','Clause + 다고 볼 수 있다','Đưa ra nhận định có dè dặt.']] },
    'TOPIK 5': { themes:['Academic study','Professional writing','Economy','Social issues','Research','Argument','Negotiation'], grammar:[['-는 데 비해','Clause + 는 데 비해','So sánh tương phản có tính phân tích.'],['-(으)므로','Stem + (으)므로','Nguyên nhân trang trọng trong văn viết.'],['-기 마련이다','Stem + 기 마련이다','Khái quát xu hướng thường xảy ra.'],['-는 것으로 나타나다','Clause + 는 것으로 나타나다','Tường thuật kết quả khảo sát/nghiên cứu.']] },
    'TOPIK 6': { themes:['Abstract argument','Policy','Ethics','Literature','Research','Corporate strategy','Nuance'], grammar:[['-기에 망정이지','Clause + 기에 망정이지','Nhấn mạnh nhờ một điều kiện mà tránh kết quả xấu.'],['-고도 남다','Stem + 고도 남다','Nhấn mạnh mức độ hơn cả đủ.'],['-는 셈이다','Clause + 는 셈이다','Kết luận theo nghĩa “coi như”.'],['-을/를 막론하고','Noun + 을/를 막론하고','Bất kể đối tượng/phạm vi.']] },
  },
}

const localizeLevelGrammar = (languageId, levelName, source, lessonNumber) => {
  const profile = levelCurriculum[languageId]?.[levelName]
  if (!profile?.grammar?.length) return source.grammar
  const [name,structure,explanation] = profile.grammar[(lessonNumber - 1) % profile.grammar.length]
  return { name, structure, explanation, examples: [structure, `${name}: ${explanation}`], mistake: `Tập trung dùng đúng cấu trúc ${structure} trong ngữ cảnh ${profile.themes[(lessonNumber - 1) % profile.themes.length]}.`, referenceOnly:true }
}

const contextualTarget = (languageId, levelName, words, topic, lessonNumber, fallback) => {
  const profile = levelCurriculum[languageId]?.[levelName]
  if (!profile) return fallback
  const theme = profile.themes[(lessonNumber - 1) % profile.themes.length] || topic
  const vocabulary = words.map((word)=>word[0]).filter(Boolean).slice(0,2).join(' / ')
  return languageId === 'chinese' ? `围绕“${theme}”表达一个完整观点，并尽量使用 ${vocabulary}。` : languageId === 'japanese' ? `「${theme}」について、${vocabulary}を使いながら自分の考えを一文で述べてください。` : `“${theme}”에 대해 ${vocabulary}를 활용해서 자신의 생각을 한 문장으로 말해 보세요.`
}


const nonEnglishReading = (languageId, words, lessonNumber) => {
  const [a,b,c] = words
  const examples = words.map((word) => word?.[4]).filter(Boolean)
  const first = a?.[4] && String(a[4]).includes(a[0]) ? a[4] : `${a[0]}。 ${a?.[4] || ''}`.trim()
  const text = [first, ...examples.filter((example) => example !== a?.[4])].filter(Boolean).join(' ')
  if (languageId === 'chinese') return {
    title:`短文 · ${lessonNumber}`,
    text,
    question:'哪一个词出现在第一句话里？', options:[a[0],b[0],c[0]], answer:0, type:'Multiple Choice',
  }
  if (languageId === 'japanese') return {
    title:`短文 · ${lessonNumber}`,
    text,
    question:'最初の文に出てくる語はどれですか。', options:[a[0],b[0],c[0]], answer:0, type:'Multiple Choice',
  }
  return {
    title:`짧은 글 · ${lessonNumber}`,
    text,
    question:'첫 문장에 나오는 단어는 무엇입니까?', options:[a[0],b[0],c[0]], answer:0, type:'Multiple Choice',
  }
}

const nonEnglishListeningText = (languageId, words) => {
  const [firstWord] = words
  const examples = words.map((word) => word?.[4]).filter(Boolean)
  const lead = firstWord?.[4] && String(firstWord[4]).includes(firstWord[0])
    ? firstWord[4]
    : `${firstWord?.[0] || ''}。 ${firstWord?.[4] || ''}`.trim()
  return [lead, ...examples.filter((example) => example !== firstWord?.[4]).slice(0, 1)].filter(Boolean).join(' ') || words.map((word) => word[0]).join(' ')
}

const makeVocabularyListening = (languageId, words, lessonNumber) => {
  const type = listeningTypes[(lessonNumber - 1) % listeningTypes.length]
  const audio = nonEnglishListeningText(languageId, words, lessonNumber)
  const [a,b,c] = words
  if (type === 'Dictation') return { type, audio:a[0], prompt:'Nghe và chép lại chính xác từ bạn nghe.', expected:a[0], explanation:`Đáp án: “${a[0]}”.` }
  if (type === 'Fill in the Blank') return { type, audio:`${a[0]} ${b[0]}`, prompt:'Nghe hai từ và nhập từ thứ hai.', expected:b[0], explanation:`Từ thứ hai là “${b[0]}”.` }
  if (type === 'Listen & Answer') return { type, audio:a[0], prompt:'Từ vừa nghe có nghĩa là gì?', options:meaningOptions(words), answer:0, explanation:`${a[0]}: ${a[3]}.` }
  if (type === 'Conversation Listening') return { type, audio, prompt:'Từ nào được giới thiệu là từ trọng tâm?', options:[a[0],b[0],c[0]], answer:0, explanation:`Đoạn nghe nói rõ từ trọng tâm là “${a[0]}”.` }
  return { type:'Listen & Choose', audio:a[0], prompt:'Bạn vừa nghe từ nào?', options:[a[0],b[0],c[0]], answer:0, explanation:`Bạn vừa nghe “${a[0]}”.` }
}

const generatedEnglishListening = (meta, topic, words, lessonNumber) => {
  const base = meta.listening[(lessonNumber - 1) % meta.listening.length]
  const examples = words.map((word) => word?.[4]).filter(Boolean)
  const variants = [
    `${base} ${examples[0] || ''}`,
    `${examples[0] || base} ${examples[1] || ''}`,
    `${base} ${examples[1] || examples[0] || ''}`,
    `${examples[1] || base} ${examples[2] || ''}`,
  ]
  return variants[(lessonNumber - 1) % variants.length].replace(/\s+/g,' ').trim()
}

const generatedEnglishReading = (meta, topic, words, lessonNumber) => {
  const labels = words.map((word) => word?.[0]).filter(Boolean)
  const focusIndex = (lessonNumber - 1) % labels.length
  const focus = labels[focusIndex]
  const examples = words.map((word) => word?.[4]).filter(Boolean)
  const baseText = [meta.reading?.text, ...examples].filter(Boolean).join(' ')
  const text = baseText.toLocaleLowerCase().includes(String(focus).toLocaleLowerCase()) ? baseText : `${baseText} ${focus}.`.trim()
  return {
    title:`${topic} · Reading ${lessonNumber}`,
    text,
    question:'Which lesson word appears in this passage?',
    options:[focus, ...labels.filter((item) => item !== focus)],
    answer:0,
    type:'Reading Comprehension',
  }
}

const distributeLessonCounts = (unitCount, total = TARGET_LESSONS_PER_LEVEL) => {
  const base = Math.floor(total / unitCount)
  const remainder = total % unitCount
  return Array.from({ length:unitCount }, (_, index) => base + (index < remainder ? 1 : 0))
}

const expandLessonWord = (row = []) => row.length <= 2
  ? [row[0] || '', '', '', row[1] || '', '', '']
  : row

const vocabularyRows = (languageId, levelName, fallback = []) => {
  const rows = lessonPools?.[languageId]?.[levelName] || []
  return rows.length >= 3 ? rows.map(expandLessonWord) : fallback
}

const sliceVocabulary = (pool, start, count = 3) => Array.from({ length:count }, (_, offset) => pool[(start + offset) % pool.length])
const uniqueOptionValues = (correct, candidates = [], fallbackPrefix = 'Lựa chọn') => {
  const normalized = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim()
  const result = [correct]
  for (const candidate of candidates) {
    if (!candidate || result.some((item) => normalized(item) === normalized(candidate))) continue
    result.push(candidate)
  }
  let suffix = 1
  while (result.length < 3) {
    const fallback = `${fallbackPrefix} ${suffix++}`
    if (!result.some((item) => normalized(item) === normalized(fallback))) result.push(fallback)
  }
  return result.slice(0,3)
}

const meaningOptions = (words) => uniqueOptionValues(
  words[0]?.[3] || '',
  words.slice(1).map((word) => word?.[3] === words[0]?.[3] ? `${word?.[3]} · ${word?.[0]}` : word?.[3]),
  'Nghĩa khác',
)

export function getRoadmap(languageId, levelName) {
  const language = getLanguage(languageId)
  if (!language) return []
  const levelMeta = getLevelMeta(languageId, levelName)
  if (levelMeta) {
    const counts = distributeLessonCounts(levelMeta.topics.length)
    let lessonOffset = 0
    return levelMeta.topics.map((title, unitIndex) => {
      const lessons = makeEnglishLessons(levelName, unitIndex, title, levelMeta, counts[unitIndex], lessonOffset)
      lessonOffset += counts[unitIndex]
      return { unit:unitIndex + 1,title,lessons }
    })
  }

  const firstLevel = language.levels[0][0]
  const unitTitles = levelName === firstLevel ? ['Khởi đầu tự tin', ...genericUnits.slice(1)] : genericUnits
  return unitTitles.map((title, unitIndex) => ({
    unit:unitIndex + 1,
    title,
    lessons:makePracticeLessons(languageId, levelName, unitIndex, unitIndex * 6, title, levelName === firstLevel),
  }))
}
function makeEnglishLessons(levelName, unitIndex, topic, meta, lessonCount, lessonOffset) {
  const levelIndex = getLanguage('english').levels.findIndex(([name]) => name === levelName)
  const vocabPool = vocabularyRows('english',levelName,meta.vocabulary)
  return Array.from({ length:lessonCount }, (_, variant) => {
    const lessonNumber = lessonOffset + variant + 1
    const words = sliceVocabulary(vocabPool,(lessonNumber - 1) * 3,3)
    const grammarData = meta.grammar[(unitIndex + variant) % meta.grammar.length]
    const grammar = {
      name: grammarData[0], structure: grammarData[1], explanation: grammarData[2], examples: grammarData[3], mistake: grammarData[4],
    }
    const listen = generatedEnglishListening(meta, topic, words, lessonNumber)
    const targetBase = meta.targets[(unitIndex + variant) % meta.targets.length]
    const target = words.find((word) => word?.[4])?.[4] || targetBase
    const reading = generatedEnglishReading(meta, topic, words, lessonNumber)
    const focus = lessonFocuses[variant % lessonFocuses.length]
    const round = Math.floor(variant / lessonFocuses.length)
    const titleSuffix = round ? `${focus} · Practice ${round + 1}` : focus
    const writingVariant = variant % 3
    return {
      id: `english-${levelSlug(levelName)}-${unitIndex + 1}-${variant + 1}`,
      number: lessonNumber,
      title: `${topic}: ${titleSuffix}`,
      nativeTitle: focus === 'Review & Challenge' ? 'Practice & Review' : `${meta.name} · ${topic}`,
      icon: focus === 'Review & Challenge' ? '✦' : ['◌','◇','🎧','△','✎'][variant % 5],
      topic,
      level: levelName,
      vocab: words,
      grammar,
      listen,
      listening: makeListening(listen, words, topic, lessonNumber),
      target,
      reading,
      writing: makeWriting(levelIndex, writingVariant, words, target, topic),
      quiz: makeQuiz(grammar, words, listen, target, lessonNumber),
      duration: 22 + (lessonNumber % 4) * 4,
      objectives: [
        `Sử dụng chính xác ${words.map((word) => word[0]).join(', ')} trong ngữ cảnh “${topic}”.`,
        `Nhận diện và vận dụng cấu trúc ${grammar.structure}.`,
        'Nghe lấy ý chính, phản hồi bằng lời nói và viết một đoạn có tổ chức.',
      ],
      detailedExplanation: `Chủ đề: ${topic} · Ngữ pháp: ${grammar.name} · Từ trọng tâm: ${words.map((word) => word[0]).join(', ')}.`,
      dialogue: {
        lines: [
          ['A', `Have you had a chance to think about ${topic.toLowerCase()}?`],
          ['B', `Yes. ${target}`],
          ['A', 'That is a useful example. Could you explain it in more detail?'],
          ['B', `Certainly. I will use ${words[0][0]} and ${words[1][0]} to make my point clear.`],
        ],
        translation: `Hai người đang trao đổi về ${topic}. Người nói B đưa ra ví dụ và hứa giải thích rõ hơn bằng từ vựng trọng tâm của bài.`,
      },
      extraReading: `A practical way to master ${topic.toLowerCase()} is to notice how speakers connect an idea with evidence. Read the text once for the main message, then a second time to identify the grammar pattern. Finally, summarize the passage without copying its exact wording.`,
      practice: {
        fill: { prompt: `Viết từ phù hợp với nghĩa “${words[0][3]}”.`, answer: words[0][0] },
        reorder: { tokens: target.replace(/[.!?]/g, '').split(/\s+/).sort((a, b) => a.localeCompare(b)), answer: target },
        translation: { prompt: `Viết lại câu mục tiêu của bài và giữ đúng ý chính.`, answer: target },
      },
    }
  })
}
function makeListening(audio, words, topic, lessonNumber) {
  const type = listeningTypes[(lessonNumber - 1) % listeningTypes.length]
  if (type === 'Dictation') return { type, audio, prompt: 'Nghe và chép lại chính xác câu bạn nghe được.', expected: audio, explanation: `Câu hoàn chỉnh: “${audio}”` }
  if (type === 'Fill in the Blank') {
    const expected = words.find((word) => word[4] && new RegExp(`\\b${word[0]}\\b`, 'i').test(word[4]))
    if (expected) return { type, audio: expected[4], prompt: expected[4].replace(new RegExp(expected[0], 'i'), '_____'), expected: expected[0], explanation: `Từ còn thiếu là “${expected[0]}”.` }
    const focus = words[0]
    return { type, audio:`${audio} ${focus[0]}.`, prompt:'Nghe và nhập từ trọng tâm ở cuối đoạn.', expected:focus[0], explanation:`Từ trọng tâm là “${focus[0]}” (${focus[3]}).` }
  }
  return {
    type,
    audio,
    prompt: type === 'Conversation Listening' ? 'Người nói đang tập trung vào chủ đề nào?' : type === 'Listen & Answer' ? 'Ý chính của câu vừa nghe là gì?' : 'Chọn chủ đề phù hợp nhất với câu bạn nghe.',
    options: [topic, words[0][3], words[1][3]],
    answer: 0,
    explanation: `Câu bạn vừa nghe: “${audio}”`,
  }
}

function makeWriting(levelIndex, variant, words, target, topic) {
  if (levelIndex <= 1 && variant === 0) return { type: 'Reorder Sentence', prompt: 'Sắp xếp các từ để tạo thành câu đúng.', expected: target, tokens: target.replace(/[.!?]/g, '').split(/\s+/).sort((a, b) => a.localeCompare(b)), keywords: words.slice(0, 2).map((word) => word[0]), minWords: 3 }
  if (levelIndex <= 1 && variant === 1) return { type: 'Fill Missing Word', prompt: `Viết từ phù hợp với nghĩa “${words[0][3]}”.`, expected: words[0][0], keywords: [words[0][0]], minWords: 1 }
  if (levelIndex <= 1) return { type: 'Write Simple Sentence', prompt: `Viết 3–5 câu đơn giản về “${topic}”.`, keywords: words.slice(0, 2).map((word) => word[0]), minWords: levelIndex === 0 ? 8 : 15, maxWords: 50 }
  if (levelIndex <= 3) return { type: ['Email', 'Story', 'Opinion'][variant], prompt: `${['Viết một email', 'Kể một câu chuyện', 'Trình bày ý kiến'][variant]} về “${topic}”.`, keywords: words.slice(0, 2).map((word) => word[0]), minWords: levelIndex === 2 ? 50 : 80, maxWords: 120 }
  return { type: ['Argumentative Writing', 'Formal Writing', 'Academic-style Writing'][variant], prompt: `Viết ${variant === 0 ? 'một bài luận lập luận' : variant === 1 ? 'một văn bản trang trọng' : 'một bản phân tích học thuật'} về “${topic}”.`, keywords: words.slice(0, 2).map((word) => word[0]), minWords: levelIndex === 4 ? 120 : 150, maxWords: levelIndex === 4 ? 220 : 260, requiredIdeas: ['Nêu luận điểm chính', 'Đưa ra bằng chứng hoặc ví dụ', 'Kết luận rõ ràng'] }
}

function makeQuiz(grammar, words, listen, target, lessonNumber) {
  const type = quizTypes[(lessonNumber - 1) % quizTypes.length]
  const word = words[0]
  if (type === 'Fill Blank') return { type, question: `Viết từ phù hợp với nghĩa “${word[3]}”.`, expected: word[0], explanation: `Từ phù hợp là “${word[0]}” (${word[3]}).` }
  if (type === 'Reorder Sentence') return { type, question: 'Sắp xếp thành câu hoàn chỉnh.', expected: target, tokens: target.replace(/[.!?]/g, '').split(/\s+/).sort((a, b) => a.localeCompare(b)), explanation: `Câu đúng: “${target}”` }
  if (type === 'Matching') return { type, question: 'Ghép từ với nghĩa phù hợp.', pairs: words.map((item) => [item[0], item[3]]), explanation: 'Các cặp từ và nghĩa được lấy từ phần từ vựng của bài.' }
  if (type === 'True False') return { type, question: `“${word[0]}” có nghĩa là “${word[3]}”.`, options: ['True', 'False'], answer: 0, explanation: `${word[0]}: ${word[3]}.` }
  if (type === 'Grammar Quiz') return { type, question: `Cấu trúc nào là trọng tâm của “${grammar.name}”?`, options: uniqueOptionValues(grammar.structure, [target, words[0][0]], 'Cấu trúc khác'), answer: 0, explanation: `${grammar.name}: ${grammar.structure}. ${grammar.explanation}` }
  if (type === 'Listening Quiz') return { type, audio: listen, question: 'Chọn chính xác câu bạn vừa nghe.', options: uniqueOptionValues(listen, [target, `${words[0][0]} — ${words[0][3]}`], 'Câu khác'), answer: 0, explanation: `Câu đúng là: “${listen}”` }
  return { type, question: `“${word[0]}” gần nghĩa nhất với đáp án nào?`, options: meaningOptions(words), answer: 0, explanation: `${word[0]} (${word[2]}) có nghĩa là “${word[3]}”.` }
}

function makePracticeLessons(languageId, levelName, unitIndex, lessonOffset, topic, keepStarterCore = false) {
  const levelIndex = getLanguage(languageId).levels.findIndex(([name]) => name === levelName)
  const vocabPool = vocabularyRows(languageId,levelName,packs[languageId].flatMap((item) => item.vocab))
  return Array.from({ length:6 }, (_, index) => {
    const source = packs[languageId][(unitIndex + index) % packs[languageId].length]
    const lessonNumber = lessonOffset + index + 1
    const words = sliceVocabulary(vocabPool,(lessonNumber - 1) * 3,3)
    const focus = lessonFocuses[index]
    const profile = levelCurriculum[languageId]?.[levelName]
    const lessonTheme = profile?.themes?.[(lessonNumber - 1) % profile.themes.length] || topic
    const grammar = localizeLevelGrammar(languageId, levelName, source, lessonNumber)
    const listen = nonEnglishListeningText(languageId, words, lessonNumber)
    const target = words.find((word) => word?.[4])?.[4] || contextualTarget(languageId, levelName, words, lessonTheme, lessonNumber, source.target)
    const reading = nonEnglishReading(languageId, words, lessonNumber)
    const writing = levelIndex >= 4
      ? { type:'Extended Writing', prompt:`Viết khoảng 120–150 từ về “${lessonTheme}”, cố gắng dùng ${words[0][0]} và ${words[1][0]}.`, keywords:words.slice(0,2).map((word) => word[0]), minWords:120, maxWords:180 }
      : levelIndex >= 2
        ? { type:'Guided Writing', prompt:`Viết 5–7 câu về “${lessonTheme}” và dùng ít nhất hai từ mới của bài.`, keywords:words.slice(0,2).map((word) => word[0]), minWords:35, maxWords:100 }
        : { ...source.writing, type:source.writing.type || 'Guided Writing', keywords:words.slice(0,2).map((word) => word[0]) }
    const quiz = makeQuiz(grammar, words, listen, target, lessonNumber)

    return {
      ...source,
      id:`${languageId}-${levelSlug(levelName)}-${unitIndex + 1}-${index + 1}`,
      number:lessonNumber,
      title:`${lessonTheme}: ${focus}`,
      nativeTitle:`${focus} · ${source.nativeTitle}`,
      icon:focus === 'Review & Challenge' ? '✦' : source.icon,
      topic:lessonTheme,
      level:levelName,
      vocab:words,
      grammar,
      listen,
      target,
      listening:makeVocabularyListening(languageId,words,lessonNumber),
      reading,
      writing,
      quiz,
      duration:20 + (index % 3) * 5,
      objectives:[
        `Ghi nhớ và dùng được ${words.map((word) => word[0]).join(', ')}.`,
        `Vận dụng ${grammar.name} trong ngữ cảnh ${lessonTheme}.`,
        'Hoàn thành hoạt động nghe, đọc, viết và bài kiểm tra cuối bài.',
      ],
      detailedExplanation:`${levelName} · ${lessonTheme} · ${grammar.name} · ${words.map((word) => word[0]).join(', ')}.`,
    }
  })
}
export function getLesson(languageId, levelName, lessonId) {
  return getRoadmap(languageId, levelName).flatMap((unit) => unit.lessons).find((lesson) => lesson.id === lessonId)
}

export function getStarterLessons(languageId) { return packs[languageId] || [] }
