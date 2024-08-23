import axiosInstance from "../axiosInstance.js";
import { Form, Input, Select, Button, TimePicker, Alert, Space } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { getShopMenu } from "../api/DataService.js";

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
	const [shops, setShops] = useState([]);
	const [selectedShop, setSelectedShop] = useState(null);
	const [menus, setMenus] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [roomsResponse, menuResponse] = await Promise.all([
					axiosInstance.get("/users/get_rooms"),
					getShopMenu(),
				]);

				const data = menuResponse.data.cafe_menu;

				console.log(data);

				// Check if data is an array
				if (Array.isArray(data)) {
					// Transform data to group by shop
					const groupedShops = data.reduce((acc, item) => {
						if (!acc[item.shop_id]) {
							acc[item.shop_id] = {
								shop_id: item.shop_id,
								shop_name: item.shop_name,
								menus: [],
							};
						}
						acc[item.shop_id].menus.push({
							menu_id: item.menu_id,
							menu_name: item.menu_name,
						});
						return acc;
					}, {});

					setShops(Object.values(groupedShops));
				} else {
					console.error("Data is not an array:", data);
				}

				// const response = await axiosInstance.get("/users/get_rooms");
				// console.log("Rooms response:", response.data.rooms); // Check response data
				setRooms(roomsResponse.data.rooms);
				// setMenus(menuResponse.data);
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		console.log(menus);
	}, [menus]);

	// useEffect(() => {
	// 	if (selectedShop) {
	// 		const shop = shops.find((shop) => shop.shop_id === selectedShop);
	// 		if (shop) {
	// 			setMenus(shop.menus);
	// 		} else {
	// 			setMenus([]);
	// 		}
	// 	}
	// }, [selectedShop, shops]);

	const handleShopChange = (value) => {
		setSelectedShop(value);
	};

	const disabledHours = () => {
		// Set the minimum hour
		return Array.from({ length: 24 }, (v, k) => k)
			.slice(0, 8)
			.concat(Array.from({ length: 24 }, (v, k) => k).slice(17)); // Disable hours before 9 AM and after 4 PM
	};

	const layout = {
		labelCol: {
			sm: { span: 10 },
			md: { span: 10 },
			lg: { span: 10 },
		},
		wrapperCol: {
			sm: { span: 10 },
			md: { span: 10 },
			lg: { span: 10 },
		},
	};

	return (
		<>
			<Form
				className={`px-6 pt-6`}
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
						value={username}
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
					<Space>
						<Form.Item className="mb-0" name="timeStart">
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
					</Space>
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Select Room</p>}
					name="room"
					rules={[
						{
							required: true,
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
						<Select placeholder="Choose room">
							{rooms.map((room) => (
								<Select.Option
									key={room.room_id}
									value={room.room_name}
									children={room.room_name}></Select.Option>
							))}
						</Select>
					)}
				</Form.Item>
				<Form.Item
					label={<p className="text-base">Select Shop</p>}
					name="shop"
					rules={[
						{
							required: true,
							message: "Please select a shop!",
						},
					]}>
					<Select
						placeholder="Select a shop"
						onChange={handleShopChange}
						style={{ width: 200 }}
						value={selectedShop}>
						{shops.map((shop) => (
							<Select.Option
								key={shop.shop_id}
								value={shop.shop_id}>
								{shop.shop_name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item className="ant-btn flex flex-col items-center">
					<Button className="mx-4" type="primary" htmlType="submit">
						Submit
					</Button>
					{isModalForm ? (
						<Button
							className="mx-4"
							type="default"
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
