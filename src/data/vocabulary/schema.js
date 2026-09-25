export const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Editorial teaching bands, not corpus frequency ranks or official CEFR certification.
export function defineWords(level, rows, register = 'neutral') {
  return rows.map(([word, ipa, partOfSpeech, meaningVi, definition, example, translation, topic, collocations, synonyms, antonyms, wordFamily, usageNote, kind = 'word']) => normalizeWord({
    id: word.toLowerCase().replace(/\s+/g, '-'), word, ipa, partOfSpeech, meaningVi, definition, example, translation,
    topic, level, collocations, synonyms, antonyms, wordFamily, usageNote, register, kind,
  }))
}

export function normalizeWord(word) {
  const examRelevance = word.examRelevance || (['Business', 'Office', 'Marketing', 'Sales', 'Finance', 'Banking', 'Customer Service', 'Human Resources', 'Airport', 'Hotel', 'Transportation', 'Work'].includes(word.topic)
    ? ['TOEIC'] : ['Academic English', 'Science', 'Environment', 'Education', 'Society', 'Government', 'IELTS'].includes(word.topic) ? ['IELTS'] : [])
  return {
    language: 'English', register: 'neutral', kind: 'word', usageNote: '', commonMistakes: [],
    phrasalVerbs: [], academicUsage: '', businessUsage: '', ...word,
    cefr: word.level, difficulty: cefrOrder.indexOf(word.level) + 1,
    skills: ['Vocabulary', 'Reading', 'Writing', 'Speaking', 'Listening'], examRelevance,
    exam: word.exam || examRelevance[0] || 'General',
    frequency: { band: ['A1', 'A2'].includes(word.level) ? 'everyday' : ['B1', 'B2'].includes(word.level) ? 'general-and-professional' : 'specialist-and-nuanced', rank: null, basis: 'editorial teaching priority; not a corpus measurement' },
    audio: { kind: 'speech-synthesis', text: word.word, locale: 'en-GB', recordingUrl: null },
    phrases: word.phrases || word.collocations || [],
    commonMistakes: word.commonMistakes?.length ? word.commonMistakes : word.usageNote ? [word.usageNote] : [],
    academicUsage: word.academicUsage || (examRelevance.includes('IELTS') && ['B2', 'C1', 'C2'].includes(word.level) ? word.example : ''),
    businessUsage: word.businessUsage || (examRelevance.includes('TOEIC') ? word.example : ''),
    provenance: { source: 'original editorial learning content', cefrBasis: 'estimated teaching band for this sense', reviewedByTeacher: false },
  }
}
