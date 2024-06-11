import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance.js";
import moment from "moment";
import { Badge, Calendar, Modal, Col, Row, Button } from "antd";
import HomeForm from "./HomeForm.js";
import UpcomingBooking from "./UpcomingBooking.js";
import { jwtDecode } from "jwt-decode";

function LandingPage({ isModalForm }) {
	const [rooms, setRooms] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedRoomId, setSelectedRoomId] = useState(null);
	const [selectedRoomName, setSelectedRoomName] = useState(null);
	const [mainModalVisible, setMainModalVisible] = useState(false);
	const [subModalVisible, setSubModalVisible] = useState(false);
	const navigate = useNavigate();

	// const isModalFormState = isModalForm();

	console.log("isModalForm: ", isModalForm);

	const [username, setUsername] = useState("");

	useEffect(() => {
		console.log("sub modal visible: ", subModalVisible);
		const token = localStorage.getItem("accessToken");
		console.log(token);
		if (token) {
			const decoded = jwtDecode(token);
			setUsername(decoded.username);
			const fetchRooms = async () => {
				try {
					console.log("acc token: ", token);
					const response = await axiosInstance.get(
						"/users/get_rooms"
					);
					console.log("Rooms response:", response.data.rooms); // Check response data
					setRooms(response.data.rooms);
					console.log(rooms);
				} catch (error) {
					console.error("Error fetching rooms:", error);
				}
			};

			const fetchBookings = async () => {
				try {
					const bookingResponse = await axiosInstance.get(
						"/users/get_bookings"
					);
					console.log(bookingResponse.data.bookings);
					setBookings(bookingResponse.data.bookings);
				} catch (error) {
					console.error("Error fetching bookings:", error);
				}
			};

			fetchRooms();
			fetchBookings();
		} else {
			console.log("No token found.");
		}
	}, []);

	// useEffect(() => console.log(filteredBookings));

	const handleDateSelect = (date) => {
		const formatDate = date.format("YYYY-MM-DD");
		console.log("formatted date: ", formatDate);
		setSelectedDate(formatDate);

		setMainModalVisible(true);
	};

	const handleModalCancel = () => {
		setMainModalVisible(false);
	};

	const onSubModal = (
		e,
		roomId,
		roomName,
		stateSub = true,
		stateMain = false
	) => {
		setSelectedRoomId(roomId);
		setSelectedRoomName(roomName);
		setMainModalVisible(stateMain);
		setSubModalVisible(stateSub);
	};

	const toPreviousMainModal = () => {
		setMainModalVisible(!mainModalVisible);
		setSubModalVisible(!subModalVisible);
	};

	const CustomHeader = ({ value, type, onChange, onTypeChange }) => {
		const handlePrevYear = () => {
			onChange(value.clone().subtract(1, "month"));
		};

		const handleNextYear = () => {
			onChange(value.clone().add(1, "month"));
		};

		return (
			<div className="flex justify-between items-center border border-gray-300 rounded px-4 py-2">
				<span className="cursor-pointer" onClick={handlePrevYear}>
					Prev Month
				</span>
				<span className="mx-4">{value.format("MMMM")}</span>
				<span className="cursor-pointer" onClick={handleNextYear}>
					Next Month
				</span>
			</div>
		);
	};

	const momentSelectedDate = moment(selectedDate);

	const filteredBookings = momentSelectedDate
		? bookings.filter((booking) => {
				const momentBookingDate = moment(booking.booking_date);
				return momentBookingDate.isSame(momentSelectedDate, "day");
		  })
		: [];

	console.log(filteredBookings);

	const getListData = (value) => {
		let listData = [];
		const formattedDate = value.format("YYYY-MM-DD");

		bookings.forEach((booking) => {
			const bookingDate = moment(booking.booking_date).format(
				"YYYY-MM-DD"
			);
			if (bookingDate === formattedDate) {
				let badgeColor;
				if (booking.selected_room === 1) {
					badgeColor = "#52c41a"; // Green
				} else if (booking.selected_room === 2) {
					badgeColor = "#faad14"; // Orange
				} else if (booking.selected_room === 3) {
					badgeColor = "#f5222d"; // Red
				} else {
					badgeColor = "#d9d9d9"; // Grey
				}
				listData.push({
					color: badgeColor,
					type: "warning",
					room: booking.room_name,
					content: (
						<>
							{booking.room_name}
							<div>
								{moment(
									booking.booking_start_time,
									"HH:mm"
								).format("HH:mm")}{" "}
								-{" "}
								{moment(
									booking.booking_end_time,
									"HH:mm"
								).format("HH:mm")}{" "}
							</div>
						</>
					),
				});
			}
		});

		return listData;
	};

	const dateCellRender = (value) => {
		const listData = getListData(value);
		return (
			<ul className="events">
				{listData.map((item, index) => (
					<li key={index}>
						<Badge
							status={item.type}
							text={item.content}
							color={item.color}
						/>
					</li>
				))}
			</ul>
		);
	};

	return (
		<>
			<UpcomingBooking selectedDate={selectedDate} bookings={bookings} />
			<div className="px-10">
				<Calendar
					headerRender={({ value, type, onChange, onTypeChange }) => (
						<CustomHeader
							value={value}
							type={type}
							onChange={onChange}
							onTypeChange={onTypeChange}
						/>
					)}
					cellRender={dateCellRender}
					onSelect={(date, { source }) => {
						if (source === "date") {
							console.log("Date: ", date);
							handleDateSelect(date);
						}
					}}
				></Calendar>
			</div>
			(
			<>
				<Modal
					open={mainModalVisible}
					onCancel={handleModalCancel}
					footer={null}
				>
					<div className="font-semibold text-2xl">
						Booking Details
					</div>
					<Row gutter={[32, 32]}>
						{
							<>
								<Col span={24} className="flex flex-col">
									<div className="pt-5 text-lg">
										Booked Rooms
									</div>
									{filteredBookings
										.sort((a, b) =>
											moment(
												a.booking_start_time,
												"HH:mm"
											).diff(
												moment(
													b.booking_start_time,
													"HH:mm"
												)
											)
										)
										.map((booking, index) => (
											<div
												className="flex flex-row justify-between mt-3 mb-3 p-3 border rounded-md border-red-500 cursor-pointer"
												key={index}
											>
												<div>
													<div>
														<strong>
															{booking.room_name}
														</strong>
													</div>
													<div>
														{moment(
															booking.booking_start_time,
															"HH:mm"
														).format("HH:mm")}{" "}
														-{" "}
														{moment(
															booking.booking_end_time,
															"HH:mm"
														).format("HH:mm")}
													</div>
												</div>
											</div>
										))}
									<div className="pt-5 text-lg">
										Available Rooms
									</div>
									{rooms
										.filter(
											(room) =>
												!filteredBookings.some(
													(booking) =>
														booking.room_name ===
														room.room_name
												)
										)
										.map((room, index) => (
											<div
												className="flex flex-row justify-between mt-3 mb-3 p-3 border rounded-md border-blue-500 cursor-pointer"
												key={index}
											>
												<div>
													<div>
														<strong>
															{room.room_name}
														</strong>
													</div>
												</div>
												<Button
													type="primary"
													className="self-center"
													onClick={(e) =>
														onSubModal(
															e,
															room.room_id,
															room.room_name,
															selectedDate
														)
													}
													value={room.room_name}
												>
													Book now
												</Button>
											</div>
										))}
								</Col>
							</>
						}
					</Row>
				</Modal>
				<Modal
					open={subModalVisible}
					onCancel={(e) => setSubModalVisible(false)}
					footer={null}
				>
					<HomeForm
						roomId={selectedRoomId}
						roomName={selectedRoomName}
						selectedDate={selectedDate}
						isModalForm={isModalForm}
						username={username}
						toPreviousMainModal={toPreviousMainModal}
					/>
				</Modal>
			</>
			)}
		</>
	);
}

export default LandingPage;
