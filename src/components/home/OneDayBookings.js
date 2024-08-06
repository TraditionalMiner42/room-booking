import { Row, Col, Button, Modal, Card } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function OneDayBooking({
	mainModalVisible,
	setMainModalVisible,
	filteredBookings,
	setSelectedBooking,
	setCurrentBookingIndex,
	selectedDate,
	rooms,
	availableRoom,
	onDetailModal,
	onSubModal,
}) {
	const [mainModal, setMainModal] = useState(null);

	useEffect(() => {
		setMainModal(document.getElementById("main-modal"));
	}, []);

	return (
		<>
			{mainModal &&
				createPortal(
					<Modal
						open={mainModalVisible}
						onCancel={() => setMainModalVisible(false)}
						footer={null}>
						<Row gutter={[32, 32]}>
							{
								<>
									<Col span={24} className="flex flex-col">
										<div className="py-2 font-semibold text-2xl tracking-wide">
											{moment(selectedDate).format(
												"Do MMMM YYYY"
											)}
										</div>
										<div className="pt-5 font-semibold text-xl">
											Booked Rooms
										</div>
										{/* Sort filteredBookings by room name */}
										{filteredBookings
											.sort((a, b) =>
												a.room_name.localeCompare(
													b.room_name
												)
											)
											// Group bookings by room name
											.reduce((acc, booking) => {
												const roomIndex = acc.findIndex(
													(room) =>
														room.name ===
														booking.room_name
												);
												if (roomIndex === -1) {
													acc.push({
														name: booking.room_name,
														bookings: [booking],
													});
												} else {
													acc[
														roomIndex
													].bookings.push(booking);
												}
												return acc;
											}, [])
											.map((room) => (
												<div
													className="pb-2 mt-3"
													key={room.name}>
													<Card
														hoverable={true}
														style={{
															cursor: "default",
														}}>
														<div className="py-2 font-bold">
															{room.name}
														</div>
														{/* Display booking times for each room */}
														{room.bookings.map(
															(
																booking,
																index
															) => (
																<div
																	className="flex justify-between items-center py-2"
																	key={index}>
																	<div className="align-middle font-light flex-grow">
																		<div className="py-2">
																			{
																				booking.name
																			}
																		</div>
																		<div className="flex justify-between items-center">
																			<div className="align-middle">
																				{moment(
																					booking.booking_start_time,
																					"HH:mm"
																				).format(
																					"HH:mm"
																				)}{" "}
																				-{" "}
																				{moment(
																					booking.booking_end_time,
																					"HH:mm"
																				).format(
																					"HH:mm"
																				)}
																			</div>

																			<Button
																				type="default"
																				className="border-none"
																				onClick={(
																					e
																				) => {
																					console.log(
																						booking
																					);
																					console.log(
																						index
																					);
																					onDetailModal(
																						e,
																						room.room_id,
																						room.room_name,
																						selectedDate
																					);
																					setSelectedBooking(
																						booking
																					);
																					setCurrentBookingIndex(
																						index
																					);
																					// index += 1;
																				}}>
																				View
																			</Button>
																		</div>
																	</div>
																</div>
															)
														)}
													</Card>
												</div>
											))}
										<div className="pt-5 font-semibold text-xl">
											Available Rooms
										</div>
										{filteredBookings.length !== 0
											? availableRoom.map(
													(room, index) => (
														<div
															className="flex-1 flex-row pb-2 mt-3"
															key={index}>
															<Card
																hoverable={true}
																style={{
																	cursor: "default",
																}}>
																<div className="flex justify-between items-center">
																	<div className="font-bold">
																		{
																			room.room_name
																		}
																	</div>
																	<Button
																		type="primary"
																		className="self-center cursor-pointer"
																		onClick={(
																			e
																		) =>
																			onSubModal(
																				e,
																				room.room_id,
																				room.room_name,
																				selectedDate
																			)
																		}
																		value={
																			room.room_name
																		}>
																		Book now
																	</Button>
																</div>
															</Card>
														</div>
													)
											  )
											: // Display all rooms if there are no bookings for the selected date
											  rooms.map((room, index) => (
													<div
														className="flex-1 flex-row pb-2 mt-3 cursor-pointer"
														key={index}>
														<Card
															hoverable={true}
															style={{
																cursor: "default",
															}}>
															<div className="flex justify-between items-center">
																<div className="font-bold">
																	{
																		room.room_name
																	}
																</div>

																<Button
																	type="primary"
																	className="self-center cursor-pointer"
																	onClick={(
																		e
																	) =>
																		onSubModal(
																			e,
																			room.room_id,
																			room.room_name,
																			selectedDate
																		)
																	}
																	value={
																		room.room_name
																	}>
																	Book now
																</Button>
															</div>
														</Card>
													</div>
											  ))}
									</Col>
								</>
							}
						</Row>
					</Modal>,
					mainModal
				)}
		</>
	);
}
