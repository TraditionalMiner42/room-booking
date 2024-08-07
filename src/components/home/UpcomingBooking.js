import { Collapse, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function UpcomingBooking({ selectedDate, bookings }) {
	const now = moment();
	const { Panel } = Collapse;
	const [activeKey, setActiveKey] = useState([]);
	const [loading, setLoading] = useState(true);

	const handlePanelChange = (key) => {
		setActiveKey(key);
	};

	const sevenDaysFromNow = moment().add(7, "days");

	const filteredBookings = bookings.filter((booking) => {
		const bookingDate = booking.booking_date;
		return (
			moment(bookingDate).isSameOrAfter(now, "day") &&
			moment(bookingDate).isSameOrBefore(sevenDaysFromNow, "day")
		);
	});

	// Group bookings by date
	const bookingsByDate = filteredBookings.reduce((acc, booking) => {
		const bookingDate = moment(booking.booking_date).format("DD/MM/YYYY");
		if (!acc[bookingDate]) {
			acc[bookingDate] = [];
		}
		acc[bookingDate].push(booking);
		return acc;
	}, {});

	useEffect(() => {
		const firstKey = Object.keys(bookingsByDate)[0];
		if (firstKey) {
			setActiveKey([firstKey]);
		}
		setLoading(false); // Set loading to false once bookings are processed
	}, []);

	// Sort each date's bookings by room name and start time
	Object.keys(bookingsByDate).forEach((date) => {
		bookingsByDate[date].sort((a, b) => {
			const roomComparison = a.room_name.localeCompare(b.room_name);
			if (roomComparison !== 0) {
				return roomComparison;
			}
			return moment(a.booking_start_time, "HH:mm").diff(
				moment(b.booking_start_time, "HH:mm")
			);
		});
	});

	// Object to track displayed rooms by date
	const displayedRoomsByDate = {};

	return (
		<div className="p-10 pt-14 lg:w-2/3">
			<div className="font-semibold text-2xl my-6">Upcoming Bookings</div>
			<Spin spinning={loading} tip="loading" size="large">
				<Collapse
					className="bg-white shadow-md"
					activeKey={activeKey}
					onChange={handlePanelChange}
					defaultActiveKey={activeKey}>
					{Object.keys(bookingsByDate).map((date, index) => (
						<Panel
							header={<strong className="text-lg">{date}</strong>}
							key={date}>
							{bookingsByDate[date].map((booking, subIndex) => {
								// Initialize the date in displayedRoomsByDate if it doesn't exist
								if (!displayedRoomsByDate[date]) {
									displayedRoomsByDate[date] = new Set();
								}

								const isSameRoom = displayedRoomsByDate[
									date
								].has(booking.room_name);

								if (!isSameRoom) {
									displayedRoomsByDate[date].add(
										booking.room_name
									);
								}

								return (
									<div
										className="flex flex-col pb-2"
										key={subIndex}>
										<div className="items-center">
											<div className="font-light">
												{!isSameRoom && (
													<div className="pb-2 text-lg font-semibold">
														<strong>
															{booking.room_name}
														</strong>
													</div>
												)}
												<div className="flex flex-row text-base">
													<div className="grid w-1/2 sm-mobile-size:flex sm-mobile-size:w-1/2">
														<span className="w-2/5 pr-4">
															({booking.name})
														</span>
														<span className="w-2/5 xl:w-3/5">
															{booking.topic}
														</span>
													</div>
													<span className="ml-0 sm-mobile-size:ml-10">
														{moment(
															booking.booking_start_time,
															"HH:mm"
														).format("HH:mm")}{" "}
														-{" "}
														{moment(
															booking.booking_end_time,
															"HH:mm"
														).format("HH:mm")}
													</span>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</Panel>
					))}
				</Collapse>
			</Spin>
		</div>
	);
}
