import {
	Spin,
	Form,
	Input,
	Button,
	Result,
	Descriptions,
	Menu,
	Select,
	message,
} from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	getParticipantsAndBeverage,
	getShopMenu,
	insertParticipantsAndBeverages,
} from "../../api/DataService.js";
import moment from "moment";

export function MealMenu() {
	const [meal, setMeal] = useState([{ name: "", drink: "", remark: "" }]);
	const [existingMeal, setExistingMeal] = useState(null);
	const [menu, setMenu] = useState([]);
	const [loading, setLoading] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);
	const { value } = useParams();
	const [form] = Form.useForm();

	useEffect(() => {
		const fetchData = async () => {
			const [mealResponse, menuResponse] = await Promise.all([
				getParticipantsAndBeverage(),
				getShopMenu(),
			]);
			setExistingMeal(mealResponse.data.bookings);
			setMenu(menuResponse.data.cafe_menu);
		};

		fetchData();
	}, []);

	// useEffect(() => {
	// 	const fetchMeal = async () => {
	// 		try {
	// 			getParticipantsAndBeverage().then((mealResponse) => {
	// 				setExistingMeal(mealResponse.data.bookings);
	// 			});
	// 		} catch (error) {
	// 			console.log("Error fetching participants and beverages.");
	// 		}
	// 	};

	// 	fetchMeal();
	// }, []);

	// useEffect(() => {
	// 	try {
	// 		getShopMenu().then((menuResponse) => {
	// 			setMenu(menuResponse.data.cafe_menu);
	// 		});
	// 	} catch (error) {
	// 		setError(error.response.data.message);
	// 	}
	// }, []);

	console.log("menu: ", menu);
	console.log("meal: ", existingMeal);

	// useEffect(() => {
	// 	return getShopMenu().then((res) => console.log(res));
	// }, []);

	const filteredBookingInfo = existingMeal?.reduce((acc, meal) => {
		if (meal.booking_id === Number(value)) {
			acc = [
				{ label: "Topic", value: meal.topic },
				{ label: "Shop ID", value: meal.shop_id },
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
				{ label: "Selected Shop", value: meal.shop_name },
			];
		}
		return acc;
	}, []);

	const remainingBookingInfo = filteredBookingInfo?.slice(2) || [];

	console.log("bookinginfo: ", filteredBookingInfo);

	const filteredMenusByShop = filteredBookingInfo?.map((meal) => {
		return menu.filter((shop) => {
			return shop.shop_id === meal.value;
		});
	});

	console.log("filtered menu: ", filteredMenusByShop);

	// Remove empty objects from the filtered array
	const nonEmptyFilteredMenusByShop = filteredMenusByShop?.filter((shop) => {
		return Object.keys(shop).length > 0; // Keep only objects with properties
	});

	const filteredMeals = existingMeal?.filter((meal) => {
		return meal.booking_id === Number(value);
	});
	console.log("menus: ", nonEmptyFilteredMenusByShop);

	// console.log("existing meal: ", existingMeal);
	// console.log("filtered booking info: ", filteredBookingInfo);

	const addMealChange = (index, field, value) => {
		const updatedInputs = [...meal];
		updatedInputs[index][field] = value;
		setMeal(updatedInputs);
	};

	const addInput = () => {
		setMeal([...meal, { name: "", drink: "", remark: "" }]);
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
		// console.log(meal);
		await insertParticipantsAndBeverages(meal, value, null, true)
			.then((response) => {
				const { success } = response.data;
				if (success) {
					setSuccessAlert(!successAlert);
					setMeal([{ name: "", drink: "", remark: "" }]);
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				}
			})
			.catch((error) => {
				if (error.response.status === 500) {
					message.error(error.response.data.message, 0);
				}
			})
			.finally(() => {
				setLoading(false);
			});
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

								<div className="flex space-x-4 items-center gap-4 mb-4">
									<div className="font-bold flex-1">Name</div>
									<div className="font-bold flex-1">
										Drink
									</div>
									<div className="font-bold flex-1">
										Remark
									</div>
								</div>
								{filteredMeals?.map((mealItem, index) => (
									<div
										key={index}
										className="flex space-x-4 items-center gap-4 mb-4">
										<div className="flex-1">
											{mealItem.participant_name}
										</div>
										<div className="flex-1">
											{mealItem.beverage}
										</div>
										<div className="flex-1">
											{mealItem.participant_name &&
											mealItem.beverage &&
											mealItem.remark
												? mealItem.remark
												: mealItem.participant_name &&
												  mealItem.beverage &&
												  !mealItem.remark &&
												  "-"}
										</div>
									</div>
								))}

								<div className="max-h-96 w-full overflow-y-auto">
									{meal.map((mealItem, index) => (
										<div
											key={index}
											className="flex space-x-4 items-center">
											<div className="flex-1">
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
											<div className="flex-1">
												<Form.Item
													name={`drink-${index}`}
													rules={[
														{
															required: true,
															message:
																"Please input the drink.",
														},
													]}>
													{/* <Input
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
													/> */}

													<Select
														placeholder="Drink"
														onChange={(value) =>
															addMealChange(
																index,
																"drink",
																value
															)
														}>
														{nonEmptyFilteredMenusByShop?.[0].map(
															(menu) => (
																<Select.Option
																	key={
																		menu.menu_id
																	}
																	value={
																		menu.menu_name
																	}>
																	{
																		menu.menu_name
																	}
																</Select.Option>
															)
														)}
													</Select>
												</Form.Item>
											</div>
											<div className="flex-1">
												<Form.Item
													name={`remark-${index}`}>
													<Input
														placeholder="Remark"
														className="border rounded-md"
														value={mealItem.remark}
														onChange={(e) =>
															addMealChange(
																index,
																"remark",
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
