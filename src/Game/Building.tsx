import React from "react";
import * as THREE from "three";

type BuildingProps = {
  id: number;
  position: [number, number, number];
  size: [number, number, number];
  texture: THREE.Texture;
};

const Building = ({ id, position, size, texture }: BuildingProps) => {
  const [width, height, depth] = size;

  const greyShades = Array.from(
    { length: 8 },
    (_, i) => new THREE.Color(`hsl(0, 0%, ${10 + i * 10}%)`)
  );

  const topColor = greyShades[Math.floor(Math.random() * greyShades.length)];

  const materials = [
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    }), // right
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    }), // left
    new THREE.MeshStandardMaterial({
      color: topColor,
      transparent: true,
      opacity: 1,
    }), // top
    new THREE.MeshStandardMaterial({
      color: "black",
      transparent: true,
      opacity: 1,
    }), // bottom
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    }), // front
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    }), // back
  ];

  // Rooftop clutter
  const clutter: React.ReactNode[] = [];
  const clutterPositions: THREE.Box3[] = [];
  const clutterCount = Math.floor(Math.random() * 5);

  for (let i = 0; i < clutterCount; i++) {
    const isCylinder = Math.random() > 0.5;
    const clutterSize = [
      (Math.random() * (width / 4) + 0.5) * 0.5,
      (Math.random() * 1 + 0.5) * 0.5,
      (Math.random() * (depth / 4) + 0.5) * 0.5,
    ];

    let newClutterBox: THREE.Box3;
    let attempts = 0;

    do {
      const clutterPosition = [
        Math.random() * (width / 2) - width / 4,
        height / 2 + clutterSize[1] / 2,
        Math.random() * (depth / 2) - depth / 4,
      ];

      const clutterMesh = new THREE.Mesh(
        isCylinder
          ? new THREE.CylinderGeometry(
              clutterSize[0] / 2,
              clutterSize[0] / 2,
              clutterSize[1],
              16
            )
          : new THREE.BoxGeometry(...(clutterSize as [number, number, number])),
        new THREE.MeshStandardMaterial()
      );
      clutterMesh.position.set(
        ...(clutterPosition as [number, number, number])
      );
      newClutterBox = new THREE.Box3().setFromObject(clutterMesh);

      attempts++;
    } while (
      clutterPositions.some((box) => box.intersectsBox(newClutterBox)) &&
      attempts < 20
    );

    if (attempts < 20) {
      const clutterColor =
        greyShades[Math.floor(Math.random() * greyShades.length)];
      clutterPositions.push(newClutterBox);
      clutter.push(
        <mesh
          key={i}
          position={newClutterBox.getCenter(new THREE.Vector3()).toArray()}
          userData={{ isBuilding: true, id: `${id}-clutter-${i}` }}
        >
          {isCylinder ? (
            <cylinderGeometry
              args={[
                clutterSize[0] / 2,
                clutterSize[0] / 2,
                clutterSize[1],
                16,
              ]}
            />
          ) : (
            <boxGeometry args={clutterSize as [number, number, number]} />
          )}
          <meshStandardMaterial
            color={clutterColor}
            transparent={true}
            opacity={1}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={position}>
      <mesh
        castShadow
        receiveShadow
        userData={{ isBuilding: true, id }}
        material={materials}
      >
        <boxGeometry args={size} />
      </mesh>
      {clutter}
    </group>
  );
};

export default Building;
