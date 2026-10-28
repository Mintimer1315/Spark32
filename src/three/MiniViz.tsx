import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import type { Lesson } from "../types";

function Pulse({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    const t = (Math.sin(s.clock.elapsedTime * 2) + 1) / 2;
    if (ref.current) {
      ref.current.scale.setScalar(0.7 + t * 0.35);
      (ref.current.material as { opacity: number }).opacity = 0.35 + t * 0.4;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.9, 48, 48]} />
      <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.2} metalness={0.1} />
    </mesh>
  );
}

function Bars() {
  const g = useRef<Group>(null);
  useFrame((s) => {
    g.current?.children.forEach((c, i) => {
      c.scale.y = 0.4 + Math.abs(Math.sin(s.clock.elapsedTime * 3 + i)) * 1.6;
      c.position.y = c.scale.y * 0.35;
    });
  });
  return (
    <group ref={g}>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.35, 0.8, 0.35]} />
          <meshStandardMaterial color="#0071e3" />
        </mesh>
      ))}
    </group>
  );
}

export function MiniViz({ kind }: { kind: Lesson["viz"] }) {
  return (
    <div className="viz-scene">
      <Canvas camera={{ position: [0, 1.4, 4], fov: 40 }}>
        <color attach="background" args={["#eef2f7"]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 3, 2]} intensity={1.3} />
        {kind === "pwm" && <Bars />}
        {kind === "wifi" && <Pulse color="#64d2ff" />}
        {kind === "sleep" && <Pulse color="#ff9f0a" />}
        {kind === "gpio" && <Pulse color="#30d158" />}
        {kind === "bus" && <Pulse color="#bf5af2" />}
        {kind === "board" && <Pulse color="#0071e3" />}
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
