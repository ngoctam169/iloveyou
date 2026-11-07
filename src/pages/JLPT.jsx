import { Award, BarChart3, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Headphones, History, Languages, RotateCcw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import AudioPlayer from '../components/common/AudioPlayer'
import ProgressBar from '../components/common/ProgressBar'
import QuizQuestion from '../components/common/QuizQuestion'
import StatisticsCard from '../components/common/StatisticsCard'
import SectionedExamRunner from '../components/exam/SectionedExamRunner'
import { useApp } from '../context/AppContext'
import { JLPT_LEVELS, JLPT_PASS_MARKS, JLPT_SECTION_MIN, buildJlptExamSections, buildJlptResult, jlptKnowledgePractice, jlptReadingListeningPractice } from '../data/exams/jlptExam'
import { buildExamMistakes } from '../utils/examMistakes'

const tabs = ['Overview', 'Full Test', '文字・語彙・文法', '読解・聴解', 'History']

export default function JLPT() {
  const { state, update } = useApp()
  const [tab, setTab] = useState('Overview')
  const defaultLevel = JLPT_LEVELS.includes(state.selectedLevel) ? state.selectedLevel : (state.jlptTarget || 'N3')
  const [examLevel, setExamLevel] = useState(defaultLevel)

  useEffect(() => {
    if (state.selectedLanguage === 'japanese' && JLPT_LEVELS.includes(state.selectedLevel)) {
      setExamLevel(state.selectedLevel)
    }
  }, [state.selectedLanguage, state.selectedLevel])

  const latest = (state.jlptHistory || [])[0]
  const passMark = JLPT_PASS_MARKS[examLevel] || 95

  return (
    <div className="inner-page section-shell learning-hub exam-hub">
      <div className="hub-hero exam-hero">
        <div>
          <span className="overline">JAPANESE-LANGUAGE PROFICIENCY TEST · 日本語能力試験 (JLPT)</span>
          <h1>Thi thử JLPT {examLevel} Thực chiến chuẩn JEES</h1>
          <p>
            3 phần thi chuẩn quốc tế: 言語知識 (Chữ Hán·Từ vựng·Ngữ pháp 60đ) · 読解 (Đọc hiểu 60đ) · 聴解 (Nghe hiểu 60đ) — Thang 180 điểm (Đậu {examLevel} ≥ {passMark}/180 &amp; không phần nào dưới {JLPT_SECTION_MIN}/60).
          </p>
        </div>
        <label className="target-picker">
          <span>Cấp độ dự thi JLPT</span>
          <select
            aria-label="Cấp độ dự thi JLPT"
            value={examLevel}
            onChange={(e) => {
              setExamLevel(e.target.value)
              update({ jlptTarget: e.target.value })
            }}
          >
            {JLPT_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>JLPT {lvl}</option>
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

      {tab === 'Overview' && <JLPTOverview examLevel={examLevel} passMark={passMark} latest={latest} onOpen={setTab} />}
      {tab === 'Full Test' && <JLPTFullTest key={examLevel} examLevel={examLevel} onHistory={() => setTab('History')} />}
      {tab === '文字・語彙・文法' && <JLPTPractice questions={jlptKnowledgePractice} label="JLPT 言語知識（文字・語彙・文法）" />}
      {tab === '読解・聴解' && <JLPTPractice questions={jlptReadingListeningPractice} label="JLPT 読解・聴解 (Đọc hiểu & Nghe hiểu)" />}
      {tab === 'History' && <JLPTHistory history={state.jlptHistory || []} />}
    </div>
  )
}

function JLPTOverview({ examLevel, passMark, latest, onOpen }) {
  return (
    <>
      <div className="metric-grid exam-metrics">
        <StatisticsCard icon={Target} value={latest ? `${latest.score}/180` : '—'} label="Điểm JLPT gần nhất" />
        <StatisticsCard icon={Award} value={latest ? (latest.passed ? '合格 (Đậu)' : '不合格') : `≥ ${passMark}/180`} label={`Điểm chuẩn ${examLevel}`} />
        <StatisticsCard icon={Languages} value={latest ? `${latest.knowledgeScore}/60` : '—'} label="文字・語彙・文法" />
        <StatisticsCard icon={BookOpen} value={latest ? `${latest.readingScore}/60` : '—'} label="読解 · Đọc hiểu" />
        <StatisticsCard icon={Headphones} value={latest ? `${latest.listeningScore}/60` : '—'} label="聴解 · Nghe hiểu" />
        <StatisticsCard icon={BarChart3} value={latest ? `${latest.accuracy}%` : '—'} label="Độ chính xác" />
      </div>

      <section className="exam-primary-cta">
        <div>
          <span className="overline">OFFICIAL MOCK EXAM · JLPT {examLevel}</span>
          <h2>Đề thi JLPT {examLevel} đủ 3 phần · Chấm điểm liệt &amp; tổng điểm (180đ)</h2>
          <p>
            Có bài toán dấu sao ★ (文の組み立て), đọc hiểu email/thông báo (読解) và nghe hội thoại tiếng Nhật (聴解). Sau khi nộp bài, hệ thống kiểm tra cả tổng điểm và điểm liệt từng phần (≥ 19/60).
          </p>
        </div>
        <button className="btn large" onClick={() => onOpen('Full Test')}>
          Bắt đầu Full Test {examLevel} <ChevronRight />
        </button>
      </section>

      <div className="exam-format-grid">
        <article>
          <span><Languages /></span>
          <div>
            <h3>言語知識（文字・語彙・文法）</h3>
            <strong>12 câu · 25 phút · 60 điểm</strong>
            <p>Cách đọc Kanji (漢字読み), từ vựng theo ngữ cảnh, từ đồng nghĩa, ngữ pháp và bài toán ghép câu dấu sao ★.</p>
          </div>
        </article>
        <article>
          <span><BookOpen /></span>
          <div>
            <h3>読解 (Đọc hiểu đoạn văn)</h3>
            <strong>8 câu · 25 phút · 60 điểm</strong>
            <p>Đọc hiểu thông báo nội bộ, email công việc, bài bình luận xã hội và bảng tra cứu thông tin (情報検索).</p>
          </div>
        </article>
        <article>
          <span><Headphones /></span>
          <div>
            <h3>聴解 (Nghe hiểu hội thoại)</h3>
            <strong>8 câu · 20 phút · 60 điểm</strong>
            <p>Nghe hiểu nhiệm vụ (課題理解), trọng tâm (ポイント理解) và phản xạ hội thoại tức thì (即時応答).</p>
          </div>
        </article>
      </div>

      <section className="panel exam-note">
        <h2>Quy tắc xét Đậu / Rớt (合格 / 不合格) chuẩn JLPT</h2>
        <p>
          Kỳ thi JLPT chấm trên thang 180 điểm (mỗi phần 60 điểm). Thí sinh chỉ được công nhận Đậu (合格) khi thỏa mãn đồng thời 2 điều kiện: đạt tổng điểm chuẩn của cấp độ (N5: 80đ, N4: 90đ, N3: 95đ, N2: 90đ, N1: 100đ) và không có bất kỳ phần thi nào bị điểm liệt dưới 19/60 điểm.
        </p>
      </section>
    </>
  )
}

function JLPTFullTest({ examLevel, onHistory }) {
  const { saveExamResult, addMistakes } = useApp()
  const sections = buildJlptExamSections(examLevel)
  return (
    <SectionedExamRunner
      title={`Kỳ thi JLPT Thực chiến · ${examLevel} (日本語能力試験)`}
      subtitle={`Đề thi gồm 3 phần chuẩn JEES. Hệ thống áp dụng quy tắc xét điểm liệt từng phần (≥ 19/60) và tổng điểm đậu chuẩn ${examLevel}.`}
      sections={sections}
      sectionsFactory={() => buildJlptExamSections(examLevel)}
      sessionKey={`jlpt-full-${examLevel.toLowerCase()}`}
      languageId="japanese"
      startNotes={[
        'Phần 1 — 言語知識 (Chữ Hán · Từ vựng · Ngữ pháp): Chú ý trường âm trong Kanji và vị trí dấu ★ trong câu.',
        'Phần 2 — 読解 (Đọc hiểu): Đọc kỹ điều kiện thời gian/đối tượng trong câu hỏi tìm kiếm thông tin (情報検索).',
        'Phần 3 — 聴解 (Nghe hiểu): Audio phát 1 lần bằng giọng tiếng Nhật chuẩn; chú ý hành động nhân vật sẽ làm tiếp theo.',
        'Sau khi nộp bài, bảng chấm chữa chi tiết từng câu sẽ hiển thị ngay bên dưới.',
      ]}
      buildResult={(payload) => buildJlptResult(payload, examLevel)}
      onComplete={(report, attempt) => {
        saveExamResult('jlpt', report)
        addMistakes(buildExamMistakes('JLPT', attempt.sections, attempt.answers, '/jlpt'))
      }}
      renderResult={({ result, restart }) => (
        <section className="practice-result exam-result full-score-report">
          <span>{result.passed ? '💮' : '📋'}</span>
          <h2>Kết quả JLPT {result.level} · {result.passed ? '合格 (ĐẠT CHUẨN JLPT)' : '不合格 (CHƯA ĐẠT)'}</h2>
          <strong>{result.score} / 180</strong>
          <p className="score-scale">
            Điểm chuẩn {result.level}: ≥ {result.passMark}/180 · Điểm tối thiểu mỗi phần: ≥ {result.sectionMin}/60
          </p>
          <div className="result-breakdown">
            <div>
              <b>{result.knowledgeScore}/60</b>
              <span>文字・語彙・文法</span>
              <small>{result.knowledgeCorrect}/{result.knowledgeTotal} đúng {result.knowledgeScore < result.sectionMin ? '· ⚠ Điểm liệt' : ''}</small>
            </div>
            <div>
              <b>{result.readingScore}/60</b>
              <span>読解 · Đọc hiểu</span>
              <small>{result.readingCorrect}/{result.readingTotal} đúng {result.readingScore < result.sectionMin ? '· ⚠ Điểm liệt' : ''}</small>
            </div>
            <div>
              <b>{result.listeningScore}/60</b>
              <span>聴解 · Nghe hiểu</span>
              <small>{result.listeningCorrect}/{result.listeningTotal} đúng {result.listeningScore < result.sectionMin ? '· ⚠ Điểm liệt' : ''}</small>
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
            <strong>Nhận xét kết quả:</strong>{' '}
            {result.passed
              ? `Chúc mừng! Bạn đã đạt cả tổng điểm (${result.score}/180 ≥ ${result.passMark}) và vượt qua điểm liệt ở cả 3 phần thi JLPT ${result.level}.`
              : !result.allSectionsPassed
                ? `Bạn có phần thi dưới mức điểm liệt (${result.sectionMin}/60). Hãy xem bảng giải thích chi tiết từng câu bên dưới để củng cố kỹ năng yếu.`
                : `Bạn đạt điểm liệt từng phần nhưng tổng điểm (${result.score}/180) còn thiếu ${result.passMark - result.score} điểm để đậu ${result.level}.`}
          </p>
          <div className="center-actions">
            <button className="btn secondary" onClick={restart}><RotateCcw /> Thi lại JLPT {result.level}</button>
            <button className="btn" onClick={onHistory}>Xem lịch sử thi JLPT</button>
          </div>
        </section>
      )}
    />
  )
}

function JLPTPractice({ questions, label }) {
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
      {q.audio && <AudioPlayer text={q.audio} languageId="japanese" label="Phát audio tiếng Nhật" />}
      {q.passage && (
        <article className="exam-passage">
          <h3>{q.passageTitle || 'Đoạn văn JLPT'}</h3>
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

function JLPTHistory({ history }) {
  if (!history.length) {
    return (
      <div className="empty-inline">
        <History />
        <h2>Chưa có lịch sử thi JLPT</h2>
        <p>Hoàn thành bài thi Full Test JLPT để lưu bảng điểm 3 kỹ năng.</p>
      </div>
    )
  }
  return (
    <section className="history-list">
      <div className="panel-title">
        <div>
          <h2>Lịch sử thi thử JLPT</h2>
          <p>{history.length} lần thi gần nhất trên thiết bị này.</p>
        </div>
      </div>
      {history.map((item) => (
        <article key={item.id}>
          <div>
            <strong>{item.score}/180</strong>
            <span>JLPT {item.level} · {item.passed ? '合格 (Đậu)' : '不合格'}</span>
          </div>
          <div><b>{item.knowledgeScore}/60</b><span>文字・語彙・文法</span></div>
          <div><b>{item.readingScore}/60</b><span>読解 Đọc</span></div>
          <div><b>{item.listeningScore}/60</b><span>聴解 Nghe</span></div>
          <div><b>{item.accuracy}%</b><span>Chính xác</span></div>
          <time>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(item.date))}</time>
        </article>
      ))}
    </section>
  )
}
