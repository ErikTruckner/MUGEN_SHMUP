import * as THREE from "three";

const Environment = () => {
  const texture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 2;
      canvas.height = 2;
      context.fillStyle = "#a3d9a5"; // Light green
      context.fillRect(0, 0, 2, 2);
      context.fillStyle = "#4a854c"; // Dark green
      context.fillRect(0, 0, 1, 1);
      context.fillRect(1, 1, 1, 1);
      return canvas;
    })()
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(50, 500);
  texture.magFilter = THREE.NearestFilter;

  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 1000]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Environment;
