import { Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./components/LandingPage.js";
import SignIn from "./components/auth/SignIn.js";
import SignUp from "./components/auth/SignUp.js";
import "./App.css";
import Navbar from "./components/Navbar.js";
import { useEffect, useState } from "react";
import Room from "./components/room/Room.js";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState(null);

	useEffect(() => console.log("login state: ", isLoggedIn));

	const handleLoginSuccess = (user) => {
		setIsLoggedIn(true);
		setToken(Math.random().toString(36).substring(2, 15)); // Generate dummy token
	};
	return (
		<div className="app-container">
			<Routes>
				{/* <Route path="/" element={<LandingPage />} /> */}

				<Route
					element={
						<>
							<Navbar />
							<Outlet />
						</>
					}
				>
					<Route path="/" element={<LandingPage />} />
					<Route path="/rooms" element={<Room />} />
				</Route>
				<Route
					path="/users/signin"
					element={<SignIn onLoginSuccess={handleLoginSuccess} />}
				/>
				<Route path="/users/signup" element={<SignUp />} />
			</Routes>
		</div>
	);
}

export default App;
