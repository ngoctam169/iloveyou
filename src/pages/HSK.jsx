import { Award, BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, History, PenLine, RotateCcw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import AudioPlayer from '../components/common/AudioPlayer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import SectionedExamRunner from '../components/exam/SectionedExamRunner'
import { useApp } from '../context/AppContext'
import { HSK_LEVELS, buildHskExamSections, buildHskResult, hskListeningPractice, hskReadingWritingPractice } from '../data/exams/hskExam'
import { buildExamMistakes } from '../utils/examMistakes'

const tabs = ['Overview', 'Full Test', 'Listening Practice', 'Reading & Writing', 'History']

export default function HSK() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const defaultLevel = HSK_LEVELS.includes(state.selectedLevel) ? state.selectedLevel : (state.hskTarget || 'HSK 3')
  const [examLevel, setExamLevel] = useState(defaultLevel)

  useEffect(() => {
    if (state.selectedLanguage === 'chinese' && HSK_LEVELS.includes(state.selectedLevel)) {
      setExamLevel(state.selectedLevel)
    }
  }, [state.selectedLanguage, state.selectedLevel])

  const latest = (state.hskHistory || [])[0]
  const hasWriting = !['HSK 1', 'HSK 2'].includes(examLevel)

  return (
    <div className="inner-page section-shell learning-hub exam-hub">
      <div className="hub-hero exam-hero">
        <div>
          <span className="overline">CHINESE PROFICIENCY TEST · 汉语水平考试 (HSK)</span>
          <h1>Thi thử {examLevel} Thực chiến chuẩn Hanban / CTI</h1>
          <p>
            {hasWriting
              ? `${examLevel} gồm 3 phần: 听力 (Nghe hiểu 100đ) · 阅读 (Đọc hiểu 100đ) · 书写 (Viết & Sắp xếp câu 100đ) — Tổng 300 điểm (Đậu ≥ 180).`
              : `${examLevel} gồm 2 phần: 听力 (Nghe hiểu 100đ) · 阅读 (Đọc hiểu 100đ) — Tổng 200 điểm (Đậu ≥ 120).`}
          </p>
        </div>
        <label className="target-picker">
          <span>Cấp độ dự thi HSK</span>
          <select
            aria-label="Cấp độ dự thi HSK"
            value={examLevel}
            onChange={(e) => {
              setExamLevel(e.target.value)
              update({ hskTarget: e.target.value })
            }}
          >
            {HSK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
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

      {tab === 'Overview' && <HSKOverview examLevel={examLevel} hasWriting={hasWriting} latest={latest} onOpen={setTab} />}
      {tab === 'Full Test' && <HSKFullTest key={examLevel} examLevel={examLevel} onHistory={() => setTab('History')} />}
      {tab === 'Listening Practice' && <HSKPractice questions={hskListeningPractice} label="HSK 听力 · Luyện Nghe hiểu" audio />}
      {tab === 'Reading & Writing' && <HSKPractice questions={hskReadingWritingPractice} label="HSK 阅读与书写 · Luyện Đọc & Sắp xếp câu" />}
      {tab === 'History' && <HSKHistory history={state.hskHistory || []} />}
    </div>
  )
}

function HSKOverview({ examLevel, hasWriting, latest, onOpen }) {
  const maxScore = hasWriting ? 300 : 200
  const passMark = hasWriting ? 180 : 120
  return (
    <>
      <div className="metric-grid exam-metrics">
        <StatisticsCard icon={Target} value={latest ? `${latest.score}/${latest.maxScore}` : '—'} label="Điểm HSK gần nhất" />
        <StatisticsCard icon={Award} value={latest ? (latest.passed ? '合格 (Đậu)' : 'Chưa đạt') : `≥ ${passMark}/${maxScore}`} label="Chuẩn đạt HSK" />
        <StatisticsCard icon={Headphones} value={latest?.listeningScore ?? '—'} label="听力 · Nghe (/100)" />
        <StatisticsCard icon={BookOpen} value={latest?.readingScore ?? '—'} label="阅读 · Đọc (/100)" />
        <StatisticsCard icon={PenLine} value={hasWriting ? (latest?.writingScore ?? '—') : 'Miễn thi'} label="书写 · Viết (/100)" />
        <StatisticsCard icon={BarChart3} value={latest ? `${latest.accuracy}%` : '—'} label="Độ chính xác" />
      </div>

      <section className="exam-primary-cta">
        <div>
          <span className="overline">OFFICIAL MOCK EXAM · {examLevel}</span>
          <h2>Đề thi {examLevel} bấm giờ chuẩn phòng thi ({maxScore} điểm)</h2>
          <p>
            Audio tiếng Trung phát 1 lần trong chế độ Full Test, tự động lưu bài làm khi tải lại trang, hết giờ tự chuyển phần và có bảng chấm chữa giải thích từng câu sau khi nộp bài.
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
            <h3>第一部分：听力 (Nghe hiểu)</h3>
            <strong>12 câu · 20 phút · 100 điểm</strong>
            <p>Nghe câu ngắn, hội thoại đời sống – công sở và đoạn văn ngắn bằng giọng đọc tiếng Trung chuẩn.</p>
          </div>
        </article>
        <article>
          <span><BookOpen /></span>
          <div>
            <h3>第二部分：阅读 (Đọc hiểu)</h3>
            <strong>12 câu · 25 phút · 100 điểm</strong>
            <p>Điền từ vào chỗ trống (选词填空), sắp xếp thứ tự mệnh đề (排列顺序) và đọc hiểu đoạn văn (阅读理解).</p>
          </div>
        </article>
        {hasWriting && (
          <article>
            <span><PenLine /></span>
            <div>
              <h3>第三部分：书写 (Viết &amp; Cấu trúc)</h3>
              <strong>8 câu · 20 phút · 100 điểm</strong>
              <p>Sắp xếp từ thành câu chuẩn ngữ pháp (câu chữ 把, chữ 被, chữ 比, 连…都…) và đặt câu theo từ khóa.</p>
            </div>
          </article>
        )}
      </div>

      <section className="panel exam-note">
        <h2>Quy tắc chấm điểm HSK chuẩn Quốc tế</h2>
        <p>
          Ở cấp độ HSK 1 và HSK 2, bài thi gồm 2 phần Nghe (100 điểm) và Đọc (100 điểm), tổng 200 điểm, đạt từ 120 điểm trở lên là Đậu (合格). Từ HSK 3 đến HSK 6, bài thi có thêm phần Viết &amp; Sắp xếp câu (100 điểm), tổng 300 điểm, đạt từ 180 điểm trở lên là Đậu (合格).
        </p>
      </section>
    </>
  )
}

function HSKFullTest({ examLevel, onHistory }) {
  const { saveExamResult, addMistakes } = useApp()
  const sections = buildHskExamSections(examLevel)
  return (
    <SectionedExamRunner
      title={`Kỳ thi HSK Thực chiến · ${examLevel} (汉语水平考试)`}
      subtitle={`Mô phỏng đầy đủ các phần thi của ${examLevel}. Sau khi nộp bài, hệ thống chấm điểm theo thang ${sections.length * 100} điểm và mở bảng giải thích chi tiết từng câu.`}
      sections={sections}
      sectionsFactory={() => buildHskExamSections(examLevel)}
      sessionKey={`hsk-full-${examLevel.toLowerCase().replace(/\s+/g, '-')}`}
      languageId="chinese"
      startNotes={[
        'Phần 1 — 听力 (Nghe hiểu): Phát âm tiếng Trung chuẩn 1×, ưu tiên nghe từ khóa thời gian, địa điểm và hành động.',
        'Phần 2 — 阅读 (Đọc hiểu): Chú ý cặp liên từ (不仅…而且…, 只有…才…) và câu chủ đề cuối đoạn.',
        ...(sections.length === 3 ? ['Phần 3 — 书写 (Viết & Sắp xếp câu): Kiểm tra kỹ trật tự câu chữ 把, chữ 被 và bổ ngữ kết quả.'] : []),
        'Sau khi bấm Nộp bài, bạn có thể xem lại đáp án chuẩn, transcript và giải thích ngữ pháp của toàn bộ câu hỏi.',
      ]}
      buildResult={(payload) => buildHskResult(payload, examLevel)}
      onComplete={(report, attempt) => {
        saveExamResult('hsk', report)
        addMistakes(buildExamMistakes('HSK', attempt.sections, attempt.answers, '/hsk'))
      }}
      renderResult={({ result, restart }) => (
        <section className="practice-result exam-result full-score-report">
          <span>{result.passed ? '🏆' : '📋'}</span>
          <h2>Kết quả thi thử {result.level} · {result.passed ? '合格 (ĐẠT CHUẨN HSK)' : '不合格 (CHƯA ĐẠT)'}</h2>
          <strong>{result.score} / {result.maxScore}</strong>
          <p className="score-scale">Điểm chuẩn đạt {result.level}: ≥ {result.passMark}/{result.maxScore} điểm</p>
          <div className="result-breakdown">
            <div>
              <b>{result.listeningScore}/100</b>
              <span>听力 · Nghe hiểu</span>
              <small>{result.listeningCorrect}/{result.listeningTotal} câu đúng</small>
            </div>
            <div>
              <b>{result.readingScore}/100</b>
              <span>阅读 · Đọc hiểu</span>
              <small>{result.readingCorrect}/{result.readingTotal} câu đúng</small>
            </div>
            {result.hasWriting && (
              <div>
                <b>{result.writingScore}/100</b>
                <span>书写 · Viết câu</span>
                <small>{result.writingCorrect}/{result.writingTotal} câu đúng</small>
              </div>
            )}
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
            <strong>Đánh giá năng lực:</strong>{' '}
            {result.passed
              ? `Chúc mừng! Bạn đã vượt ngưỡng đậu ${result.level} (${result.score}/${result.maxScore}). Hãy xem bảng chấm chữa chi tiết bên dưới để nắm chắc các câu khó.`
              : `Bạn còn thiếu ${result.passMark - result.score} điểm để đạt chuẩn ${result.level}. Các câu sai đã được lưu vào Sổ lỗi sai và giải thích chi tiết ngay bên dưới.`}
          </p>
          <div className="center-actions">
            <button className="btn secondary" onClick={restart}><RotateCcw /> Thi lại đề {result.level}</button>
            <button className="btn" onClick={onHistory}>Xem lịch sử thi HSK</button>
          </div>
        </section>
      )}
    />
  )
}

function HSKPractice({ questions, label, audio = false }) {
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
      {(audio || q.audio) && <AudioPlayer text={q.audio} languageId="chinese" label="Phát hội thoại tiếng Trung" />}
      {q.passage && (
        <article className="exam-passage">
          <h3>{q.passageTitle || 'Đoạn văn HSK'}</h3>
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

function HSKHistory({ history }) {
  if (!history.length) {
    return (
      <div className="empty-inline">
        <History />
        <h2>Chưa có lịch sử thi HSK</h2>
        <p>Hoàn thành bài thi Full Test HSK để lưu bảng điểm và theo dõi tiến độ.</p>
      </div>
    )
  }
  return (
    <section className="history-list">
      <div className="panel-title">
        <div>
          <h2>Lịch sử thi thử HSK</h2>
          <p>{history.length} lần thi gần nhất trên thiết bị này.</p>
        </div>
      </div>
      {history.map((item) => (
        <article key={item.id}>
          <div>
            <strong>{item.score}/{item.maxScore}</strong>
            <span>{item.level} · {item.passed ? '合格 (Đậu)' : 'Chưa đạt'}</span>
          </div>
          <div><b>{item.listeningScore}</b><span>听力 Nghe</span></div>
          <div><b>{item.readingScore}</b><span>阅读 Đọc</span></div>
          <div><b>{item.hasWriting ? item.writingScore : '—'}</b><span>书写 Viết</span></div>
          <div><b>{item.accuracy}%</b><span>Chính xác</span></div>
          <time>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(item.date))}</time>
        </article>
      ))}
    </section>
  )
}
