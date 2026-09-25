const connectorPattern = /\b(however|therefore|although|whereas|moreover|nevertheless|in contrast|for example|as a result|on the other hand)\b/gi

export function analyzeSelfStudy(text, prompt) {
  const value = String(text || '').trim()
  const words = value ? value.split(/\s+/u) : []
  const sentences = value ? value.split(/[.!?]+/u).filter((item) => item.trim()).length : 0
  const paragraphs = value ? value.split(/\n+/u).filter((item) => item.trim()).length : 0
  const normalized = value.toLocaleLowerCase()
  const uniqueWords = new Set(words.map((word) => word.toLocaleLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '')).filter(Boolean)).size
  const connectors = value.match(connectorPattern)?.length || 0
  const keywordHits = (prompt?.keywords || []).filter((keyword) => normalized.includes(keyword.toLocaleLowerCase())).length
  const repeated = Object.entries(words.reduce((result, word) => {
    const clean = word.toLocaleLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '')
    if (clean.length >= 5) result[clean] = (result[clean] || 0) + 1
    return result
  }, {})).filter(([, count]) => count >= 4).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const checks = [
    { label: `Đủ độ dài tối thiểu (${prompt?.minWords || 0} từ)`, passed: words.length >= (prompt?.minWords || 0) },
    { label: 'Có câu hoàn chỉnh và dấu câu', passed: sentences >= (words.length > 80 ? 3 : 2) && /[.!?]$/u.test(value) },
    { label: 'Có liên kết ý hoặc chuyển ý', passed: connectors >= (words.length > 80 ? 2 : 1) },
    { label: 'Dùng từ vựng đúng chủ đề', passed: keywordHits >= Math.min(2, (prompt?.keywords || []).length) },
    { label: 'Hạn chế lặp từ nội dung', passed: repeated.length <= 2 },
    { label: 'Có xuống dòng để tách ý', passed: paragraphs >= (words.length > 120 ? 2 : 1) },
  ]
  const score = Math.round(checks.filter((item) => item.passed).length / checks.length * 100)
  return { wordCount: words.length, sentences, paragraphs, uniqueWords, lexicalDiversity: words.length ? Math.round(uniqueWords / words.length * 100) : 0, connectors, keywordHits, repeated, checks, score }
}

export const selfStudyRubric = [
  ['task', 'Task completion'],
  ['accuracy', 'Accuracy'],
  ['range', 'Range & structure'],
  ['naturalness', 'Naturalness'],
]
