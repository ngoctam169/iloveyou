import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error:null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('UI error boundary', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return <main className="error-boundary section-shell" role="alert">
      <div>
        <span className="overline">ỨNG DỤNG GẶP LỖI</span>
        <h1>Trang này chưa tải được.</h1>
        <p>Tiến độ đã lưu trên thiết bị vẫn được giữ. Bạn có thể tải lại trang hoặc quay về trang chủ.</p>
        <div className="error-boundary-actions">
          <button className="btn" onClick={() => window.location.reload()}>Tải lại</button>
          <button className="btn secondary" onClick={() => window.location.assign(import.meta.env.BASE_URL || '/')}>Về trang chủ</button>
        </div>
      </div>
    </main>
  }
}
