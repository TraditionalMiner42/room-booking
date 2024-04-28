import { useState } from "react";

function LandingPage() {
	const [status, setStaus] = useState(false);
	return (
		<>
			<div className="text-center">Meeting Room Status</div>
			<table></table>
		</>
	);
}

export default LandingPage;
