import { useState } from "react";
import { motion } from "framer-motion";
import { Esp32Board } from "../three/Esp32Board";
import { pins } from "../data/pins";
import type { Pin } from "../types";

export function Board() {
  const [sel, setSel] = useState<Pin>(pins[2]);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title">Плата 3D</h1>
      <p className="page-sub">Крутите DevKit, нажимайте площадки. Красные — питание, серые — Flash, синяя — выбор.</p>
      <div className="space" />
      <div className="lesson-layout">
        <Esp32Board selected={sel.id} onPick={setSel} />
        <div className="card">
          <div className="kicker">{sel.side === "left" ? "Левый ряд" : "Правый ряд"}</div>
          <h2 className="h2" style={{ marginTop: 6 }}>{sel.label}</h2>
          {sel.gpio !== undefined && <p className="muted">GPIO {sel.gpio}</p>}
          <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
            {sel.roles.map((r) => (
              <span key={r} className="chip">{r}</span>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 14 }}>{sel.note}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Pins() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Pin | null>(null);
  const list = pins.filter((p) => (p.label + (p.gpio ?? "") + p.roles.join() + p.note).toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Карта пинов</h1>
      <p className="page-sub">ESP32-WROOM DevKit. Не все контакты свободны — Flash и strapping выделены в ролях.</p>
      <div className="space" />
      <input className="search" placeholder="GPIO, UART, ADC…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="space" />
      <div className="lesson-layout">
        <div className="card pin-list">
          {list.map((p) => (
            <button key={p.id} className={`pin-row ${sel?.id === p.id ? "active" : ""}`} onClick={() => setSel(p)}>
              <b>{p.label}</b>
              <span className="muted">{p.roles.join(" · ")}</span>
              <span className="chip">{p.gpio ?? "—"}</span>
            </button>
          ))}
        </div>
        <div className="card">
          <div className="kicker">Справка</div>
          <h2 className="h2" style={{ marginTop: 8 }}>{sel?.label ?? "Выберите пин"}</h2>
          <p className="muted" style={{ marginTop: 8 }}>{sel?.note ?? "Список слева фильтруется мгновенно."}</p>
        </div>
      </div>
    </motion.div>
  );
}
