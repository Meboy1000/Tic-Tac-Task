import React, { useState } from "react";
import styles from "./landPage.module.css";

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPagePreview({ onLogin }: LandingPageProps) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setCreds({ ...creds, username: value });
        break;
      case "password":
        setCreds({ ...creds, pwd: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: "", pwd: "" });
  }

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
              value={creds.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={creds.pwd}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter password"
            />
          </div>

          <button type="button" onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  );
}
