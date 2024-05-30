import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance.js";
import moment from "moment";
import { Badge, Calendar, Modal, Col, Row, Button } from "antd";
import BookingForm from "./room/BookingForm.js";

function LandingPage() {
	const [rooms, setRooms] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		console.log(token);
		if (token) {
			const fetchRooms = async () => {
				try {
					const response = await axiosInstance.get(
						"/users/get_rooms"
					);
					console.log("Rooms response:", response.data.rooms); // Check response data
					setRooms(response.data.rooms);
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

	const handleDateSelect = (date) => {
		const formatDate = date.format("YYYY-MM-DD");
		setSelectedDate(formatDate);
		setModalVisible(true);
		// console.log(selectedDate);
	};

	const handleModalCancel = () => {
		setModalVisible(false);
	};

	const checkBookedRoom = () => {};

	const filteredBookings = selectedDate
		? bookings.filter((booking) =>
				moment(booking.booking_date).isSame(selectedDate, "day")
		  )
		: [];

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
			<Calendar
				cellRender={dateCellRender}
				mode="month"
				onSelect={(date, { source }) => {
					if (source === "date") {
						console.log("Date: ", date);
						handleDateSelect(date);
					}
				}}
			></Calendar>
			{selectedDate && (
				<Modal
					title="Booking Details"
					open={modalVisible}
					onCancel={handleModalCancel}
					footer={null}
				>
					<Row gutter={[32, 32]}>
						{filteredBookings.length > 0 ? (
							<>
								<Col span={24} className="flex flex-col">
									{filteredBookings.map((booking, index) => (
										<div className="mb-3" key={index}>
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
									))}
									<Button
										className="self-center"
										onClick={() => navigate("/users/rooms")}
									>
										Book a room
									</Button>
								</Col>
							</>
						) : (
							<Col span={24}>
								<p>No bookings for this date.</p>
							</Col>
						)}
					</Row>
				</Modal>
			)}
		</>
	);
}

export default LandingPage;
