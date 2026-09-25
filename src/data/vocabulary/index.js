import a1 from './a1.js'
import a2 from './a2.js'
import { legacyVocabulary } from './legacy.js'
import { normalizeWord } from './schema.js'

// Rich editorial entries are merged with lesson words in catalog.js.
export const vocabulary = [...a1, ...a2, ...legacyVocabulary.map((word) => normalizeWord(word))]
