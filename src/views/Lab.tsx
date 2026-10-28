import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const GPIOS = [2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26];

export function Lab() {
  const [on, setOn] = useState<Record<number, boolean>>({});
  const [duty, setDuty] = useState(40);
  const log = useMemo(() => {
    const high = GPIOS.filter((g) => on[g]);
    return high.length
      ? `digitalWrite: ${high.map((g) => `IO${g}=HIGH`).join(", ")}  |  LEDC duty ${duty}/255`
      : `все GPIO LOW  |  LEDC duty ${duty}/255`;
  }, [on, duty]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title">Лаборатория</h1>
      <p className="page-sub">Виртуальные GPIO: щёлкните пин, как digitalWrite. Ползунок — ШИМ на канале 0.</p>
      <div className="space" />
      <div className="playground">
        <div className="gpio">
          {GPIOS.map((g) => (
            <button
              key={g}
              className="cell"
              onClick={() => setOn((s) => ({ ...s, [g]: !s[g] }))}
            >
              <div className={`led ${on[g] ? "on" : ""}`} style={g === 18 ? { opacity: 0.35 + duty / 255, boxShadow: on[g] || duty > 20 ? `0 0 ${8 + duty / 12}px rgba(48,209,88,0.7)` : undefined } : undefined} />
              <div style={{ fontWeight: 650 }}>IO{g}</div>
              <div className="muted">{on[g] ? "HIGH" : "LOW"}</div>
            </button>
          ))}
        </div>
        <div className="card">
          <div className="kicker">Serial</div>
          <div className="code" style={{ marginTop: 12 }}>{log}</div>
          <div className="space" />
          <div className="muted">ШИМ GPIO18 · duty</div>
          <input
            type="range"
            min={0}
            max={255}
            value={duty}
            onChange={(e) => setDuty(Number(e.target.value))}
            style={{ width: "100%", marginTop: 8 }}
          />
          <p className="muted" style={{ marginTop: 16 }}>
            Это модель поведения, не прошивка реальной платы. Для железа откройте проект «Дыхание светодиода».
          </p>
        </div>
      </div>
    </motion.div>
  );
}
