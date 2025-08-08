import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import Environment from "./Environment";
import InfiniteBuildings from "./InfiniteBuildings";
import CameraManager from "./CameraManager";
import InfiniteRoad from "./InfiniteRoad";
import GameLogic from "./GameLogic";

const Scene = () => {

  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} castShadow />
      <Player name="player" />
      <Environment />
      <InfiniteBuildings name="infiniteBuildingsGroup" />
      <InfiniteRoad />
      <CameraManager />
      <GameLogic />
      <InfiniteRoad />
      <CameraManager />
    </Canvas>
  );
};

export default Scene;
