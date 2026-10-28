import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { pins } from "../data/pins";
import type { Pin } from "../types";

function Pad({
  pin,
  selected,
  onPick,
}: {
  pin: Pin;
  selected: boolean;
  onPick: (p: Pin) => void;
}) {
  const x = pin.side === "left" ? -1.15 : 1.15;
  const z = 1.55 - pin.index * 0.172;
  const color = selected ? "#0071e3" : pin.roles.includes("PWR") ? "#ff375f" : pin.roles.includes("FLASH") ? "#86868b" : "#d2d2d7";
  return (
    <mesh position={[x, 0.08, z]} onClick={(e) => { e.stopPropagation(); onPick(pin); }}>
      <boxGeometry args={[0.22, 0.06, 0.1]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} emissive={selected ? "#0071e3" : "#000"} emissiveIntensity={selected ? 0.4 : 0} />
    </mesh>
  );
}

function BoardModel({ selected, onPick }: { selected?: string; onPick: (p: Pin) => void }) {
  const left = useMemo(() => pins.filter((p) => p.side === "left"), []);
  const right = useMemo(() => pins.filter((p) => p.side === "right"), []);

  return (
    <group rotation={[0, 0.4, 0]}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[2.05, 0.08, 3.5]} />
        <meshStandardMaterial color="#1d3328" metalness={0.15} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.07, 0.15]}>
        <boxGeometry args={[0.85, 0.12, 0.85]} />
        <meshStandardMaterial color="#2c2c2e" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.14, 0.15]}>
        <boxGeometry args={[0.7, 0.02, 0.7]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.07, -1.55]}>
        <boxGeometry args={[0.7, 0.14, 0.35]} />
        <meshStandardMaterial color="#d2d2d7" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-0.55, 0.1, 1.45]}>
        <boxGeometry args={[0.28, 0.12, 0.18]} />
        <meshStandardMaterial color="#e6e6e6" />
      </mesh>
      <mesh position={[0.55, 0.1, 1.45]}>
        <boxGeometry args={[0.28, 0.12, 0.18]} />
        <meshStandardMaterial color="#1d1d1f" />
      </mesh>
      {left.map((p) => (
        <Pad key={p.id} pin={p} selected={selected === p.id} onPick={onPick} />
      ))}
      {right.map((p) => (
        <Pad key={p.id} pin={p} selected={selected === p.id} onPick={onPick} />
      ))}
      <Html position={[0, 0.35, 0.15]} center>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f5f5f7", letterSpacing: 1 }}>ESP32</div>
      </Html>
    </group>
  );
}

export function Esp32Board({
  selected,
  onPick,
  height = 520,
}: {
  selected?: string;
  onPick?: (p: Pin) => void;
  height?: number;
}) {
  return (
    <div className="canvas-wrap" style={{ height }}>
      <Canvas camera={{ position: [3.2, 2.4, 3.6], fov: 38 }} shadows>
        <color attach="background" args={["#e8eef5"]} />
        <hemisphereLight args={["#ffffff", "#8aa0b8", 0.9]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={1.6} castShadow />
        <BoardModel selected={selected} onPick={onPick ?? (() => {})} />
        <ContactShadows position={[0, -0.4, 0]} opacity={0.45} blur={2.2} scale={8} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}
