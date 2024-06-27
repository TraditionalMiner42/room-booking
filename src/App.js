import { Routes, Route, Outlet, Router } from "react-router-dom";
import LandingPage from "./components/home/LandingPage.js";
import SignIn from "./components/auth/SignIn.js";
import SignUp from "./components/auth/SignUp.js";
import "./App.css";
import Navbar from "./components/Navbar.js";
import { useEffect, useState } from "react";
import Room from "./components/room/Room.js";
import { AuthProvider } from "./components/context/AuthContext.js";
import PrivateRoute from "./components/PrivateRoute.js";
import PageException from "./components/PageException.js";
import MyBooking from "./components/my-bookings/MyBookings.js";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isModalForm, setIsModalForm] = useState(false);
	const [username, setUsername] = useState("");

	useEffect(() => console.log("login state: ", isLoggedIn));

	// const handleLoginSuccess = (user) => {
	// 	setIsLoggedIn(true);
	// 	setToken(Math.random().toString(36).substring(2, 15)); // Generate dummy token
	// };
	return (
		<div className="font-NotoSansThai">
			<AuthProvider>
				<Routes>
					{/* Private Routes */}
					<Route
						element={
							<>
								<Navbar />
								<Outlet />
							</>
						}>
						<Route
							path="/"
							element={
								<PrivateRoute>
									<LandingPage
										isModalForm={!isModalForm}
										username={username}
										setUsername={setUsername}
									/>
								</PrivateRoute>
							}
						/>
						<Route
							path="users/rooms"
							element={
								<PrivateRoute>
									<Room
										isModalForm={isModalForm}
										username={username}
										setUsername={setUsername}
									/>
								</PrivateRoute>
							}
						/>
						<Route
							path="users/bookings"
							element={
								<PrivateRoute>
									<MyBooking
										username={username}
										setUsername={setUsername}
									/>
								</PrivateRoute>
							}
						/>
					</Route>

					{/* Public routes */}
					<Route path="/users/signin" element={<SignIn />} />
					<Route path="/users/signup" element={<SignUp />} />

					<Route path="*" element={<PageException />} />
				</Routes>
			</AuthProvider>
		</div>
	);
}

export default App;
