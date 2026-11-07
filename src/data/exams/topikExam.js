import { isCorrectAnswer, hasAnswer } from '../../components/common/QuizQuestion'

export const TOPIK_LEVELS = ['TOPIK 1', 'TOPIK 2', 'TOPIK 3', 'TOPIK 4', 'TOPIK 5', 'TOPIK 6']

const topikListeningCore = [
  {
    part: 1,
    type: '듣기 · Phản hồi hội thoại ngắn',
    audio: '여자: 주말에 시간이 있어요? 같이 영화 보러 갈래요? 남자: 좋아요. 토요일 오후에 만나요.',
    question: '두 사람은 주말에 무엇을 할 겁니까? (Hai người sẽ làm gì vào cuối tuần?)',
    options: [
      '영화를 봅니다 (Xem phim)',
      '도서관에서 공부합니다 (Học ở thư viện)',
      '백화점에서 쇼핑합니다 (Mua sắm ở trung tâm thương mại)',
      '산을 등산합니다 (Leo núi)',
    ],
    answer: 0,
    explanation: 'Người nữ rủ: “같이 영화 보러 갈래요?” (Cùng đi xem phim nhé?) và người nam đồng ý: “좋아요. 토요일 오후에 만나요.”',
  },
  {
    part: 1,
    type: '듣기 · Nghe hội thoại chọn hành động tiếp theo',
    audio: '남자: 민수 씨, 회의 자료는 다 준비됐어요? 여자: 네, 인쇄는 끝났는데 아직 회의실에 안 가져다 놓았어요. 지금 바로 가지고 갈게요.',
    question: '여자가 이어서 할 행동으로 알맞은 것을 고르십시오. (Hành động tiếp theo người nữ sẽ làm là gì?)',
    options: [
      '회의실에 자료를 가져다 놓는다 (Mang tài liệu vào phòng họp)',
      '회의 자료를 다시 인쇄한다 (In lại tài liệu họp)',
      '컴퓨터를 고친다 (Sửa máy tính)',
      '회의 시간을 연기한다 (Hoãn giờ họp)',
    ],
    answer: 0,
    explanation: 'Người nữ nói: “아직 회의실에 안 가져다 놓았어요. 지금 바로 가지고 갈게요” (Tôi chưa mang vào phòng họp, giờ tôi sẽ mang vào ngay).',
  },
  {
    part: 1,
    type: '듣기 · Nghe hội thoại tại địa điểm thực tế',
    audio: '여자: 어서 오세요. 무엇을 도와드릴까요? 남자: 지난주에 여기서 산 바지인데 사이즈가 좀 작아서요. 한 치수 큰 걸로 바꾸고 싶어요.',
    question: '남자는 왜 이 가게에 왔습니까? (Tại sao người nam đến cửa hàng này?)',
    options: [
      '바지 사이즈를 교환하려고 (Để đổi size quần lớn hơn)',
      '새로운 모자를 사려고 (Để mua mũ mới)',
      '가방을 수선하려고 (Để sửa túi xách)',
      '선물을 포장하려고 (Để gói quà)',
    ],
    answer: 0,
    explanation: 'Người nam nói: “사이즈가 좀 작아서요. 한 치수 큰 걸로 바꾸고 싶어요” (Quần hơi chật nên muốn đổi sang cỡ lớn hơn 1 size).',
  },
  {
    part: 2,
    type: '듣기 · Nghe thông báo công cộng',
    audio: '안내 말씀 드립니다. 오늘 오후 두 시부터 네 시까지 도서관 전산 시스템 점검이 있습니다. 이 시간에는 도서 대출과 반납이 어려우니 이용에 참고하시기 바랍니다.',
    question: '오늘 오후 두 시부터 네 시 사이에 할 수 없는 일은 무엇입니까?',
    options: [
      '책을 빌리거나 반납하는 일 (Mượn hoặc trả sách)',
      '도서관 열람실에 앉아 있는 일 (Ngồi đọc tại phòng đọc)',
      '도서관 앞 공원을 산책하는 일 (Đi dạo công viên trước thư viện)',
      '개인 노트북으로 문서 작업을 하는 일 (Làm việc trên laptop cá nhân)',
    ],
    answer: 0,
    explanation: 'Thông báo nêu rõ: “이 시간에는 도서 대출과 반납이 어려우니” (Trong khung giờ 14h–16h không thể mượn và trả sách do bảo trì hệ thống).',
  },
  {
    part: 2,
    type: '듣기 · Nghe phỏng vấn chuyên đề',
    audio: '남자: 요즘 젊은 층 사이에서 동네 서점이 다시 인기를 끌고 있습니다. 단순히 책만 파는 것이 아니라, 작가와의 대화나 독서 모임 같은 문화 프로그램을 함께 운영하기 때문입니다.',
    question: '동네 서점이 다시 인기를 끄는 이유는 무엇입니까?',
    options: [
      '다양한 문화 프로그램을 함께 운영하기 때문에',
      '모든 책을 반값으로 할인해서 팔기 때문에',
      '24시간 동안 쉬지 않고 문을 열기 때문에',
      '지하철역 안에만 서점이 있기 때문에',
    ],
    answer: 0,
    explanation: 'Lý do được nêu trực tiếp: “단순히 책만 파는 것이 아니라, 작가와의 대화나 독서 모임 같은 문화 프로그램을 함께 운영하기 때문입니다.”',
  },
  {
    part: 2,
    type: '듣기 · Nghe hội thoại công sở',
    audio: '여자: 김 대리님, 이번 신제품 발표회 장소는 정해졌나요? 남자: 원래 본사 대강당에서 하려고 했는데, 참석자가 많아서 시청 옆에 있는 국제컨벤션센터로 변경했습니다.',
    question: '신제품 발표회는 어디에서 열립니까?',
    options: [
      '시청 옆 국제컨벤션센터 (Trung tâm hội nghị quốc tế cạnh Tòa thị chính)',
      '본사 대강당 (Hội trường lớn trụ sở chính)',
      '공항 근처 호텔 (Khách sạn gần sân bay)',
      '대학 도서관 (Thư viện đại học)',
    ],
    answer: 0,
    explanation: 'Chú ý bẫy trong TOPIK: “원래 본사 대강당에서 하려고 했는데” (Ban đầu định làm ở hội trường trụ sở chính), nhưng sau đó “국제컨벤션센터로 변경했습니다” (đã đổi sang Trung tâm hội nghị quốc tế).',
  },
  {
    part: 2,
    type: '듣기 · Nghe tư vấn sức khỏe',
    audio: '식사 후에 바로 눕는 습관은 소화에 좋지 않습니다. 밥을 먹은 뒤에는 최소한 20분 정도 가볍게 걸으면 소화도 잘되고 혈당이 급격히 오르는 것도 막을 수 있습니다.',
    question: '들으면서 알 수 있는 내용으로 맞는 것을 고르십시오.',
    options: [
      '식사 후 가볍게 산책하면 소화에 도움이 된다.',
      '밥을 먹자마자 바로 자는 것이 건강에 좋다.',
      '식사 후에는 2시간 동안 격렬하게 뛰어야 한다.',
      '물을 전혀 마시지 않아야 소화가 잘된다.',
    ],
    answer: 0,
    explanation: 'Bài nghe khuyên: “밥을 먹은 뒤에는 최소한 20분 정도 가볍게 걸으면 소화도 잘되고…” (Đi bộ nhẹ khoảng 20 phút sau bữa ăn giúp tiêu hóa tốt và ổn định đường huyết).',
  },
  {
    part: 2,
    type: '듣기 · Nghe thông tin thời tiết & lịch trình',
    audio: '내일 오전에는 전국적으로 맑겠지만, 오후 늦게부터는 비가 내리기 시작해 기온이 크게 떨어지겠습니다. 외출하실 때 우산과 얇은 겉옷을 챙기시는 것이 좋겠습니다.',
    question: '내일 날씨에 대한 설명으로 맞는 것은 무엇입니까?',
    options: [
      '오전에는 맑다가 오후 늦게부터 비가 오고 쌀쌀해진다.',
      '하루 종일 눈이 많이 내린다.',
      '오전에만 비가 오고 오후에는 무척 덥다.',
      '바람이 전혀 불지 않고 밤에도 기온이 높다.',
    ],
    answer: 0,
    explanation: 'Dự báo thời tiết: Sáng nắng ráo (오전에는 맑겠지만), chiều muộn bắt đầu mưa và nhiệt độ giảm mạnh (오후 늦게부터는 비가 내리기 시작해 기온이 크게 떨어지겠습니다).',
  },
]

const topikReadingCore = [
  {
    part: 3,
    type: '읽기 · Ngữ pháp & Từ vựng điền khuyết',
    question: '빈칸에 들어갈 가장 알맞은 것을 고르십시오:\n한국어를 처음 배울 때는 발음이 (   ) 자꾸 연습하다 보면 자연스러워집니다.',
    options: [
      '어렵지만 (tuy khó nhưng)',
      '어려워서 (vì khó nên)',
      '어려우려고 (để khó)',
      '어려운지 (không biết có khó không)',
    ],
    answer: 0,
    explanation: 'Hai vế đối lập nhau (“Lúc mới học tiếng Hàn phát âm tuy khó, nhưng cứ luyện tập nhiều sẽ trở nên tự nhiên”), nên dùng vĩ tố nối tương phản 「-지만」 (어렵지만).',
  },
  {
    part: 3,
    type: '읽기 · Ngữ pháp & Từ vựng điền khuyết',
    question: '빈칸에 들어갈 가장 알맞은 것을 고르십시오:\n기차 출발 시간이 얼마 남지 않았으니 서둘러 (   ).',
    options: [
      '가는 편이 낫다 (tốt hơn là nên đi nhanh)',
      '갈 리가 없다 (không đời nào đi)',
      '간 적이 있다 (đã từng đi)',
      '가느라고 했다 (vì mải đi nên)',
    ],
    answer: 0,
    explanation: '「-(으)ㄴ/는 편이 낫다」 dùng để đưa ra lời khuyên hợp lý: “Không còn nhiều thời gian trước giờ tàu chạy nên tốt hơn là hãy khẩn trương đi.”',
  },
  {
    part: 3,
    type: '읽기 · Đọc hiểu thông báo thực tế',
    passageTitle: '문화센터 요리 교실 안내',
    passage: '[행복 문화센터 · 주말 한국 요리 교실]\n• 일시: 매주 토요일 오전 10:00 ~ 12:00 (4주 과정)\n• 수강료: 무료 (단, 재료비 20,000원은 본인 부담)\n• 신청 방법: 홈페이지 선착순 접수 (정원 15명)',
    question: '이 안내문의 내용과 같은 것을 고르십시오.',
    options: [
      '수업료는 무료이지만 재료비는 따로 내야 한다.',
      '수업은 평일 저녁에 진행된다.',
      '전화로만 신청할 수 있고 인원 제한이 없다.',
      '재료비까지 모두 무료로 제공된다.',
    ],
    answer: 0,
    explanation: 'Thông báo ghi rõ: “수강료: 무료 (단, 재료비 20,000원은 본인 부담)” (Học phí miễn phí, nhưng tiền nguyên liệu 20.000 won học viên tự đóng).',
  },
  {
    part: 4,
    type: '읽기 · Điền câu vào đoạn văn (Chuẩn TOPIK Câu 28–31)',
    passageTitle: '식물과 실내 공기 정화',
    passage: '집 안에 식물을 키우면 인테리어 효과가 있을 뿐만 아니라 공기를 깨끗하게 하는 데도 도움이 된다. 식물은 잎을 통해 미세먼지를 흡수하고 산소를 내보내기 때문이다. (          ) 겨울철처럼 창문을 자주 열기 어려운 계절에는 실내 식물이 천연 공기청정기 역할을 톡톡히 해낸다.',
    question: '(          )에 들어갈 가장 알맞은 말을 고르십시오.',
    options: [
      '특히 환기가 부족하기 쉬운 (Đặc biệt là khi việc thông gió dễ bị thiếu hụt như…)',
      '반면에 식물이 빨리 시드는 (Ngược lại khi cây nhanh héo)',
      '아무리 창문을 활짝 열어 두어도 (Dù có mở toang cửa sổ)',
      '실내 온도가 너무 높아서 (Vì nhiệt độ trong phòng quá cao)',
    ],
    answer: 0,
    explanation: 'Phía sau chỗ trống là “겨울철처럼 창문을 자주 열기 어려운 계절에는” (vào mùa khó mở cửa sổ thường xuyên như mùa đông), bổ nghĩa trực tiếp cho cụm “특히 환기가 부족하기 쉬운” (Đặc biệt vào mùa dễ thiếu thông gió).',
  },
  {
    part: 4,
    type: '읽기 · Sắp xếp thứ tự 4 câu thành đoạn văn (Chuẩn TOPIK Câu 23–24)',
    question: 'Sắp xếp 4 câu (가), (나), (다), (라) theo mạch logic chuẩn TOPIK:\n(가) 요즘은 일회용 컵 대신 개인 텀블러를 사용하는 사람들이 늘고 있다.\n(나) 또한 커피전문점에서도 텀블러 이용 고객에게 할인 혜택을 제공하고 있기 때문이다.\n(다) 환경 보호에 대한 시민들의 의식이 높아진 것이 가장 큰 이유이다.\n(라) 이러한 작은 실천이 모이면 플라스틱 쓰레기를 줄이는 데 큰 힘이 된다.',
    options: [
      '(가) - (다) - (나) - (라)',
      '(다) - (가) - (나) - (라)',
      '(가) - (나) - (다) - (라)',
      '(라) - (가) - (다) - (나)',
    ],
    answer: 0,
    explanation: '(가) Mở đầu nêu hiện tượng dùng bình cá nhân tăng lên -> (다) Giải thích lý do lớn nhất -> (나) Bổ sung lý do thứ hai bằng “또한 … 때문이다” -> (라) Kết luận tổng kết bằng “이러한 작은 실천이…”.',
  },
  {
    part: 4,
    type: '읽기 · Đọc hiểu bài báo xã hội & kinh tế',
    passageTitle: '재택근무와 업무 환경의 변화',
    passage: '정보통신 기술의 발달로 사무실에 출근하지 않고 집에서 일하는 재택근무가 확산되고 있다. 재택근무는 통근 시간을 줄여 주어 직원의 삶의 질을 높이는 장점이 있다. 그러나 대면 소통이 줄어들어 부서 간 협업이 늦어질 수 있으므로, 정기적인 화상 회의와 명확한 업무 공유 규칙을 마련할 필요가 있다.',
    question: '이 글의 중심 생각으로 가장 알맞은 것을 고르십시오.',
    options: [
      '재택근무의 단점을 보완하기 위해 소통과 업무 공유 체계를 갖추어야 한다.',
      '모든 회사는 즉시 재택근무를 전면 중단해야 한다.',
      '재택근무를 하면 통근 시간이 오히려 더 길어진다.',
      '화상 회의는 업무 효율을 떨어뜨리므로 피해야 한다.',
    ],
    answer: 0,
    explanation: 'Ý chính nằm ở câu kết với cấu trúc 「-으므로 … -ㄹ 필요가 있다」: Để khắc phục nhược điểm thiếu giao tiếp trực tiếp của làm việc từ xa, cần thiết lập họp trực tuyến định kỳ và quy tắc chia sẻ công việc rõ ràng.',
  },
  {
    part: 4,
    type: '읽기 · Đọc hiểu tâm lý & giáo dục',
    passageTitle: '칭찬의 효과적인 방법',
    passage: '아이를 칭찬할 때 단순히 "머리가 좋구나"라고 결과나 재능만 칭찬하면, 아이는 실패를 두려워해 어려운 과제를 피하게 될 수 있다. 반면에 "끝까지 포기하지 않고 방법을 찾아냈네"처럼 구체적인 노력과 과정을 칭찬하면, 아이는 새로운 문제에 더 적극적으로 도전하게 된다.',
    question: '윗글의 내용과 일치하는 것을 고르십시오.',
    options: [
      '구체적인 노력과 과정을 칭찬하면 아이의 도전 정신이 높아진다.',
      '결과와 타고난 재능만 칭찬하는 것이 가장 효과적이다.',
      '아이가 어려운 과제를 할 때는 전혀 칭찬하지 말아야 한다.',
      '칭찬을 많이 들은 아이는 언제나 도전을 포기한다.',
    ],
    answer: 0,
    explanation: 'Bài đọc chỉ rõ: Khen ngợi nỗ lực và quá trình cụ thể (“구체적인 노력과 과정을 칭찬하면”) giúp trẻ chủ động thử thách với những vấn đề mới hơn.',
  },
  {
    part: 4,
    type: '읽기 · Thành ngữ & Biểu hiện quán dụng tiếng Hàn',
    question: '밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오:\n오랜만에 고향 친구를 만나서 시간 가는 줄 모르고 【 입이 닳도록 】 옛날이야기를 나누었다.',
    options: [
      '여러 번 반복해서 아주 많이 (Lặp đi lặp lại rất nhiều lần)',
      '한마디도 하지 않고 조용히 (Im lặng không nói lời nào)',
      '서로 화를 내면서 크게 (Nổi giận cãi nhau lớn)',
      '아주 짧은 시간 동안 급하게 (Vội vàng trong thời gian ngắn)',
    ],
    answer: 0,
    explanation: 'Quán dụng ngữ 「입이 닳도록 (말하다)」 (nói đến mòn cả miệng) nghĩa là nói đi nói lại hoặc trò chuyện rất nhiều lần.',
  },
]

const topikWritingCore = [
  {
    part: 5,
    type: '쓰기 51번 · Điền khuyết văn bản đời sống / email lịch sự',
    passageTitle: 'TOPIK II 쓰기 51번 · Email đổi lịch hẹn phỏng vấn câu lạc bộ',
    passage: '제목: 동아리 면접 시간 변경 문의\n안녕하십니까? 이번 사진 동아리에 지원한 경영학과 2학년 박지훈입니다.\n다름이 아니라 제가 이번 주 금요일 오후 2시에 면접을 보기로 되어 있습니다. 그런데 금요일 오후에 전공 필수 시험이 갑자기 잡혀서 그 시간에 (   ㄱ   ). 혹시 면접 순서를 오전으로 바꾸어 주실 수 있는지 여쭙고 싶습니다.',
    question: '빈칸 (   ㄱ   )에 들어갈 가장 격식에 맞고 자연스러운 표현을 고르십시오.',
    options: [
      '참석하기가 어렵게 되었습니다',
      '참석해 주시기 바랍니다',
      '참석하느라고 고생하셨습니다',
      '참석할 리가 없었습니다',
    ],
    answer: 0,
    explanation: 'Trong câu 51 TOPIK II, người viết giải thích lý do trùng lịch thi chuyên ngành nên “trở nên khó có thể tham dự vào khung giờ đó” → 「참석하기가 어렵게 되었습니다」 (vừa đúng ngữ cảnh vừa đúng thể lịch sự trang trọng -ㅂ니다).',
  },
  {
    part: 5,
    type: '쓰기 52번 · Điền khuyết văn bản giải thích khoa học / xã hội',
    passageTitle: 'TOPIK II 쓰기 52번 · Tác dụng của việc đọc sách giấy',
    passage: '전자책은 휴대하기 편리하다는 장점이 있지만, 내용을 깊이 이해하고 기억하는 데는 종이책이 더 효과적이라는 연구 결과가 많다. 종이책을 읽을 때는 손끝으로 종이의 질감과 남은 페이지의 두께를 느끼면서 전체 글의 구조를 파악할 수 있다. 이처럼 감각적인 정보가 함께 전달되기 때문에 독자는 내용을 훨씬 더 (   ㄴ   ).',
    question: '빈칸 (   ㄴ   )에 들어갈 설명문 종결 표현으로 가장 알맞은 것을 고르십시오.',
    options: [
      '오래 기억하게 된다',
      '오래 기억할까 한다',
      '오래 기억해 주어야 한다',
      '오래 기억하지 못한다',
    ],
    answer: 0,
    explanation: 'Câu 52 TOPIK II yêu cầu dùng thể văn viết trung tính 「-ㄴ/는다」 và khớp mạch lập luận câu đầu (“내용을 깊이 이해하고 기억하는 데는 종이책이 더 효과적이다”) → 「오래 기억하게 된다」.',
  },
  {
    part: 5,
    type: '쓰기 53번 · Phân tích biểu đồ & số liệu (해설문)',
    question: 'Khi viết bài phân tích biểu đồ Câu 53 TOPIK II, câu nào sau đây diễn đạt chuẩn xác số liệu “Tỷ lệ sử dụng phương tiện giao thông công cộng tăng từ 35% năm 2022 lên 58% năm 2026”?',
    options: [
      '대중교통 이용 비율은 2022년 35%에서 2026년 58%로 크게 증가한 것으로 나타났다.',
      '대중교통 이용 비율은 2022년 35%부터 2026년 58%까지 크게 감소하기로 했다.',
      '대중교통 이용 비율이 2022년에 35%였으나 2026년에는 58%에 불과할 것이다.',
      '대중교통을 이용하는 사람들이 35%와 58%를 모두 합쳐서 줄어들었다.',
    ],
    answer: 0,
    explanation: 'Mẫu câu chuẩn mực của TOPIK II câu 53: 「N은/는 [연도] [수치]%에서 [연도] [수치]%로 크게 증가한/상승한 것으로 나타났다」.',
  },
  {
    part: 5,
    type: '쓰기 54번 · Lập luận nghị luận xã hội (논설문)',
    question: 'Chọn câu mở đoạn chuẩn học thuật nhất cho đề bài Câu 54 TOPIK II về chủ đề “Sự hài hòa giữa phát triển kinh tế và bảo vệ môi trường (경제 발전과 환경 보호의 조화)”:',
    options: [
      '현대 사회에서 경제 성장은 국가 경쟁력을 높이는 핵심 요소이지만, 환경을 훼손하는 개발은 장기적으로 지속 가능하지 않다.',
      '저는 어제 친구와 함께 환경 보호에 대한 영화를 재미있게 보았습니다.',
      '경제 발전이 좋으니까 환경 보호는 나중에 생각해도 괜찮다고 말하고 싶습니다.',
      '왜 사람들이 환경을 보호하는지 잘 모르겠지만 한번 써 보겠습니다.',
    ],
    answer: 0,
    explanation: 'Câu 54 TOPIK II đòi hỏi văn phong nghị luận học thuật (không dùng 저/나, không dùng -ㅂ니다/-아요 mà dùng thể -다), nêu bật tính hai mặt của vấn đề và tính bền vững (지속 가능성).',
  },
]

export function buildTopikExamSections(level = 'TOPIK 2') {
  const isTopik2 = ['TOPIK 3', 'TOPIK 4', 'TOPIK 5', 'TOPIK 6'].includes(level)
  const sections = [
    {
      id: 'listening',
      label: '듣기 · Nghe hiểu',
      duration: 20 * 60,
      questions: topikListeningCore.map((q, i) => ({
        ...q,
        id: `topik-${level}-l-${i + 1}`,
        languageId: 'korean',
      })),
    },
  ]

  if (isTopik2) {
    sections.push({
      id: 'writing',
      label: '쓰기 · Viết & Điền khuyết (51–54)',
      duration: 20 * 60,
      questions: topikWritingCore.map((q, i) => ({
        ...q,
        id: `topik-${level}-w-${i + 1}`,
        languageId: 'korean',
      })),
    })
  }

  sections.push({
    id: 'reading',
    label: '읽기 · Đọc hiểu',
    duration: 25 * 60,
    questions: topikReadingCore.map((q, i) => ({
      ...q,
      id: `topik-${level}-r-${i + 1}`,
      languageId: 'korean',
    })),
  })

  return sections
}

export function buildTopikResult({ answers = {}, sections = [], elapsed = {} }, level = 'TOPIK 2') {
  const isTopik2 = sections.some((s) => s.id === 'writing')
  const maxScore = isTopik2 ? 300 : 200

  const scoreSection = (sectionId) => {
    const sec = sections.find((s) => s.id === sectionId)
    if (!sec || !sec.questions.length) return { score: 0, correct: 0, total: 0 }
    const correct = sec.questions.filter((q) => isCorrectAnswer(q, answers[q.id])).length
    const score = Math.round((correct / sec.questions.length) * 100)
    return { score, correct, total: sec.questions.length }
  }

  const listening = scoreSection('listening')
  const reading = scoreSection('reading')
  const writing = isTopik2 ? scoreSection('writing') : { score: 0, correct: 0, total: 0 }

  const totalScore = listening.score + reading.score + (isTopik2 ? writing.score : 0)
  const totalQuestions = listening.total + reading.total + writing.total
  const totalCorrect = listening.correct + reading.correct + writing.correct
  const unanswered = sections.reduce(
    (sum, s) => sum + s.questions.filter((q) => !hasAnswer(answers[q.id])).length,
    0,
  )

  let achievedGrade = '불합격 (Chưa đạt cấp)'
  let passed = false
  if (!isTopik2) {
    if (totalScore >= 140) { achievedGrade = '2급 (TOPIK I · Cấp 2)'; passed = true }
    else if (totalScore >= 80) { achievedGrade = '1급 (TOPIK I · Cấp 1)'; passed = true }
  } else {
    if (totalScore >= 230) { achievedGrade = '6급 (TOPIK II · Cấp 6)'; passed = true }
    else if (totalScore >= 190) { achievedGrade = '5급 (TOPIK II · Cấp 5)'; passed = true }
    else if (totalScore >= 150) { achievedGrade = '4급 (TOPIK II · Cấp 4)'; passed = true }
    else if (totalScore >= 120) { achievedGrade = '3급 (TOPIK II · Cấp 3)'; passed = true }
  }

  const timeUsed = Object.values(elapsed).reduce((sum, sec) => sum + (Number(sec) || 0), 0)
  const accuracy = Math.round((totalCorrect / Math.max(1, totalQuestions)) * 100)

  return {
    exam: isTopik2 ? 'TOPIK II' : 'TOPIK I',
    level,
    isTopik2,
    score: totalScore,
    maxScore,
    achievedGrade,
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
    correct: totalCorrect,
    total: totalQuestions,
    wrong: totalQuestions - totalCorrect - unanswered,
    unanswered,
    accuracy,
    timeUsed,
  }
}

export const topikListeningPractice = topikListeningCore.map((q, idx) => ({ ...q, id: `topik-prac-l-${idx + 1}`, languageId: 'korean' }))
export const topikReadingWritingPractice = [...topikReadingCore, ...topikWritingCore].map((q, idx) => ({ ...q, id: `topik-prac-rw-${idx + 1}`, languageId: 'korean' }))
