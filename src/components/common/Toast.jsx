import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  return toast ? <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div> : null
}
