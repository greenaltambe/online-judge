import "./styles/Problem.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
	getProblemById,
	reset,
	deleteProblem,
} from "../features/problem/problemSlice";
import { toast } from "react-toastify";
import CodeEditor from "../components/CodeEditor";

const Problem = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("cpp");

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
					{currentProblem.problem.difficulty}
				</p>
			</div>
			<div className="problem-description">
				<p>{currentProblem.problem.description}</p>
			</div>

			<div className="test-cases-section">
				<h2>Example Test Cases</h2>
				<ul className="test-cases-list">
					{currentProblem.problem.testCases.map((testCase, index) => (
						<li key={index} className="test-case-item">
							<span className="test-case-label">
								Test Case {index + 1}:
							</span>
							<div className="test-case-line">
								<span className="test-case-label">Input:</span>
								<code className="code-inline">
									{testCase.input}
								</code>
							</div>
							<div className="test-case-line">
								<span className="test-case-label">
									Expected Output:
								</span>
								<code className="code-inline">
									{testCase.expectedOutput}
								</code>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="language-selector">
				<select
					value={language}
					onChange={(e) => setLanguage(e.target.value)}
				>
					<option value="cpp">C++</option>
					<option value="java">Java</option>
					<option value="python">Python</option>
				</select>
			</div>

			<CodeEditor code={code} setCode={setCode} language={language} />
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
