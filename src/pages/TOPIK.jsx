import { Award, BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Headphones, History, PenLine, RotateCcw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import AudioPlayer from '../components/common/AudioPlayer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import SectionedExamRunner from '../components/exam/SectionedExamRunner'
import { useApp } from '../context/AppContext'
import { TOPIK_LEVELS, buildTopikExamSections, buildTopikResult, topikListeningPractice, topikReadingWritingPractice } from '../data/exams/topikExam'
import { buildExamMistakes } from '../utils/examMistakes'

const tabs = ['Overview', 'Full Test', '듣기 (Listening)', '읽기·쓰기 (Reading & Writing)', 'History']

export default function TOPIK() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const defaultLevel = TOPIK_LEVELS.includes(state.selectedLevel) ? state.selectedLevel : (state.topikTarget || 'TOPIK 2')
  const [examLevel, setExamLevel] = useState(defaultLevel)

  useEffect(() => {
    if (state.selectedLanguage === 'korean' && TOPIK_LEVELS.includes(state.selectedLevel)) {
      setExamLevel(state.selectedLevel)
    }
  }, [state.selectedLanguage, state.selectedLevel])

  const latest = (state.topikHistory || [])[0]
  const isTopik2 = ['TOPIK 3', 'TOPIK 4', 'TOPIK 5', 'TOPIK 6'].includes(examLevel)

  return (
    <div className="inner-page section-shell learning-hub exam-hub">
      <div className="hub-hero exam-hero">
        <div>
          <span className="overline">TEST OF PROFICIENCY IN KOREAN · 한국어능력시험 (TOPIK)</span>
          <h1>Thi thử {isTopik2 ? `TOPIK II (${examLevel})` : `TOPIK I (${examLevel})`} chuẩn NIIED Hàn Quốc</h1>
          <p>
            {isTopik2
              ? 'TOPIK II (Cấp 3–6) gồm 3 phần: 듣기 (Nghe hiểu 100đ) · 쓰기 (Viết & Điền khuyết Câu 51–54 100đ) · 읽기 (Đọc hiểu 100đ) — Thang 300 điểm.'
              : 'TOPIK I (Cấp 1–2) gồm 2 phần: 듣기 (Nghe hiểu 100đ) · 읽기 (Đọc hiểu 100đ) — Thang 200 điểm (≥ 80đ đạt 1급, ≥ 140đ đạt 2급).'}
          </p>
        </div>
        <label className="target-picker">
          <span>Cấp độ mục tiêu TOPIK</span>
          <select
            aria-label="Cấp độ mục tiêu TOPIK"
            value={examLevel}
            onChange={(e) => {
              setExamLevel(e.target.value)
              update({ topikTarget: e.target.value })
            }}
          >
            {TOPIK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl} ({['TOPIK 1', 'TOPIK 2'].includes(lvl) ? 'TOPIK I' : 'TOPIK II'})</option>
            ))}
          </select>
        </label>
      </div>

      <div className="hub-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? 'active' : ''}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <TOPIKOverview examLevel={examLevel} isTopik2={isTopik2} latest={latest} onOpen={setTab} />}
      {tab === 'Full Test' && <TOPIKFullTest key={examLevel} examLevel={examLevel} onHistory={() => setTab('History')} />}
      {tab === '듣기 (Listening)' && <TOPIKPractice questions={topikListeningPractice} label="TOPIK 듣기 · Luyện Nghe hiểu tiếng Hàn" audio />}
      {tab === '읽기·쓰기 (Reading & Writing)' && <TOPIKPractice questions={topikReadingWritingPractice} label="TOPIK 읽기·쓰기 · Luyện Đọc & Viết 51–54" />}
      {tab === 'History' && <TOPIKHistory history={state.topikHistory || []} />}
    </div>
  )
}

function TOPIKOverview({ examLevel, isTopik2, latest, onOpen }) {
  const maxScore = isTopik2 ? 300 : 200
  return (
    <>
      <div className="metric-grid exam-metrics">
        <StatisticsCard icon={Target} value={latest ? `${latest.score}/${latest.maxScore}` : '—'} label="Điểm TOPIK gần nhất" />
        <StatisticsCard icon={Award} value={latest?.achievedGrade || examLevel} label="Cấp độ (급) đạt được" />
        <StatisticsCard icon={Headphones} value={latest?.listeningScore ?? '—'} label="듣기 · Nghe (/100)" />
        <StatisticsCard icon={BookOpen} value={latest?.readingScore ?? '—'} label="읽기 · Đọc (/100)" />
        <StatisticsCard icon={PenLine} value={isTopik2 ? (latest?.writingScore ?? '—') : 'TOPIK I miễn'} label="쓰기 · Viết (/100)" />
        <StatisticsCard icon={BarChart3} value={latest ? `${latest.accuracy}%` : '—'} label="Độ chính xác" />
      </div>

      <section className="exam-primary-cta">
        <div>
          <span className="overline">OFFICIAL MOCK EXAM · {isTopik2 ? 'TOPIK II' : 'TOPIK I'} ({examLevel})</span>
          <h2>Đề thi {isTopik2 ? 'TOPIK II (300 điểm)' : 'TOPIK I (200 điểm)'} chuẩn NIIED</h2>
          <p>
            Mô phỏng sát cấu trúc đề thi TOPIK chính thức với audio tiếng Hàn (ko-KR), câu hỏi sắp xếp đoạn văn (가)-(나)-(다)-(라), điền khuyết 쓰기 51–54 và bảng giải thích đáp án chi tiết từng câu.
          </p>
        </div>
        <button className="btn large" onClick={() => onOpen('Full Test')}>
          Bắt đầu Full Test {examLevel} <ChevronRight />
        </button>
      </section>

      <div className="exam-format-grid">
        <article>
          <span><Headphones /></span>
          <div>
            <h3>1교시：듣기 (Nghe hiểu)</h3>
            <strong>8 câu · 20 phút · 100 điểm</strong>
            <p>Chọn câu phản hồi tiếp theo, tìm hành động nhân vật sẽ làm tiếp, nghe thông báo công cộng và phỏng vấn chuyên đề.</p>
          </div>
        </article>
        {isTopik2 && (
          <article>
            <span><PenLine /></span>
            <div>
              <h3>1교시：쓰기 (Viết &amp; Điền khuyết 51–54)</h3>
              <strong>4 câu · 20 phút · 100 điểm</strong>
              <p>Điền khuyết email đời sống (Câu 51), văn bản giải thích khoa học (Câu 52), phân tích biểu đồ (Câu 53) và nghị luận xã hội (Câu 54).</p>
            </div>
          </article>
        )}
        <article>
          <span><BookOpen /></span>
          <div>
            <h3>2교시：읽기 (Đọc hiểu)</h3>
            <strong>8 câu · 25 phút · 100 điểm</strong>
            <p>Ngữ pháp điền khuyết, đọc thông báo, sắp xếp thứ tự 4 câu (가)-(나)-(다)-(라), thành ngữ tiếng Hàn và đọc hiểu học thuật.</p>
          </div>
        </article>
      </div>

      <section className="panel exam-note">
        <h2>Thang điểm phân cấp TOPIK I &amp; TOPIK II (NIIED)</h2>
        <p>
          • <strong>TOPIK I (Thang 200 điểm):</strong> Đạt 80–139 điểm nhận chứng chỉ <strong>1급 (Cấp 1)</strong>; đạt từ 140–200 điểm nhận chứng chỉ <strong>2급 (Cấp 2)</strong>.<br />
          • <strong>TOPIK II (Thang 300 điểm):</strong> 120–149 điểm đạt <strong>3급</strong>; 150–189 điểm đạt <strong>4급</strong>; 190–229 điểm đạt <strong>5급</strong>; từ 230–300 điểm đạt <strong>6급 (Cấp cao nhất)</strong>.
        </p>
      </section>
    </>
  )
}

function TOPIKFullTest({ examLevel, onHistory }) {
  const { saveExamResult, addMistakes } = useApp()
  const sections = buildTopikExamSections(examLevel)
  return (
    <SectionedExamRunner
      title={`Kỳ thi TOPIK Thực chiến · ${examLevel} (한국어능력시험)`}
      subtitle={`Hệ thống tự động chấm điểm và xếp cấp chứng chỉ (1급 – 6급) theo đúng thang điểm NIIED Hàn Quốc, kèm giải thích chi tiết từng câu sau khi nộp bài.`}
      sections={sections}
      sectionsFactory={() => buildTopikExamSections(examLevel)}
      sessionKey={`topik-full-${examLevel.toLowerCase().replace(/\s+/g, '-')}`}
      languageId="korean"
      startNotes={[
        'Phần 듣기 (Nghe hiểu): Chú ý câu cuối của người nói để xác định hành động tiếp theo (이어서 할 행동).',
        ...(sections.length === 3 ? ['Phần 쓰기 (Viết 51–54): Phân biệt rõ thể lịch sự trang trọng (-ㅂ니다/습니다) ở Câu 51 và thể văn viết trung tính (-ㄴ/는다) ở Câu 52–54.'] : []),
        'Phần 읽기 (Đọc hiểu): Chú ý các từ nối chỉ nguyên nhân – kết quả và từ chỉ định (이러한, 이처럼) khi sắp xếp đoạn văn.',
        'Sau khi nộp bài, toàn bộ đáp án chuẩn và giải thích chi tiết sẽ mở ngay bên dưới.',
      ]}
      buildResult={(payload) => buildTopikResult(payload, examLevel)}
      onComplete={(report, attempt) => {
        saveExamResult('topik', report)
        addMistakes(buildExamMistakes('TOPIK', attempt.sections, attempt.answers, '/topik'))
      }}
      renderResult={({ result, restart }) => (
        <section className="practice-result exam-result full-score-report">
          <span>{result.passed ? '🏅' : '📋'}</span>
          <h2>Kết quả {result.exam} · Xếp cấp: {result.achievedGrade}</h2>
          <strong>{result.score} / {result.maxScore}</strong>
          <p className="score-scale">Mục tiêu đăng ký: {result.level}</p>
          <div className="result-breakdown">
            <div>
              <b>{result.listeningScore}/100</b>
              <span>듣기 · Nghe hiểu</span>
              <small>{result.listeningCorrect}/{result.listeningTotal} câu đúng</small>
            </div>
            {result.isTopik2 && (
              <div>
                <b>{result.writingScore}/100</b>
                <span>쓰기 · Viết (51–54)</span>
                <small>{result.writingCorrect}/{result.writingTotal} câu đúng</small>
              </div>
            )}
            <div>
              <b>{result.readingScore}/100</b>
              <span>읽기 · Đọc hiểu</span>
              <small>{result.readingCorrect}/{result.readingTotal} câu đúng</small>
            </div>
            <div>
              <b>{result.accuracy}%</b>
              <span>Độ chính xác</span>
              <small>{result.correct}/{result.total} câu đúng</small>
            </div>
            <div>
              <b>{result.unanswered}</b>
              <span>Bỏ trống</span>
              <small>câu chưa chọn</small>
            </div>
            <div>
              <b>{Math.max(1, Math.ceil(result.timeUsed / 60))}p</b>
              <span>Thời gian làm</span>
              <small>tổng thời gian</small>
            </div>
          </div>
          <p>
            <strong>Đánh giá cấp độ NIIED:</strong>{' '}
            {result.passed
              ? `Chúc mừng! Với ${result.score}/${result.maxScore} điểm, bạn đạt mức ${result.achievedGrade}. Hãy xem bảng giải thích chi tiết từng câu bên dưới.`
              : `Tổng điểm hiện tại (${result.score}/${result.maxScore}) chưa đủ ngưỡng xét cấp tối thiểu. Các câu sai đã được lưu vào Sổ lỗi sai và giải thích chi tiết bên dưới.`}
          </p>
          <div className="center-actions">
            <button className="btn secondary" onClick={restart}><RotateCcw /> Thi lại {result.level}</button>
            <button className="btn" onClick={onHistory}>Xem lịch sử thi TOPIK</button>
          </div>
        </section>
      )}
    />
  )
}

function TOPIKPractice({ questions, label, audio = false }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [done, setDone] = useState(false)
  const correct = questions.filter((item) => answers[item.id] === item.answer).length

  if (done) {
    return (
      <section className="practice-result exam-result">
        <CheckCircle2 />
        <h2>{label} hoàn thành</h2>
        <strong>{correct}/{questions.length}</strong>
        <p>Độ chính xác {Math.round((correct / Math.max(1, questions.length)) * 100)}%.</p>
        <button className="btn" onClick={() => { setIndex(0); setAnswers({}); setChecked({}); setDone(false) }}>
          <RotateCcw /> Luyện lại
        </button>
      </section>
    )
  }

  const q = questions[index]
  const selected = answers[q.id]
  const isChecked = checked[q.id]
  const isLast = index === questions.length - 1

  return (
    <section className="exam-practice">
      <div className="practice-head">
        <div>
          <span>{q.type}</span>
          <strong>Câu {index + 1}/{questions.length}</strong>
        </div>
        <ProgressBar value={index + Number(Boolean(isChecked))} max={questions.length} />
      </div>
      {(audio || q.audio) && <AudioPlayer text={q.audio} languageId="korean" label="Phát audio tiếng Hàn" />}
      {q.passage && (
        <article className="exam-passage">
          <h3>{q.passageTitle || 'Đoạn văn TOPIK'}</h3>
          <p>{q.passage}</p>
        </article>
      )}
      <QuizQuestion
        question={q}
        value={selected}
        onChange={(value) => setAnswers((current) => ({ ...current, [q.id]: value }))}
        checked={isChecked}
      />
      <div className="practice-actions spread">
        <button className="btn ghost" disabled={index === 0} onClick={() => setIndex((v) => Math.max(0, v - 1))}>
          <ChevronLeft /> Câu trước
        </button>
        {!isChecked && (
          <button className="btn" disabled={selected === undefined} onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))}>
            Kiểm tra đáp án
          </button>
        )}
        {isChecked && !isLast && (
          <button className="btn" onClick={() => setIndex((v) => v + 1)}>
            Câu tiếp <ChevronRight />
          </button>
        )}
        {isChecked && isLast && (
          <button className="btn" onClick={() => setDone(true)}>
            Xem kết quả
          </button>
        )}
      </div>
    </section>
  )
}

function TOPIKHistory({ history }) {
  if (!history.length) {
    return (
      <div className="empty-inline">
        <History />
        <h2>Chưa có lịch sử thi TOPIK</h2>
        <p>Hoàn thành bài thi Full Test TOPIK I hoặc TOPIK II để lưu kết quả.</p>
      </div>
    )
  }
  return (
    <section className="history-list">
      <div className="panel-title">
        <div>
          <h2>Lịch sử thi thử TOPIK</h2>
          <p>{history.length} lần thi gần nhất trên thiết bị này.</p>
        </div>
      </div>
      {history.map((item) => (
        <article key={item.id}>
          <div>
            <strong>{item.score}/{item.maxScore}</strong>
            <span>{item.achievedGrade}</span>
          </div>
          <div><b>{item.listeningScore}</b><span>듣기 Nghe</span></div>
          <div><b>{item.isTopik2 ? item.writingScore : '—'}</b><span>쓰기 Viết</span></div>
          <div><b>{item.readingScore}</b><span>읽기 Đọc</span></div>
          <div><b>{item.accuracy}%</b><span>Chính xác</span></div>
          <time>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(item.date))}</time>
        </article>
      ))}
    </section>
  )
}
