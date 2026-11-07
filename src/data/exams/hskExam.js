import { isCorrectAnswer, hasAnswer } from '../../components/common/QuizQuestion'

export const HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6']

const hskListeningCore = [
  {
    part: 1,
    type: '听对话选择答案 · Nghe câu ngắn',
    audio: '女：请问，去北京大学的地铁站在哪儿？男：一直往前走，在超市旁边。',
    question: '地铁站在什么地方？ (Ga tàu điện ngầm ở đâu?)',
    options: ['超市旁边 (Cạnh siêu thị)', '医院后面 (Sau bệnh viện)', '学校里面 (Trong trường học)', '银行对面 (Đối diện ngân hàng)'],
    answer: 0,
    explanation: 'Trong đoạn hội thoại: “一直往前走，在超市旁边” (Đi thẳng về phía trước, ở ngay cạnh siêu thị). Đáp án chuẩn là A.',
  },
  {
    part: 1,
    type: '听对话选择答案 · Nghe câu ngắn',
    audio: '男：今天天气真冷，你穿得太少了。女：没关系，办公室里有空调。',
    question: '今天的天气怎么样？ (Thời tiết hôm nay thế nào?)',
    options: ['非常热 (Rất nóng)', '很冷 (Rất lạnh)', '下大雨 (Mưa to)', '刮大风 (Gió lớn)'],
    answer: 1,
    explanation: 'Người nam nói “今天天气真冷，你穿得太少了” (Hôm nay thời tiết lạnh thật, bạn mặc ít quá). Đáp án đúng là B.',
  },
  {
    part: 1,
    type: '听对话选择答案 · Nghe câu ngắn',
    audio: '女：明天的飞机是上午九点的，我们七点出发吧。男：好，我已经叫好出租车了。',
    question: '他们明天怎么去机场？ (Ngày mai họ đi ra sân bay bằng gì?)',
    options: ['坐公共汽车 (Xe buýt)', '坐出租车 (Taxi)', '坐地铁 (Tàu điện ngầm)', '自己开车 (Tự lái xe)'],
    answer: 1,
    explanation: 'Người nam trả lời “我已经叫好出租车了” (Tôi đã đặt xong taxi rồi). Đáp án đúng là B.',
  },
  {
    part: 2,
    type: '听对话理解 · Hội thoại thực tế',
    audio: '男：王经理，这份合同您看过了吗？女：看过了，价格没问题，但是交货时间需要再提前三天。',
    question: '王经理对合同有什么意见？ (Giám đốc Vương có ý kiến gì về hợp đồng?)',
    options: ['价格太高了 (Giá quá cao)', '希望提前三天交货 (Muốn giao hàng sớm hơn 3 ngày)', '产品质量不合格 (Chất lượng chưa đạt)', '不同意签约 (Không đồng ý ký)'],
    answer: 1,
    explanation: 'Giám đốc Vương nói: “价格没问题，但是交货时间需要再提前三天” (Giá cả không vấn đề, nhưng thời gian giao hàng cần sớm hơn 3 ngày).',
  },
  {
    part: 2,
    type: '听对话理解 · Hội thoại thực tế',
    audio: '女：你最近怎么每天都去图书馆？男：下个月要参加汉语水平考试，我想多做几套模拟题。',
    question: '男的为什么要去图书馆？ (Tại sao người nam lại đến thư viện?)',
    options: ['借历史小说 (Mượn tiểu thuyết lịch sử)', '准备汉语考试 (Chuẩn bị kỳ thi HSK)', '找安静的地方睡觉 (Tìm chỗ yên tĩnh ngủ)', '帮同学找资料 (Tìm tài liệu giúp bạn)'],
    answer: 1,
    explanation: 'Người nam giải thích: “下个月要参加汉语水平考试，我想多做几套模拟题” (Tháng sau thi HSK nên muốn làm thêm đề mô phỏng).',
  },
  {
    part: 2,
    type: '听对话理解 · Hội thoại thực tế',
    audio: '男：服务员，这道鱼做得有点儿咸，能给我们换一盘清淡一点儿的吗？女：非常抱歉，我马上请厨房重新做。',
    question: '男的觉得这道菜怎么样？ (Người nam thấy món cá thế nào?)',
    options: ['太甜了 (Quá ngọt)', '太辣了 (Quá cay)', '有点儿咸 (Hơi mặn)', '还没熟 (Chưa chín)'],
    answer: 2,
    explanation: 'Từ khóa “这道鱼做得有点儿咸” (Món cá này làm hơi mặn, đổi đĩa thanh đạm hơn).',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '男：没想到你汉语说得这么流利，在中国住了好几年了吧？女：其实我刚来上海八个月，不过我在大学里学了三年中文。',
    question: '女的来上海多长时间了？ (Người nữ đã đến Thượng Hải bao lâu?)',
    options: ['三年 (3 năm)', '八个月 (8 tháng)', '半年 (Nửa năm)', '两年半 (2 năm rưỡi)'],
    answer: 1,
    explanation: 'Bẫy thường gặp trong HSK: “学了三年中文” (học tiếng Trung 3 năm), nhưng “刚来上海八个月” (mới đến Thượng Hải 8 tháng). Câu hỏi hỏi thời gian đến Thượng Hải nên chọn B.',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '女：这次去云南旅游，除了丽江，你还打算去哪儿？男：如果时间来得及，我想去大理住两天，听说那儿的洱海特别美。',
    question: '男的还想去哪里旅游？ (Người nam còn muốn đi du lịch ở đâu?)',
    options: ['北京 (Bắc Kinh)', '大理 (Đại Lý)', '西安 (Tây An)', '成都 (Thành Đô)'],
    answer: 1,
    explanation: 'Người nam nói: “如果时间来得及，我想去大理住两天” (Nếu kịp thời gian thì muốn đến Đại Lý ở 2 ngày).',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '许多人在制定计划时总是写得非常完美，但真正坚持下来的人却不多。其实，每天进步一点点，比一下子定太高的目标更有效。',
    question: '这段话主要想告诉我们什么？ (Đoạn văn muốn nhắn nhủ điều gì?)',
    options: ['不要制定任何计划 (Đừng lập kế hoạch)', '坚持每天进步更重要 (Kiên trì tiến bộ mỗi ngày quan trọng hơn)', '目标定得越高越好 (Mục tiêu càng cao càng tốt)', '计划比行动更重要 (Kế hoạch quan trọng hơn hành động)'],
    answer: 1,
    explanation: 'Câu chủ đề cuối đoạn: “每天进步一点点，比一下子定太高的目标更有效” (Mỗi ngày tiến bộ một chút hiệu quả hơn đặt mục tiêu quá cao).',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '男：小李，下午三点的客户会议改到明天上午十点了，请通知一下市场部的同事。女：好的，我现在就发群消息。',
    question: '会议改到什么时候了？ (Cuộc họp được dời sang lúc nào?)',
    options: ['今天下午三点 (3h chiều nay)', '明天上午十点 (10h sáng mai)', '明天下午两点 (2h chiều mai)', '后天上午九点 (9h sáng ngày kia)'],
    answer: 1,
    explanation: 'Trong thông báo: “下午三点的客户会议改到明天上午十点了” (Họp khách hàng 3h chiều dời sang 10h sáng mai).',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '女：这件白色衬衫打完折多少钱？男：原价三百元，今天店庆打八折，只要两百四十元。',
    question: '这件衬衫现在卖多少钱？ (Chiếc áo sơ mi này hiện bán giá bao nhiêu?)',
    options: ['300元', '240元', '180元', '260元'],
    answer: 1,
    explanation: 'Trong tiếng Trung “打八折” nghĩa là tính 80% giá gốc (giảm 20%): 300 × 0.8 = 240元.',
  },
  {
    part: 3,
    type: '听长对话与短文 · Nghe đoạn văn',
    audio: '科学研究表明，保证每天七到八个小时的睡眠，不仅能提高记忆力，还能让人的情绪更加稳定。',
    question: '充足的睡眠有什么好处？ (Ngủ đủ giấc mang lại lợi ích gì?)',
    options: ['减轻体重 (Giảm cân)', '提高记忆力并稳定情绪 (Tăng trí nhớ & ổn định cảm xúc)', '治好所有感冒 (Chữa khỏi mọi bệnh cảm)', '不需要运动 (Không cần tập thể dục)'],
    answer: 1,
    explanation: 'Trong bài nghe: “不仅能提高记忆力，还能让人的情绪更加稳定” (Không những tăng trí nhớ mà còn giúp cảm xúc ổn định hơn).',
  },
]

const hskReadingCore = [
  {
    part: 1,
    type: '选词填空 · Chọn từ điền câu',
    question: '虽然工作很忙，他还是（   ）每天锻炼半个小时身体。',
    options: ['坚持 (jiānchí - kiên trì)', '怀疑 (huáiyí - nghi ngờ)', '原谅 (yuánliàng - tha thứ)', '放弃 (fàngqì - từ bỏ)'],
    answer: 0,
    explanation: 'Cấu trúc “虽然……还是坚持……” (Mặc dù công việc rất bận, anh ấy vẫn kiên trì tập thể dục nửa tiếng mỗi ngày).',
  },
  {
    part: 1,
    type: '选词填空 · Chọn từ điền câu',
    question: '在做决定之前，我们应该先（   ）一下可能出现的问题。',
    options: ['考虑 (kǎolǜ - cân nhắc)', '参观 (cānguān - tham quan)', '演出 (yǎnchū - biểu diễn)', '理发 (lǐfà - cắt tóc)'],
    answer: 0,
    explanation: '“考虑一下可能出现的问题” nghĩa là suy xét/cân nhắc những vấn đề có thể phát sinh trước khi đưa ra quyết định.',
  },
  {
    part: 1,
    type: '选词填空 · Chọn từ điền câu',
    question: '这家餐厅的菜（   ）好吃，而且价格也很公道。',
    options: ['不仅 (bùjǐn - không những)', '尽管 (jǐnguǎn - cho dù)', '既然 (jìrán - đã là)', '哪怕 (nǎpà - dù cho)'],
    answer: 0,
    explanation: 'Cặp liên từ递进 (tăng tiến) chuẩn HSK: “不仅……而且……” (Không những ngon mà giá cả còn rất phải chăng).',
  },
  {
    part: 1,
    type: '选词填空 · Chọn từ điền câu',
    question: '由于下大雪，高速公路暂时封闭，所有航班也（   ）推迟了。',
    options: ['不得不 (bùdébù - đành phải)', '来得及 (láidejí - kịp lúc)', '怪不得 (guàibudé - thảo nào)', '不见得 (bùjiàndé - chưa chắc)'],
    answer: 0,
    explanation: '“不得不” (bất đắc dĩ phải / đành phải) dùng khi do nguyên nhân khách quan (tuyết lớn) khiến chuyến bay phải hoãn.',
  },
  {
    part: 2,
    type: '排列顺序 · Sắp xếp thứ tự câu',
    question: 'Sắp xếp 3 mệnh đề A, B, C thành câu hoàn chỉnh theo chuẩn HSK Reading Part 2:\nA. 才能真正理解当地的文化\nB. 只有亲自去那个城市生活一段时间\nC. 你只看书本上的介绍是不够的',
    options: ['C - B - A', 'B - C - A', 'A - B - C', 'C - A - B'],
    answer: 0,
    explanation: 'Đầu tiên nêu nhận định C (Chỉ đọc sách là chưa đủ), sau đó dùng cấu trúc điều kiện cần “只有……才……” (B: Chỉ có tự mình sống ở thành phố đó một thời gian -> A: mới có thể thực sự hiểu văn hóa bản địa). Thứ tự chuẩn: C - B - A.',
  },
  {
    part: 2,
    type: '排列顺序 · Sắp xếp thứ tự câu',
    question: 'Sắp xếp 3 mệnh đề A, B, C thành đoạn văn mạch lạc:\nA. 因此受到了很多年轻人的欢迎\nB. 这种新型电子词典既轻便又实用\nC. 还可以随时连接网络更新词库',
    options: ['B - C - A', 'A - B - C', 'C - A - B', 'B - A - C'],
    answer: 0,
    explanation: 'B giới thiệu chủ thể (“既轻便又实用”), C bổ sung tính năng (“还可以……”), và A nêu kết quả (“因此受到了……欢迎”). Thứ tự chuẩn: B - C - A.',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 习惯与效率',
    passage: '很多人觉得时间不够用，其实问题往往不在于事情太多，而在于没有分清轻重缓急。每天早上花五分钟把当天最重要的三件事列出来，优先完成核心任务，你的工作效率会提高很多。',
    question: '根据这段话，提高工作效率的关键是什么？ (Theo đoạn văn, chìa khóa nâng cao hiệu suất làm việc là gì?)',
    options: [
      '分清轻重缓急，优先完成重要任务 (Phân rõ việc chính phụ, ưu tiên việc quan trọng)',
      '每天工作十四个小时以上 (Làm việc hơn 14 tiếng mỗi ngày)',
      '同时处理五六件不同的事情 (Làm 5-6 việc cùng lúc)',
      '把所有工作都留到晚上做 (Để mọi việc tới tối mới làm)',
    ],
    answer: 0,
    explanation: 'Đoạn văn nêu rõ: “问题往往不在于事情太多，而在于没有分清轻重缓急……优先完成核心任务” (Phân biệt mức độ quan trọng và ưu tiên hoàn thành nhiệm vụ cốt lõi).',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 茶文化',
    passage: '在中国，喝茶不仅是一种解渴的方式，更是一种社交礼仪。当客人来到家里时，主人通常会先泡上一杯热茶，表示尊重和欢迎。不同季节人们喜欢的茶也不一样，比如夏天爱喝绿茶，冬天则偏爱红茶或普洱茶。',
    question: '中国人冬天更喜欢喝什么茶？ (Người Trung Quốc vào mùa đông thường thích uống trà gì hơn?)',
    options: ['绿茶 (Trà xanh)', '红茶或普洱茶 (Hồng trà hoặc trà Phổ Nhĩ)', '冰镇果茶 (Trà hoa quả ướp lạnh)', '只喝白开水 (Chỉ uống nước lọc)'],
    answer: 1,
    explanation: 'Câu cuối đoạn văn: “夏天爱喝绿茶，冬天则偏爱红茶或普洱茶” (Mùa hè thích trà xanh, mùa đông chuộng hồng trà hoặc trà Phổ Nhĩ).',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 城市共享单车',
    passage: '近年来，共享单车解决了许多城市居民“最后一公里”的出行难题。从地铁站出来后，人们只需用手机扫一扫二维码，就能骑车回家，既环保又能锻炼身体。',
    question: '关于共享单车，下列哪项是正确的？ (Điều nào sau đây đúng về xe đạp công cộng?)',
    options: [
      '必须用现金买票才能骑 (Phải dùng tiền mặt mua vé)',
      '用手机扫码即可使用，既环保又方便 (Quét mã QR bằng điện thoại, vừa bảo vệ môi trường vừa tiện lợi)',
      '只能在公园内部骑行 (Chỉ được đi trong công viên)',
      '速度比地铁还要快 (Tốc độ nhanh hơn tàu điện ngầm)',
    ],
    answer: 1,
    explanation: 'Đoạn văn viết: “只需用手机扫一扫二维码，就能骑车回家，既环保又能锻炼身体”.',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 沟通的艺术',
    passage: '真正的沟通不只是表达自己的观点，更重要的是学会倾听。如果只顾着说服对方，而不去理解别人的想法，讨论很容易变成争吵。耐心听完对方的话，往往能找到双方都满意的办法。',
    question: '作者认为真正沟通的重点是什么？ (Tác giả cho rằng trọng tâm của giao tiếp thực sự là gì?)',
    options: [
      '学会耐心倾听并理解对方 (Học cách kiên nhẫn lắng nghe và thấu hiểu đối phương)',
      '声音越大越有说服力 (Nói càng to càng thuyết phục)',
      '尽量避免和别人讨论问题 (Tránh thảo luận với người khác)',
      '坚持自己的观点绝不让步 (Giữ khư khư quan điểm không nhượng bộ)',
    ],
    answer: 0,
    explanation: 'Câu đầu và câu cuối khẳng định: “更重要的是学会倾听……耐心听完对方的话，往往能找到双方都满意的办法”.',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 读书笔记',
    passage: '不少人一年读了几十本书，但过了几个月却连主要内容都记不清了。如果在阅读时顺手写下简短的读书笔记，或者用自己的话把核心观点复述出来，留下的印象会深刻得多。',
    question: '怎样才能让读书留下的印象更深刻？ (Làm thế nào để nhớ sâu nội dung sách đã đọc?)',
    options: [
      '写读书笔记并用自己的话复述核心观点 (Viết ghi chú và diễn đạt lại ý chính bằng lời của mình)',
      '只看目录不看正文 (Chỉ đọc mục lục)',
      '买最贵的精装书 (Mua sách bìa cứng đắt nhất)',
      '一口气读完十本书 (Đọc liền một mạch 10 cuốn)',
    ],
    answer: 0,
    explanation: 'Đoạn văn nêu rõ giải pháp: “顺手写下简短的读书笔记，或者用自己的话把核心观点复述出来”.',
  },
  {
    part: 3,
    type: '阅读理解 · Đọc hiểu đoạn văn',
    passageTitle: 'HSK 阅读短文 · 网购退换货',
    passage: '根据本店规定，商品签收后七天内，如保持包装完整且未经使用，可享受无理由退换货服务。生鲜食品及定制类商品除外。',
    question: '哪种商品不能享受七天无理由退货？ (Loại hàng hóa nào không được áp dụng đổi trả 7 ngày không lý do?)',
    options: ['未拆封的书包 (Balo chưa bóc tem)', '生鲜食品和定制商品 (Thực phẩm tươi sống và hàng đặt riêng)', '刚收到的尺码不合适的衣服 (Quần áo mới nhận lệch size)', '未使用的笔记本 (Sổ tay chưa dùng)'],
    answer: 1,
    explanation: 'Câu cuối thông báo: “生鲜食品及定制类商品除外” (Trừ thực phẩm tươi sống và hàng hóa đặt làm riêng).',
  },
]

const hskWritingCore = [
  {
    part: 1,
    type: '书写第一部分 · Sắp xếp từ thành câu chuẩn HSK',
    question: 'Sắp xếp các từ sau thành câu tiếng Trung đúng ngữ pháp:\n[ 把 / 放在 / 请 / 护照 / 桌子上 ]',
    options: [
      '请把护照放在桌子上。',
      '把请护照桌子上放在。',
      '请放在把桌子上护照。',
      '护照请把桌子上放在。',
    ],
    answer: 0,
    explanation: 'Cấu trúc câu chữ 把 (Bả): 请 + 把 + Tân ngữ (护照) + Động từ (放在) + Tân ngữ chỉ vị trí (桌子上)。 → “请把护照放在桌子上。”',
  },
  {
    part: 1,
    type: '书写第一部分 · Sắp xếp từ thành câu chuẩn HSK',
    question: 'Sắp xếp các từ sau thành câu tiếng Trung đúng ngữ pháp:\n[ 比 / 今年 / 去年 / 的 / 多得多 / 游客 ]',
    options: [
      '今年的游客比去年多得多。',
      '今年比去年的多得多游客。',
      '游客今年的比多得多去年。',
      '比去年今年的游客多得多。',
    ],
    answer: 0,
    explanation: 'Cấu trúc so sánh chữ 比: Chủ ngữ (今年的游客) + 比 + Đối tượng so sánh (去年) + Hình dung từ + Bổ ngữ mức độ (多得多)。',
  },
  {
    part: 1,
    type: '书写第一部分 · Sắp xếp từ thành câu chuẩn HSK',
    question: 'Sắp xếp các từ sau thành câu tiếng Trung đúng ngữ pháp:\n[ 被 / 那本词典 / 借走了 / 同事 ]',
    options: [
      '那本词典被同事借走了。',
      '同事被那本词典借走了。',
      '借走了被同事那本词典。',
      '那本词典借走了被同事。',
    ],
    answer: 0,
    explanation: 'Câu bị động chữ 被: Tân ngữ chịu tác động (那本词典 - cuốn từ điển đó) + 被 + Tác nhân (同事 - đồng nghiệp) + Động từ + Bổ ngữ kết quả (借走了 - mượn đi rồi).',
  },
  {
    part: 1,
    type: '书写第一部分 · Sắp xếp từ thành câu chuẩn HSK',
    question: 'Sắp xếp các từ sau thành câu tiếng Trung đúng ngữ pháp:\n[ 对 / 他 / 感兴趣 / 中国历史 / 非常 ]',
    options: [
      '他对中国历史非常感兴趣。',
      '他非常对中国历史感兴趣。',
      '对中国历史他感兴趣非常。',
      '中国历史对他非常感兴趣。',
    ],
    answer: 0,
    explanation: 'Cấu trúc cố định: Chủ ngữ (他) + 对 + Sự vật (中国历史) + Phó từ mức độ (非常) + 感兴趣 (có hứng thú).',
  },
  {
    part: 1,
    type: '书写第一部分 · Sắp xếp từ thành câu chuẩn HSK',
    question: 'Sắp xếp các từ sau thành câu tiếng Trung đúng ngữ pháp:\n[ 连 / 这么简单 / 都 / 的问题 / 答不出来 / 他 ]',
    options: [
      '他连这么简单的问题都答不出来。',
      '连他都这么简单的问题答不出来。',
      '这么简单的问题连都他答不出来。',
      '他都连答不出来这么简单的问题。',
    ],
    answer: 0,
    explanation: 'Cấu trúc nhấn mạnh “连……都……” (Ngay cả... cũng...): 他 + 连 + 这么简单的问题 + 都 + 答不出来。',
  },
  {
    part: 2,
    type: '书写第二部分 · Viết câu theo từ gợi ý & ngữ cảnh',
    question: 'Chọn câu hoàn chỉnh và chuẩn xác nhất sử dụng từ khóa 【 既然 】 (đã là / một khi đã):',
    options: [
      '既然你已经答应了大家，就应该按时参加活动。',
      '既然天下雨，但是我们还是去爬山了。',
      '他既然很努力，反而没有通过考试。',
      '既然明天的天气，我们就去公园吧。',
    ],
    answer: 0,
    explanation: '“既然……就……” biểu thị suy luận từ sự việc đã xác định: “Một khi bạn đã nhận lời với mọi người thì nên tham gia đúng giờ.”',
  },
  {
    part: 2,
    type: '书写第二部分 · Viết câu theo từ gợi ý & ngữ cảnh',
    question: 'Chọn câu hoàn chỉnh và chuẩn xác nhất sử dụng từ khóa 【 来不及 】 (không kịp):',
    options: [
      '现在已经八点半了，再不出发就来不及赶上火车了。',
      '今天时间很多，我们完全来不及吃早饭。',
      '因为来不及了，所以我们提前一个小时到了机场。',
      '这件事我来不及已经做完了。',
    ],
    answer: 0,
    explanation: '“来不及 + Động từ” nghĩa là không còn đủ thời gian để làm việc gì: “Bây giờ đã 8 rưỡi rồi, không xuất phát ngay sẽ không kịp chuyến tàu.”',
  },
  {
    part: 2,
    type: '书写第二部分 · Viết câu theo từ gợi ý & ngữ cảnh',
    question: 'Chọn câu hoàn chỉnh và chuẩn xác nhất sử dụng từ khóa 【 哪怕 】 (dù cho / cho dù):',
    options: [
      '哪怕遇到再大的困难，我们也不会轻易放弃。',
      '哪怕今天天气很好，所以我们去散步了。',
      '他哪怕学了三年，因此说得非常好。',
      '哪怕你喜欢这本书，我就送给你。',
    ],
    answer: 0,
    explanation: 'Cặp hô ứng nhượng bộ giả định “哪怕……也……” (Dù cho gặp khó khăn lớn đến mấy, chúng tôi cũng sẽ không dễ dàng từ bỏ).',
  },
]

export function buildHskExamSections(level = 'HSK 3') {
  const hasWriting = !['HSK 1', 'HSK 2'].includes(level)
  const listeningQuestions = hskListeningCore.map((item, idx) => ({
    ...item,
    id: `hsk-${level}-l-${idx + 1}`,
    languageId: 'chinese',
  }))
  const readingQuestions = hskReadingCore.map((item, idx) => ({
    ...item,
    id: `hsk-${level}-r-${idx + 1}`,
    languageId: 'chinese',
  }))
  const writingQuestions = hskWritingCore.map((item, idx) => ({
    ...item,
    id: `hsk-${level}-w-${idx + 1}`,
    languageId: 'chinese',
  }))

  const sections = [
    {
      id: 'listening',
      label: '听力 · Nghe hiểu',
      duration: 20 * 60,
      questions: listeningQuestions,
    },
    {
      id: 'reading',
      label: '阅读 · Đọc hiểu',
      duration: 25 * 60,
      questions: readingQuestions,
    },
  ]

  if (hasWriting) {
    sections.push({
      id: 'writing',
      label: '书写 · Viết & Sắp xếp câu',
      duration: 20 * 60,
      questions: writingQuestions,
    })
  }

  return sections
}

export function buildHskResult({ answers = {}, sections = [], elapsed = {} }, level = 'HSK 3') {
  const hasWriting = sections.some((s) => s.id === 'writing')
  const maxTotal = hasWriting ? 300 : 200
  const passMark = hasWriting ? 180 : 120

  const scoreSection = (sectionId) => {
    const sec = sections.find((s) => s.id === sectionId)
    if (!sec || !sec.questions.length) return { score: 0, correct: 0, total: 0 }
    const correct = sec.questions.filter((q) => isCorrectAnswer(q, answers[q.id])).length
    const score = Math.round((correct / sec.questions.length) * 100)
    return { score, correct, total: sec.questions.length }
  }

  const listening = scoreSection('listening')
  const reading = scoreSection('reading')
  const writing = hasWriting ? scoreSection('writing') : { score: 0, correct: 0, total: 0 }

  const totalScore = listening.score + reading.score + (hasWriting ? writing.score : 0)
  const totalQuestions = listening.total + reading.total + writing.total
  const totalCorrect = listening.correct + reading.correct + writing.correct
  const unanswered = sections.reduce(
    (sum, s) => sum + s.questions.filter((q) => !hasAnswer(answers[q.id])).length,
    0,
  )
  const timeUsed = Object.values(elapsed).reduce((sum, sec) => sum + (Number(sec) || 0), 0)
  const accuracy = Math.round((totalCorrect / Math.max(1, totalQuestions)) * 100)
  const passed = totalScore >= passMark

  return {
    exam: 'HSK',
    level,
    score: totalScore,
    maxScore: maxTotal,
    passMark,
    passed,
    listeningScore: listening.score,
    listeningCorrect: listening.correct,
    listeningTotal: listening.total,
    readingScore: reading.score,
    readingCorrect: reading.correct,
    readingTotal: reading.total,
    writingScore: writing.score,
    writingCorrect: writing.correct,
    writingTotal: writing.total,
    hasWriting,
    correct: totalCorrect,
    total: totalQuestions,
    wrong: totalQuestions - totalCorrect - unanswered,
    unanswered,
    accuracy,
    timeUsed,
  }
}

export const hskListeningPractice = hskListeningCore.map((q, idx) => ({ ...q, id: `hsk-prac-l-${idx + 1}`, languageId: 'chinese' }))
export const hskReadingWritingPractice = [...hskReadingCore, ...hskWritingCore].map((q, idx) => ({ ...q, id: `hsk-prac-rw-${idx + 1}`, languageId: 'chinese' }))
