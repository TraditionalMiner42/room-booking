import { Button, Descriptions } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getParticipantsAndBeverage } from "../../api/DataService.js";
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
	useEffect(() => console.log(selectedBooking.booking_id), [selectedBooking]);
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
		try {
			getParticipantsAndBeverage().then((response) => {
				setBookings(response.data.bookings);
			});
		} catch (error) {
			console.error(error.message);
		}
	}, []);

	let filteredBookings = [];

	if (bookings && selectedBooking) {
		filteredBookings = bookings.filter((booking) => {
			return booking.booking_id === selectedBooking.booking_id;
		});
	}

	var callAddFont = function () {
		this.addFileToVFS("NotoSansThai-Regular.ttf", font);
		this.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
	};
	jsPDF.API.events.push(["addFonts", callAddFont]);

	const generatePDF = () => {
		const doc = new jsPDF();

		// Set the font
		doc.setFont("NotoSansThai");

		// Define starting y positions for different sections
		let y = 10;
		const startY = y;
		const lineHeight = 10;
		const columnXOffsets = [10, 80, 150];

		// Add header text
		doc.text("Booking Details", 10, y);
		y += lineHeight;

		// Add booking details
		doc.text(`Booking Date: ${bookingDate}`, 10, y);
		y += lineHeight;
		doc.text(`Time: ${bookingStartTime} - ${bookingEndTime}`, 10, y);
		y += lineHeight;
		doc.text(`Room Name: ${selectedBooking.room_name}`, 10, y);
		y += lineHeight + 10; // Add extra space before the lists

		// Add participants, drinks, and remarks
		const sections = [
			{
				title: "Participants: ",
				field: "participant_name",
				xOffset: columnXOffsets[0],
			},
			{
				title: "Drinks: ",
				field: "beverage",
				xOffset: columnXOffsets[1],
			},
			{ title: "Remark: ", field: "remark", xOffset: columnXOffsets[2] },
		];

		sections.forEach((section, sectionIndex) => {
			if (filteredBookings.length > 0) {
				doc.text(section.title, section.xOffset, y);
				y += lineHeight;
			}

			filteredBookings.forEach((booking, bookingIndex) => {
				doc.text(`${booking[section.field]}`, section.xOffset, y);
				y += lineHeight;

				// Reset y position if it goes beyond the page height
				if (y > 270) {
					// Adjust based on page size and content length
					doc.addPage();
					y = startY;
				}
			});
			y = 60; // Set y height to 60 for the rest of section
		});

		// Save the PDF
		doc.save("booking-details.pdf");
	};

	// useEffect(() => console.log(bookings));

	return (
		<>
			<div className="font-semibold text-xl pb-5">
				{selectedBooking.topic}
			</div>
			<Descriptions key={key} column={2} className="pb-4">
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
				<Descriptions.Item label="Selected Shop">
					{selectedBooking.shop_name}
				</Descriptions.Item>
			</Descriptions>
			<Descriptions key={key} column={3}>
				{filteredBookings.map((booking, index) => (
					<React.Fragment key={index}>
						<Descriptions.Item label="Participant">
							{booking.participant_name}
						</Descriptions.Item>
						<Descriptions.Item label="Drink">
							{booking.beverage}
						</Descriptions.Item>
						<Descriptions.Item label="Remark">
							{booking.remark ? booking.remark : "-"}
						</Descriptions.Item>
					</React.Fragment>
				))}
			</Descriptions>

			<div className="ant-btn mt-8 flex flex-row justify-between">
				<Button className="flex" type="primary" onClick={generatePDF}>
					<div className="mr-1">Download</div>
					<DownloadOutlined className="antd-icon"></DownloadOutlined>
				</Button>

				{showBackButton && (
					<>
						<Button
							className="mx-4"
							type="default"
							onClick={toPreviousMainModal}>
							Back
						</Button>
					</>
				)}
			</div>
		</>
	);
}
