import {
  BookOpen,
  Box,
  Cpu,
  FlaskConical,
  Home,
  Layers,
  Map,
} from "lucide-react";
import { useStore } from "../store";
import type { Route } from "../types";

const items: { route: Route; label: string; icon: typeof Home }[] = [
  { route: "home", label: "Обзор", icon: Home },
  { route: "academy", label: "Академия", icon: BookOpen },
  { route: "projects", label: "Проекты", icon: Layers },
  { route: "board", label: "Плата 3D", icon: Box },
  { route: "pins", label: "Пины", icon: Map },
  { route: "lab", label: "Лаборатория", icon: FlaskConical },
  { route: "parts", label: "Компоненты", icon: Cpu },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { nav, go, percent } = useStore();
  const active = nav.route === "lesson" ? "academy" : nav.route === "project" ? "projects" : nav.route;

  return (
    <div className="app">
      <div className="titlebar">
        <div className="lights">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="wordmark">Spark32</div>
      </div>
      <div className="shell">
        <aside className="sidebar">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.route}
                className={`nav-item ${active === it.route ? "active" : ""}`}
                onClick={() => go({ route: it.route })}
              >
                <Icon />
                {it.label}
              </button>
            );
          })}
          <div className="progress-pill">
            <h4>Прогресс курса</h4>
            <p>{percent}% уроков закрыто</p>
            <div className="bar">
              <i style={{ width: `${percent}%` }} />
            </div>
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
