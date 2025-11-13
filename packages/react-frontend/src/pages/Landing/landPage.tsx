import React, { useState } from "react";
import styles from "./landPage.module.css";

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPagePreview({ onLogin }: LandingPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const setLogin = () => {
    if (username && password) {
      console.log(`Logging in with username: ${username} and password: ${password}`);
      alert("okay logged player");
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
            <label htmlFor="username">Username:</label>
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
            <label htmlFor="password">Password:</label>
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
        </div>
      </div>
    </div>
  );
}