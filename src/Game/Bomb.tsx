import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface BombProps {
  position: [number, number, number];
  target: [number, number, number];
}

export const Bomb = ({ position, target }: BombProps) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      // Simple parabolic trajectory
      ref.current.position.x += (target[0] - position[0]) * delta;
      ref.current.position.y += 9.8 * delta; // Gravity
      ref.current.position.z += (target[2] - position[2]) * delta;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

interface BombSightProps {
  player: React.RefObject<THREE.Group>;
}

export const BombSight = ({ player }: BombSightProps) => {
  const { scene } = useThree();
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);

  useFrame(({ mouse }) => {
    if (player.current) {
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(scene.camera);
      const dir = vector.sub(scene.camera.position).normalize();
      const distance = -scene.camera.position.y / dir.y;
      const pos = scene.camera.position.clone().add(dir.multiplyScalar(distance));
      const playerPos = player.current.position.clone();
      const direction = pos.clone().sub(playerPos);
      if (direction.length() > 30) {
        direction.setLength(30);
      }
      setTarget(playerPos.add(direction));
    }
  });

  return (
    <>
      {target && (
        <mesh position={target}>
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
};