import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import axios from "axios";

export default function SignIn({ setUserToken }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	// const [user, setUser] = useState(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	useEffect(() => console.log("error: ", error));

	const handleSubmitEvent = (e) => {
		e.preventDefault();

		axios
			.post("http://localhost:4000/users/signin", {
				username,
				password,
			})
			.then((response) => {
				// console.log(response.data);
				const { success, username } = response.data;
				if (success) {
					// Set session information as cookies
					// document.cookie = `user=${JSON.stringify(
					// 	user
					// )}; Secure; HttpOnly`;
					// Redirect or perform any other actions
					localStorage.setItem(
						"accessToken",
						response.data.jwtAccessToken
					);
					login();
					setUserToken({
						token: localStorage.getItem("accessToken"),
					});
					console.log(
						`access token: ${response.data.jwtAccessToken}`
					);
					navigate("/");
				} else {
					setError("Invalid username or password");
				}
			})
			.catch((error) => {
				if (error.response?.status === 500) {
					console.log(
						`Request failed with status code ${error.response?.status}`
					);
					alert(error.response.data.message);
				}
			});
	};

	return (
		<>
			<div className="text-center text-xl mt-4 pt-10">
				Welcome to Meeting Room Booking System
			</div>
			<form
				className="flex flex-col justify-center items-center p-4 m-4"
				onSubmit={handleSubmitEvent}
				method="post"
			>
				<div className="flex flex-col text-left p-2 mx-2 my-2">
					<label className="login-label" htmlFor="email">
						Username
					</label>
					<input
						className="login-input"
						type="text"
						name="username"
						placeholder="Enter your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col text-left p-2 mx-2 my-2">
					<label className="login-label" htmlFor="password">
						Password
					</label>
					<input
						className="login-input"
						type="password"
						name="password"
						placeholder="Enter your password"
						minLength="8"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="login-btn-container">
					<button className="form-btn" type="submit">
						Log In
					</button>
					{error && <p className="error-message">{error}</p>}
				</div>
				<div className="flex flex-row space-x-5">
					<p>Forgot password?</p>
					<p>
						<Link to={"/users/signup"}>Sign Up</Link>
					</p>
				</div>
			</form>
		</>
	);
}
