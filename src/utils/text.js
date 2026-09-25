const normalize = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/)

export function speechScore(target, heard) {
  const expected = normalize(target)
  const actual = normalize(heard)
  const matches = expected.filter((word, index) => actual[index] === word).length
  return Math.round((matches / Math.max(expected.length, actual.length, 1)) * 100)
}
