const langCodes = { english: 'en-US', chinese: 'zh-CN', japanese: 'ja-JP', korean: 'ko-KR' }

export function speak(text, languageId, rate = 1, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
    onError?.('Trình duyệt này không hỗ trợ phát âm. Bạn vẫn có thể đọc thành tiếng để luyện tập.')
    return false
  }
  window.speechSynthesis.cancel()
  const utterance = new window.SpeechSynthesisUtterance(text)
  utterance.lang = langCodes[languageId] || 'en-US'
  utterance.rate = rate
  utterance.onerror = () => onError?.('Không thể phát âm lúc này. Vui lòng thử lại.')
  window.speechSynthesis.speak(utterance)
  return true
}

export function recognitionFor(languageId) {
  if (typeof window === 'undefined') return null
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Recognition) return null
  const recognition = new Recognition()
  recognition.lang = langCodes[languageId] || 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  return recognition
}
