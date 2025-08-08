import * as THREE from "three";

const occludedObjects = new Set<THREE.Mesh>();

const setMaterialOpacity = (object: THREE.Object3D, opacity: number) => {
  if (object instanceof THREE.Mesh) {
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((mat: THREE.MeshStandardMaterial) => {
      mat.transparent = true;
      mat.opacity = opacity;
    });
  }
};

export const checkCollisions = (
  player: THREE.Object3D,
  camera: THREE.Camera,
  objects: THREE.Object3D[]
) => {
  const playerBox = new THREE.Box3().setFromObject(player);
  const cameraPosition = camera.position;

  const currentlyOccluded = new Set<THREE.Mesh>();

  objects.forEach((object) => {
    if (object instanceof THREE.Group) {
      object.children.forEach((child) => {
        if (child.userData.isBuilding) {
          const objectBox = new THREE.Box3().setFromObject(child);

          setMaterialOpacity(child, 1);
        }
      });
    }
  });

  // Reset opacity for objects that are no longer occluded
  occludedObjects.forEach((obj) => {
    if (!currentlyOccluded.has(obj)) {
      setMaterialOpacity(obj, 1);
      occludedObjects.delete(obj);
    }
  });

  currentlyOccluded.forEach((obj) => occludedObjects.add(obj));
};
