import React, { useState } from 'react';
import LandingPagePreview from "./pages/Landing/landPage";
import GameBoard from "./pages/Game/GameBoardL";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1); // Track which player is logged in

  const handleLogin = (playerId: number = 1) => {
    setCurrentPlayerId(playerId);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LandingPagePreview onLogin={() => handleLogin(1)} />;
  }

  return <GameBoard onLogout={() => setIsLoggedIn(false)} currentPlayerId={currentPlayerId} />;
}

export default App;