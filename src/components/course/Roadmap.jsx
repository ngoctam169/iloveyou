import { Check, Circle, Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessonPath } from '../../utils/routes'

export default function Roadmap({ language, level, units, completedLessons }) {
  let foundCurrent = false
  return <div className="roadmap">
    {units.map((unit) => <section className="roadmap-unit" key={unit.unit}>
      <div className="unit-heading"><span>Unit {unit.unit}</span><h2>{unit.title}</h2><small>{unit.lessons.length} bài học · {unit.unit === 10 ? 'Tổng ôn' : '20–30 phút/bài'}</small></div>
      <div className="lesson-path">
        {unit.lessons.map((lesson, index) => {
          const done = completedLessons.includes(lesson.id)
          const current = !done && !foundCurrent
          if (current) foundCurrent = true
          return <div className={`path-row ${done ? 'done' : ''} ${current ? 'current' : ''}`} key={lesson.id}>
            <div className="path-line" />
            <Link className="lesson-node" to={lessonPath(language.id, level, lesson.id)} aria-label={`Bài ${lesson.number}: ${lesson.title}`}>
              {done ? <Check /> : current ? <Play fill="currentColor" /> : index === unit.lessons.length - 1 ? <Star /> : <Circle />}
            </Link>
            <div className="lesson-node-text"><span>Bài {lesson.number}</span><strong>{lesson.title}</strong><small>{lesson.nativeTitle}</small></div>
          </div>
        })}
      </div>
    </section>)}
  </div>
}
