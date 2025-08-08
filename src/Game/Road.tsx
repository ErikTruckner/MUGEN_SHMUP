import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Road = () => {
  const roadTexture = useLoader(THREE.TextureLoader, "/textures/asphalt/asphalt_02_diff_1k.jpg");
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(10, 100);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[100, 1000]} />
      <meshStandardMaterial map={roadTexture} />
    </mesh>
  );
};

export default Road;