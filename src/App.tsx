import { Shell } from "./components/Shell";
import { useStore } from "./store";
import { Home } from "./views/Home";
import { Academy } from "./views/Academy";
import { Lesson } from "./views/Lesson";
import { ProjectDetail, Projects } from "./views/Projects";
import { Board, Pins } from "./views/Board";
import { Lab } from "./views/Lab";
import { Parts } from "./views/Parts";

export function App() {
  const { nav } = useStore();
  const page = {
    home: <Home />,
    academy: <Academy />,
    lesson: <Lesson />,
    projects: <Projects />,
    project: <ProjectDetail />,
    board: <Board />,
    pins: <Pins />,
    lab: <Lab />,
    parts: <Parts />,
  }[nav.route];

  return <Shell>{page}</Shell>;
}
