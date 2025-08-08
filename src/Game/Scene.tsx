import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import Environment from "./Environment";
import Buildings from "./Buildings";
import CameraManager from "./CameraManager";

import Road from "./Road";

const Scene = () => {

  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} castShadow />
      <Player />
      <Environment />
      <Buildings />
      <Road />
      <CameraManager />
    </Canvas>
  );
};

export default Scene;
