import { Button, Form, Input, Result } from "antd";
import Spin from "antd/es/spin/index.js";
import "antd/es/spin/style/index.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../api/DataService.js";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const navigate = useNavigate();
	const [form] = Form.useForm();

	// Validator function to check if username exists
	const validateUsername = async (_, value) => {
		if (!value) {
			return Promise.resolve();
		}
		try {
			// Check if username exists using the same signup endpoint
			await signUpUser(value, "dummyPassword", true);
			// Use a dummy password
			return Promise.resolve();
		} catch (err) {
			if (err.message === "Username already exists") {
				return Promise.reject("Username already exists");
			}
			return Promise.reject("Failed to validate username");
		}
	};

	const handleSubmit = () => {
		console.log("Submitting form...");
		setLoading(true);
		try {
			signUpUser(username, password)
				.then((response) => {
					const { success } = response.data;
					console.log(response);
					if (success) {
						// Reset form data (optional)
						setSuccessAlert(true);
						setUsername("");
						setPassword("");
						setConfirmPassword("");
						setTimeout(() => {
							navigate("/users/signin?submit=success", {
								replace: true,
							});
						}, 2000);
					}
				})
				.catch((error) => {
					console.error("Error signing up: ", error);
					if (error.message === "Username already exists") {
						setError("Username already exists");
					} else {
						setError("Failed to sign up. Please try again.");
					}
				})
				.finally(() => setLoading(false));
		} catch (error) {
			console.log("Error signing up: ", error);
		}
	};

	return (
		<>
			{successAlert ? (
				<Result
					status={"success"}
					title="You have signed up successfully"></Result>
			) : (
				<>
					<div>
						<Spin spinning={loading} tip="Loading" size="large">
							<div className="flex flex-col justify-start items-center min-h-screen bg-gray-100">
								{/* Change welcoming text later */}
								<div className="py-8 px-4 m-4 text-center text-2xl tracking-widest">
									Register Page
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
										label={
											<p className="text-base">
												Username
											</p>
										}
										name="username"
										rules={[
											{
												required: true,
												message:
													"Please enter your username",
											},
											{
												validator: validateUsername,
											},
										]}>
										<Input
											placeholder="Enter your username"
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
										/>
									</Form.Item>
									<Form.Item
										className="py-2"
										label={
											<p className="text-base">
												Password
											</p>
										}
										name="password"
										rules={[
											{
												required: true,
												message:
													"Please enter your password",
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
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
									</Form.Item>
									<Form.Item
										className="py-2"
										label={
											<p className="text-base">
												Password
											</p>
										}
										name="Confirmed Password"
										rules={[
											{
												required: true,
												message:
													"Please re-enter your password",
											},
											({ getFieldValue }) => ({
												validator(_, value) {
													if (
														!value ||
														getFieldValue(
															"password"
														) === value
													) {
														return Promise.resolve();
													}
													return Promise.reject(
														new Error(
															"The two passwords do not match!"
														)
													);
												},
											}),
										]}>
										<Input.Password
											placeholder="Re-enter your password"
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
										/>
									</Form.Item>

									<Form.Item className="flex justify-center py-2">
										<Button
											type="primary"
											htmlType="submit">
											Sign Up
										</Button>
									</Form.Item>
								</Form>
							</div>
						</Spin>
					</div>
				</>
			)}
		</>
	);
}
