import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { usePlayerControls } from "./usePlayerControls";

const Player = ({ name }: { name?: string }) => {
  const ref = useRef<THREE.Group>(null!);
  usePlayerControls(ref);

  return (
    <group ref={ref} castShadow userData={{ isPlayer: true }} name={name} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.4, 1.5]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Turret (half-circle) */}
      <mesh position={[0, 0.3, 0.2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>

      {/* Cannon */}
      <mesh position={[0, 0.4, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="darkslategray" />
      </mesh>
    </group>
  );
};

export default Player;
