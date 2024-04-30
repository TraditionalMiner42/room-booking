import { useEffect, useState } from "react";

export default function BookingForm({ room }) {
	const [formData, setFormData] = useState({
		meetingTopic: "",
		name: "",
		dateFrom: "",
		dateTo: "",
		bookingTimeFrom: "",
		bookingTimeTo: "",
		room: "",
		participants: "",
	});

	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();

		// Additional processing or validation can be done here
		const {
			meetingTopic,
			name,
			dateFrom,
			dateTo,
			bookingTimeFrom,
			bookingTimeTo,
			room,
			participants,
		} = formData;

		// Send data to server (optional)
		// ... code for sending data to server using fetch or an API library

		// Store data in localStorage

		localStorage.setItem("meetingData", JSON.stringify(formData));

		setIsSubmitted(true); // Update state for success message or redirection
	};

	useEffect(() => {
		const storedData = localStorage.getItem("meetingData");
		if (storedData) {
			setFormData(JSON.parse(storedData));
			console.log(formData);
		}
	}, []);

	const handleChange = (event) => {
		// event.preventDefault();
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
						/>
					</div>
					<div className="form-item">
						<label>Booking Date</label>
						<div className="flex">
							<input
								className="input-item"
								placeholder="Start date"
								type="date"
								name="dateStart"
								value={formData.dateFrom}
								onChange={handleChange}
							/>
							to
							<input
								className="input-item"
								placeholder="End date"
								type="date"
								name="dateEnd"
								value={formData.dateTo}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="form-item">
						<label>Booking Time</label>
						<div className="flex">
							<input
								className="input-item"
								placeholder="Start time"
								type="time"
								name="timeStart"
								value={formData.dateFrom}
								onChange={handleChange}
							/>
							to
							<input
								className="input-item"
								placeholder="End time"
								type="time"
								name="timeEnd"
								value={formData.dateTo}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="form-item">
						<label>Select Room</label>
						<select className="input-item">
							<option value="" selected disabled hidden>
								Choose room
							</option>
							{room?.map((room) => (
								<option
									value={formData.room}
									onChange={handleChange}
								>
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
