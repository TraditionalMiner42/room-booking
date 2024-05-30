import { useEffect, useState } from "react";
import users from "../../users/users.js";
import axiosInstance from "../../axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function BookingForm() {
	// const { foundUser } = useContext(UserContext);

	const navigate = useNavigate();

	const initialFormData = {
		meetingTopic: "",
		name: "",
		dateStart: "",
		timeStart: "",
		timeEnd: "",
		room: "",
		participants: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [rooms, setRooms] = useState([]);
	const [username, setUsername] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			const decoded = jwtDecode(token);
			setUsername(decoded.username);
			console.log("user: ", username);

			const storedData = localStorage.getItem("meetingData");
			if (storedData) {
				setFormData(JSON.parse(storedData));
				console.log("Booked room: ", formData.room);
			}
		}

		const fetchRooms = async () => {
			try {
				const response = await axiosInstance.get("/users/get_rooms");
				console.log("Rooms response:", response.data.rooms); // Check response data
				setRooms(response.data.rooms);
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		};

		fetchRooms();
		console.log("Meeting rooms: ", rooms);
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		try {
			axiosInstance
				.post("/users/rooms", {
					formData,
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
						setFormData(initialFormData);
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

		console.log("Updated form data: ", formData);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<>
			<div className="flex justify-center items-center h-full">
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
			</div>
		</>
	);
}
