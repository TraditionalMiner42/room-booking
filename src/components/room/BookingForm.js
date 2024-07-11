import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GenericForm from "../GenericForm.js";
import { Form, Result, Spin } from "antd";
import { fetchPostForm } from "../../api/DataService.js";

export default function BookingForm({
	isModalForm,
	username,
	setUsername,
	loading,
	setLoading,
	isSubmitted,
	setIsSubmitted,
}) {
	const navigate = useNavigate();

	const initialFormData = {
		meetingTopic: "",
		name: "",
		dateStart: "",
		timeStart: null,
		timeEnd: null,
		room: "",
	};

	// const [formData, setFormData] = useState(initialFormData);
	const [rooms, setRooms] = useState([]);
	// const [username, setUsername] = useState("");

	// const [isSubmitted, setIsSubmitted] = useState(false);
	// const [loading, setLoading] = useState(false);

	const [form] = Form.useForm();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");

		if (token) {
			const decoded = jwtDecode(token);
			setUsername(decoded.username);
		}

		const fetchRooms = async () => {
			try {
				const response = await axiosInstance.get("/users/get_rooms");
				// console.log("Rooms response:", response.data.rooms); // Check response data
				setRooms(response.data.rooms);
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		};

		fetchRooms();
		console.log("Meeting rooms: ", rooms);
	}, []);

	useEffect(() => {
		// console.log("user: ", username);
		form.setFieldValue("name", username);
	});

	const handleSubmit = (formData) => {
		const fromTimeValue = form.getFieldValue("timeStart");
		const toTimeValue = form.getFieldValue("timeEnd");

		const fromTime = fromTimeValue ? fromTimeValue.format("HH:mm") : null;
		const toTime = toTimeValue ? toTimeValue.format("HH:mm") : null;

		const modifiedFormValues = {
			...formData,
			timeStart: fromTime,
			timeEnd: toTime,
		};

		// console.log("fromTime: ", fromTime);
		console.log("form: ", modifiedFormValues);
		setLoading(true);
		try {
			fetchPostForm(modifiedFormValues)
				.then((response) => {
					console.log(response);
					const { success } = response.data;
					if (success) {
						form.resetFields();
						setIsSubmitted(true); // Update state for success message or redirection
						setTimeout(() => {
							navigate("/?submit=success", { replace: true });
						}, 2000);
					}
				})
				.catch((error) => {
					if (error.response && error.response.status === 403) {
						localStorage.removeItem("accessToken");
						navigate("/users/signin");
					} else if (
						error.response &&
						error.response.status === 409
					) {
						alert(error.response.data.message);
					} else {
						console.error("An unexpected error occurred:", error);
					}
				})
				.finally(() => setLoading(false));
		} catch (error) {
			console.log(error);
		}
	};

	// console.log("name: ", username);

	return (
		<>
			<div className="pt-[136px] pb-6">
				<div className="bg-white border rounded-md shadow-md">
					<GenericForm
						handleSubmit={handleSubmit}
						username={username}
						form={form}
						initialFormData={initialFormData}
						isModalForm={isModalForm}
					/>
				</div>
			</div>
		</>
	);
}
