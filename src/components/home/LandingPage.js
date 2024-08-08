import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Badge, Calendar, Modal, Spin } from "antd";
import HomeForm from "./HomeForm.js";
import UpcomingBooking from "./UpcomingBooking.js";
import { jwtDecode } from "jwt-decode";
import {
	fetchGetBookings,
	fetchGetRooms,
	getCurrentSignInUser,
} from "../../api/DataService.js";
import EachBooking from "./EachBooking.js";
import OneDayBooking from "./OneDayBookings.js";
import BookingForm from "./BookingForm.js";
import { createPortal } from "react-dom";

function LandingPage({ isModalForm, username, setUsername }) {
	const [rooms, setRooms] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedRoomId, setSelectedRoomId] = useState(null);
	const [selectedRoomName, setSelectedRoomName] = useState(null);

	const [mainModalVisible, setMainModalVisible] = useState(false);
	const [subModalVisible, setSubModalVisible] = useState(false);
	const [detailModalVisible, setDetailModalVisible] = useState(false);

	const [currentBookingIndex, setCurrentBookingIndex] = useState(null);
	// const [isSubmitted, setIsSubmitted] = useState(false);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const location = useLocation(); // Get the current location object

	const [submissionSuccess, setSubmissionSuccess] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const value = params.get("submit");
		console.log("submit value: ", value);

		if (value === "success") {
			console.log("success: ", value);
			// Clear the URL parameter after processing
			navigate("/", { replace: true });
		}
	}, [location, navigate, subModalVisible]);

	const isTokenExpired = (token) => {
		try {
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000; // Current time in seconds
			return decoded.exp < currentTime;
		} catch (error) {
			console.error("Failed to decode token", error);
			return true; // Assume expired if decoding fails
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		console.log("token: ", token);
		if (token) {
			if (isTokenExpired(token)) {
				console.log("Token expired.");
				navigate("/users/signin", { replace: true });
				return;
			}
			const decoded = jwtDecode(token);
			setUsername(decoded.username);

			fetchGetRooms().then((data) => setRooms(data));
			fetchGetBookings().then((data) => {
				setBookings(data);
			});
		} else {
			console.log("No token found.");
		}
	}, []);

	// useEffect(() => {
	// 	const fetchUser = async () => {
	// 		try {
	// 			const response = await getCurrentSignInUser(username);
	// 			setFullName(response.data.users);
	// 		} catch (error) {
	// 			console.error("Error fetching user: ", error);
	// 		}
	// 	};

	// 	fetchUser();
	// }, [username]);

	useEffect(() => {
		if (submissionSuccess) {
			fetchGetBookings().then((data) => setBookings(data));
			setSubmissionSuccess(false); // Reset the submission success state
		}
		setLoading(false);
	}, [submissionSuccess]);

	const handleDateSelect = (date) => {
		const formatDate = date.format("YYYY-MM-DD");
		console.log("formatted date: ", formatDate);
		setSelectedDate(formatDate);
		setMainModalVisible(true);
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

	const onDetailModal = (e, roomId, roomName, selectedDate) => {
		setSelectedRoomId(roomId);
		setSelectedRoomName(roomName);
		setMainModalVisible(false);
		setDetailModalVisible(true);
		// Set other modal state as needed
	};

	const toPreviousMainModal = () => {
		setMainModalVisible(true);
		setSubModalVisible(false);
		setDetailModalVisible(false);
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

	const availableRoom = rooms.filter((room) => {
		const roomBookings = filteredBookings
			.filter((booking) => booking.room_name === room.room_name)
			.sort((a, b) =>
				a.booking_start_time.localeCompare(b.booking_start_time)
			);

		let lastEndTime = "08:00:00";

		for (const booking of roomBookings) {
			if (booking.booking_start_time > lastEndTime) {
				// Check if there is a gap
				if (
					lastEndTime < "16:00:00" &&
					booking.booking_start_time > "08:00:00"
				) {
					return true;
				}
			}
			lastEndTime =
				booking.booking_end_time > lastEndTime
					? booking.booking_end_time
					: lastEndTime;
		}

		// Check for availability after the last booking
		return lastEndTime < "16:00:00";
	});

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
			<div className="grid lg:flex lg:justify-between">
				<UpcomingBooking
					selectedDate={selectedDate}
					bookings={bookings}
				/>
				<BookingForm
					isModalForm={isModalForm}
					username={username}
					setUsername={setUsername}
					onSubmissionSuccess={() => setSubmissionSuccess(true)} // Pass the handler as a prop
				/>
			</div>
			<div className="px-10 pb-10">
				<Spin spinning={loading} tip="Loading" size="large">
					<Calendar
						className="shadow-md"
						headerRender={({
							value,
							type,
							onChange,
							onTypeChange,
						}) => (
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
						}}></Calendar>
				</Spin>
			</div>
			<div id="main-modal"></div>
			<OneDayBooking
				mainModalVisible={mainModalVisible}
				setMainModalVisible={setMainModalVisible}
				filteredBookings={filteredBookings}
				setSelectedBooking={setSelectedBooking}
				setCurrentBookingIndex={setCurrentBookingIndex}
				selectedDate={selectedDate}
				rooms={rooms}
				availableRoom={availableRoom}
				onDetailModal={onDetailModal}
				onSubModal={onSubModal}
			/>

			{/* {console.log("selected booking: ", selectedBooking)} */}
			<div id="detail-modal"></div>
			{filteredBookings.map(
				(booking, index) =>
					detailModalVisible &&
					currentBookingIndex === index &&
					createPortal(
						<Modal
							key={index} // Make sure to provide a unique key
							open={detailModalVisible}
							onCancel={(e) => {
								setDetailModalVisible(false);
								setCurrentBookingIndex(null);
							}}
							footer={null}>
							<EachBooking
								index={index}
								detailModalVisible={detailModalVisible}
								setDetailModalVisible={setDetailModalVisible}
								setCurrentBookingIndex={setCurrentBookingIndex}
								key={currentBookingIndex} // Ensure EachBooking components have unique keys
								selectedBooking={selectedBooking}
								roomId={selectedRoomId}
								roomName={selectedRoomName}
								username={username}
								toPreviousMainModal={toPreviousMainModal}
							/>
						</Modal>,
						document.getElementById("detail-modal")
					)
			)}

			<div id="form-modal"></div>
			{subModalVisible &&
				createPortal(
					<Modal
						open={subModalVisible}
						onCancel={(e) => setSubModalVisible(false)}
						footer={false}>
						<HomeForm
							roomId={selectedRoomId}
							roomName={selectedRoomName}
							selectedDate={selectedDate}
							isModalForm={!isModalForm}
							username={username}
							setUsername={setUsername}
							toPreviousMainModal={toPreviousMainModal}
							setSubModalVisible={setSubModalVisible}
							onSubmissionSuccess={() =>
								setSubmissionSuccess(true)
							}
						/>
					</Modal>,
					document.getElementById("form-modal")
				)}
		</>
	);
}

export default LandingPage;
