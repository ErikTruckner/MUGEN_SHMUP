import { useFrame, useThree } from "@react-three/fiber";
import { checkCollisions } from "./CollisionManager";

const GameLogic = () => {
  const { scene, camera } = useThree();

  useFrame(() => {
    const player = scene.getObjectByName("player");
    const buildingsGroup = scene.getObjectByName("infiniteBuildingsGroup");

    if (player && buildingsGroup) {
      checkCollisions(player, camera, buildingsGroup.children);
    }
  });

  return null; // This component doesn't render anything visible
};

export default GameLogic;