import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/problems/";

const runSolution = async (problemData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "run", problemData, config);
  return response.data;
};

const submitSolution = async (problemData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "submit", problemData, config);
  return response.data;
};

const getSubmissions = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + id + "/submissions", config);
  console.log(response);
  return response.data;
};

const submissionService = {
  runSolution,
  submitSolution,
  getSubmissions,
};

export default submissionService;
