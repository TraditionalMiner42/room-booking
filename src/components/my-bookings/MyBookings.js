import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	fetchGetSignedInUser,
	fetchUserBookings,
} from "../../api/DataService.js";
import { Modal, Result, Spin, Table, message } from "antd";
import moment from "moment";
import EditEachBooking from "./EditEachBookingName.js";
import EachBooking from "../home/EachBooking.js";
import { createPortal } from "react-dom";
import {
	EditOutlined,
	EyeOutlined,
	DeleteOutlined,
	CopyOutlined,
	ExportOutlined,
} from "@ant-design/icons";
import DeleteBooking from "./DeleteBooking.js";
import EditEachBookingName from "./EditEachBookingName.js";

export default function MyBooking({ username, setUsername }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [userBookings, setUserBookings] = useState([]);
	// const [selectedBooking, setSelectedBooking] = useState(null);
	const [selectedBookingIndex, setSelectedBookingIndex] = useState(null); // Track the index of the selected booking
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [submissionSuccess, setSubmissionSuccess] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubModal = (index, action) => {
		if (action === "edit") {
			setEditModalVisible(true);
		} else if (action === "view") {
			setViewModalVisible(true);
		} else if (action === "delete") {
			setDeleteModalVisible(true);
		}
		setSelectedBookingIndex(index);
	};

	const fetchUserBookingData = async () => {
		const token = localStorage.getItem("accessToken");

		if (token && (!submissionSuccess || submissionSuccess)) {
			try {
				const decoded = jwtDecode(token);
				setUsername(decoded.username);
				setLoading(true);

				const userResponse = await fetchGetSignedInUser();
				const user = userResponse.user;
				setUsername(user);

				const bookings = await fetchUserBookings(user);
				setUserBookings(bookings);
			} catch (error) {
				console.log("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const copyUrlToClipboard = (value) => {
		const currentUrl = window.location.href; // Get the current URL
		const bookingUrl = `${currentUrl}/${value}/meal-menu`; // Append booking path

		if (navigator.clipboard) {
			// Modern method
			navigator.clipboard
				.writeText(bookingUrl)
				.then(() => {
					message.success("URL copied to clipboard!");
				})
				.catch((err) => {
					message.error("Failed to copy URL!");
					console.error("Error copying URL:", err);
				});
		} else {
			// Fallback method
			const textarea = document.createElement("textarea");
			textarea.value = bookingUrl;
			document.body.appendChild(textarea);
			textarea.select();
			try {
				document.execCommand("copy");
				message.success("URL copied to clipboard!");
			} catch (err) {
				message.error("Failed to copy URL!");
				console.error("Error copying URL:", err);
			} finally {
				document.body.removeChild(textarea);
			}
		}
	};

	useEffect(() => {
		fetchUserBookingData();

		const params = new URLSearchParams(location.search);
		const value = params.get("submit");

		if (value === "success") {
			navigate("/users/bookings", { replace: true });
			setSuccessAlert(false);
		}
	}, [location, navigate, deleteModalVisible, submissionSuccess]);

	return (
		<>
			<div className="min-w-full container p-8 pt-20">
				<div className="overflow-x-auto border rounded-md  bg-white shadow-md">
					{" "}
					{/* Apply overflow-x-auto for horizontal scrolling if needed */}
					<Spin spinning={loading}>
						<Table
							dataSource={userBookings}
							pagination={false}
							rowKey="booking_id" // Assuming 'booking_id' is a unique key
						>
							<Table.Column
								title={
									<p className="text-base text-center">
										Topic
									</p>
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
								width="15%"
								align="center"
								render={(text, record) =>
									moment(text).format("DD-MM-YYYY")
								}
							/>
							<Table.Column
								title={
									<p className="text-base text-center">
										Start Time
									</p>
								}
								dataIndex="booking_start_time"
								key="booking_start_time"
								width="12%"
								align="center"
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
										End Time
									</p>
								}
								dataIndex="booking_end_time"
								key="booking_end_time"
								width="12%"
								align="center"
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
								align="center"
							/>
							<Table.Column
								title={
									<p className="text-base text-center">
										Action
									</p>
								}
								key="action"
								align="right"
								render={(text, record, index) => (
									<div className="flex flex-row justify-center">
										<EditOutlined
											className="antd-icon mr-4"
											onClick={() =>
												onSubModal(index, "edit")
											}></EditOutlined>
										<EyeOutlined
											className="antd-icon mr-4"
											onClick={() =>
												onSubModal(index, "view")
											}></EyeOutlined>
										<DeleteOutlined
											className="antd-icon"
											onClick={() =>
												onSubModal(index, "delete")
											}></DeleteOutlined>
									</div>
								)}
							/>
							<Table.Column
								title={
									<p className="text-base text-center">
										Add Break-meal
									</p>
								}
								key="booking_id"
								dataIndex="booking_id"
								render={(value, record, index) => (
									<div className="flex flex-row justify-center">
										<div className="mr-2">Copy</div>
										<CopyOutlined
											className="mr-4"
											onClick={() =>
												copyUrlToClipboard(value)
											}></CopyOutlined>
										<Link
											to={`/users/bookings/${value}/meal-menu`}
											target="_blank"
											rel="noreferrer">
											<ExportOutlined></ExportOutlined>
										</Link>
									</div>
								)}
							/>
						</Table>
					</Spin>
					<div id="edit-detail-modal"></div>
					{selectedBookingIndex !== null &&
						editModalVisible &&
						createPortal(
							<Modal
								open={editModalVisible}
								onCancel={() => {
									setEditModalVisible(false);
									setSelectedBookingIndex(null);
								}}
								footer={null}
								key={
									userBookings[selectedBookingIndex]
										.booking_id
								}>
								<EditEachBookingName
									booking={userBookings[selectedBookingIndex]}
									bookingId={
										userBookings[selectedBookingIndex]
											.booking_id
									}
									setEditModalVisible={setEditModalVisible}
									onSubmissionSuccess={() =>
										setSubmissionSuccess(true)
									}
								/>
							</Modal>,
							document.getElementById("edit-detail-modal")
						)}
					<div id="view-detail-modal"></div>
					{selectedBookingIndex !== null &&
						viewModalVisible &&
						createPortal(
							<Modal
								open={viewModalVisible}
								onCancel={() => {
									setViewModalVisible(false);
									setSelectedBookingIndex(null);
								}}
								footer={null}
								key={
									userBookings[selectedBookingIndex]
										.booking_id
								}>
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
							</Modal>,
							document.getElementById("view-detail-modal")
						)}
					<div id="delete-modal"></div>
					{selectedBookingIndex !== null &&
						deleteModalVisible &&
						createPortal(
							<DeleteBooking
								deleteModalVisible={deleteModalVisible}
								setDeleteModalVisible={setDeleteModalVisible}
								setSelectedBookingIndex={
									setSelectedBookingIndex
								}
								bookingId={
									userBookings[selectedBookingIndex]
										.booking_id
								}
								onSubmissionSuccess={() =>
									setSubmissionSuccess(true)
								}
							/>,
							document.getElementById("delete-modal")
						)}
				</div>
			</div>
		</>
	);
}
