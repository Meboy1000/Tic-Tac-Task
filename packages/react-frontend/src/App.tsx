import React, { useState } from 'react';
import LandingPagePreview from "./pages/Landing/landPage";
import GameBoard from "./pages/Game/GameBoardL";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LandingPagePreview onLogin={() => setIsLoggedIn(true)} />;
  }

  return <GameBoard onLogout={() => setIsLoggedIn(false)} />;
}

export default App;