import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProblemForm from "../components/ProblemForm";
import UserDashboard from "../components/UserDashboard";
import Spinner from "../components/Spinner";

const Dashboard = () => {
	const navigate = useNavigate();

	const user = useSelector((state) => state.auth.user);

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
