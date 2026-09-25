# Báo cáo hoàn thiện NT

## SOURCE REVIEW

- Đã rà cấu trúc, route, state, `localStorage`, dữ liệu, bài học, Vocabulary, Grammar, TOEIC, IELTS, responsive và các luồng trình duyệt chính.
- Các vấn đề lớn được tìm thấy: kho từ chưa đạt ngưỡng sử dụng thực tế; Vocabulary render toàn bộ danh sách; search chưa debounce; Review chưa có cỡ phiên; thiếu lịch sử học tập riêng; IELTS Writing hiển thị band tính từ quy tắc cục bộ; thông báo về dữ liệu đa ngôn ngữ đã lỗi thời.

## FIXED

- Giữ progress độc lập theo ngôn ngữ và level; đổi level không xóa dữ liệu cũ, refresh không mất phiên học hoặc bản nháp.
- Sửa liên kết từ bookmark, lỗi sai và kết quả tìm kiếm để quay lại đúng nội dung.
- Sửa chọn nghĩa tiếng Anh theo đúng từ loại, loại trùng từ không hợp lý giữa các level Trung, Nhật, Hàn và ưu tiên dữ liệu biên tập khi trùng nguồn sinh.
- IELTS Writing không còn tạo band giả. Module hiện báo checklist theo quy tắc cho độ dài, bố cục, từ nối và độ đa dạng từ, đồng thời nói rõ đây không phải IELTS band.
- Sửa label bộ sắp xếp gây xung đột accessibility với bộ lọc Level.

## IMPLEMENTED

- Pipeline sinh dữ liệu có thể chạy lại bằng `npm run build:vocabulary`, kèm attribution và các cặp câu Tatoeba cần thiết để tái tạo dữ liệu.
- `vocabularyService` có `getVocabulary`, truy vấn theo language/level/topic, search bỏ dấu, random batch và review due.
- Vocabulary có search debounce, tìm trong từ/nghĩa Việt/topic/collocation, lọc trạng thái, sắp xếp A–Z/level/gần đây/khó nhất và load more 50 từ.
- Vocabulary Detail có phát âm, nghĩa, ví dụ, quan hệ từ, yêu thích, đánh dấu khó/đã học, ghi chú, custom list và luyện riêng một từ.
- Quiz dùng dữ liệu catalog, 11 dạng câu hỏi, SRS, kết quả đúng/sai/độ chính xác/thời gian và retry từ sai.
- Review có Due, New, Difficult, Recently Wrong, Mastered; lượt 5/10/20/all và Smart Review 5/10/20 phút.
- Flashcards hỗ trợ query theo language/level/limit, Again/Hard/Good/Easy, next/previous/shuffle/restart/progress.
- Trang History hiển thị hoạt động hôm nay, hôm qua hoặc 7 ngày gần nhất từ `learningHistory` thật.
- IELTS Writing tự lưu bản nháp, có nút lưu/xóa và checklist cục bộ không giả lập AI.

## VOCABULARY DATA

- English A1: **250**
- English A2: **264**
- English B1: **288**
- English B2: **292**
- English C1: **163**
- English C2: **120**
- English total: **1.377**
- Chinese total: **327**
- Japanese total: **328**
- Korean total: **315**
- Tổng catalog: **2.347** mục, ID lịch học không trùng.

Nguồn chính gồm CEFR-J, Octanove C1/C2, Skypedia English–Vietnamese Dictionary, CVDICT, HSK Vocabulary, OpenJLPT, NIKL TOPIK và Tatoeba. Chi tiết giấy phép nằm trong `src/data/vocabulary/ATTRIBUTION.md`.

## IMPROVED

- Dữ liệu từ vựng được tải trong chunk riêng khi cần; gói khởi động production khoảng 83 KB gzip.
- Danh sách lớn chỉ render 50 mục đầu, có load more và responsive theo chiều ngang trên mobile.
- Global Search có debounce, bỏ dấu và index thêm ví dụ, collocation, phrase, synonym.
- Bổ sung đầy đủ nhóm topic thực tế và chuyên biệt: TOEIC, IELTS, Academic Vocabulary, Business English, Phrasal Verbs, Collocations, Idioms, Common Expressions và Sports.

## REMOVED

- Bỏ thông báo “bộ mẫu ngắn” đã sai trên Vocabulary.
- Bỏ band IELTS suy ra từ độ dài và số từ nối.
- Không thêm placeholder, button giả hoặc dữ liệu `word001` để đạt số lượng.

## TESTED

- `npm run test:data`: validation số lượng, required fields, duplicate, helper service và quiz data.
- `npm run test:e2e`: chọn language/level, hoàn thành lesson, persistence, SRS, search debounce, Vocabulary load more 50→100, flashcard 5 thẻ, route, History, 404, back/refresh, dark mode và responsive 320–1440 px.
- `npm run test:platform`: Vocabulary/SRS/Quiz, TOEIC, IELTS Reading/Writing/Speaking, Review, My Vocabulary, Grammar, reading lookup và Settings.
- `npm run build`: production build thành công.

## REMAINING

- Audio người thật, chấm phát âm, chấm bài viết và IELTS band đáng tin cậy cần dịch vụ speech/scoring hoặc người chấm bên ngoài.
- Đồng bộ đa thiết bị và tài khoản cần backend.
- Phân loại CEFR/HSK/JLPT/TOPIK và toàn bộ bản dịch nên tiếp tục được giáo viên hoặc người bản ngữ thẩm định trước khi dùng cho chương trình chính thức.

