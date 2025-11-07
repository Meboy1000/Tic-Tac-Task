import React from "react";
import { Landing } from "../application/landingpageData";
import styles from "./landingpage.module.css";

export default function LandingPagePreview(props: Landing) {
  return (
    <>
      <div>
        <h3 className={styles.title}>{props.title}</h3>
      </div>

      <div className={styles.loginContainer}>
        <form
          className={styles.login}
          onSubmit={(e) => {
            e.preventDefault(); // remove this later when you handle real submit
            console.log("Username:", (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value);
            console.log("Password:", (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value);
          }}
        >
          <div className={styles.field}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={props.username}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue={props.password}
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

