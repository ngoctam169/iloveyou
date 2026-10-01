import { Search as SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { allSearchItems } from '../data/searchItems'
import { loadVocabularySearchIndex } from '../services/vocabularyRuntime'
import { useApp } from '../context/AppContext'
import { toeicListeningQuestions, toeicReading } from '../data/toeic'
import { ieltsReading, ieltsSpeaking, ieltsWriting } from '../data/ielts'
import { grammarEntries } from '../data/grammar'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { grammarPath, vocabularyPath } from '../utils/routes'

const extraItems = [
  ...grammarEntries.map((item) => ({ id:`search-grammar-${item.id}`,type:'Grammar',title:item.name,subtitle:`${item.structure} · ${item.level}`,topic:item.explanation,path:grammarPath(item.languageId,item.level,item.id) })),
  ...toeicListeningQuestions.map((item) => ({ id:`search-${item.id}`,type:'TOEIC',title:item.question,subtitle:`Listening Part ${item.part} · ${item.type}`,topic:item.vocabulary.join(' '),path:'/toeic' })),
  ...toeicReading.map((item) => ({ id:`search-${item.id}`,type:'TOEIC',title:item.question,subtitle:`Reading Part ${item.part} · ${item.grammarPoint}`,topic:item.vocabulary.join(' '),path:'/toeic' })),
  ...ieltsReading.map((item) => ({ id:`search-${item.id}`,type:'IELTS Reading',title:item.title,subtitle:`Passage · ${item.topic}`,topic:item.passage.join(' '),path:'/ielts' })),
  ...ieltsWriting.map((item) => ({ id:`search-${item.id}`,type:'IELTS Writing',title:item.title,subtitle:`${item.task} · ${item.type}`,topic:item.prompt,path:'/ielts' })),
  ...ieltsSpeaking.map((item) => ({ id:`search-${item.id}`,type:'IELTS Speaking',title:item.question,subtitle:`${item.part} · ${item.topic}`,topic:item.topic,path:'/ielts' })),
]
const searchItems = [...extraItems, ...allSearchItems]

export default function Search() {
  const { state } = useApp()
  const location = useLocation()
  const [query,setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '')
  const debouncedQuery = useDebouncedValue(query)
  const [vocabularyIndex, setVocabularyIndex] = useState([])
  const [vocabularyLoading, setVocabularyLoading] = useState(false)
  const [vocabularyError, setVocabularyError] = useState(null)
  const [retryIndex, setRetryIndex] = useState(0)
  useEffect(() => {
    let active = true
    if (debouncedQuery.trim().length < 2) { setVocabularyIndex([]);setVocabularyLoading(false);return () => { active = false } }
    setVocabularyLoading(true)
    setVocabularyError(null)
    loadVocabularySearchIndex().then((items) => {
      if (!active) return
      setVocabularyIndex(items)
      setVocabularyLoading(false)
    }).catch((reason) => {
      if (!active) return
      setVocabularyError(reason instanceof Error ? reason : new Error('Không tải được chỉ mục từ vựng.'))
      setVocabularyLoading(false)
    })
    return () => { active = false }
  }, [debouncedQuery, retryIndex])
  const vocabularyItems = useMemo(() => {
    const personal = state.personalVocabulary || []
    const indexed = vocabularyIndex.map(([languageId, level, word, meaningVi, topic], index) => ({ id:`search-vocab-${languageId}-${level}-${index}`,type:'Vocabulary',title:word,subtitle:`${meaningVi} · ${level}`,topic:topic || '',path:vocabularyPath(languageId,level,word) }))
    const personalItems = personal.map((word) => ({ id:`search-vocab-personal-${word.id}`,type:'Vocabulary',title:word.word,subtitle:`${word.meaningVi} · ${word.level}`,topic:[word.topic,word.definition,word.example].join(' '),path:vocabularyPath(word.languageId,word.level,word.word) }))
    return [...personalItems, ...indexed]
  }, [vocabularyIndex, state.personalVocabulary])
  const results = useMemo(()=> {
    const needle = debouncedQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase()
    return needle.length < 2 ? [] : [...vocabularyItems, ...searchItems].filter((item)=>`${item.title} ${item.subtitle} ${item.topic || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().includes(needle)).slice(0,30)
  },[debouncedQuery, vocabularyItems])
  return <div className="inner-page section-shell search-page"><div className="page-heading centered"><span className="overline">TÌM TRONG NT</span><h1>Bạn muốn học gì hôm nay?</h1><p>Tìm xuyên suốt Vocabulary, Lesson, Grammar, TOEIC, IELTS và Topic ở mọi level.</p></div><label className="search-box"><SearchIcon/><span className="sr-only">Từ khóa tìm kiếm</span><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Thử “travel”, “Present Perfect”, business…"/></label>{vocabularyError && query && <div className="notice warning" role="alert"><strong>Không tải được chỉ mục từ vựng.</strong><span>{vocabularyError.message}</span><button className="btn secondary small" onClick={()=>setRetryIndex((value)=>value+1)}>Thử lại</button></div>}{!query && <div className="search-suggestions"><span>Gợi ý</span>{['travel','Present Perfect','business','environment','argumentation'].map((item)=><button onClick={()=>setQuery(item)} key={item}>{item}</button>)}</div>}{query && query.trim().length < 2 && <div className="empty-inline"><span>⌕</span><h2>Gõ thêm một ký tự</h2><p>Tìm kiếm bắt đầu từ 2 ký tự để tránh tải chỉ mục từ vựng không cần thiết.</p></div>}{query && query.trim().length >= 2 && <div className="search-results"><div className="result-count">{vocabularyLoading ? 'Đang tải chỉ mục từ vựng…' : vocabularyError ? `${results.length} kết quả hiện có cho “${query}”` : `${results.length} kết quả cho “${query}”`}</div>{results.length ? results.map((item)=><Link key={item.id} to={item.path}><span className={`result-type ${item.type.toLowerCase()}`}>{item.type[0]}</span><div><span>{item.type}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div></Link>) : <div className="empty-inline"><span>⌕</span><h2>Không tìm thấy nội dung phù hợp</h2><p>Hãy thử từ khóa ngắn hơn hoặc kiểm tra cách viết.</p></div>}</div>}</div>
}

