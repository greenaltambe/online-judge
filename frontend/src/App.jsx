import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";

function App() {
	return (
		<>
			<div className="App">
				<Header />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/problems" element={<Problems />} />
					<Route path="/problems/:id" element={<Problem />} />
				</Routes>
			</div>
			<ToastContainer position="bottom-right" />
		</>
	);
}

export default App;
