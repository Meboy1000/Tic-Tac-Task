import React from "react";
import { Landing } from "../application/landingpageData";
import styles from "./landingpage.css";

export default function LandingPagePreview(props: Landing) {
	return (
		<div>	
			<b> <h3> {props.title} </h3> </b>
		</div>
	);
}
