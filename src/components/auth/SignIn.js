import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import users from "../../users/users.js";
import axios from "axios";
import { UserContext } from "../UserContext.js";

export default function SignIn({ onLoginSuccess }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const { foundUser, setFoundUser, users } = useContext(UserContext);

	useEffect(() => {
		setFoundUser(users.find((user) => user.email === email));
	}, [email, setFoundUser, users]);

	function handleSubmitEvent(e) {
		e.preventDefault();

		// const foundEmail = users.find((user) => user.email === email);

		// console.log("found user: ", foundUser);

		// setFoundUser(foundEmail);

		// if (
		// 	foundUser &&
		// 	foundUser.email === email &&
		// 	password === "mockPassword"
		// ) {
		// 	// Mock successful login (replace with actual login logic)
		// 	onLoginSuccess(foundUser);
		// 	document.cookie = `email=${foundUser.email}; path=/`;
		// 	setError("");
		// 	navigate("/");
		// } else {
		// 	setError("Invalid email or password");
		// }

		try {
			axios
				.post("http://localhost:4000/users/signin", {
					email,
					password,
				})
				.then((response) => {
					// console.log(response.data);
					const { success, user } = response.data;
					if (success) {
						// Set session information as cookies
						document.cookie = `user=${JSON.stringify(
							user
						)}; Secure; HttpOnly`;
						// Redirect or perform any other actions
						navigate("/");
					} else {
						setError("Invalid email or password");
					}
				});
		} catch (error) {
			console.log(error);
		}
	}

	function handleInput(e) {
		switch (e.target.type) {
			case "email":
				setEmail(e.target.value);
				break;
			case "password":
				setPassword(e.target.value);
				break;
			default:
				console.log("No input type");
		}
	}

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
						Email
					</label>
					<input
						className="login-input"
						type="email"
						name="email"
						placeholder="Enter your email"
						onChange={handleInput}
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
						onChange={handleInput}
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
