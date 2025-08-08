import React from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <button onClick={onStart} style={{ padding: '20px 40px', fontSize: '2em', cursor: 'pointer' }}>
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;