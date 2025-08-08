import { useState } from "react";
import Scene from "./Game/Scene";
import StartScreen from "./Game/StartScreen";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">MUGEN</h1> */}
      {/* GAME SCRENE SIZE */}
      <div className="absolute z-20 top-0 left-0 w-full h-screen border-2 border-black">
        {gameStarted ? <Scene /> : <StartScreen onStart={handleStart} />}
      </div>
    </>
  );
}

export default App;
