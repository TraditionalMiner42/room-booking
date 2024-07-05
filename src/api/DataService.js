import axiosInstance from "../axiosInstance.js";

const signInCurrentUser = async (
	username,
	password,
	checkCredential = false
) => {
	try {
		if (checkCredential) {
			const response = await axiosInstance.post(
				"/users/signin/check_credential",
				{
					username,
					password,
				}
			);
			console.log("Signed-in user: ", response);
			return response;
		} else {
			const response = await axiosInstance.post("/users/signin", {
				username,
				password,
			});

			console.log("Signed-in user: ", response);
			return response;
		}
	} catch (error) {
		if (error.response && error.response.status === 500) {
			throw new Error("Username or password is not matched");
		}
		console.error("Error post sign-in: ", error);
		throw new Error("Failed to sign in");
	}
};

const signUpUser = async (username, password, checkUsername = false) => {
	try {
		if (checkUsername) {
			// Check if username exists
			const response = await axiosInstance.post(
				"/users/signup/check_username",
				{ username }
			);
			console.log("Username check response: ", response);
			return response;
		} else {
			// Perform actual signup
			const response = await axiosInstance.post("/users/signup", {
				username,
				password,
			});
			console.log("Signed-in user: ", response);
			return response;
		}
	} catch (error) {
		if (error.response && error.response.status === 409) {
			// Handle 409 conflict error for existing username
			throw new Error("Username already exists");
		}
		console.error("Error post sign-up: ", error);
		throw new Error("Failed to sign up");
	}
};

const fetchGetRooms = async () => {
	try {
		const response = await axiosInstance.get("/users/get_rooms");
		console.log("Rooms response:", response.data.rooms); // Check response data
		return response.data.rooms;
	} catch (error) {
		console.error("Error fetching rooms: ", error);
		throw error;
	}
};

const fetchGetBookings = async () => {
	try {
		const response = await axiosInstance.get("/users/get_bookings");
		console.log(response.data.bookings);
		return response.data.bookings;
	} catch (error) {
		console.error("Error fetching bookings: ", error);
		throw error;
	}
};

const fetchGetSignedInUser = async () => {
	try {
		const response = await axiosInstance.get("/users/get_user");
		console.log(response.data.user);
		return response;
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
		const response = await axiosInstance.post("/users/rooms", {
			modifiedFormValues: formData,
		});
		return response;
	} catch (error) {
		console.error("Error fetching submitting the form: ", error);
		throw error;
	}
};

const insertParticipantsAndBeverages = async (meal, bookingId, editedTopic) => {
	try {
		const response = await axiosInstance.post("/users/add_more", {
			meal,
			bookingId,
			editedTopic,
		});
		return response;
	} catch (error) {
		console.log(
			"Error insert participants and beverages to particular booking: ",
			error
		);
		throw error;
	}
};

const getParticipantsAndBeverage = async () => {
	try {
		const response = await axiosInstance.get("/users/get_break_details");
		return response;
	} catch (error) {
		console.log(
			"Error get participants and beverages of particular booking: ",
			error
		);
		throw error;
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
	signInCurrentUser,
	signUpUser,
	fetchGetRooms,
	fetchGetBookings,
	fetchPostForm,
	fetchGetSignedInUser,
	fetchUserBookings,
	insertParticipantsAndBeverages,
	getParticipantsAndBeverage,
	deleteBookingFromTable,
};
