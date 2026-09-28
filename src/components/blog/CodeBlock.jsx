import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export default function CodeBlock({ language, label, code }) {
  const [copied,setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false),1600)
    } catch { setCopied(false) }
  }
  return <figure className="article-code">
    <figcaption><span>{label}</span><span className="code-language">{language}</span><button type="button" onClick={copy} aria-label={`Sao chép đoạn code ${label}`}>{copied ? <Check/> : <Copy/>}{copied ? 'Đã sao chép' : 'Sao chép'}</button></figcaption>
    <pre tabIndex="0"><code>{code}</code></pre>
  </figure>
}
