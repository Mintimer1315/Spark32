import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { allLessons } from "./data/curriculum";
import type { Route } from "./types";

type Nav = { route: Route; lessonId?: string; projectId?: string };

type Store = {
  nav: Nav;
  go: (n: Nav) => void;
  done: Set<string>;
  mark: (id: string) => void;
  percent: number;
};

const Ctx = createContext<Store | null>(null);
const KEY = "spark32-progress";

function load(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [nav, go] = useState<Nav>({ route: "home" });
  const [done, setDone] = useState<Set<string>>(load);

  const mark = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const percent = Math.round((done.size / allLessons.length) * 100);

  const value = useMemo(() => ({ nav, go, done, mark, percent }), [nav, done, percent]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("store");
  return v;
}
