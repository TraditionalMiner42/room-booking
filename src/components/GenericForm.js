import axiosInstance from "../axiosInstance.js";
import { Form, Input, Select, Button, TimePicker, Alert } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";

export default function GenericForm({
	handleSubmit,
	username,
	form,
	initialFormData,
	defaultRoomId,
	defaultRoomName,
	selectedDate,
	isModalForm,
	toPreviousMainModal,
	alertMessage,
	setAlertMessage,
}) {
	const [rooms, setRooms] = useState([]);

	console.log("userrrr: ", username);
	console.log("booking date: ", selectedDate);
	console.log("rooms : ", rooms);

	useEffect(() => {
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
	}, []);

	const disabledHours = () => {
		// Set the minimum hour
		return Array.from({ length: 24 }, (v, k) => k)
			.slice(0, 8)
			.concat(Array.from({ length: 24 }, (v, k) => k).slice(17)); // Disable hours before 9 AM and after 4 PM
	};

	const layout = {
		labelCol: {
			sm: { span: 10 },
			md: { span: 12 },
			lg: { span: 12 },
		},
		wrapperCol: {
			sm: { span: 10 },
			md: { span: 12 },
			lg: { span: 12 },
		},
	};

	return (
		<>
			<Form
				className={`p-6`}
				onFinish={handleSubmit}
				form={form}
				initialValues={initialFormData}
				{...layout}>
				<Form.Item
					label={<p className="text-base">Meeting Topic</p>}
					name="meetingTopic"
					rules={[
						{
							required: true,
							message: "Please input your meeting topic!",
						},
					]}>
					<Input placeholder="topic" type="text" required />
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Name</p>}
					name="name"
					rules={[
						{
							required: true,
							message: "Please input your name!",
						},
					]}>
					<Input
						placeholder="name"
						defaultValue={username}
						type="text"
						required
						disabled
					/>
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Booking Date</p>}
					name="dateStart"
					rules={[
						{
							required: true,
							message: "Please select booking date!",
						},
					]}>
					{isModalForm ? (
						<Input value={selectedDate} disabled />
					) : (
						<Input format="DD-MM-YYYY" type="date" required />
					)}
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Booking Time</p>}
					rules={[
						{
							required: true,
							message: "Please select booking time range!",
						},
					]}>
					<Input.Group compact>
						<Form.Item
							className="mb-0 booking-time-pb:mb-6"
							name="timeStart">
							<TimePicker
								defaultValue={moment("08:00", "HH:mm")}
								placeholder="Start time"
								disabledHours={disabledHours}
								minuteStep={15}
								format="HH:mm"
								required
							/>
						</Form.Item>
						<Form.Item className="mb-0" name="timeEnd">
							<TimePicker
								defaultValue={moment("08:00", "HH:mm")}
								placeholder="End time"
								disabledHours={disabledHours}
								minuteStep={15}
								format="HH:mm"
								required
							/>
						</Form.Item>
					</Input.Group>
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Select Room</p>}
					name="room"
					rules={[
						{
							message: "Please select a room!",
						},
					]}>
					{isModalForm ? (
						<>
							<Input
								type="text"
								value={defaultRoomName}
								required
								disabled
							/>
						</>
					) : (
						<Select required placeholder="Choose room">
							{rooms.map((room) => (
								<Select.Option
									key={room.room_id}
									value={room.room_name}
									children={room.room_name}></Select.Option>
							))}
						</Select>
					)}
				</Form.Item>
				<Form.Item className="ant-btn flex flex-col justify-between">
					<Button className="mx-4" type="primary" htmlType="submit">
						Submit
					</Button>
					{isModalForm ? (
						<Button
							className="mx-4"
							type="primary"
							onClick={toPreviousMainModal}>
							Back
						</Button>
					) : (
						""
					)}
				</Form.Item>
				{alertMessage && (
					<Alert
						type="error"
						message={alertMessage}
						onClose={() => setAlertMessage(null)}
						closable
					/>
				)}
			</Form>
		</>
	);
}
