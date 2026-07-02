import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Common/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Problems from "./pages/Problems/Problems";
import Problem from "./pages/Problem/Problem";
import Submissions from "./pages/Submissions/Submissions";

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
					<Route path="/:id/submissions" element={<Submissions />} />
				</Routes>
			</div>
			<ToastContainer position="bottom-right" />
		</>
	);
}

export default App;
