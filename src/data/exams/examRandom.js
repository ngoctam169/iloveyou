const fallbackRandom = () => Math.random()

export function createExamRandom() {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return () => {
      const values = new Uint32Array(1)
      crypto.getRandomValues(values)
      return values[0] / 4294967296
    }
  }
  return fallbackRandom
}

export function shuffled(items, random = fallbackRandom) {
  const output = [...items]
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[output[index], output[target]] = [output[target], output[index]]
  }
  return output
}

export function sample(items, count, random = fallbackRandom) {
  if (count >= items.length) return shuffled(items, random)
  return shuffled(items, random).slice(0, count)
}

export function grouped(items, keyFor) {
  const groups = new Map()
  items.forEach((item) => {
    const key = keyFor(item)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  })
  return [...groups.values()]
}

export function shuffleQuestionOptions(question, random = fallbackRandom) {
  if (!question?.options?.length || !Number.isInteger(question.answer) || question.choiceLabelsOnly) return { ...question }
  const indexed = question.options.map((option, index) => ({ option, correct:index === question.answer }))
  const next = shuffled(indexed, random)
  return {
    ...question,
    options:next.map((item) => item.option),
    answer:next.findIndex((item) => item.correct),
  }
}

export function stampQuestions(items, prefix, random = fallbackRandom, { shuffleChoices = true } = {}) {
  return items.map((item, index) => {
    const prepared = shuffleChoices ? shuffleQuestionOptions(item, random) : { ...item }
    return {
      ...prepared,
      sourceId:item.sourceId || item.id,
      id:`${prefix}-${String(index + 1).padStart(3,'0')}-${item.id}`,
    }
  })
}

export function examFormId(prefix = 'form') {
  const stamp = Date.now().toString(36)
  const randomPart = Math.floor(Math.random() * 0xffffff).toString(36).padStart(5,'0')
  return `${prefix}-${stamp}-${randomPart}`
}
