import { Form, Input, Select, Button } from "antd";
import GenericForm from "../GenericForm.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.js";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export default function HomeForm({
	roomId,
	roomName,
	selectedDate,
	isModalForm,
	username,
	toPreviousMainModal,
}) {
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

	const [rooms, setRooms] = useState([]);
	// const [username, setUsername] = useState("");
	const [form] = Form.useForm();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			console.log("decoded user: ", username);
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
		console.log("user: ", username);
		console.log(selectedDate);
		form.setFieldValue("name", username);
		form.setFieldValue("dateStart", selectedDate);
		form.setFieldValue("room", roomName);
	});

	const handleSubmit = (formData) => {
		const fromTimeValue = form.getFieldValue("timeStart");
		const toTimeValue = form.getFieldValue("timeEnd");

		const fromTime = fromTimeValue ? fromTimeValue.format("HH:mm") : null;
		const toTime = toTimeValue ? toTimeValue.format("HH:mm") : null;

		// const formValues = formData.getFieldValue();

		console.log("form data: ", formData);

		console.log(moment(selectedDate).format("YYYY-MM-DD"));

		const modifiedFormValues = {
			...formData,
			timeStart: fromTime,
			timeEnd: toTime,
		};

		// console.log("fromTime: ", fromTime);
		console.log("form: ", modifiedFormValues);
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
	};

	return (
		<>
			<GenericForm
				handleSubmit={handleSubmit}
				username={username}
				form={form}
				initialFormData={initialFormData}
				defaultRoomId={roomId}
				defaultRoomName={roomName}
				selectedDate={selectedDate}
				isModalForm={isModalForm}
				toPreviousMainModal={toPreviousMainModal}
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
