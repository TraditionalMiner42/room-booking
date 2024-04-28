import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import users from "../../users/users";

export default function SignIn({ onLoginSuccess }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	function handleSubmitEvent(e) {
		e.preventDefault();

		const foundUser = users.find((user) => user.email === email);

		if (
			foundUser &&
			foundUser.email === email &&
			password === "mockPassword"
		) {
			// Mock successful login (replace with actual login logic)
			onLoginSuccess(foundUser);
			setError("");
			navigate("/");
		} else {
			setError("Invalid email or password");
		}
	}

	function handleInput(e) {
		// const name = e.target.name;

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
				<div>
					<p>Forgot password?</p>
					<p>
						<Link to={"/signup"}>Sign Up</Link>
					</p>
				</div>
			</form>
		</>
	);
}
