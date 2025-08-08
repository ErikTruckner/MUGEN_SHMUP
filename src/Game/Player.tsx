import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { usePlayerControls } from "./usePlayerControls";

const Player = () => {
  const ref = useRef<THREE.Mesh>(null!);
  usePlayerControls(ref);

  return (
    <mesh ref={ref} castShadow userData={{ isPlayer: true }}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

export default Player;
