import moment from "moment";

export default function UpcomingBooking({ selectedDate, bookings }) {
	const seenDates = new Set();
	const now = moment();

	const filteredBookings = bookings.filter((booking) => {
		return moment(booking.booking_date).isSameOrAfter(now, "day");
	});

	return (
		<div className="p-10">
			<div className="font-semibold text-2xl">Upcoming Bookings</div>
			{filteredBookings.map((booking, index) => {
				const bookingDate = moment(booking.booking_date).format(
					"DD/MM/YYYY"
				);
				const isFirstBookingOfTheDay = !seenDates.has(bookingDate);

				if (isFirstBookingOfTheDay) {
					seenDates.add(bookingDate);
				}

				return (
					<div
						className={`${isFirstBookingOfTheDay ? "pt-5" : ""}`}
						key={index}
					>
						<div>
							{isFirstBookingOfTheDay && (
								<>
									<strong>{bookingDate}</strong>
									<br />
									<strong>{booking.room_name}</strong>
								</>
							)}
						</div>
						<div>
							{moment(booking.booking_start_time, "HH:mm").format(
								"HH:mm"
							)}{" "}
							-{" "}
							{moment(booking.booking_end_time, "HH:mm").format(
								"HH:mm"
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
