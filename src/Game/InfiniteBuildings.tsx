import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import Buildings from './Buildings';
import { useAtom } from 'jotai';
import { masterSpeedAtom } from '../GameState';

const SEGMENT_LENGTH = 500; // Length of each building segment
const NUM_SEGMENTS = 3; // Number of segments to create a seamless loop

const InfiniteBuildings = ({ name }: { name?: string }) => {
  const [masterSpeed] = useAtom(masterSpeedAtom);
  const texturePaths = [
    "/textures/buildings/buildingA/buildingA.webp",
    "/textures/buildings/buildingB/buildingB.jpg",
    "/textures/buildings/buildingC/buildingC.jpg",
    "/textures/buildings/buildingD/buildingD.jpg",
  ];

  const textures = useLoader(THREE.TextureLoader, texturePaths);

  textures.forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });

  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segs.push(
        <Buildings
          key={i}
          gridSize={{ x: 10, z: 50 }}
          cellSize={10}
          textures={textures}
          positionOffset={new THREE.Vector3(0, 0, -i * SEGMENT_LENGTH)}
        />
      );
    }
    return segs;
  }, [textures]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Simulate player movement, adjust speed as needed
      groupRef.current.position.z += masterSpeed * delta; 

      // Loop segments
      segments.forEach((segment, index) => {
        const segmentPosition = -index * SEGMENT_LENGTH + groupRef.current!.position.z;
        if (segmentPosition > SEGMENT_LENGTH) {
          // Move segment to the back if it's out of view
          groupRef.current!.children[index].position.z -= NUM_SEGMENTS * SEGMENT_LENGTH;
        }
      });
    }
  });

  return <group ref={groupRef} name={name}>{segments}</group>;
};

export default InfiniteBuildings;