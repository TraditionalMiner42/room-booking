import { useEffect, useState } from "react";
import BookingForm from "./BookingForm.js";
import { Calendar, Badge } from "antd";
import styled from "styled-components";
import axiosInstance from "../../axiosInstance.js";
import moment from "moment";

// const StyledCalendarContainer = styled.div`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	// height: 100vh; /* Set container height for vertical centering */
// `;

// const StyledCalendar = styled(Calendar)`
// 	margin: 0 auto;
// 	width: 1000px; /* Set calendar width */
// 	border: 1px solid #ddd;
// 	border-radius: 5px;

// 	.react-calendar__month-view {
// 		background-color: #f5f5f5;
// 	}

// 	.react-calendar__tile {
// 		text-align: center;
// 		display: flex;
// 		align-items: center;
// 		justify-content: center;
// 		padding: 20px;
// 		cursor: pointer;
// 	}

// 	.react-calendar__tile--active {
// 		background-color: #333;
// 		color: #fff;
// 	}

// 	/* Target other calendar elements as needed */
// `;

export default function Room({ userToken }) {
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await axiosInstance.get("/users/get_bookings");
				console.log(response.data.bookings);
				setBookings(response.data.bookings);
			} catch (error) {
				console.error("Error fetching bookings:", error);
			}
		};

		fetchBookings();
	}, []);

	const getListData = (value) => {
		let listData = [];
		const formattedDate = value.format("YYYY-MM-DD");

		bookings.forEach((booking) => {
			const bookingDate = moment(booking.booking_date).format(
				"YYYY-MM-DD"
			);
			if (bookingDate === formattedDate) {
				let badgeColor;
				console.log(booking.selected_room);
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
					content: `${booking.booking_start_time} - ${booking.booking_end_time}`,
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
						<Badge status={item.type} text={item.content} />
					</li>
				))}
			</ul>
		);
	};

	return (
		<div>
			<Calendar cellRender={dateCellRender} mode="month"></Calendar>
			<BookingForm userToken={userToken} />
		</div>
	);
}
