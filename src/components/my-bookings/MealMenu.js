import { Spin, Form, Input, Button, Result, Descriptions } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	getParticipantsAndBeverage,
	insertParticipantsAndBeverages,
} from "../../api/DataService.js";
import moment from "moment";

export function MealMenu() {
	const [meal, setMeal] = useState([{ name: "", drink: "" }]);
	const [existingMeal, setExistingMeal] = useState(null);
	const [loading, setLoading] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);
	const { value } = useParams();
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

	const filteredBookingInfo = existingMeal?.reduce((acc, meal) => {
		if (meal.booking_id === Number(value)) {
			acc = [
				{ label: "Topic", value: meal.topic },
				{
					label: "Date",
					value: moment(meal.booking_date).format("DD-MM-YYYY"),
				},
				{
					label: "Time",
					value: `${moment(meal.booking_start_time, "HH:mm").format(
						"HH:mm"
					)} - ${moment(meal.booking_end_time, "HH:mm").format(
						"HH:mm"
					)}`,
				},
				{ label: "Room Name", value: meal.room_name },
			];
		}
		return acc;
	}, []);

	const remainingBookingInfo = filteredBookingInfo?.slice(1) || [];

	const filteredMeals = existingMeal?.filter((meal) => {
		return meal.booking_id === Number(value);
	});

	console.log("existing meal: ", existingMeal);
	console.log("filtered booking info: ", filteredBookingInfo);

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

	const onUpdateData = async () => {
		setLoading(true);
		try {
			await insertParticipantsAndBeverages(meal, value, null, true)
				.then((response) => {
					const { success } = response.data;
					if (success) {
						setSuccessAlert(!successAlert);
						setMeal([{ name: "", drink: "" }]);
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					}
				})
				.catch((error) => {
					if (error.response.status === 500) {
						setError(error.response.data.message);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {}
	};

	return (
		<>
			{successAlert ? (
				<Result
					title="Break-meal added successfully"
					status="success"
					closable
				/>
			) : (
				<Spin spinning={loading} tip="Loading" size="large">
					<div className="flex justify-center items-center">
						<div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl m-8 p-8 bg-white shadow-md rounded-md">
							<Form
								onFinish={onUpdateData}
								form={form}
								key={value}>
								<div className="font-semibold text-xl pb-5">
									{filteredBookingInfo?.[0]?.value}
								</div>

								<Descriptions column={2}>
									{remainingBookingInfo?.map(
										(item, index) => (
											<Descriptions.Item
												key={index}
												label={item.label}>
												{item.value}
											</Descriptions.Item>
										)
									)}
								</Descriptions>
								<div className="py-4 mt-4 font-semibold text-xl">
									Add Break
								</div>

								<div className="grid grid-cols-2 gap-4 mb-4">
									<div className="font-bold text-left">
										Name
									</div>
									<div className="font-bold text-left">
										Drink
									</div>
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

								<div className="max-h-96 overflow-y-auto">
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
										}}>
										+
									</PlusCircleOutlined>
									<MinusCircleOutlined
										type="dashed"
										className="ml-4"
										onClick={deleteInput}
										style={{
											fontSize: "20px",
											display: "flex",
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
					</div>
				</Spin>
			)}
		</>
	);
}
