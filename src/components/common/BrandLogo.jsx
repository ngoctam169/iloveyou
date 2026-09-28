export default function BrandLogo({ compact = false }) {
  return <span className={`brand-logo ${compact ? 'compact' : ''}`} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width={compact ? 36 : 42} height={compact ? 36 : 42}/></span>
}
