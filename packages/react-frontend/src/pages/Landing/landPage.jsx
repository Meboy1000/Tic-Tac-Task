import React, { useState } from "react";
import styles from "./landPage.module.css";
import { addUser, getUserById } from "../../api/user";
import { addMatch, getMatchById, addUser2ToMatch } from "../../api/match";

export default function LandingPagePreview({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinSection, setShowJoinSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setLogin = async () => {
    if (username && password) {
      setIsLoading(true);
      try {
        // Create/register user
        const newUser = await addUser({ username, password });
        console.log('User created:', newUser);
        
        // Create a new match with this user as player 1
        const newMatch = await addMatch({
          user1_id: newUser.id,
          password: password // Backend requires password for match creation
        });
        console.log('Match created:', newMatch);
        
        alert(`Game created! Room ID: ${newMatch.id}`);
        
        // Pass user and match info to App
        onLogin({
          userId: newUser.id,
          username: newUser.username,
          matchId: newMatch.id,
          playerId: 1 // This user is player 1
        });
      } catch (error) {
        console.error('Error creating game:', error);
        alert('Error creating game. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleJoinGame = async () => {
    if (username && password && roomId) {
      setIsLoading(true);
      try {
        // Create/register user
        const newUser = await addUser({ username, password });
        console.log('User created:', newUser);
        
        // Get the match to join
        const match = await getMatchById(roomId);
        console.log('Match found:', match);
        
        // Add this user as player 2
        const updatedMatch = await addUser2ToMatch(roomId, newUser.id);
        console.log('Joined match:', updatedMatch);
        
        alert(`Joined game! Room ID: ${roomId}`);
        
        // Pass user and match info to App
        onLogin({
          userId: newUser.id,
          username: newUser.username,
          matchId: updatedMatch.id,
          playerId: 2 // This user is player 2
        });
      } catch (error) {
        console.error('Error joining game:', error);
        alert('Error joining game. Check the room ID and try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter username, password, and room ID');
    }
  };
  
  // Connected CSS styling for titles, containers, etc. (ex. {styles.container})
  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.title}>Tic Tac Task</h3>
      </div>
      
      
      <div className={styles.loginContainer}>
        <div className={styles.login}>
          <div className={styles.field}>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setLogin()}
              placeholder="Enter password"
            />
          </div>

          <button type="button" onClick={setLogin} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Game'}
          </button>
          <button
            type="button"
            className={styles.joinToggleButton}
            onClick={() => setShowJoinSection(!showJoinSection)}
            style={{ marginTop: "20px" }}
            disabled={isLoading}
          >
            Join Game 
          </button>
        </div>
      </div>

      {showJoinSection && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Join a Game</h2>

            <div className={styles.field}>
              <label htmlFor="roomId">Room ID: </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
              />
            </div>

            <div className={styles.popupButtons}>
              <button type="button" onClick={handleJoinGame} className={styles.saveBtn} disabled={isLoading}>
                {isLoading ? 'Joining...' : 'Join Game'}
              </button>
              <button type="button" onClick={() => setShowJoinSection(false)} className={styles.cancelBtn} disabled={isLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
