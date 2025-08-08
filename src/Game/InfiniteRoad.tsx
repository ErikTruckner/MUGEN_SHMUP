import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import Road from './Road';

const SEGMENT_LENGTH = 1000; // Length of each road segment
const NUM_SEGMENTS = 3; // Number of segments to create a seamless loop

const InfiniteRoad = () => {
  const roadTexture = useLoader(THREE.TextureLoader, "/textures/asphalt/asphalt_02_diff_1k.jpg");
  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segs.push(
        <Road
          key={i}
          width={100}
          height={SEGMENT_LENGTH}
          texture={roadTexture}
          position={[0, 0.01, -i * SEGMENT_LENGTH]}
        />
      );
    }
    return segs;
  }, [roadTexture]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Simulate player movement, adjust speed as needed
      groupRef.current.position.z += 8.33 * delta; 

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

  return <group ref={groupRef}>{segments}</group>;
};

export default InfiniteRoad;