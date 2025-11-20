import React, { useState } from 'react';
import LandingPagePreview from "./pages/Landing/landPage.jsx";
import GameBoard from "./pages/Game/GameBoardL.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState(1); // track which player is logged in

  const handleLogin = (playerId = 1) => {
    setCurrentPlayerId(playerId);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LandingPagePreview onLogin={() => handleLogin(1)} />;
  }

  return <GameBoard onLogout={() => setIsLoggedIn(false)} currentPlayerId={currentPlayerId} />;
}

export default App;
