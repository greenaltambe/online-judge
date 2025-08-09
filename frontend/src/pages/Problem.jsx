import "./styles/Problem.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
	getProblemById,
	reset,
	deleteProblem,
} from "../features/problem/problemSlice";
import { toast } from "react-toastify";

const Problem = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { currentProblem, isLoading, isError, message } = useSelector(
		(state) => state.problems
	);

	const handleClickDelete = () => {
		dispatch(deleteProblem(id));
		toast.success("Problem deleted");
		navigate("/problems");
	};

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}
		dispatch(getProblemById(id));

		return () => {
			dispatch(reset());
		};
	}, [id, user, navigate, dispatch]);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
	}, [isError, message]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!currentProblem && !isLoading) {
		return <p>Problem not found</p>;
	}

	return (
		<div className="problem-page-container">
			<div className="problem-page-header">
				<h1>{currentProblem.problem.title}</h1>
				<p
					className={`problem-difficulty ${currentProblem.problem.difficulty.toLowerCase()}`}
				>
					{currentProblem.difficulty}
				</p>
			</div>
			<div className="problem-description">
				<p>{currentProblem.problem.description}</p>
			</div>

			{/* Admin Actions */}
			{user && user.role === "admin" && (
				<div className="admin-actions">
					<button className="btn btn-edit">Edit</button>
					<button
						className="btn btn-delete"
						onClick={handleClickDelete}
					>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

export default Problem;
