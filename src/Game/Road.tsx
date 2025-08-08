import { PlaneGeometry, MeshStandardMaterial, Texture, RepeatWrapping } from "three";
import type { ThreeElements } from "@react-three/fiber";

type MeshElementProps = ThreeElements['mesh'];

interface RoadProps extends MeshElementProps {
  width: number;
  height: number;
  texture: Texture;
}

const Road = ({ width, height, texture, ...props }: RoadProps) => {
  texture.wrapS = texture.wrapT = RepeatWrapping as any;
  texture.repeat.set(width / 10, height / 10); // Adjust repeat based on segment size

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Road;