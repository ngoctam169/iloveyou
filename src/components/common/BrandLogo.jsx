export default function BrandLogo({ compact = false }) {
  return <span className={`brand-logo ${compact ? 'compact' : ''}`} aria-hidden="true"><img src="/logo.svg" alt="" width={compact ? 36 : 42} height={compact ? 36 : 42}/></span>
}

