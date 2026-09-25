export default function StatisticsCard({ icon: Icon, value, label, detail }) {
  return <article className="statistics-card">{Icon && <span><Icon /></span>}<div><strong>{value}</strong><small>{label}</small>{detail && <em>{detail}</em>}</div></article>
}
