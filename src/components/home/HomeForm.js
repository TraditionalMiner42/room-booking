import { Alert, Form, Result, Spin } from "antd";
import GenericForm from "../GenericForm.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.js";
import moment from "moment";
import { fetchPostForm } from "../../api/DataService.js";
import { jwtDecode } from "jwt-decode";

export default function HomeForm({
	roomId,
	roomName,
	selectedDate,
	isModalForm,
	username,
	setUsername,
	toPreviousMainModal,
}) {
	// const { foundUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	const initialFormData = {
		meetingTopic: "",
		name: "",
		dateStart: "",
		timeStart: null,
		timeEnd: null,
		room: "",
	};

	const [rooms, setRooms] = useState([]);
	const [form] = Form.useForm();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");

		if (token) {
			const decoded = jwtDecode(token);
			setUsername(decoded.username);
		}

		const fetchRooms = async () => {
			try {
				const response = await axiosInstance.get("/users/get_rooms");
				// console.log("Rooms response:", response.data.rooms); // Check response data
				setRooms(response.data.rooms);
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		};

		fetchRooms();
		console.log("Meeting rooms: ", rooms);
	}, []);

	form.setFieldValue("name", username);
	form.setFieldValue("dateStart", selectedDate);
	form.setFieldValue("room", roomName);

	const handleSubmit = (formData) => {
		const fromTimeValue = form.getFieldValue("timeStart");
		const toTimeValue = form.getFieldValue("timeEnd");

		const fromTime = fromTimeValue ? fromTimeValue.format("HH:mm") : null;
		const toTime = toTimeValue ? toTimeValue.format("HH:mm") : null;

		// const formValues = formData.getFieldValue();

		// console.log(moment(selectedDate).format("YYYY-MM-DD"));

		const modifiedFormValues = {
			...formData,
			timeStart: fromTime,
			timeEnd: toTime,
		};

		// console.log("fromTime: ", fromTime);
		console.log("form: ", modifiedFormValues);
		setLoading(true);
		try {
			fetchPostForm(modifiedFormValues)
				.then((response) => {
					console.log(response);
					const { success } = response.data;
					if (success) {
						form.resetFields();
						setIsSubmitted(true);
						setTimeout(() => {
							navigate("/?submit=success", { replace: true });
						}, 2000);
					}
				})
				.catch((error) => {
					if (error.response && error.response.status === 403) {
						localStorage.removeItem("accessToken");
						navigate("/users/signin");
					} else if (
						error.response &&
						error.response.status === 409
					) {
						setAlertMessage(error.response.data.message);
						// alert(error.response.data.message);
					} else {
						console.error("An unexpected error occurred:", error);
					}
				})
				.finally(() => setLoading(false));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{isSubmitted ? (
				<Result status="success" title="You have submitted the form." />
			) : (
				<>
					<Spin spinning={loading} tip="Loading" size="large">
						<GenericForm
							handleSubmit={handleSubmit}
							username={username}
							form={form}
							initialFormData={initialFormData}
							defaultRoomId={roomId}
							defaultRoomName={roomName}
							selectedDate={selectedDate}
							isModalForm={isModalForm}
							toPreviousMainModal={toPreviousMainModal}
						/>
						{alertMessage && (
							<Alert
								type="error"
								message={alertMessage}
								onClose={() => setAlertMessage(null)}
								closable
							/>
						)}
					</Spin>
				</>
			)}
		</>
	);
}
