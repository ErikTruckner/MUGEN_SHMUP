import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";

const CameraManager = () => {
  const { camera, scene } = useThree();
  const playerRef = useRef<THREE.Object3D>();
  const lastIntersected = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    // Find the player in the scene
    scene.traverse((object) => {
      if (object.userData.isPlayer) {
        playerRef.current = object;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerPosition = new THREE.Vector3();
    playerRef.current.getWorldPosition(playerPosition);

    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    const direction = cameraPosition.clone().sub(playerPosition).normalize();
    const distance = cameraPosition.distanceTo(playerPosition);

    const raycaster = new THREE.Raycaster(
      playerPosition,
      direction,
      0,
      distance
    );
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Reset opacity for previously intersected objects
    lastIntersected.current.forEach((object) => {
      if (object.userData.isBuilding && (object.material as THREE.MeshStandardMaterial).opacity !== 1) {
        (object.material as THREE.MeshStandardMaterial).opacity = 1;
      }
    });
    lastIntersected.current = [];

    intersects.forEach((intersection) => {
      if (intersection.object.userData.isBuilding) {
        (intersection.object.material as THREE.MeshStandardMaterial).opacity = 0.5;
        lastIntersected.current.push(intersection.object);
      }
    });
  });

  return null;
};

export default CameraManager;
