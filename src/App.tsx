import { useState, useEffect, useRef } from "react";
import Scene from "./Game/Scene";
import StartScreen from "./Game/StartScreen";
import MobileJoystick from "./Game/UI/MobileJoystick";
import MobileButtons from "./Game/UI/MobileButtons";
import { useSetAtom, useAtomValue } from 'jotai';
import { isMobileAtom } from './GameState';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const setIsMobile = useSetAtom(isMobileAtom);
  const isMobile = useAtomValue(isMobileAtom);
  const gameScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Mobi|Android|iPad|Tablet/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [setIsMobile]);

  useEffect(() => {
    const handleClick = () => {
      if (gameScreenRef.current && document.pointerLockElement !== gameScreenRef.current) {
        gameScreenRef.current.requestPointerLock();
      }
    };

    const gameScreen = gameScreenRef.current;
    gameScreen?.addEventListener('click', handleClick);

    return () => {
      gameScreen?.removeEventListener('click', handleClick);
    };
  }, []);

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      <div className="game-screen-container" ref={gameScreenRef}>
        {gameStarted ? <Scene /> : <StartScreen onStart={handleStart} />}
        {gameStarted && isMobile && <MobileJoystick />}
        {gameStarted && isMobile && <MobileButtons />}
      </div>
    </>
  );
}

export default App;
