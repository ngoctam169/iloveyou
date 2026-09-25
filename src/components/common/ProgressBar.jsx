export default function ProgressBar({ value, max = 100, label, tone = 'primary' }) {
  const numericValue = Number(value)
  const numericMax = Number(max)
  const percent = Number.isFinite(numericValue) && Number.isFinite(numericMax) && numericMax > 0 ? Math.min(100, Math.max(0, Math.round((numericValue / numericMax) * 100))) : 0
  return (
    <div className="progress-wrap" role="progressbar" aria-label={label || 'Tiến độ'} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
      {label && <div className="progress-label"><span>{label}</span><strong>{percent}%</strong></div>}
      <div className="progress-track"><span className={`progress-fill ${tone}`} style={{ width: `${percent}%` }} /></div>
    </div>
  )
}
