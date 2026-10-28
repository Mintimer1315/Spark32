import { useState } from "react";
import { motion } from "framer-motion";
import { parts } from "../data/parts";

export function Parts() {
  const [q, setQ] = useState("");
  const list = parts.filter((p) => (p.name + p.category + p.note).toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Компоненты</h1>
      <p className="page-sub">Что ставить к ESP32 и как не сжечь пин.</p>
      <div className="space" />
      <input className="search" placeholder="OLED, реле, датчик…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="space" />
      <div className="grid grid-3">
        {list.map((p) => (
          <div key={p.id} className="card">
            <span className="chip">{p.category}</span>
            <h2 className="h2" style={{ marginTop: 10 }}>{p.name}</h2>
            <p className="muted">{p.pins}</p>
            <p className="muted" style={{ marginTop: 8 }}>{p.note}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
