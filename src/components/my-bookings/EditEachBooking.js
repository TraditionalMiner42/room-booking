import {
	Button,
	Descriptions,
	Form,
	Input,
	Result,
	Spin,
	Table,
	message,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertParticipantsAndBeverages } from "../../api/DataService.js";

export default function EditEachBooking({
	booking,
	bookingId,
	successAlert,
	setSuccessAlert,
}) {
	const navigate = useNavigate();
	const [topicInputState, setTopicInputState] = useState(false);
	const [editedTopic, setEditedTopic] = useState(booking.topic); // Initialize editedTopic state with booking.topic
	const [meal, setMeal] = useState([{ name: "", drink: "" }]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState("");
	const [form] = Form.useForm();

	console.log(bookingId);

	const onRename = (e) => {
		setTopicInputState(!topicInputState);
	};

	const handleInputChange = (e) => {
		setEditedTopic(e.target.value); // Update editedTopic state based on input change
	};

	const addMealChange = (index, field, value) => {
		const updatedInputs = [...meal];
		updatedInputs[index][field] = value;
		setMeal(updatedInputs);
	};

	const addInput = () => {
		setMeal([...meal, { name: "", drink: "" }]);
	};

	const deleteInput = () => {
		if (meal.length > 1) {
			const updatedInputs = [...meal];
			updatedInputs.pop(); // Remove the last item
			setMeal(updatedInputs);
		}
	};

	const onUpdateData = (e) => {
		setLoading(true);
		try {
			console.log("booking id: ", bookingId);
			insertParticipantsAndBeverages(meal, bookingId, true)
				.then((response) => {
					const { success, message } = response.data;
					if (success) {
						setSuccessAlert(!successAlert);
						setMeal([{ name: "", drink: "" }]);
						setTimeout(() => {
							navigate("/users/bookings/?submit=success");
						}, 2000);
					}
				})
				.catch((error) => {
					if (error.response.status === 500) {
						setError(error.response.data.message);
					}
				})
				.finally(() => setLoading(false));
		} catch (error) {
			console.log("Error updating participants and drinks: ", error);
		}
	};

	const onSave = (e) => {
		setTopicInputState(false);
	};

	return (
		<>
			<Spin spinning={loading} tip="Loading" size="large">
				<div className="my-4">
					<Form onFinish={onUpdateData} form={form} key={bookingId}>
						<Descriptions>
							<Form.Item
								className="flex flex-row border rounded-md pt-4 mt-4 pl-2"
								label={<p className="pt-1">Topic</p>}
								labelCol={{ span: 4 }}
								wrapperCol={{ span: 20 }}>
								{topicInputState ? (
									<>
										<Input
											value={editedTopic}
											onChange={handleInputChange}
										/>
										<Button
											type="link"
											onClick={onSave}
											className="ml-2">
											Save
										</Button>
									</>
								) : (
									<div className="flex flex-row ">
										<Input
											className="border-none"
											value={editedTopic}
											disabled
										/>
										<div className="flex">
											<Button
												className="mx-4"
												type="primary"
												onClick={onRename}>
												Rename
											</Button>
										</div>
									</div>
								)}
							</Form.Item>
						</Descriptions>

						<div className="py-4 mt-4 font-semibold text-xl">
							Add Break
						</div>

						<div className="scrollable-container">
							{meal.map((mealItem, index) => (
								<div key={index} className="flex mb-4">
									<div className="flex flex-col flex-1 mr-4">
										<Form.Item
											name={`name-${index}`}
											rules={[
												{
													required: true,
													message:
														"Please input the participant.",
												},
											]}>
											<Input
												placeholder="Name"
												className="border rounded-md"
												value={mealItem.name}
												onChange={(e) =>
													addMealChange(
														index,
														"name",
														e.target.value
													)
												}
											/>
										</Form.Item>
									</div>
									<div className="flex flex-col flex-1">
										<Form.Item
											name={`drink-${index}`}
											rules={[
												{
													required: true,
													message:
														"Please input the drink.",
												},
											]}>
											<Input
												placeholder="Drink"
												className="border rounded-md"
												value={mealItem.drink}
												onChange={(e) =>
													addMealChange(
														index,
														"drink",
														e.target.value
													)
												}
											/>
										</Form.Item>
									</div>
								</div>
							))}
						</div>
						<div className="flex justify-center mb-8 p-4">
							<Button
								type="dashed"
								className="mr-4"
								onClick={addInput}
								style={{
									fontSize: "20px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
								+
							</Button>
							<Button
								type="dashed"
								className="mr-4"
								onClick={deleteInput}
								style={{
									fontSize: "20px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
								-
							</Button>
						</div>
						<div className="flex justify-end items-center">
							<Button
								className="align-middle "
								type="primary"
								htmlType="submit">
								Update Data
							</Button>
						</div>
					</Form>
				</div>
			</Spin>
		</>
	);
}
