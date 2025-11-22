import React, { useState } from "react";
import styles from "./landPage.module.css";

export default function LandingPagePreview({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinSection, setShowJoinSection] = useState(false);

  const setLogin = () => {
    if (username && password) {
      console.log(`Logging in with username: ${username} and password: ${password}`);
      alert("okay logged player");
      onLogin();
    }
  };

  const handleJoinGame = () => {
    if (username && password && roomId) {
      console.log(`Joining game with room ID: ${roomId}`);
      alert(`Joining game with room ID: ${roomId}`);
      onLogin();
    }
  };


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

          <button type="button" onClick={setLogin}>Create Game</button>
          <button
            type="button"
            className={styles.joinToggleButton}
            onClick={() => setShowJoinSection(!showJoinSection)}
            style={{ marginTop: "20px" }}
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
              <button type="button" onClick={handleJoinGame} className={styles.saveBtn}>Join Game</button>
              <button type="button" onClick={() => setShowJoinSection(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
