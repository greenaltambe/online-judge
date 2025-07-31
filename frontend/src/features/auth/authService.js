import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

const register = async (userData) => {
	const response = await axios.post(API_URL + "register", userData);

	if (response.data) {
		console.log(response.data);
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

const login = async (userData) => {
	const response = await axios.post(API_URL + "login", userData);

	if (response.data) {
		console.log(response.data);
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

const logout = () => {
	localStorage.removeItem("user");
};

const authService = {
	register,
	logout,
	login,
};

export default authService;
