import "./Dashboard.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import ProblemForm from "../../components/ProblemForm/ProblemForm";
import UserDashboard from "../../components/UserDashboard";
import Spinner from "../../components/Common/Spinner";

const Dashboard = () => {
	const navigate = useNavigate();

	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	if (!user) {
		return <Spinner />;
	}

	return (
		<div className="dashboard">
			{user.role === "admin" ? <ProblemForm /> : <UserDashboard />}
		</div>
	);
};

export default Dashboard;
