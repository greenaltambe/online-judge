import axios from "axios";

const API_URL = "http://localhost:5000/api/problems/";

const getProblems = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);

	if (response.data) {
		console.log(response.data);
	}
	return response.data;
};

const getProblem = async (id, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + id, config);
	console.log(response.data);
	return response.data;
};

const createProblem = async (problemData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, problemData, config);
	return response.data;
};

const deleteProblem = async (id, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + id, config);
	return response.data;
};

const runSolution = async (problemData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL + "run", problemData, config);
	return response.data;
};

const problemService = {
	getProblems,
	createProblem,
	deleteProblem,
	getProblem,
	runSolution,
};

export default problemService;
