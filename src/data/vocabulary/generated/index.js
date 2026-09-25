import english from './english.json' with { type: 'json' }
import chinese from './chinese.json' with { type: 'json' }
import japanese from './japanese.json' with { type: 'json' }
import korean from './korean.json' with { type: 'json' }

export const generatedVocabulary = [...english, ...chinese, ...japanese, ...korean]
