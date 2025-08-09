import React, { useCallback, useEffect, useState } from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [isLocked, setIsLocked] = useState(false);

  const handleStart = useCallback(() => {
    document.body.requestPointerLock();
    onStart();
  }, [onStart]);

  useEffect(() => {
    const pointerLockChange = () => {
      if (document.pointerLockElement === document.body) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    document.addEventListener('pointerlockchange', pointerLockChange, false);

    return () => {
      document.removeEventListener('pointerlockchange', pointerLockChange, false);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {!isLocked ? (
        <button onClick={handleStart} style={{ padding: '20px 40px', fontSize: '2em', cursor: 'pointer' }}>
          Start Game
        </button>
      ) : (
        <div style={{ color: 'white', fontSize: '1.5em' }}>
          Press ESC to release mouse
        </div>
      )}
    </div>
  );
};

export default StartScreen;