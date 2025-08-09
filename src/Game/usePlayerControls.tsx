import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { checkCollisions } from "./CollisionManager";
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { masterSpeedAtom, isMobileAtom, joystickInputAtom, bulletsAtom, bombsAtom, fireRateAtom, shootAtom, bombAtom } from '../GameState';
import { BombSight } from "./Bomb";

export const usePlayerControls = (playerRef: React.RefObject<THREE.Group>) => {
  const { camera, size, scene } = useThree();
  const controls = useRef({ w: false, s: false, a: false, d: false });
  const [masterSpeed] = useAtom(masterSpeedAtom);
  const isMobile = useAtomValue(isMobileAtom);
  const joystickInput = useAtomValue(joystickInputAtom);
  const bombState = useRef<'idle' | 'aiming' | 'cooldown'>('idle');
  const setBullets = useSetAtom(bulletsAtom);
  const setBombs = useSetAtom(bombsAtom);
  const [showBombSight, setShowBombSight] = useState(false);
  const bombTarget = useRef(new THREE.Vector3());
  const shoot = useAtomValue(shootAtom);
  const [bomb, setBomb] = useAtom(bombAtom);
  const setShoot = useSetAtom(shootAtom);
  const lastShotTime = useRef(0);
  const fireRate = useAtomValue(fireRateAtom);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setShoot(true);
      } else if (e.button === 2) {
        if (bombState.current === 'idle') {
          bombState.current = 'aiming';
          setShowBombSight(true);
        } else if (bombState.current === 'aiming') {
          // Launch bomb
          setBombs((prevBombs) => [...prevBombs, {
            id: Date.now(),
            position: playerRef.current!.position.toArray(),
            target: bombTarget.current.toArray(),
          }]);
          bombState.current = 'cooldown';
          setShowBombSight(false);
          setTimeout(() => {
            bombState.current = 'idle';
          }, 10000); // 10-second cooldown
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setShoot(false);
      }
    };

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
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isMobile, setBombs, playerRef, setBullets, setShoot]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    if (shoot) {
      const now = Date.now();
      if (now - lastShotTime.current > fireRate) {
        lastShotTime.current = now;
        const bulletPosition = playerRef.current!.position.clone();
        const bulletVelocity = new THREE.Vector3(0, 0, -20);
        setBullets((prevBullets) => [...prevBullets, {
          id: Date.now(),
          position: bulletPosition.toArray(),
          velocity: bulletVelocity.toArray(),
        }]);
      }
    }

    if (bomb) {
      if (bombState.current === 'idle') {
        bombState.current = 'aiming';
        setShowBombSight(true);
      } else if (bombState.current === 'aiming') {
        // Launch bomb
        setBombs((prevBombs) => [...prevBombs, {
          id: Date.now(),
          position: playerRef.current!.position.toArray(),
          target: bombTarget.current.toArray(),
        }]);
        bombState.current = 'cooldown';
        setShowBombSight(false);
        setTimeout(() => {
          bombState.current = 'idle';
        }, 10000); // 10-second cooldown
      }
      setBomb(false);
    }


    // --- Bomb aiming ---
    if (bombState.current === 'aiming') {
      const vector = new THREE.Vector3(state.mouse.x, state.mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.y / dir.y;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      const playerPos = playerRef.current.position.clone();
      const direction = pos.clone().sub(playerPos);
      if (direction.length() > 30) {
        direction.setLength(30);
      }
      bombTarget.current.copy(playerPos.add(direction));
    }

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
    const distanceToPlayer = camera.position.y - playerPosition.y;
    const aspect = size.width / size.height;
    const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    const frustumHeight = 2 * Math.tan(vFov / 2) * distanceToPlayer;
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

  return <>{showBombSight && <BombSight player={playerRef} />}</>;
};
