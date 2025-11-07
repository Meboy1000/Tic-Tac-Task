import LandingPagePreview from "../../components/landingPage";
import { landingContent } from "../landingPageData";

export default function Home() {
	return (
	<>
		{landingContent.map((home) =>
			<LandingPagePreview
			title={home.title}
		        username={home.username}
			password={home.password}
			/>
		)}
	</>
	);
}
