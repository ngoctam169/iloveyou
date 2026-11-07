import { CheckCircle2, Flag, HelpCircle, Volume2, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { answerText, correctAnswerText, hasAnswer, isCorrectAnswer } from '../common/QuizQuestion'
import { useApp } from '../../context/AppContext'
import { speak } from '../../utils/speech'

export default function ExamReviewInspector({ sections = [], answers = {}, flagged = {}, languageId = 'english' }) {
  const { setToast } = useApp()
  const [statusFilter, setStatusFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [expandedCount, setExpandedCount] = useState(25)

  const flatQuestions = useMemo(() => {
    let number = 0
    return sections.flatMap((section) =>
      (section.questions || []).map((q) => {
        number += 1
        const userAns = answers[q.id]
        const answered = hasAnswer(userAns)
        const correct = answered && isCorrectAnswer(q, userAns)
        const isFlagged = Boolean(flagged[q.id])
        const status = !answered ? 'unanswered' : correct ? 'correct' : 'wrong'
        return {
          ...q,
          globalNumber: number,
          sectionId: section.id,
          sectionLabel: section.label,
          userAns,
          answered,
          correct,
          isFlagged,
          status,
        }
      }),
    )
  }, [sections, answers, flagged])

  const counts = useMemo(() => ({
    all: flatQuestions.length,
    wrong: flatQuestions.filter((q) => q.status === 'wrong').length,
    unanswered: flatQuestions.filter((q) => q.status === 'unanswered').length,
    correct: flatQuestions.filter((q) => q.status === 'correct').length,
    flagged: flatQuestions.filter((q) => q.isFlagged).length,
  }), [flatQuestions])

  const filtered = useMemo(() => {
    return flatQuestions.filter((q) => {
      if (sectionFilter !== 'all' && q.sectionId !== sectionFilter) return false
      if (statusFilter === 'wrong') return q.status === 'wrong'
      if (statusFilter === 'unanswered') return q.status === 'unanswered'
      if (statusFilter === 'correct') return q.status === 'correct'
      if (statusFilter === 'flagged') return q.isFlagged
      return true
    })
  }, [flatQuestions, sectionFilter, statusFilter])

  const visible = filtered.slice(0, expandedCount)

  return (
    <section className="panel exam-review-inspector" aria-label="Bảng chấm chữa và giải thích chi tiết từng câu">
      <div className="exam-review-head">
        <div>
          <span className="overline">DETAILED SCORE &amp; ANSWER KEY REVIEW</span>
          <h2>Bảng chấm chữa &amp; giải thích chi tiết từng câu ({counts.all} câu)</h2>
          <p>Đối chiếu từng câu trả lời của bạn với đáp án chuẩn, nghe lại transcript phần Nghe, đọc lại ngữ cảnh phần Đọc và xem giải thích ngữ pháp/từ vựng chi tiết.</p>
        </div>
        <div className="exam-review-filters">
          <label>
            <span>Phần thi</span>
            <select value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setExpandedCount(25) }}>
              <option value="all">Tất cả các phần ({sections.length})</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.label} ({s.questions.length} câu)</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="exam-review-pills" role="tablist" aria-label="Lọc câu hỏi theo kết quả">
        {[
          ['all', `Tất cả (${counts.all})`],
          ['wrong', `Câu sai (${counts.wrong})`],
          ['unanswered', `Bỏ trống (${counts.unanswered})`],
          ['correct', `Câu đúng (${counts.correct})`],
          ['flagged', `Đã đánh dấu (${counts.flagged})`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={statusFilter === id}
            className={`review-pill ${statusFilter === id ? 'active' : ''}`}
            onClick={() => { setStatusFilter(id); setExpandedCount(25) }}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty-inline">
          <p>Không có câu hỏi nào trong bộ lọc này.</p>
        </div>
      ) : (
        <div className="exam-review-list">
          {visible.map((item) => (
            <article key={item.id} className={`exam-review-item status-${item.status}`}>
              <header className="exam-review-item-top">
                <div className="exam-review-meta">
                  <span className="review-q-no">Câu {item.globalNumber}</span>
                  <span className="review-section-tag">{item.sectionLabel}{item.part ? ` · Part ${item.part}` : ''}{item.type ? ` · ${item.type}` : ''}</span>
                  {item.isFlagged && <span className="review-flag-tag"><Flag size={12}/> Đã đánh dấu</span>}
                </div>
                <span className={`review-status-badge ${item.status}`}>
                  {item.status === 'correct' && <><CheckCircle2 size={14}/> Chính xác</>}
                  {item.status === 'wrong' && <><XCircle size={14}/> Trả lời sai</>}
                  {item.status === 'unanswered' && <><HelpCircle size={14}/> Bỏ trống</>}
                </span>
              </header>

              {item.audio && (
                <div className="exam-review-audio">
                  <button
                    type="button"
                    className="btn secondary small"
                    onClick={() => speak(item.audio, item.languageId || languageId, 1, setToast)}
                  >
                    <Volume2 size={15}/> Nghe lại câu / hội thoại
                  </button>
                  <p><strong>Transcript:</strong> {item.audio}</p>
                </div>
              )}

              {item.passage && (
                <div className="exam-review-passage">
                  <strong>{item.passageTitle || 'Ngữ liệu đọc hiểu'}:</strong>
                  {Array.isArray(item.passage)
                    ? item.passage.map((p, idx) => <p key={idx}>{p}</p>)
                    : <p>{item.passage}</p>}
                </div>
              )}

              <h3 className="exam-review-prompt">{item.question}</h3>

              {Array.isArray(item.options) && item.options.length > 0 && (
                <div className="exam-review-options">
                  {item.options.map((opt, idx) => {
                    const isCorrectChoice = idx === item.answer
                    const isUserChoice = idx === item.userAns
                    return (
                      <div
                        key={idx}
                        className={`exam-review-option ${isCorrectChoice ? 'correct-choice' : ''} ${isUserChoice && !isCorrectChoice ? 'wrong-choice' : ''}`}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                        <span className="opt-text">{opt}</span>
                        {isCorrectChoice && <small className="opt-badge correct">✓ Đáp án chuẩn</small>}
                        {isUserChoice && !isCorrectChoice && <small className="opt-badge wrong">✕ Bạn chọn</small>}
                        {isUserChoice && isCorrectChoice && <small className="opt-badge user-correct">✓ Bạn chọn đúng</small>}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="exam-review-comparison">
                <div>
                  <span>Câu trả lời của bạn:</span>
                  <strong className={item.correct ? 'text-ok' : 'text-err'}>
                    {item.answered ? answerText(item, item.userAns) : 'Chưa trả lời (Bỏ trống)'}
                  </strong>
                </div>
                <div>
                  <span>Đáp án chính thức:</span>
                  <strong className="text-ok">{correctAnswerText(item)}</strong>
                </div>
              </div>

              <div className="exam-review-explanation">
                <strong>Giải thích chi tiết:</strong>
                <p>{item.explanation || 'Đối chiếu từ khóa trong câu hỏi với ngữ cảnh bài đọc/nghe để loại phương án gây nhiễu.'}</p>
              </div>
            </article>
          ))}

          {expandedCount < filtered.length && (
            <div className="center-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setExpandedCount((c) => c + 30)}
              >
                Xem thêm {Math.min(30, filtered.length - expandedCount)} câu giải thích (còn {filtered.length - expandedCount} câu)
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
