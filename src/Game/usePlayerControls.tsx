import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { checkCollisions } from "./CollisionManager";
import { useAtom, useAtomValue } from 'jotai';
import { masterSpeedAtom, isMobileAtom, joystickInputAtom } from '../GameState';

export const usePlayerControls = (playerRef: React.RefObject<THREE.Group>) => {
  const { camera, size, scene } = useThree();
  const controls = useRef({ w: false, s: false, a: false, d: false });
  const [masterSpeed] = useAtom(masterSpeedAtom);
  const isMobile = useAtomValue(isMobileAtom);
  const joystickInput = useAtomValue(joystickInputAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in controls.current) {
        controls.current[e.key as keyof typeof controls.current] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in controls.current) {
        controls.current[e.key as keyof typeof controls.current] = false;
      }
    };

    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [isMobile]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    // --- Constant Forward Motion ---
    const forwardMovement = masterSpeed * delta;
    camera.position.z -= forwardMovement;
    playerRef.current.position.z -= forwardMovement;

    // --- Player Input ---
    const speed = 5 * delta;
    const playerPosition = playerRef.current.position;

    if (isMobile) {
      playerPosition.x += joystickInput.x * speed;
      playerPosition.z -= joystickInput.y * speed; // Joystick Y controls forward/backward
    } else {
      if (controls.current.w) {
        playerPosition.z -= speed;
      }
      if (controls.current.s) {
        playerPosition.z += speed;
      }
      if (controls.current.a) {
        playerPosition.x -= speed;
      }
      if (controls.current.d) {
        playerPosition.x += speed;
      }
    }

    // --- Boundary Calculation ---
    const distance = camera.position.y - playerPosition.y;
    const aspect = size.width / size.height;
    const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    const frustumHeight = 2 * Math.tan(vFov / 2) * distance;
    const frustumWidth = frustumHeight * aspect;

    const minX = -frustumWidth / 2;
    const maxX = frustumWidth / 2;

    const basePlayerZ = camera.position.z - 10;
    const minZ = basePlayerZ - 15;
    const maxZ = basePlayerZ + 5;

    // --- Clamping ---
    playerPosition.x = THREE.MathUtils.clamp(playerPosition.x, minX, maxX);
    playerPosition.z = THREE.MathUtils.clamp(playerPosition.z, minZ, maxZ);

    // --- Collision Detection ---
    checkCollisions(playerRef.current, camera, scene.children);

    // --- Camera Update ---
    const lookAtPoint = new THREE.Vector3(0, 0, camera.position.z - 10);
    camera.lookAt(lookAtPoint);
  });
};
