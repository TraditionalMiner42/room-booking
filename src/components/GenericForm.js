import axiosInstance from "../axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, TimePicker, DatePicker } from "antd";
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
}) {
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		console.log("userrrr: ", username);
		console.log("booking date: ", selectedDate);

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

	// const disabledMinutes = (selectedHour) => {
	// 	// Disable all minutes if the selected hour is the minimum hour
	// 	if (selectedHour === 8) {
	// 		return Array.from({ length: 60 }, (v, k) => k);
	// 	}
	// 	return [];
	// };

	return (
		<>
			<div className="flex justify-center items-center h-full w-full">
				<Form
					className={`p-6 ${!isModalForm ? "border-2" : ""}`}
					onFinish={handleSubmit}
					form={form}
					initialValues={initialFormData}
				>
					{/* <Form.Item>
						<DatePicker value={moment("2024-01-01")}></DatePicker>
					</Form.Item> */}
					<Form.Item
						label="Meeting Topic"
						labelAlign="right"
						name="meetingTopic"
						rules={[
							{
								required: true,
								message: "Please input your meeting topic!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
						<Input placeholder="topic" type="text" required />
					</Form.Item>
					<Form.Item
						label="Name"
						labelAlign="right"
						name="name"
						rules={[
							{
								required: true,
								message: "Please input your name!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
						<Input
							placeholder="name"
							defaultValue={username}
							type="text"
							required
							disabled
						/>
					</Form.Item>
					<Form.Item
						label="Booking Date"
						labelAlign="right"
						name="dateStart"
						rules={[
							{
								required: true,
								message: "Please select booking date!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
						{isModalForm ? (
							<Input value={selectedDate} disabled />
						) : (
							<Input format="YYYY-MM-DD" type="date" required />
						)}
					</Form.Item>
					<Form.Item
						label="Booking Time"
						labelAlign="right"
						rules={[
							{
								required: true,
								message: "Please select booking time range!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
						<Input.Group compact>
							<Form.Item name="timeStart">
								<TimePicker
									name="timeStart"
									placeholder="Start time"
									disabledHours={disabledHours}
									minuteStep={15}
									// defaultValue={moment("08:30", "HH:mm")}
									format="HH:mm"
									required
								/>
							</Form.Item>
							<Form.Item name="timeEnd">
								<TimePicker
									name="timeEnd"
									placeholder="End time"
									format="HH:mm"
									required
								/>
							</Form.Item>
						</Input.Group>
					</Form.Item>
					<Form.Item
						label="Select Room"
						name="room"
						rules={[
							{
								message: "Please select a room!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
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
							<Select
								required
								name="room"
								placeholder="Choose room"
								defaultValue={defaultRoomName}
							>
								{rooms.map((room) => (
									<Select.Option key={room.room_id}>
										{room.room_name}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
					<Form.Item
						label="Participants"
						name="participants"
						rules={[
							{
								required: true,
								message: "Please input participants!",
							},
						]}
						labelCol={{
							span: 10,
						}}
						wrapperCol={{
							span: 10,
						}}
					>
						<Input placeholder="Attend" type="text" required />
					</Form.Item>
					<Form.Item className="ant-btn flex flex-col justify-between">
						<Button
							className="mx-4"
							type="primary"
							htmlType="submit"
						>
							Submit
						</Button>
						<Button
							className="mx-4"
							type="primary"
							onClick={toPreviousMainModal}
						>
							Back
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
}
