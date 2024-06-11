import { useEffect, useState } from "react";
import BookingForm from "./BookingForm.js";
import { Calendar, Badge, Popover, Modal } from "antd";
import styled from "styled-components";
import axiosInstance from "../../axiosInstance.js";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

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

export default function Room({ isModalForm }) {
	console.log("Is modal form (booking nav): ", isModalForm);
	return (
		<div>
			<BookingForm isModalForm={isModalForm} />
		</div>
	);
}
