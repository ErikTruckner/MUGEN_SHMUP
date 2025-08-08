import Building from "./Building";
import * as THREE from "three";

type BuildingsProps = {
  gridSize?: {
    x: number;
    z: number;
  };
  cellSize?: number;
  sizeRange?: {
    width: [number, number];
    height: [number, number];
    depth: [number, number];
  };
  textures: THREE.Texture[];
  positionOffset?: THREE.Vector3;
};

const Buildings = ({
  gridSize = { x: 10, z: 50 },
  cellSize = 10,
  sizeRange = { width: [0.8, 1], height: [1, 10], depth: [0.8, 1] },
  textures,
  positionOffset = new THREE.Vector3(0, 0, 0),
}: BuildingsProps) => {
  const buildings = [];
  for (let i = 0; i < gridSize.x; i++) {
    for (let j = 0; j < gridSize.z; j++) {
      if (
        (i - Math.floor(gridSize.x / 2)) % 3 === 0 ||
        (j - Math.floor(gridSize.z / 2)) % 5 === 0
      ) {
        continue;
      }

      const x = (i - gridSize.x / 2) * cellSize + positionOffset.x;
      const z = (j - gridSize.z / 2) * cellSize + positionOffset.z;

      const width =
        (Math.random() * (sizeRange.width[1] - sizeRange.width[0]) +
          sizeRange.width[0]) *
        cellSize *
        0.8;
      const height =
        Math.random() * (sizeRange.height[1] - sizeRange.height[0]) +
        sizeRange.height[0];
      const depth =
        (Math.random() * (sizeRange.depth[1] - sizeRange.depth[0]) +
          sizeRange.depth[0]) *
        cellSize *
        0.8;

      const texture = textures[Math.floor(Math.random() * textures.length)];

      buildings.push(
        <Building
          key={`${i}-${j}`}
          id={i * gridSize.z + j}
          position={[x, height / 2, z]}
          size={[width, height, depth]}
          texture={texture}
        />
      );
    }
  }

  return <>{buildings}</>;
};

export default Buildings;
