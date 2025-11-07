import React from "react";
import { Landing } from "../application/landingpageData";
import styles from "./landingpage.module.css";

export default function LandingPagePreview(props: Landing) {
	return (
	<>
		<div>	
			<b> <h3 className={styles.title}> {props.title} </h3> </b>
		</div>
		<div className={styles.loginContainer}>
			<div className={styles.login}> 
				<h3> {props.username} </h3>
				<h3> {props.password} </h3>
			</div>
		</div>
	</>
	);
}
