import { Modal } from "antd";
import { deleteBookingFromTable } from "../../api/DataService.js";
import { useState } from "react";

export default function DeleteBooking({
	deleteModalVisible,
	setDeleteModalVisible,
	setSelectedBookingIndex,
	bookingId,
}) {
	const [error, setError] = useState(false);

	const deleteSelectedBooking = async (bookingId) => {
		console.log(typeof bookingId);
		console.log("selected booking id: ", bookingId);
		try {
			await deleteBookingFromTable(bookingId)
				.then((response) => {
					const { success } = response.data;
					if (success) {
						window.location.reload();
					}
				})
				.catch((error) => {
					if (error.response.status === 500) {
						setError(error.response.data.message);
					}
				});
		} catch (error) {
			console.log("Error delete selected booking: ", error);
		}
	};

	return (
		<Modal
			open={deleteModalVisible}
			onCancel={() => {
				setDeleteModalVisible(false);
				setSelectedBookingIndex(null);
			}}
			onOk={() => deleteSelectedBooking(bookingId)}>
			<div className="text-base">Confirm delete this booking?</div>
		</Modal>
	);
}
