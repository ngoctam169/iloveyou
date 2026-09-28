import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Analytics from './components/common/Analytics'
import Seo from './components/common/Seo'
import Layout from './components/layout/Layout'
import { getLanguage, levelSlug } from './data/languages'
import { languagePath, lessonPath, levelPath } from './utils/routes'

const Home = lazy(() => import('./pages/Home'))
const Languages = lazy(() => import('./pages/Languages'))
const LanguageLanding = lazy(() => import('./pages/LanguageLanding'))
const ResourceLanding = lazy(() => import('./pages/ResourceLanding'))
const InfoPage = lazy(() => import('./pages/InfoPage'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Course = lazy(() => import('./pages/Course'))
const Lesson = lazy(() => import('./pages/Lesson'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const Mistakes = lazy(() => import('./pages/Mistakes'))
const Saved = lazy(() => import('./pages/Saved'))
const Progress = lazy(() => import('./pages/Progress'))
const PlacementTest = lazy(() => import('./pages/PlacementTest'))
const Settings = lazy(() => import('./pages/Settings'))
const Search = lazy(() => import('./pages/Search'))
const Vocabulary = lazy(() => import('./pages/Vocabulary'))
const MyVocabulary = lazy(() => import('./pages/MyVocabulary'))
const Grammar = lazy(() => import('./pages/Grammar'))
const TOEIC = lazy(() => import('./pages/TOEIC'))
const IELTS = lazy(() => import('./pages/IELTS'))
const Review = lazy(() => import('./pages/Review'))
const SelfStudy = lazy(() => import('./pages/SelfStudy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loading() { return <div className="loading" role="status"><span/><p>Đang mở nội dung…</p></div> }
function LessonRoute() { const { languageId, levelSlug:slug, lessonId } = useParams(); return <Lesson key={`${languageId}/${slug}/${lessonId}`}/> }
function LegacyLanguage() { const { languageId } = useParams(); return <Navigate replace to={languagePath(languageId)}/> }
function LegacyCourse() { const { languageId, levelSlug:slug } = useParams(); const language=getLanguage(languageId); const level=language?.levels.find(([name])=>levelSlug(name)===slug)?.[0] || slug; return <Navigate replace to={levelPath(languageId,level)}/> }
function LegacyLesson() { const { languageId, levelSlug:slug, lessonId }=useParams(); const location=useLocation(); const language=getLanguage(languageId); const level=language?.levels.find(([name])=>levelSlug(name)===slug)?.[0] || slug; return <Navigate replace to={`${lessonPath(languageId,level,lessonId)}${location.search}`}/> }

export default function App() {
  return <Suspense fallback={<Loading/>}><Seo/><Analytics/><Routes>
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/languages" element={<Languages/>}/>
      <Route path="/learn-english" element={<LanguageLanding languageId="english"/>}/>
      <Route path="/learn-chinese" element={<LanguageLanding languageId="chinese"/>}/>
      <Route path="/learn-japanese" element={<LanguageLanding languageId="japanese"/>}/>
      <Route path="/learn-korean" element={<LanguageLanding languageId="korean"/>}/>
      <Route path="/english-vocabulary" element={<ResourceLanding type="vocabulary"/>}/>
      <Route path="/english-grammar" element={<ResourceLanding type="grammar"/>}/>
      <Route path="/:languageId/:levelSlug/vocabulary" element={<Vocabulary/>}/>
      <Route path="/:languageId/:levelSlug/grammar" element={<Grammar/>}/>
      <Route path="/:languageId/:levelSlug/lessons/:lessonId" element={<LessonRoute/>}/>
      <Route path="/:languageId/:levelSlug" element={<Course/>}/>
      <Route path="/languages/:languageId" element={<LegacyLanguage/>}/>
      <Route path="/course/:languageId/:levelSlug" element={<LegacyCourse/>}/>
      <Route path="/lesson/:languageId/:levelSlug/:lessonId" element={<LegacyLesson/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/blog" element={<Blog/>}/>
      <Route path="/blog/:slug" element={<BlogPost/>}/>
      <Route path="/contact" element={<InfoPage page="contact"/>}/>
      <Route path="/privacy" element={<InfoPage page="privacy"/>}/>
      <Route path="/terms" element={<InfoPage page="terms"/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/vocabulary" element={<Vocabulary/>}/>
      <Route path="/my-vocabulary" element={<MyVocabulary/>}/>
      <Route path="/grammar" element={<Grammar/>}/>
      <Route path="/flashcards" element={<Flashcards/>}/>
      <Route path="/toeic" element={<TOEIC/>}/>
      <Route path="/ielts" element={<IELTS/>}/>
      <Route path="/review" element={<Review/>}/>
      <Route path="/history" element={<Navigate replace to="/progress#history"/>}/>
      <Route path="/self-study" element={<SelfStudy/>}/>
      <Route path="/mistakes" element={<Mistakes/>}/>
      <Route path="/saved" element={<Saved/>}/>
      <Route path="/progress" element={<Progress/>}/>
      <Route path="/placement-test" element={<PlacementTest/>}/>
      <Route path="/mock-tests" element={<Navigate replace to="/toeic"/>}/>
      <Route path="/profile" element={<Navigate replace to="/settings#profile"/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/search" element={<Search/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  </Routes></Suspense>
}
