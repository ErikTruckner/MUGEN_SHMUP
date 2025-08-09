import { useFrame, useThree } from "@react-three/fiber";
import { checkCollisions } from "./CollisionManager";
import { useAtom } from "jotai";
import { bulletsAtom, bombsAtom } from "../GameState";
import { Bullet } from "./Bullet";
import { Bomb } from "./Bomb";

const GameLogic = () => {
  const { scene, camera } = useThree();
  const [bullets] = useAtom(bulletsAtom);
  const [bombs, setBombs] = useAtom(bombsAtom);

  useFrame(() => {
    const player = scene.getObjectByName("player");
    const buildingsGroup = scene.getObjectByName("infiniteBuildingsGroup");

    if (player && buildingsGroup) {
      checkCollisions(player, camera, buildingsGroup.children);
    }

    // Update bombs
    setBombs((prevBombs) =>
      prevBombs.map((bomb) => ({
        ...bomb,
        position: [bomb.position[0], bomb.position[1], bomb.position[2] - 0.1],
      })).filter(bomb => bomb.position[2] > camera.position.z - 50)
    );
  });

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} {...bullet} />
      ))}
      {bombs.map((bomb) => (
        <Bomb key={bomb.id} {...bomb} />
      ))}
    </>
  );
};

export default GameLogic;