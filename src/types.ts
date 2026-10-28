export type Route =
  | "home"
  | "academy"
  | "lesson"
  | "projects"
  | "project"
  | "board"
  | "pins"
  | "lab"
  | "parts";

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  bullets?: string[];
  code?: string;
  viz: "board" | "gpio" | "pwm" | "wifi" | "sleep" | "bus";
  quiz: { q: string; options: string[]; answer: number };
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  lessons: Lesson[];
};

export type Project = {
  id: string;
  title: string;
  level: "Старт" | "Средний" | "Продвинутый";
  minutes: number;
  summary: string;
  parts: string[];
  steps: string[];
  code: string;
  viz: Lesson["viz"];
};

export type Pin = {
  id: string;
  side: "left" | "right";
  index: number;
  label: string;
  gpio?: number;
  roles: string[];
  note: string;
};

export type Part = {
  id: string;
  name: string;
  category: string;
  pins: string;
  note: string;
};
