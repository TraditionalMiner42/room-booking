import { Button, Descriptions } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getParticipantsAndBeverage } from "../../api/DataService.js";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import { font } from "../../assets/fonts/Base64Font.js";

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

	var callAddFont = function () {
		this.addFileToVFS("NotoSansThai-Regular.ttf", font);
		this.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
	};
	jsPDF.API.events.push(["addFonts", callAddFont]);

	const generatePDF = () => {
		const doc = new jsPDF();

		doc.setFont("NotoSansThai");

		doc.text("Booking Details", 10, 10);
		doc.text(`Booking Date: ${bookingDate}`, 10, 20);
		doc.text(`Time: ${bookingStartTime} - ${bookingEndTime}`, 10, 30);
		doc.text(`Room Name: ${selectedBooking.room_name}`, 10, 40);

		let x = 10;
		let yPart = 60;
		filteredBookings.forEach((booking, index) => {
			if (index === 0) {
				doc.text(`Participants: `, 10, 50);
			}
			doc.text(`${booking.participant_name}`, 10, yPart);
			yPart += 10;
		});

		let yDrinks = 60;
		filteredBookings.forEach((booking, index) => {
			if (index === 0) {
				doc.text(`Drinks: `, 125, 50);
			}
			doc.text(`${booking.beverage}`, 125, yDrinks);
			yDrinks += 10;
		});

		doc.save("booking-details.pdf");
	};

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
			<div className="ant-btn mt-2 flex flex-row justify-between">
				<DownloadOutlined
					className="antd-icon cursor-pointer"
					onClick={generatePDF}></DownloadOutlined>

				{showBackButton && (
					<>
						<Button
							className="mx-4"
							type="primary"
							onClick={toPreviousMainModal}>
							Back
						</Button>
					</>
				)}
			</div>
		</>
	);
}
