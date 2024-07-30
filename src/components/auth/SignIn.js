import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { Alert, Button, Form, Input } from "antd";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form] = Form.useForm();

	const localtion = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(localtion.search);
		const value = params.get("submit");

		if (value === "success") {
			setTimeout(() => {
				navigate("/users/signin", { replace: true }); // Navigate to signin page
			}, 2000);
		}

		// Clear the URL parameter after processing
		// navigate("/", { replace: true });
	}, [navigate]);

	const handleSubmit = async (e) => {
		// e.preventDefault();

		try {
			await login(username, password);
			navigate("/");
		} catch (error) {
			if (error.message === "Invalid username or password") {
				setError(error.message);
			} else {
				setError("An error occurred during sign-in");
			}
		}
	};

	return (
		<>
			<div className="flex flex-col justify-start items-center min-h-screen bg-gray-100">
				{/* Change welcoming text later */}
				<div className="py-8 px-4 m-4 text-center text-2xl tracking-widest">
					Welcome to Meeting Room Booking System
				</div>

				<Form
					form={form}
					name="login"
					className="m-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-8 bg-white shadow-md rounded-md"
					initialValues={{ username, password }}
					onFinish={handleSubmit}
					layout="vertical">
					<Form.Item
						className="pb-2 pt-4"
						label={<p className="text-base">Username</p>}
						name="username"
						rules={[
							{
								required: true,
								message: "Please enter your username",
							},
						]}>
						<Input
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						className="py-2"
						label={<p className="text-base">Password</p>}
						name="password"
						rules={[
							{
								required: true,
								message: "Please enter your password",
							},
							{
								min: 8,
								message:
									"Password must be at least 8 characters",
							},
						]}>
						<Input.Password
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Item>

					{error && (
						<Alert
							type="error"
							message={error}
							onClose={() => setError(null)}
							closable>
							{error}
						</Alert>
					)}

					<Form.Item className="py-2">
						<Button
							type="primary"
							htmlType="submit"
							className="w-full">
							Log In
						</Button>
					</Form.Item>

					<div className="flex justify-between pb-4">
						<p>Forgot password?</p>
						<p>
							<Link to="/users/signup">Sign Up</Link>
						</p>
					</div>
				</Form>
			</div>
		</>
	);
}
