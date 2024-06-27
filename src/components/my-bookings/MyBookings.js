import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	fetchGetSignedInUser,
	fetchUserBookings,
} from "../../api/DataService.js";
import { Button, Descriptions, Modal, Result, Table } from "antd";
import moment from "moment";
import EditEachBooking from "./EditEachBooking.js";
import EachBooking from "../home/EachBooking.js";

export default function MyBooking({ username, setUsername }) {
	const navigate = useNavigate();
	const [userBookings, setUserBookings] = useState([]);
	// const [selectedBooking, setSelectedBooking] = useState(null);
	const [selectedBookingIndex, setSelectedBookingIndex] = useState(null); // Track the index of the selected booking
	const [mainModalVisible, setMainModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);

	const onSubModal = (index, action) => {
		if (action === "edit") {
			setEditModalVisible(true);
		} else if (action === "view") {
			setViewModalVisible(true);
		}
		setMainModalVisible(false);
		setSelectedBookingIndex(index);
	};

	const onCancel = () => {
		setEditModalVisible(false);
		setViewModalVisible(false);
		// setMainModalVisible(true);
		setSelectedBookingIndex(null);
	};

	useEffect(() => {
		const token = localStorage.getItem("accessToken");

		if (token) {
			const decoded = jwtDecode(token);
			setUsername(decoded.username);
			fetchGetSignedInUser()
				.then((response) => {
					const user = response.data.user;
					setUsername(user);
					// console.log("response user: ", user);
					fetchUserBookings(user)
						.then((bookingResponse) => {
							const bookings = bookingResponse;
							setUserBookings(bookings);
							console.log("Booking response: ", bookings);
						})
						.catch((bookingError) => {
							console.log(
								"Error fetching user bookings: ",
								bookingError
							);
						});
				})
				.catch((error) => {
					console.log("Error fetching signed-in user: ", error);
				});
		}
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const value = params.get("submit");

		if (value === "success") {
			navigate("/users/bookings");
			setSuccessAlert(false);
			window.location.reload();
		}
	}, [navigate]);

	useEffect(() => {
		console.log("Edit state: ", editModalVisible);
		console.log("View state: ", viewModalVisible);
	});

	return (
		<>
			<div className="flex flex-col items-center p-10">
				<div className="overflow-x-auto">
					{" "}
					{/* Apply overflow-x-auto for horizontal scrolling if needed */}
					<Table
						className="px-4 my-4 border rounded-md"
						dataSource={userBookings}
						pagination={false}
						rowKey="booking_id" // Assuming 'booking_id' is a unique key
					>
						<Table.Column
							title={
								<p className="text-base text-center">Topic</p>
							}
							dataIndex="topic"
							key="topic"
							width="20%"
						/>
						<Table.Column
							title={
								<p className="text-base text-center">
									Booking Date
								</p>
							}
							dataIndex="booking_date"
							key="booking_date"
							width="20%"
							render={(text, record) =>
								moment(text).format("DD-MM-YYYY")
							}
						/>
						<Table.Column
							title={
								<p className="text-base text-center">
									Booking Start Time
								</p>
							}
							dataIndex="booking_start_time"
							key="booking_start_time"
							width="15%"
							render={(time, record) => {
								const startTime = new Date(time); // Convert the time to a Date object
								if (isNaN(startTime.getTime())) {
									// Check if the conversion resulted in a valid date
									return time; // Return the original value if it's not a valid date
								}
								return moment(startTime).format("HH:mm"); // Format the time using moment
							}}
						/>
						<Table.Column
							title={
								<p className="text-base text-center">
									Booking End Time
								</p>
							}
							dataIndex="booking_end_time"
							key="booking_end_time"
							width="15%"
							render={(time, record) => {
								const endTime = new Date(time); // Convert the time to a Date object
								if (isNaN(endTime.getTime())) {
									// Check if the conversion resulted in a valid date
									return time; // Return the original value if it's not a valid date
								}
								return moment(endTime).format("HH:mm"); // Format the time using moment
							}}
						/>
						<Table.Column
							title={
								<p className="text-base text-center">
									Room Name
								</p>
							}
							dataIndex="room_name"
							key="room_name"
							width="20%"
						/>
						<Table.Column
							title={
								<p className="text-base text-center">Action</p>
							}
							key="action"
							align="right"
							render={(text, record, index) => (
								<div className="flex flex-row">
									<Button
										className="border mr-4"
										type="primary"
										onClick={() =>
											onSubModal(index, "edit")
										}>
										Edit
									</Button>
									<Button
										className="border"
										type="primary"
										onClick={() =>
											onSubModal(index, "view")
										}>
										View
									</Button>
								</div>
							)}
						/>
					</Table>
					{selectedBookingIndex !== null && editModalVisible && (
						<Modal
							open={true}
							onCancel={onCancel}
							footer={null}
							key={userBookings[selectedBookingIndex].booking_id}>
							{successAlert ? (
								<Result
									title="Successfully inserted"
									status="success"
									closable
								/>
							) : (
								<EditEachBooking
									booking={userBookings[selectedBookingIndex]}
									bookingId={
										userBookings[selectedBookingIndex]
											.booking_id
									}
									successAlert={successAlert}
									setSuccessAlert={setSuccessAlert}
								/>
							)}
						</Modal>
					)}
					{selectedBookingIndex !== null && viewModalVisible && (
						<Modal
							open={true}
							onCancel={onCancel}
							footer={null}
							key={userBookings[selectedBookingIndex].booking_id}>
							<EachBooking
								key={
									userBookings[selectedBookingIndex]
										.booking_id
								}
								selectedBooking={
									userBookings[selectedBookingIndex]
								}
								showBackButton={false}
							/>
						</Modal>
					)}
				</div>
			</div>
		</>
	);
}
