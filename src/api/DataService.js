import axiosInstance from "../axiosInstance.js";

const getSection = async () => {
	try {
		const response = await axiosInstance.get("/users/get_sections");
		return response;
	} catch (error) {
		if (error.response) {
			throw new Error(
				error.response.data.message || "Failed to get division data"
			);
		}
		// Handle network errors or unexpected errors
		throw new Error("Network or server error");
	}
};

const getDivision = async () => {
	try {
		const response = await axiosInstance.get("/users/get_divisions");
		return response;
	} catch (error) {
		if (error.response) {
			throw new Error(
				error.response.data.message || "Failed to get division data"
			);
		}
		// Handle network errors or unexpected errors
		throw new Error("Network or server error");
	}
};

const getCurrentSignInUser = async (username) => {
	try {
		const response = await axiosInstance.get("/users/get_user_name", {
			params: { username },
		});
		return response;
	} catch (error) {
		throw error;
	}
};

const signInCurrentUser = async (username, password) => {
	try {
		const response = await axiosInstance.post("/users/signin", {
			username,
			password,
		});

		console.log("Signed-in user: ", response);
		return response;
	} catch (error) {
		console.log("error: ", error);
		// Check if the error has a response object
		if (error.response) {
			if (error.response.status === 400) {
				throw new Error(
					error.response.data.message ||
						"Invalid username or password"
				);
			}
		}
		throw new Error("Failed to sign in");
	}
};

const signUpUser = async (
	empId = null,
	fullname = null,
	division = null,
	section = null,
	username,
	password,
	checkUsername = false
) => {
	try {
		if (checkUsername) {
			// Check if username exists
			const response = await axiosInstance.post(
				"/users/signup/check_username",
				{ username }
			);
			return response;
		} else {
			// Perform actual signup
			const response = await axiosInstance.post("/users/signup", {
				empId,
				fullname,
				division,
				section,
				username,
				password,
			});
			return response;
		}
	} catch (error) {
		if (error.response && error.response.status === 409) {
			// Handle 409 conflict error for existing username
			throw new Error(
				error.response.data.message || "Username already exists"
			);
		}
		throw new Error("Failed to sign up");
	}
};

const fetchGetRooms = async () => {
	try {
		const response = await axiosInstance.get("/users/get_rooms");
		return response.data.rooms;
	} catch (error) {
		throw new Error("Failed to fetch rooms");
	}
};

const getShopMenu = async () => {
	try {
		const response = await axiosInstance.get("/users/shop_menu");
		console.log(response);
		return response;
	} catch (error) {
		throw new Error("Failed to fetch shops");
	}
};

const fetchGetBookings = async () => {
	try {
		const response = await axiosInstance.get("/users/get_bookings");
		return response.data.bookings;
	} catch (error) {
		throw new Error("Failed to fetch bookings");
	}
};

const fetchGetSignedInUser = async () => {
	try {
		const response = await axiosInstance.get("/users/get_user");
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching signed-in user: ", error);
		throw error;
	}
};

const fetchUserBookings = async (user) => {
	const params = {
		userId: user.user_id,
	};
	try {
		const response = await axiosInstance.get("/users/get_user_bookings", {
			params,
		});
		return response.data.bookings;
	} catch (error) {
		console.error("Error fetching user bookings: ", error);
		throw error;
	}
};

const fetchPostForm = async (formData) => {
	try {
		console.log("form data: ", formData);
		const response = await axiosInstance.post("/", {
			modifiedFormValues: formData,
		});
		return response;
	} catch (error) {
		console.error("Error fetching submitting the form: ", error);
		throw error;
	}
};

const updateBookingTopic = async (editedTopic, bookingId) => {
	try {
		const response = await axiosInstance.post("/users/rename_topic", {
			editedTopic,
			bookingId,
		});
		return response;
	} catch (error) {
		console.log("Error updating the renamed topic: ", error);
		throw error;
	}
};

const insertParticipantsAndBeverages = async (meal, bookingId) => {
	try {
		const response = await axiosInstance.post("/users/add_break_meals", {
			meal,
			bookingId,
		});
		return response;
	} catch (error) {
		throw new Error(
			"Error insert participants and beverages of the booking"
		);
	}
};

const getParticipantsAndBeverage = async () => {
	try {
		const response = await axiosInstance.get("/users/get_break_details");
		return response;
	} catch (error) {
		throw new Error("Error get participants and beverages of the booking");
	}
};

const deleteBookingFromTable = async (bookingId) => {
	try {
		const response = await axiosInstance.delete(
			`/users/delete_booking/${bookingId}`
		);
		return response;
	} catch (error) {
		console.log("Error delete selected booking: ", error);
		throw error;
	}
};

export {
	getSection,
	getDivision,
	getCurrentSignInUser,
	signInCurrentUser,
	signUpUser,
	fetchGetRooms,
	getShopMenu,
	fetchGetBookings,
	fetchPostForm,
	fetchGetSignedInUser,
	fetchUserBookings,
	updateBookingTopic,
	insertParticipantsAndBeverages,
	getParticipantsAndBeverage,
	deleteBookingFromTable,
};
