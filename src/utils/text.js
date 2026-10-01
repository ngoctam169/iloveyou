const tokens = (text) => String(text || '')
  .toLocaleLowerCase()
  .normalize('NFKC')
  .replace(/[^\p{L}\p{N}\s'-]/gu, '')
  .trim()
  .split(/\s+/)
  .filter(Boolean)

function editDistance(expected, actual) {
  const previous = Array.from({ length: actual.length + 1 }, (_, index) => index)
  for (let row = 1; row <= expected.length; row += 1) {
    const current = [row]
    for (let column = 1; column <= actual.length; column += 1) {
      const cost = expected[row - 1] === actual[column - 1] ? 0 : 1
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + cost)
    }
    previous.splice(0, previous.length, ...current)
  }
  return previous[actual.length]
}

export function transcriptMatchScore(target, heard) {
  const expected = tokens(target)
  const actual = tokens(heard)
  const longest = Math.max(expected.length, actual.length, 1)
  const distance = editDistance(expected, actual)
  return Math.max(0, Math.round((1 - distance / longest) * 100))
}

export const speechScore = transcriptMatchScore
