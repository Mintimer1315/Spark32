import { useState } from "react";
import { motion } from "framer-motion";
import { allLessons } from "../data/curriculum";
import { useStore } from "../store";
import { MiniViz } from "../three/MiniViz";

export function Lesson() {
  const { nav, go, mark, done } = useStore();
  const lesson = allLessons.find((l) => l.id === nav.lessonId) ?? allLessons[0];
  const [picked, setPicked] = useState<number | null>(null);
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const next = allLessons[idx + 1];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="breadcrumb">
        <button onClick={() => go({ route: "academy" })}>Академия</button>
        {" / "}
        {lesson.courseTitle}
      </div>
      <h1 className="page-title">{lesson.title}</h1>
      <p className="page-sub">{lesson.minutes} минут · визуал {lesson.viz}</p>
      <div className="space" />
      <div className="lesson-layout">
        <div className="card prose">
          {lesson.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {lesson.bullets && (
            <ul>
              {lesson.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {lesson.code && (
            <>
              <h3>Код</h3>
              <div className="code">{lesson.code}</div>
            </>
          )}
          <h3>{lesson.quiz.q}</h3>
          <div className="quiz">
            {lesson.quiz.options.map((o, i) => {
              const cls = picked === null ? "" : i === lesson.quiz.answer ? "ok" : picked === i ? "bad" : "";
              return (
                <button key={o} className={cls} onClick={() => setPicked(i)}>
                  {o}
                </button>
              );
            })}
          </div>
          <div className="space" />
          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => {
                mark(lesson.id);
                if (next) go({ route: "lesson", lessonId: next.id });
                else go({ route: "academy" });
              }}
            >
              {done.has(lesson.id) ? "Ещё раз пройдено" : "Отметить и дальше"}
            </button>
            <button className="btn btn-ghost" onClick={() => go({ route: "board" })}>
              Смотреть пины
            </button>
          </div>
        </div>
        <div>
          <MiniViz kind={lesson.viz} />
          <div className="space" />
          <div className="card">
            <div className="kicker">Подсказка</div>
            <p className="muted" style={{ marginTop: 8 }}>
              Крутите сцену мышью. В разделе «Плата 3D» те же жесты работают на полном DevKit: нажимайте контактные площадки.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
