import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
		} else {
			setError(null); // Clear error if passwords match
		}
		console.log("pass: ", password);
	}, [confirmPassword, password, setError]);

	const checkMatchedPassword = (event) => {
		const newPassword = event.target.value;
		setConfirmPassword(newPassword);
	};

	const handleSubmit = (event) => {
		event.preventDefault(); // Prevent default form submission

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return; // Don't submit the form if passwords don't match
		}

		// Handle form submission logic here (e.g., send data to server)
		console.log(
			"Form submitted with username:",
			username,
			"and password:",
			password
		);

		axios
			.post("http://localhost:4000/users/signup", {
				username,
				password,
			})
			.then((response) => {
				const { success, username } = response.data;
				console.log(response);
				if (success) {
					navigate("/users/signin");
				} else {
					setError("Have problem signing up.");
				}
			})
			.catch((error) => {
				if (error.response.status === 409) {
					console.log(
						`Request failed with status code ${error.response?.status}`
					);
					alert(error.response.data.message);
				} else if (error.response.status === 500) {
					console.log(
						`Request failed with status code ${error.response?.status}`
					);
					alert(error.response.data.message);
				}
			});

		// Reset form data (optional)
		setUsername("");
		setPassword("");
		setConfirmPassword("");
	};

	return (
		<>
			<div className="text-center text-xl mt-4 pt-10">Register Page</div>
			<form
				className="flex flex-col justify-center items-center p-4 m-4"
				onSubmit={handleSubmit}
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
						required
						value={username}
						onChange={(e) => setUsername(e.target.value)}
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
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="flex flex-col text-left p-2 mx-2 my-2">
					<label className="login-label" htmlFor="password">
						Confirmed Password
					</label>
					<input
						className="login-input"
						type="password"
						name="confirmed-password"
						placeholder="Re-enter your password"
						minLength="8"
						required
						value={confirmPassword}
						onChange={checkMatchedPassword}
					/>
					{error && <p className="error-message">{error}</p>}
				</div>
				<div className="login-btn-container">
					<button className="form-btn" type="submit">
						Sign Up
					</button>
				</div>
			</form>
		</>
	);
}
