import { motion } from "framer-motion";
import { courses } from "../data/curriculum";
import { useStore } from "../store";

export function Academy() {
  const { go, done } = useStore();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title">Академия</h1>
      <p className="page-sub">От кристалла до сна на батарее. Каждый урок — теория, сцена и проверка.</p>
      <div className="space" />
      <div className="grid" style={{ gap: 20 }}>
        {courses.map((c, i) => (
          <div key={c.id} className="card">
            <div className="kicker">{String(i + 1).padStart(2, "0")}</div>
            <h2 className="h2">{c.title}</h2>
            <p className="muted">{c.subtitle}</p>
            <div className="space" />
            {c.lessons.map((l, j) => (
              <button
                key={l.id}
                className="module"
                style={{ width: "100%", textAlign: "left" }}
                onClick={() => go({ route: "lesson", lessonId: l.id })}
              >
                <div className="num" style={{ background: c.color }}>{j + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 650 }}>{l.title}</div>
                  <div className="muted">{l.minutes} мин</div>
                </div>
                {done.has(l.id) && <span className="done-dot" />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
