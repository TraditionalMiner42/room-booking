import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GenericForm from "../GenericForm.js";
import { Form } from "antd";

export default function BookingForm({ isModalForm }) {
	// const { foundUser } = useContext(UserContext);

	const navigate = useNavigate();

	const initialFormData = {
		meetingTopic: "",
		name: "",
		dateStart: "",
		timeStart: null,
		timeEnd: null,
		room: "",
		participants: "",
	};

	// const [formData, setFormData] = useState(initialFormData);
	const [rooms, setRooms] = useState([]);
	const [username, setUsername] = useState("");

	const [isSubmitted, setIsSubmitted] = useState(false);
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

	const handleSubmit = (values) => {
		const fromTimeValue = form.getFieldValue("timeStart");
		const toTimeValue = form.getFieldValue("timeEnd");

		const fromTime = fromTimeValue ? fromTimeValue.format("HH:mm") : null;
		const toTime = toTimeValue ? toTimeValue.format("HH:mm") : null;

		const formValues = form.getFieldValue();

		const modifiedFormValues = {
			...formValues,
			timeStart: fromTime,
			timeEnd: toTime,
		};

		// console.log("fromTime: ", fromTime);
		// console.log("form: ", modifiedFormValues.room);
		try {
			axiosInstance
				.post("/users/rooms", {
					modifiedFormValues,
				})
				.then((response) => {
					console.log(response.data);
					const { success, userId, formData } = response.data;
					if (success) {
						localStorage.setItem(
							"meetingData",
							JSON.stringify(formData)
						);
						setIsSubmitted(true); // Update state for success message or redirection
						// setFormData(initialFormData);
						form.resetFields();
					}
				})
				.catch((error) => {
					if (error.response.status === 403) {
						localStorage.removeItem("accessToken");
						navigate("/users/signin");
					} else if (error.response.status === 409) {
						alert(error.response.data.message);
					} else {
						console.log(error);
					}
				});
		} catch (error) {
			console.log(error);
		}

		console.log("Updated form data: ", formValues);
	};

	const handleChange = (event) => {
		console.log(event.target);
		const { name, value } = event.target;
		// setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	// console.log("name: ", username);

	return (
		<>
			<GenericForm
				handleSubmit={handleSubmit}
				username={username}
				form={form}
				initialFormData={initialFormData}
				isModalForm={isModalForm}
			/>
			{/* <div className="flex justify-center items-center h-full">
				<form
					className="w-1/2 py-2 px-2 flex flex-col items-start border-2"
					onSubmit={handleSubmit}
				>
					<div className="form-item">
						<label>Meeting Topic</label>
						<input
							className="input-item"
							placeholder="topic"
							type="text"
							name="meetingTopic"
							value={formData.meetingTopic}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-item">
						<label>Name</label>
						<input
							className="input-item"
							placeholder="name"
							type="text"
							name="name"
							value={username}
							onChange={handleChange}
							required
							disabled
						/>
					</div>
					<div className="form-item">
						<label>Booking Date</label>
						<div className="flex flex-col lg:flex-row lg:items-center">
							<input
								className="input-item"
								placeholder="Start date"
								type="date"
								name="dateStart"
								value={formData.dateStart}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="form-item">
						<label>Booking Time</label>
						<div className="flex flex-col lg:flex-row lg:items-center">
							<input
								className="input-item"
								placeholder="Start time"
								type="time"
								name="timeStart"
								value={formData.timeStart}
								onChange={handleChange}
								min="09:00"
								max="18:00"
								required
							/>
							<span className="flex items-center mx-2">to</span>
							<input
								className="input-item"
								placeholder="End time"
								type="time"
								name="timeEnd"
								value={formData.timeEnd}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="form-item">
						<label>Select Room</label>
						<select
							className="input-item"
							onChange={handleChange}
							value={formData.room}
							name="room"
							selected
							required
						>
							<option value="" disabled hidden>
								Choose room
							</option>
							{rooms?.map((room) => (
								<option
									key={room.room_id}
									value={room.room_name}
								>
									{room.room_name}
								</option>
							))}
						</select>
					</div>
					<div className="form-item">
						<label>Participants</label>
						<input
							className="input-item"
							placeholder="Attend"
							type="text"
							name="participants"
							value={formData.participants}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-item">
						<button className="px-4 py-2 border-2 rounded-md">
							Submit
						</button>
					</div>
				</form>
			</div> */}
		</>
	);
}
