import { isCorrectAnswer, hasAnswer } from '../../components/common/QuizQuestion'

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
export const JLPT_PASS_MARKS = {
  N5: 80,
  N4: 90,
  N3: 95,
  N2: 90,
  N1: 100,
}
export const JLPT_SECTION_MIN = 19

const jlptKnowledgeCore = [
  {
    part: 1,
    type: '漢字読み · Cách đọc Kanji',
    question: '来週の月曜日に本社で大事な【会議】があります。',
    options: ['かいぎ (kaigi)', 'かいき (kaiki)', 'がいぎ (gaigi)', 'あいき (aiki)'],
    answer: 0,
    explanation: '会議 đọc là かいぎ (kaigi), nghĩa là cuộc họp / hội nghị.',
  },
  {
    part: 1,
    type: '漢字読み · Cách đọc Kanji',
    question: '駅の前の【図書館】で日本語の辞書を借りました。',
    options: ['としょかん (toshokan)', 'とうしょかん (toushokan)', 'ずしょかん (zushokan)', 'としょっか (toshokka)'],
    answer: 0,
    explanation: '図書館 đọc là としょかん (toshokan - thư viện), không có trường âm ở chữ 図 (と).',
  },
  {
    part: 1,
    type: '漢字読み · Cách đọc Kanji',
    question: '電車の【都合】で、到着が15分ぐらい遅れます。',
    options: ['つごう (tsugou)', 'とごう (togou)', 'つあい (tsuai)', 'とあい (toai)'],
    answer: 0,
    explanation: '都合 đọc là つごう (tsugou - sự thuận tiện / hoàn cảnh / lý do khách quan).',
  },
  {
    part: 2,
    type: '文脈規定 · Từ vựng theo ngữ cảnh',
    question: '明日は朝早いので、今夜は早めに目覚まし時計を（   ）寝ます。',
    options: ['セットして (cài đặt / hẹn giờ)', 'コピーして (sao chép)', 'キャンセルして (hủy bỏ)', 'ノックして (gõ cửa)'],
    answer: 0,
    explanation: 'Cụm từ cố định: 目覚まし時計をセットする (cài đặt đồng hồ báo thức).',
  },
  {
    part: 2,
    type: '言い換え類義 · Từ đồng nghĩa',
    question: 'この仕事は【ただちに】始める必要があります。',
    options: ['すぐに (ngay lập tức)', 'ゆっくり (từ từ)', 'たしかに (chắc chắn là)', 'めったに (hiếm khi)'],
    answer: 0,
    explanation: 'ただちに (ngay lập tức, tức khắc) đồng nghĩa với すぐに.',
  },
  {
    part: 3,
    type: '文法形式の判断 · Ngữ pháp trọng tâm',
    question: '雨が降っている（   ）、グラウンドでサッカーの試合が行われている。',
    options: ['にもかかわらず (mặc dù / bất chấp)', 'おかげで (nhờ có)', 'ばかりに (chỉ vì)', 'にしたがって (cùng với việc)'],
    answer: 0,
    explanation: '「～にもかかわらず」 (Mặc dù trời đang mưa nhưng trận bóng đá vẫn diễn ra trên sân).',
  },
  {
    part: 3,
    type: '文法形式の判断 · Ngữ pháp trọng tâm',
    question: '健康の（   ）、毎日30分以上歩くようにしています。',
    options: ['ために (vì / để)', 'そうに (có vẻ)', 'みたいに (giống như)', 'ばかりに (chỉ tại)'],
    answer: 0,
    explanation: '「Danh từ + の + ために」 chỉ mục đích: Vì sức khỏe nên tôi cố gắng đi bộ trên 30 phút mỗi ngày.',
  },
  {
    part: 3,
    type: '文法形式の判断 · Ngữ pháp trọng tâm',
    question: '田中さんは日本料理（   ）詳しいだけでなく、自分で作るのも上手だ。',
    options: ['に', 'を', 'へ', 'と'],
    answer: 0,
    explanation: 'Cấu trúc 「N に詳しい」 nghĩa là am hiểu tường tận về lĩnh vực N (am hiểu ẩm thực Nhật Bản).',
  },
  {
    part: 4,
    type: '文の組み立て (★) · Bài toán dấu sao ghép câu',
    question: 'Chọn từ đứng ở vị trí dấu ★ trong câu sau:\nこの薬は ＿＿ ＿＿ ★ ＿＿ 飲んでください。\n1. 後に  2. ご飯を  3. 必ず  4. 食べた',
    options: ['1. 後に', '2. ご飯を', '3. 必ず', '4. 食べた'],
    answer: 0,
    explanation: 'Trật tự câu chuẩn: この薬は [2. ご飯を] [4. 食べた] [1. 後に (★)] [3. 必ず] 飲んでください (Thuốc này nhất định hãy uống sau khi ăn cơm). Vị trí ★ là 1. 後に.',
  },
  {
    part: 4,
    type: '文の組み立て (★) · Bài toán dấu sao ghép câu',
    question: 'Chọn từ đứng ở vị trí dấu ★ trong câu sau:\n日本へ ＿＿ ＿＿ ★ ＿＿ なりました。\n1. 来てから  2. ように  3. 毎日自炊する  4. 一人で',
    options: ['3. 毎日自炊する', '2. ように', '1. 来てから', '4. 一人で'],
    answer: 0,
    explanation: 'Trật tự chuẩn: 日本へ [1. 来てから] [4. 一人で] [3. 毎日自炊する (★)] [2. ように] なりました (Từ khi sang Nhật tôi đã hình thành thói quen tự nấu ăn một mình mỗi ngày). Vị trí ★ là 3.',
  },
  {
    part: 4,
    type: '文章の文法 · Ngữ pháp trong đoạn văn',
    question: '新しい言葉を覚えるときは、単語だけを見るのではなく、例文と一緒に声に出して読むことが大切です。（   ）、実際の会話でも自然に使えるようになります。',
    options: ['そうすれば (Nếu làm như vậy thì)', 'それなのに (Thế nhưng)', 'ところが (Tuy nhiên)', 'なぜなら (Bởi vì)'],
    answer: 0,
    explanation: '「そうすれば」 nối điều kiện ở câu trước với kết quả tích cực ở câu sau: “Nếu làm như vậy thì trong hội thoại thực tế cũng sẽ dùng được tự nhiên.”',
  },
  {
    part: 4,
    type: '用法 · Cách dùng từ chuẩn xác',
    question: 'Cách dùng từ 【 関心 (kanshin - sự quan tâm) 】 trong câu nào sau đây là ĐÚNG tự nhiên nhất?',
    options: [
      '若い世代の間で、環境問題への関心が高まっている。',
      '明日の試験に関心して、夜遅くまで勉強した。',
      'この荷物はとても関心なので、気をつけて運んでください。',
      '駅の近くに関心なレストランが新しく開店した。',
    ],
    answer: 0,
    explanation: '「～への関心が高まる」 (Sự quan tâm đối với vấn đề môi trường đang ngày càng tăng cao) là cụm collocation chuẩn trong JLPT.',
  },
]

const jlptReadingCore = [
  {
    part: 5,
    type: '内容理解（短文）· Đọc hiểu thông báo ngắn',
    passageTitle: '社内メール · Thông báo bảo trì thang máy',
    passage: '【お知らせ】\n今週の日曜日（11月15日）の午前9時から午後1時まで、ビル内のエレベーターの定期点検を行います。点検中はエレベーターが一切ご使用になれませんので、階段をご利用くださいますようお願いいたします。なお、午後1時以降は通常どおり運転いたします。',
    question: 'このお知らせの内容と合っているものはどれですか。 (Nội dung nào khớp với thông báo?)',
    options: [
      '日曜日の午前11時に上の階へ行くときは、階段を使わなければならない。',
      '日曜日は一日中エレベーターを使うことができない。',
      '点検は土曜日の夜から日曜日の朝まで行われる。',
      '午後1時以降も階段しか使えない。',
    ],
    answer: 0,
    explanation: 'Thang máy bảo trì từ 9h sáng đến 1h chiều Chủ nhật (午前9時から午後1時まで), nên lúc 11h sáng Chủ nhật bắt buộc phải đi cầu thang bộ.',
  },
  {
    part: 5,
    type: '内容理解（短文）· Đọc hiểu đoạn văn ngắn',
    passageTitle: 'エッセイ · Thói quen ghi chép tay',
    passage: '最近は会議のメモをパソコンやスマートフォンで取る人が増えている。確かに速く入力できて便利だが、私はあえて紙の手帳に手で書くようにしている。手で書きながら大事な部分に線を引いたり矢印を書いたりすると、頭の中で考えが整理され、記憶にも残りやすいからだ。',
    question: '筆者が紙の手帳に手でメモを取る理由は何か。 (Tại sao tác giả chọn ghi chép tay vào sổ giấy?)',
    options: [
      '考えが整理され、記憶にも残りやすいから。',
      'パソコンよりも速く文字が書けるから。',
      'スマートフォンを持っていないから。',
      '会社でパソコンの使用が禁止されているから。',
    ],
    answer: 0,
    explanation: 'Câu cuối nêu rõ lý do: 「頭の中で考えが整理され、記憶にも残りやすいからだ」 (Giúp sắp xếp suy nghĩ trong đầu và dễ nhớ lâu hơn).',
  },
  {
    part: 6,
    type: '内容理解（中文）· Đọc hiểu thư tín công việc',
    passageTitle: 'ビジネスメール · Xác nhận lịch giao tài liệu',
    passage: 'さくら商事　営業部　佐藤様\n\nいつも大変お世話になっております。みどり印刷の山本です。\n先日ご依頼いただいた新商品のパンフレットですが、本日印刷が完了いたしました。予定より1日早く仕上がりましたので、明日の午前10時ごろ御社へお届けに上がってもよろしいでしょうか。\nご都合が悪い場合は、本日午後5時までにご連絡いただけますと幸いです。よろしくお願いいたします。',
    question: '山本さんがこのメールを送った主な目的は何か。 (Mục đích chính anh Yamamoto gửi email này là gì?)',
    options: [
      '明日の午前10時ごろにパンフレットを届けてよいか確認するため。',
      '印刷が1日遅れることを謝るため。',
      'パンフレットのデザインを変更してもらうため。',
      '今日の午後5時にさくら商事を訪問するため。',
    ],
    answer: 0,
    explanation: 'Vì in xong sớm hơn dự kiến 1 ngày nên anh Yamamoto hỏi xác nhận xem sáng mai khoảng 10h mang tài liệu qua có tiện không (「明日の午前10時ごろ御社へお届けに上がってもよろしいでしょうか」).',
  },
  {
    part: 6,
    type: '情報検索 · Tìm kiếm thông tin từ bảng hướng dẫn',
    passageTitle: '市民スポーツセンター利用案内',
    passage: '【市民スポーツセンター・コース案内】\n・Aコース（水泳教室）：火・木 19:00〜20:30／月額 5,000円（初心者歓迎）\n・Bコース（ヨガ教室）：水・金 10:00〜11:30／月額 4,500円（女性限定）\n・Cコース（バドミントン）：土・日 14:00〜16:00／月額 4,000円（ラケット貸出無料）\n※平日の昼間は仕事がある男性の会社員（初心者）が参加できる運動コースを探しています。',
    question: 'この会社員の条件に合うコースはどれですか。 (Khóa học nào phù hợp với nhân viên nam đi làm giờ hành chính ngày thường?)',
    options: [
      'Aコース（火・木 19:00〜）または Cコース（土・日 14:00〜）',
      'Bコース（水・金 10:00〜）のみ',
      'BコースとCコース',
      '参加できるコースは一つもない',
    ],
    answer: 0,
    explanation: 'Khóa B chỉ dành cho nữ và học buổi sáng ngày thường (10:00). Nhân viên nam bận ban ngày từ thứ 2–6 có thể học khóa A (tối thứ 3·5 lúc 19:00) hoặc khóa C (chiều thứ 7·CN lúc 14:00).',
  },
  {
    part: 6,
    type: '内容理解（中文）· Đọc hiểu bình luận xã hội',
    passageTitle: '読書の楽しみ方',
    passage: '本を読むとき、「最後まで全部読まなければならない」と思い込んでいないだろうか。もちろん小説なら最後まで読むのが普通だが、実用書やビジネス書の場合は、今の自分に必要な章だけを選んで読んでも十分役に立つ。難しく考えすぎず、気軽にページを開いてみることが読書を続けるコツだ。',
    question: '実用書やビジネス書の読み方について、筆者はどう述べているか。',
    options: [
      '自分に必要な部分だけを選んで読んでもよい。',
      '最初のページから最後まで順番に読むべきだ。',
      '小説と同じように一度も休まずに読むのがよい。',
      '実用書は難しいので読まないほうがよい。',
    ],
    answer: 0,
    explanation: 'Tác giả khuyên: 「実用書やビジネス書の場合は、今の自分に必要な章だけを選んで読んでも十分役に立つ」 (Với sách kỹ năng/kinh doanh, chỉ cần chọn đọc chương mình đang cần cũng đã rất hữu ích).',
  },
  {
    part: 6,
    type: '内容理解（短文）· Đọc hiểu quy định thư viện',
    passageTitle: '市立図書館・返却ポストのご案内',
    passage: '閉館後や休館日に本を返却する場合は、正面入口横の「返却ポスト」をご利用ください。ただし、CD・DVDが付属している本や、他の図書館から取り寄せた本は破損のおそれがあるため、返却ポストには入れず、開館時間内にカウンターへ直接お返しください。',
    question: '返却ポストに入れてもよいものはどれか。 (Thứ nào ĐƯỢC phép bỏ vào thùng trả sách tự động?)',
    options: [
      'この市立図書館で借りた、CDが付いていない普通の本',
      'CDが付属している語学テキスト',
      '別の市の図書館から取り寄せた専門書',
      '図書館で借りた映画のDVD',
    ],
    answer: 0,
    explanation: 'Sách kèm CD/DVD hoặc sách mượn liên thư viện phải trả trực tiếp tại quầy; chỉ sách thường mượn tại thư viện (không kèm đĩa) mới được bỏ vào 返却ポスト.',
  },
  {
    part: 6,
    type: '内容理解（中文）· Quan điểm của tác giả',
    passageTitle: '失敗から学ぶこと',
    passage: '新しいことに挑戦すれば、失敗するのは自然なことだ。大切なのは、失敗したかどうかではなく、なぜうまくいかなかったのかを振り返り、次の行動をどう変えるかである。失敗を恐れて何もしないことこそ、最大の損失ではないだろうか。',
    question: '筆者が最も言いたいことは何か。',
    options: [
      '失敗を恐れずに挑戦し、失敗から学んで次に生かすことが大切だ。',
      '失敗しないように、慣れている仕事だけをするべきだ。',
      '一度失敗したら、すぐに別の目標に変えたほうがよい。',
      '挑戦する前にすべての失敗を完全に防ぐことができる。',
    ],
    answer: 0,
    explanation: 'Tác giả nhấn mạnh: Đừng sợ thất bại mà không dám thử, quan trọng là nhìn lại nguyên nhân và rút kinh nghiệm cho hành động tiếp theo.',
  },
  {
    part: 6,
    type: '情報検索 · Đọc hiểu lịch khám phòng khám',
    passageTitle: 'みどり内科クリニック診療時間',
    passage: '【午前】9:00〜12:30（月・火・水・금・土）\n【午後】15:00〜18:30（月・火・水・金）\n※木曜日・日曜日・祝日は休診です。土曜日は午前のみの診療となります。初診の方は診療終了の30分前までに受付をお済ませください。',
    question: '初めてこのクリニックに行く人が、土曜日に診察を受けたい場合、いつまでに受付をしなければならないか。',
    options: [
      '土曜日の午前12時00分まで',
      '土曜日の午前12時30分まで',
      '土曜日の午後6時00分まで',
      '木曜日の午前12時00分まで',
    ],
    answer: 0,
    explanation: 'Thứ Bảy chỉ khám buổi sáng đến 12:30 (土曜日は午前のみ), và người khám lần đầu (初診) phải đăng ký trước giờ kết thúc 30 phút -> trước 12:00 trưa.',
  },
]

const jlptListeningCore = [
  {
    part: 7,
    type: '課題理解 · Nghe hiểu nhiệm vụ cần làm',
    audio: '会社で男の人と女の人が話しています。女：鈴木さん、午後からの会議の資料、もう30部コピーしてくれましたか？男：あ、すみません、20部しか刷っていません。女：じゃあ、あと10部追加で刷っておいてください。会議室の机は私が並べておきますから。',
    question: '男の人はこのあと、まず何をしますか。 (Người nam sẽ làm gì ngay sau đây?)',
    options: [
      '資料をあと10部コピーする',
      '会議室の机を並べる',
      '資料を30部新しく作り直す',
      '会議の時間を変更する',
    ],
    answer: 0,
    explanation: 'Người nữ dặn: 「じゃあ、あと10部追加で刷っておいてください」 (Vậy hãy in thêm 10 bản nữa nhé, còn bàn ghế phòng họp để tôi xếp).',
  },
  {
    part: 7,
    type: '課題理解 · Nghe hiểu nhiệm vụ cần làm',
    audio: '病院で医者と患者が話しています。医者：熱は下がりましたが、のどの腫れがまだ残っていますね。お薬を3日分出しますので、毎食後に飲んでください。今日はお風呂に入らず、シャワーだけにして早く休んでくださいね。',
    question: '患者は今日、家に帰ってからどうしなければなりませんか。',
    options: [
      '食後に薬を飲み、お風呂には入らずシャワーだけにする',
      '熱いお風呂にゆっくり入ってから薬を飲む',
      '薬は飲まずに早く寝る',
      '3日間シャワーを浴びない',
    ],
    answer: 0,
    explanation: 'Bác sĩ dặn: uống thuốc sau mỗi bữa ăn (毎食後に飲んで) và hôm nay không ngâm bồn tắm mà chỉ tắm vòi sen rồi nghỉ sớm (お風呂に入らず、シャワーだけにして).',
  },
  {
    part: 8,
    type: 'ポイント理解 · Nghe hiểu trọng tâm',
    audio: '男：山下さん、今度の週末、映画を見に行きませんか。女：いいですね！でも土曜日は午前中に歯医者があって、午後から母と買い物に行く約束があるんです。日曜日なら一日空いていますよ。',
    question: '二人はいつ映画を見に行きますか。',
    options: ['日曜日 (Chủ nhật)', '土曜日の午前 (Sáng thứ Bảy)', '土曜日の午後 (Chiều thứ Bảy)', '金曜日の夜 (Tối thứ Sáu)'],
    answer: 0,
    explanation: 'Thứ Bảy người nữ bận đi nha sĩ và đi mua sắm với mẹ, còn Chủ nhật rảnh cả ngày (「日曜日なら一日空いていますよ」).',
  },
  {
    part: 8,
    type: 'ポイント理解 · Nghe hiểu trọng tâm',
    audio: '女：どうして今のマンションに引っ越したんですか？駅から少し遠いですよね。男：ええ、以前は駅前のアパートに住んでいたんですが、夜遅くまで車の音がうるさくて。今のところは静かで、すぐ隣に大きな公園があるのが気に入っているんです。',
    question: '男の人が今のマンションを気に入っている一番の理由は何ですか。',
    options: [
      '静かで、隣に大きな公園があるから',
      '駅のすぐ前にあって通勤に便利だから',
      '家賃が以前のアパートよりずっと安いから',
      '近くに遅くまで開いているスーパーがあるから',
    ],
    answer: 0,
    explanation: 'Người nam nói rõ: 「今のところは静かで、すぐ隣に大きな公園があるのが気に入っているんです」 (Chỗ hiện tại yên tĩnh và ngay sát cạnh có công viên lớn).',
  },
  {
    part: 9,
    type: '即時応答 · Phản xạ hội thoại tức thì',
    audio: '女：すみません、この書類、今日中にチェックしていただけないでしょうか。',
    question: 'Chọn câu trả lời tự nhiên và lịch sự nhất cho lời nhờ vả trên:',
    options: [
      'ええ、いいですよ。夕方までに見ておきますね。',
      'いいえ、昨日もうチェックしましたよ。',
      'はい、書類をどうぞ差し上げてください。',
      'すみません、今日中にチェックしてもらいました。',
    ],
    answer: 0,
    explanation: 'Khi đồng nghiệp hỏi “Anh/chị có thể kiểm tra tài liệu này trong hôm nay giúp tôi được không?”, câu đáp tự nhiên là: “Vâng, được chứ. Tôi sẽ xem trước buổi chiều tối nhé.”',
  },
  {
    part: 9,
    type: '即時応答 · Phản xạ hội thoại tức thì',
    audio: '男：部長、先ほどA社から電話がありまして、明日の打ち合わせを30分遅らせたいとのことです。',
    question: 'Chọn câu trả lời phù hợp nhất của Trưởng phòng (部長):',
    options: [
      'わかった。じゃあ、スケジュールを直しておくよ。ありがとう。',
      'そうか、A社に電話してくれてありがとう。',
      'すみません、私が30分遅れてしまいました。',
      'いいえ、打ち合わせは来週でしたよ。',
    ],
    answer: 0,
    explanation: 'Khi nhân viên báo tin nhắn từ công ty A muốn lùi lịch họp 30 phút, Trưởng phòng đáp: “Tôi hiểu rồi. Vậy tôi sẽ chỉnh lại lịch trình nhé. Cảm ơn bạn.”',
  },
  {
    part: 9,
    type: '概要理解 · Nghe hiểu thông báo nhà ga',
    audio: '本日も東都鉄道をご利用いただき、ありがとうございます。強風の影響により、2番線の急行電車は運転を見合わせております。お急ぎのお客様は、1番線の各駅停車をご利用ください。',
    question: '急行電車が止まっている理由は何ですか。',
    options: [
      '風が強いから (Do gió mạnh - 強風の影響)',
      '大雪が降っているから (Do tuyết rơi dày)',
      '車両の点検をしているから (Do kiểm tra tàu)',
      '停電が起きたから (Do mất điện)',
    ],
    answer: 0,
    explanation: 'Thông báo nêu rõ: 「強風の影響により、2番線の急行電車は運転を見合わせております」 (Do ảnh hưởng của gió lớn nên tàu tốc hành số 2 tạm ngừng chạy).',
  },
  {
    part: 9,
    type: '即時応答 · Phản xạ kính ngữ công sở',
    audio: '女：お忙しいところ恐れ入りますが、こちらのアンケートにご記入いただけますか。',
    question: 'Chọn câu trả lời phù hợp nhất:',
    options: [
      'はい、かまいませんよ。ペンをお借りできますか。',
      'いいえ、記入して差し上げません。',
      'こちらこそ、お忙しくてすみません。',
      'はい、私がアンケートを作りました。',
    ],
    answer: 0,
    explanation: 'Khi nhân viên lịch sự nhờ điền bảng khảo sát (ご記入いただけますか), đáp lại: “Vâng, được chứ ạ. Cho tôi mượn cây bút được không?” là tự nhiên nhất.',
  },
]

export function buildJlptExamSections(level = 'N3') {
  const validLevel = JLPT_LEVELS.includes(level) ? level : 'N3'
  return [
    {
      id: 'knowledge',
      label: '言語知識（文字・語彙・文法）',
      duration: 25 * 60,
      questions: jlptKnowledgeCore.map((q, i) => ({
        ...q,
        id: `jlpt-${validLevel}-k-${i + 1}`,
        languageId: 'japanese',
      })),
    },
    {
      id: 'reading',
      label: '読解 · Đọc hiểu',
      duration: 25 * 60,
      questions: jlptReadingCore.map((q, i) => ({
        ...q,
        id: `jlpt-${validLevel}-r-${i + 1}`,
        languageId: 'japanese',
      })),
    },
    {
      id: 'listening',
      label: '聴解 · Nghe hiểu',
      duration: 20 * 60,
      questions: jlptListeningCore.map((q, i) => ({
        ...q,
        id: `jlpt-${validLevel}-l-${i + 1}`,
        languageId: 'japanese',
      })),
    },
  ]
}

export function buildJlptResult({ answers = {}, sections = [], elapsed = {} }, level = 'N3') {
  const validLevel = JLPT_LEVELS.includes(level) ? level : 'N3'
  const passMark = JLPT_PASS_MARKS[validLevel] || 95

  const scoreSection = (sectionId) => {
    const sec = sections.find((s) => s.id === sectionId)
    if (!sec || !sec.questions.length) return { score: 0, correct: 0, total: 0, passedSection: false }
    const correct = sec.questions.filter((q) => isCorrectAnswer(q, answers[q.id])).length
    const score = Math.round((correct / sec.questions.length) * 60)
    return {
      score,
      correct,
      total: sec.questions.length,
      passedSection: score >= JLPT_SECTION_MIN,
    }
  }

  const knowledge = scoreSection('knowledge')
  const reading = scoreSection('reading')
  const listening = scoreSection('listening')

  const totalScore = knowledge.score + reading.score + listening.score
  const totalQuestions = knowledge.total + reading.total + listening.total
  const totalCorrect = knowledge.correct + reading.correct + listening.correct
  const unanswered = sections.reduce(
    (sum, s) => sum + s.questions.filter((q) => !hasAnswer(answers[q.id])).length,
    0,
  )
  const allSectionsPassed = knowledge.passedSection && reading.passedSection && listening.passedSection
  const passed = totalScore >= passMark && allSectionsPassed
  const timeUsed = Object.values(elapsed).reduce((sum, sec) => sum + (Number(sec) || 0), 0)
  const accuracy = Math.round((totalCorrect / Math.max(1, totalQuestions)) * 100)

  return {
    exam: 'JLPT',
    level: validLevel,
    score: totalScore,
    maxScore: 180,
    passMark,
    sectionMin: JLPT_SECTION_MIN,
    allSectionsPassed,
    passed,
    knowledgeScore: knowledge.score,
    knowledgeCorrect: knowledge.correct,
    knowledgeTotal: knowledge.total,
    readingScore: reading.score,
    readingCorrect: reading.correct,
    readingTotal: reading.total,
    listeningScore: listening.score,
    listeningCorrect: listening.correct,
    listeningTotal: listening.total,
    correct: totalCorrect,
    total: totalQuestions,
    wrong: totalQuestions - totalCorrect - unanswered,
    unanswered,
    accuracy,
    timeUsed,
  }
}

export const jlptKnowledgePractice = jlptKnowledgeCore.map((q, idx) => ({ ...q, id: `jlpt-prac-k-${idx + 1}`, languageId: 'japanese' }))
export const jlptReadingListeningPractice = [...jlptReadingCore, ...jlptListeningCore].map((q, idx) => ({ ...q, id: `jlpt-prac-rl-${idx + 1}`, languageId: 'japanese' }))
