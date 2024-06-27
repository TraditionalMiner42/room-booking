import { Button, Descriptions } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getParticipantsAndBeverage } from "../../api/DataService.js";
import { createPortal } from "react-dom";

export default function EachBooking({
	index,
	detailModalVisible,
	setDetailModalVisible,
	setCurrentBookingIndex,
	key,
	selectedBooking,
	roomId,
	roomName,
	username,
	toPreviousMainModal,
	showBackButton = true,
}) {
	const [bookings, setBookings] = useState(null);
	const bookingDate = moment(selectedBooking.booking_date).format(
		"DD-MM-YYYY"
	);
	const bookingStartTime = moment(
		selectedBooking.booking_start_time,
		"HH:mm"
	).format("HH:mm");
	const bookingEndTime = moment(
		selectedBooking.booking_end_time,
		"HH:mm"
	).format("HH:mm");

	useEffect(() => {
		console.log(selectedBooking);

		try {
			getParticipantsAndBeverage().then((response) => {
				setBookings(response.data.bookings);
			});
		} catch (error) {
			console.log("Error fetching participants and beverages.");
		}
	}, []);

	let filteredBookings = [];

	if (bookings && selectedBooking) {
		filteredBookings = bookings.filter((booking) => {
			return booking.booking_id === selectedBooking.booking_id;
		});
		console.log(filteredBookings);
		console.log(selectedBooking);
	} else {
		console.log("Bookings or selectedBooking is not available yet.");
	}

	// useEffect(() => console.log(bookings));

	return (
		<>
			<div className="font-semibold text-xl pb-5">
				{selectedBooking.topic}
			</div>
			<Descriptions key={key} column={2}>
				<Descriptions.Item label="Booking Date">
					{bookingDate}
				</Descriptions.Item>

				<Descriptions.Item label="Time">
					<div>
						{bookingStartTime} - {bookingEndTime}
					</div>
				</Descriptions.Item>
				<Descriptions.Item label="Room Name">
					{selectedBooking.room_name}
				</Descriptions.Item>
				<br />
				{filteredBookings.map((booking, index) => (
					<React.Fragment key={index}>
						<Descriptions.Item label="Participant">
							{booking.participant_name}
						</Descriptions.Item>
						<Descriptions.Item label="Drink">
							{booking.beverage}
						</Descriptions.Item>
					</React.Fragment>
				))}
			</Descriptions>
			<div className="ant-btn flex flex-row justify-center">
				{showBackButton && (
					<Button
						className="mx-4"
						type="primary"
						onClick={toPreviousMainModal}>
						Back
					</Button>
				)}
			</div>
		</>
	);
}
