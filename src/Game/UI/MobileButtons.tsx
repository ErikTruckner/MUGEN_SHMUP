import React from 'react';
import { useSetAtom } from 'jotai';
import { shootAtom, bombAtom } from '../../GameState';

const MobileButtons = () => {
  const setShoot = useSetAtom(shootAtom);
  const setBomb = useSetAtom(bombAtom);

  const handleShootDown = () => setShoot(true);
  const handleShootUp = () => setShoot(false);

  const handleBomb = () => setBomb(true);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 90,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 255, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          zIndex: 1000,
        }}
        onTouchStart={handleShootDown}
        onTouchEnd={handleShootUp}
        onMouseDown={handleShootDown}
        onMouseUp={handleShootUp}
      >
        <span>🔫</span>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          zIndex: 1000,
        }}
        onTouchStart={handleBomb}
        onMouseDown={handleBomb}
      >
        <span>💣</span>
      </div>
    </>
  );
};

export default MobileButtons;
