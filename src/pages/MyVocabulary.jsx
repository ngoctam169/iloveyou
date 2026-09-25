import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { languages } from '../data/languages'
import { allVocabulary } from '../services/vocabularyService'
import { wordKey } from '../utils/srs'
import { vocabularyPath } from '../utils/routes'

const emptyForm = (state) => ({ languageId: state.selectedLanguage, level: state.selectedLevel, word: '', meaningVi: '', ipa: '', partOfSpeech: '', definition: '', example: '', translation: '', topic: '', collocations: '', synonyms: '', antonyms: '' })
const editForm = (word) => ({ ...word, collocations: word.collocations.join(', '), synonyms: word.synonyms.join(', '), antonyms: word.antonyms.join(', ') })

export default function MyVocabulary() {
  const { state, savePersonalWord, deletePersonalWord, createVocabularyList, toggleWordInList, deleteVocabularyList, toggleSaved, setToast } = useApp()
  const [form, setForm] = useState(() => emptyForm(state))
  const [editing, setEditing] = useState(null)
  const [listName, setListName] = useState('')
  const [activeList, setActiveList] = useState('all')
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const language = languages.find((item) => item.id === form.languageId) || languages[0]
  const words = allVocabulary(state)
  const personal = state.personalVocabulary || []
  const selectedList = state.vocabularyLists.find((list) => list.id === activeList)
  const shown = (activeList === 'all' ? personal : words.filter((word) => selectedList?.wordKeys.includes(wordKey(word))))
    .filter((word) => `${word.word} ${word.meaningVi} ${word.topic}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  const change = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const submit = (event) => {
    event.preventDefault()
    try {
      savePersonalWord(form, editing)
      setForm(emptyForm(state)); setEditing(null)
    } catch (error) { setToast(error.message) }
  }
  const favorite = (word) => state.savedItems.some((item) => item.id === `vocab-${wordKey(word)}`)
  const toggleFavorite = (word) => toggleSaved({ id: `vocab-${wordKey(word)}`, type: 'Vocabulary', title: word.word, subtitle: `${word.meaningVi} · ${word.level}`, languageId: word.languageId, level: word.level, path: vocabularyPath(word.languageId,word.level,word.word) })
  const addList = (event) => { event.preventDefault(); if (listName.trim()) { createVocabularyList(listName); setListName('') } }

  return <div className="inner-page section-shell personal-vocabulary-page">
    <div className="page-heading"><span className="overline">MY VOCABULARY</span><h1>Kho từ của tôi</h1><p>Tự thêm từ, gom thành danh sách và ôn cùng bộ từ của NT. Dữ liệu được lưu trên thiết bị này.</p><Link className="text-link" to="/vocabulary">Mở kho từ và luyện tập →</Link></div>
    <div className="personal-layout"><section className="panel personal-form"><h2>{editing ? 'Sửa từ' : 'Thêm từ mới'}</h2><form onSubmit={submit}><div className="personal-form-grid"><label>Ngôn ngữ<select value={form.languageId} onChange={(event) => { const next = languages.find((item) => item.id === event.target.value); setForm((current) => ({ ...current, languageId: next.id, level: next.levels[0][0] })) }}>{languages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Level<select value={form.level} onChange={(event) => change('level', event.target.value)}>{language.levels.map(([level]) => <option key={level}>{level}</option>)}</select></label>{[['word','Từ *'],['meaningVi','Nghĩa tiếng Việt *'],['ipa','Phiên âm / IPA'],['partOfSpeech','Loại từ'],['topic','Chủ đề'],['definition','Giải nghĩa'],['example','Câu ví dụ'],['translation','Dịch câu ví dụ'],['collocations','Cụm từ (ngăn bằng dấu phẩy)'],['synonyms','Đồng nghĩa (ngăn bằng dấu phẩy)'],['antonyms','Trái nghĩa (ngăn bằng dấu phẩy)']].map(([name,label]) => <label key={name}>{label}<input value={form[name]} onChange={(event) => change(name, event.target.value)} required={['word','meaningVi'].includes(name)} maxLength={name === 'example' || name === 'translation' ? 400 : 160}/></label>)}</div><div className="personal-form-actions"><button className="btn" type="submit">{editing ? 'Lưu thay đổi' : 'Thêm vào kho từ'}</button>{editing && <button className="btn secondary" type="button" onClick={() => { setEditing(null); setForm(emptyForm(state)) }}>Hủy sửa</button>}</div></form></section>
    <section className="personal-collection"><div className="panel personal-lists"><h2>Danh sách của tôi</h2><form onSubmit={addList}><input aria-label="Tên danh sách mới" value={listName} onChange={(event) => setListName(event.target.value)} placeholder="Ví dụ: Từ công việc" maxLength={60}/><button className="btn secondary" disabled={!listName.trim()}>Tạo danh sách</button></form><div className="personal-list-buttons"><button className={activeList === 'all' ? 'active' : ''} onClick={() => setActiveList('all')}>Từ tự thêm ({personal.length})</button>{state.vocabularyLists.map((list) => <button key={list.id} className={activeList === list.id ? 'active' : ''} onClick={() => setActiveList(list.id)}>{list.name} ({list.wordKeys.length})</button>)}</div>{selectedList && <button className="text-link personal-delete-list" onClick={() => { deleteVocabularyList(selectedList.id); setActiveList('all') }}>Xóa danh sách “{selectedList.name}”</button>}</div>
    <div className="panel personal-words"><div className="personal-words-head"><h2>{selectedList?.name || 'Từ tự thêm'}</h2><input aria-label="Tìm trong kho cá nhân" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm từ hoặc nghĩa…"/></div>{shown.length ? <div className="personal-word-list">{shown.map((word) => <article key={wordKey(word)}><div><strong>{word.word}</strong><small>{word.meaningVi} · {word.level} · {word.topic}</small><Link to={vocabularyPath(word.languageId,word.level,word.word)}>Xem thẻ và luyện tập</Link></div><div className="personal-word-actions"><button aria-pressed={favorite(word)} onClick={() => toggleFavorite(word)}>{favorite(word) ? '★ Đã lưu' : '☆ Yêu thích'}</button>{state.vocabularyLists.length > 0 && <select aria-label={`Danh sách cho ${word.word}`} value="" onChange={(event) => { toggleWordInList(event.target.value, word); event.target.value = '' }}><option value="">Thêm / bỏ danh sách…</option>{state.vocabularyLists.map((list) => <option key={list.id} value={list.id}>{list.wordKeys.includes(wordKey(word)) ? '✓ ' : ''}{list.name}</option>)}</select>}{word.personal && <><button onClick={() => { setEditing(word.id); setForm(editForm(word)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Sửa</button>{confirmDelete === word.id ? <><button onClick={() => { deletePersonalWord(word.id); setConfirmDelete(null) }}>Xác nhận xóa</button><button onClick={() => setConfirmDelete(null)}>Hủy</button></> : <button onClick={() => setConfirmDelete(word.id)}>Xóa</button>}</>}</div></article>)}</div> : <p className="empty-inline">Chưa có từ ở đây. Thêm từ mới hoặc chọn danh sách khác.</p>}</div></section></div>
  </div>
}


