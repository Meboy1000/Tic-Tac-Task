import React, { useState, useEffect } from 'react';
import LandingPagePreview from "./pages/Landing/landPage.jsx";
import GameBoard from "./pages/Game/GameBoardL.jsx";
import { saveUserSession, getUserSession, clearUserSession } from './utils/cookies';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState(1); // track which player is logged in (1 or 2)
  const [userId, setUserId] = useState(null); // actual user ID from database
  const [matchId, setMatchId] = useState(null); // match/game ID
  const [username, setUsername] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const session = getUserSession();
    if (session) {
      console.log('Restored session from cookies:', session);
      setUserId(session.userId);
      setUsername(session.username);
      setMatchId(session.matchId);
      setCurrentPlayerId(session.playerId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUserId(userData.userId);
    setUsername(userData.username);
    setMatchId(userData.matchId);
    setCurrentPlayerId(userData.playerId); // 1 or 2
    setIsLoggedIn(true);
    
    // Save session to cookies
    saveUserSession(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername('');
    setMatchId(null);
    setCurrentPlayerId(1);
    
    // Clear cookies
    clearUserSession();
  };

  if (!isLoggedIn) {
    // connected this component to render the LandingPagePreview (title page) 
    // Topics: Passing props -> components -> render components   
    return <LandingPagePreview onLogin={handleLogin} />;
    
  }

  return (
    <GameBoard 
      onLogout={handleLogout} 
      currentPlayerId={currentPlayerId}
      userId={userId}
      matchId={matchId}
      username={username}
    />
  );
}

export default App;
