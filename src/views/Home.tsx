import { motion } from "framer-motion";
import { allLessons, courses } from "../data/curriculum";
import { projects } from "../data/projects";
import { useStore } from "../store";
import { Esp32Board } from "../three/Esp32Board";

export function Home() {
  const { go, done, percent } = useStore();
  const next = allLessons.find((l) => !done.has(l.id)) ?? allLessons[0];

  return (
    <motion.div initial={{ opacity: 0.001, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="card hero">
        <div className="copy">
          <span className="pill">Windows · ESP32 · Apple-like</span>
          <div className="space" />
          <h1 className="page-title">Учите ESP32 так,<br />как будто это продукт.</h1>
          <p className="page-sub">Курс, живая 3D-плата, пины, проекты и лаборатория GPIO — одним жестом, без шума.</p>
          <div className="space" />
          <div className="row">
            <button className="btn btn-primary" onClick={() => go({ route: "lesson", lessonId: next.id })}>
              Продолжить · {next.title}
            </button>
            <button className="btn btn-ghost" onClick={() => go({ route: "board" })}>
              Открыть плату
            </button>
          </div>
        </div>
      </div>
      <div className="space" />
      <div className="grid grid-3">
        <div className="card stat">
          <span className="muted">Модули</span>
          <b>{courses.length}</b>
        </div>
        <div className="card stat">
          <span className="muted">Уроки</span>
          <b>{allLessons.length}</b>
        </div>
        <div className="card stat">
          <span className="muted">Готово</span>
          <b>{percent}%</b>
        </div>
      </div>
      <div className="space" />
      <div className="grid grid-2">
        <div>
          <Esp32Board height={360} />
        </div>
        <div className="card">
          <div className="kicker">Проекты</div>
          <h2 className="h2" style={{ margin: "6px 0 12px" }}>Собрать руками</h2>
          {projects.slice(0, 4).map((p) => (
            <button
              key={p.id}
              className="module"
              style={{ width: "100%", textAlign: "left" }}
              onClick={() => go({ route: "project", projectId: p.id })}
            >
              <div>
                <div style={{ fontWeight: 650 }}>{p.title}</div>
                <div className="muted">{p.level} · {p.minutes} мин</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
