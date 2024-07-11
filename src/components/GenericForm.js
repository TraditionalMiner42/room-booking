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

	// const disabledMinutes = (selectedHour) => {
	// 	// Disable all minutes if the selected hour is the minimum hour
	// 	if (selectedHour === 8) {
	// 		return Array.from({ length: 60 }, (v, k) => k);
	// 	}
	// 	return [];
	// };

	return (
		<>
			<Form
				className={`p-6`}
				onFinish={handleSubmit}
				form={form}
				initialValues={initialFormData}>
				<Form.Item
					label={<p className="text-base">Meeting Topic</p>}
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
					}}>
					<Input placeholder="topic" type="text" required />
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Name</p>}
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
					}}>
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
					}}>
					{isModalForm ? (
						<Input value={selectedDate} disabled />
					) : (
						<Input format="YYYY-MM-DD" type="date" required />
					)}
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Booking Time</p>}
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
					}}>
					<Input.Group compact>
						<Form.Item name="timeStart">
							<TimePicker
								name="timeStart"
								defaultValue={moment("08:00", "HH:mm")}
								placeholder="Start time"
								disabledHours={disabledHours}
								minuteStep={15}
								format="HH:mm"
								required
							/>
						</Form.Item>
						<Form.Item name="timeEnd">
							<TimePicker
								name="timeEnd"
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
					]}
					labelCol={{
						span: 10,
					}}
					wrapperCol={{
						span: 10,
					}}>
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
			</Form>
		</>
	);
}
