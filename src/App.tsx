import { useState, useEffect } from "react";
import Scene from "./Game/Scene";
import StartScreen from "./Game/StartScreen";
import MobileJoystick from "./Game/UI/MobileJoystick";
import { useSetAtom, useAtomValue } from 'jotai';
import { isMobileAtom } from './GameState';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const setIsMobile = useSetAtom(isMobileAtom);
  const isMobile = useAtomValue(isMobileAtom);

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

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      <div className="game-screen-container">
        {gameStarted ? <Scene /> : <StartScreen onStart={handleStart} />}
        {gameStarted && isMobile && <MobileJoystick />}
      </div>
    </>
  );
}

export default App;
