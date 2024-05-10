import { useContext, useEffect, useState } from "react";
import users from "../../users/users.js";
import { UserContext } from "../UserContext.js";

export default function BookingForm({ room }) {
	const { foundUser } = useContext(UserContext);

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

	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();

		// Send data to server (optional)
		// ... code for sending data to server using fetch or an API library

		// Store data in localStorage

		localStorage.setItem("meetingData", JSON.stringify(formData));
		setIsSubmitted(true); // Update state for success message or redirection
		setFormData(initialFormData);

		// Update users array with the formData
		const updatedUsers = users.map((user) => {
			if (foundUser.email === user.email) {
				const updatedBookedUser = {
					...user,
					booking: [...(user.booking || []), formData],
				};
				// If the user's email matches the formData's email, add the formData to the user
				return updatedBookedUser;
			}
			return user;
		});

		console.log("Updated form data: ", updatedUsers);
	};

	useEffect(() => {
		const storedData = localStorage.getItem("meetingData");
		if (storedData) {
			setFormData(JSON.parse(storedData));
			console.log("Booked room: ", formData.room);
		}
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		// if (value !== "")
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
							value={formData.name}
							onChange={handleChange}
							required
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
							{room?.map((room) => (
								<option key={room.id} value={room.room}>
									{room.room}
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
