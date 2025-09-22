import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth/";
const API_URL = "https://online-judge-1-mf6q.onrender.com/api/auth/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    console.log(response.data);
    localStorage.setItem("user", JSON.stringify(response.data)); // store user in local storage
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    console.log(response.data);
    localStorage.setItem("user", JSON.stringify(response.data)); // store user in local storage
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("user"); // remove user from local storage
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
