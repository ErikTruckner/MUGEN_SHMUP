import { Texture, RepeatWrapping } from "three";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

type MeshElementProps = ThreeElements['mesh'];

interface RoadProps extends MeshElementProps {
  width: number;
  height: number;
  texture: Texture;
}

const Road = ({ width, height, texture, ...props }: RoadProps) => {
  texture.wrapS = texture.wrapT = RepeatWrapping as THREE.Wrapping;
  texture.repeat.set(width / 10, height / 10); // Adjust repeat based on segment size

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Road;