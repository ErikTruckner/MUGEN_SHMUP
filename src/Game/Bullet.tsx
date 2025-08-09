import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSetAtom } from 'jotai';
import { bulletsAtom } from '../GameState';

interface BulletProps {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
}

export const Bullet = ({ id, position, velocity }: BulletProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const setBullets = useSetAtom(bulletsAtom);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += velocity[0] * delta;
      ref.current.position.y += velocity[1] * delta;
      ref.current.position.z += velocity[2] * delta;

      if (ref.current.position.z < camera.position.z - 50) {
        setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.id !== id));
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};