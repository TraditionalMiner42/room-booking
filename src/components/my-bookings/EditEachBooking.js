import { Button, Descriptions, Form, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	getParticipantsAndBeverage,
	insertParticipantsAndBeverages,
} from "../../api/DataService.js";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function EditEachBooking({
	booking,
	bookingId,
	successAlert,
	setSuccessAlert,
	setEditModalVisible,
	onSubmissionSuccess,
}) {
	const navigate = useNavigate();
	const [topicInputState, setTopicInputState] = useState(false);
	const [editedTopic, setEditedTopic] = useState(booking.topic); // Initialize editedTopic state with booking.topic
	const [existingMeal, setExistingMeal] = useState(null);
	const [meal, setMeal] = useState([{ name: "", drink: "" }]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState("");
	const [form] = Form.useForm();

	useEffect(() => {
		try {
			getParticipantsAndBeverage().then((response) =>
				setExistingMeal(response.data.bookings)
			);
		} catch (error) {
			console.log("Error fetching participants and beverages.");
		}
	}, []);

	useEffect(
		() => console.log("existing meal: ", existingMeal),
		[existingMeal]
	);

	useEffect(() => console.log("filtered meal: ", filteredMeals), []);

	const onRename = (e) => {
		setTopicInputState(!topicInputState);
	};

	const handleInputChange = (e) => {
		setEditedTopic(e.target.value); // Update editedTopic state based on input change
	};

	const filteredMeals = existingMeal?.filter(
		(meal) => meal.booking_id === bookingId
	);

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

	const onUpdateData = async (e) => {
		setLoading(true);
		try {
			console.log("booking id: ", bookingId);
			console.log("break meal: ", meal);
			await insertParticipantsAndBeverages(
				meal,
				bookingId,
				editedTopic,
				true
			)
				.then((response) => {
					const { success } = response.data;
					if (success) {
						setSuccessAlert(!successAlert);
						setMeal([{ name: "", drink: "" }]);
						setEditModalVisible(false);
						setTimeout(() => {
							onSubmissionSuccess();
							navigate("/users/bookings/?submit=success", {
								replace: true,
							});
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
		setTopicInputState(!topicInputState);
		console.log("changed topic: ", editedTopic);
	};

	return (
		<>
			<Spin spinning={loading} tip="Loading" size="large">
				<div className="my-4">
					<Form onFinish={onUpdateData} form={form} key={bookingId}>
						<Descriptions>
							<Form.Item
								className="flex flex-row mt-4 pl-2"
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

						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="font-bold text-left">Name</div>
							<div className="font-bold text-left">Drink</div>
						</div>
						{filteredMeals?.map((mealItem, index) => (
							<div
								key={index}
								className="grid grid-cols-2 gap-4 mb-4">
								<div className="text-left">
									{mealItem.participant_name}
								</div>
								<div className="text-left">
									{mealItem.beverage}
								</div>
							</div>
						))}

						<div className="scrollable-container">
							{meal.map((mealItem, index) => (
								<div key={index} className="flex">
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
							<PlusCircleOutlined
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
							</PlusCircleOutlined>
							<MinusCircleOutlined
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
							</MinusCircleOutlined>
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
