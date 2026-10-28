import { motion } from "framer-motion";
import { projects } from "../data/projects";
import { useStore } from "../store";

export function Projects() {
  const { go } = useStore();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title">Проекты</h1>
      <p className="page-sub">От светодиода до MQTT и сна. Каждый проект — шаги, список деталей и прошивка.</p>
      <div className="space" />
      <div className="grid grid-3">
        {projects.map((p) => (
          <button key={p.id} className="card interactive" style={{ textAlign: "left" }} onClick={() => go({ route: "project", projectId: p.id })}>
            <span className="chip">{p.level}</span>
            <h2 className="h2" style={{ marginTop: 10 }}>{p.title}</h2>
            <p className="muted">{p.summary}</p>
            <p className="muted" style={{ marginTop: 10 }}>{p.minutes} мин · {p.parts.length} деталей</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function ProjectDetail() {
  const { nav, go } = useStore();
  const p = projects.find((x) => x.id === nav.projectId) ?? projects[0];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="breadcrumb">
        <button onClick={() => go({ route: "projects" })}>Проекты</button>
        {" / "}
        {p.title}
      </div>
      <h1 className="page-title">{p.title}</h1>
      <p className="page-sub">{p.level} · {p.minutes} минут</p>
      <div className="space" />
      <div className="lesson-layout">
        <div className="card prose">
          <p>{p.summary}</p>
          <h3>Детали</h3>
          <ul>
            {p.parts.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3>Шаги</h3>
          <ul>
            {p.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h3>Прошивка</h3>
          <div className="code">{p.code}</div>
        </div>
        <div className="card">
          <div className="kicker">Практика</div>
          <p className="muted" style={{ marginTop: 8 }}>
            Соберите схему, откройте Arduino IDE или IDF, выберите COM-порт. Если прошивка не идёт — GPIO0 (BOOT) и скорость 115200.
          </p>
          <div className="space" />
          <button className="btn btn-primary" onClick={() => go({ route: "lab" })}>
            Симулировать GPIO
          </button>
        </div>
      </div>
    </motion.div>
  );
}
