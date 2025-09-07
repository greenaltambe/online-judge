import "./styles/Problem.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
	getProblemById,
	reset,
	deleteProblem,
	runSolution,
	submitSolution,
} from "../features/problem/problemSlice";
import { toast } from "react-toastify";
import CodeEditor from "../components/CodeEditor";

const Problem = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("cpp");
	const [activeTab, setActiveTab] = useState("description");

	const { user } = useSelector((state) => state.auth);
	const {
		currentProblem,
		isLoading,
		isError,
		message,
		runResult,
		submissionResult,
	} = useSelector((state) => state.problems);

	const handleClickDelete = () => {
		dispatch(deleteProblem(id));
		toast.success("Problem deleted");
		navigate("/problems");
	};

	const handleRunSolution = () => {
		const payload = {
			problemId: id,
			language: language,
			code: code,
		};
		dispatch(runSolution(payload));
	};

	const handleSubmitSolution = () => {
		const payload = {
			problemId: id,
			language: language,
			code: code,
		};
		dispatch(submitSolution(payload));
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
		<div className="leetcode-container">
			{/* Left Panel - Problem Description */}
			<div className="problem-panel">
				<div className="problem-header">
					<div className="problem-title-section">
						<h1 className="problem-title">
							{currentProblem.problem.title}
						</h1>
						<span
							className={`difficulty-badge difficulty-${currentProblem.problem.difficulty.toLowerCase()}`}
						>
							{currentProblem.problem.difficulty}
						</span>
					</div>

					{user && user.role === "admin" && (
						<div className="admin-controls">
							<button className="admin-btn edit-btn">
								<svg
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L14.5 5.207l-3-3L12.146.146zM11.207 1.5L1.5 11.207V14.5h3.293L14.5 4.793l-3.293-3.293z" />
								</svg>
								Edit
							</button>
							<button
								className="admin-btn delete-btn"
								onClick={handleClickDelete}
							>
								<svg
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
									<path
										fillRule="evenodd"
										d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
									/>
								</svg>
								Delete
							</button>
						</div>
					)}
				</div>

				<div className="problem-tabs">
					<button
						className={`tab-btn ${
							activeTab === "description" ? "active" : ""
						}`}
						onClick={() => setActiveTab("description")}
					>
						Description
					</button>
					<button
						className={`tab-btn ${
							activeTab === "submissions" ? "active" : ""
						}`}
						onClick={() => setActiveTab("submissions")}
					>
						Submissions
					</button>
				</div>

				<div className="problem-content">
					{activeTab === "description" && (
						<>
							<div className="problem-description">
								<p>{currentProblem.problem.description}</p>
							</div>

							<div className="examples-section">
								<h3>Examples</h3>
								{currentProblem.problem.testCases.map(
									(testCase, index) => (
										<div
											key={index}
											className="example-box"
										>
											<div className="example-header">
												<strong>
													Example {index + 1}
												</strong>
											</div>
											<div className="example-content">
												<div className="io-section">
													<div className="io-label">
														Input:
													</div>
													<code className="io-value">
														{testCase.input}
													</code>
												</div>
												<div className="io-section">
													<div className="io-label">
														Output:
													</div>
													<code className="io-value">
														{
															testCase.expectedOutput
														}
													</code>
												</div>
											</div>
										</div>
									)
								)}
							</div>

							{/* Run Results */}
							{runResult && (
								<div className="results-section">
									<h3>Test Results</h3>
									{runResult.response.map((res, index) => (
										<div
											key={index}
											className={`result-box ${
												res.passed ? "passed" : "failed"
											}`}
										>
											<div className="result-header">
												<span>
													Test Case {index + 1}
												</span>
												<span
													className={`status-badge ${
														res.passed
															? "pass"
															: "fail"
													}`}
												>
													{res.passed
														? "✓ Passed"
														: "✗ Failed"}
												</span>
											</div>
											<div className="result-content">
												<div className="io-section">
													<div className="io-label">
														Input:
													</div>
													<code className="io-value">
														{res.input}
													</code>
												</div>
												<div className="io-section">
													<div className="io-label">
														Expected:
													</div>
													<code className="io-value">
														{res.expectedOutput}
													</code>
												</div>
												<div className="io-section">
													<div className="io-label">
														Your Output:
													</div>
													<code className="io-value">
														{res.output}
													</code>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Submission Results */}
							{submissionResult && (
								<div className="results-section">
									<h3>Submission Result</h3>
									{submissionResult.status ? (
										<div className="submission-success">
											<div className="submission-status">
												Status:{" "}
												<strong>
													{submissionResult.status}
												</strong>
											</div>
											{submissionResult.results?.map(
												(r, i) => (
													<div
														key={i}
														className={`result-box ${
															r.passed
																? "passed"
																: "failed"
														}`}
													>
														<div className="result-content">
															<div className="io-section">
																<div className="io-label">
																	Input:
																</div>
																<code className="io-value">
																	{r.input}
																</code>
															</div>
															<div className="io-section">
																<div className="io-label">
																	Expected:
																</div>
																<code className="io-value">
																	{
																		r.expectedOutput
																	}
																</code>
															</div>
															<div className="io-section">
																<div className="io-label">
																	Output:
																</div>
																<code className="io-value">
																	{r.output}
																</code>
															</div>
															<div className="result-status">
																{r.passed
																	? "✅ Passed"
																	: "❌ Failed"}
															</div>
														</div>
													</div>
												)
											)}
										</div>
									) : (
										<div className="submission-error">
											Error:{" "}
											{submissionResult.message ||
												"Unknown error"}
										</div>
									)}
								</div>
							)}
						</>
					)}

					{activeTab === "submissions" && (
						<div className="submissions-content">
							<button
								className="view-submissions-btn"
								onClick={() => navigate(`/${id}/submissions`)}
							>
								View All Submissions
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Right Panel - Code Editor */}
			<div className="code-panel">
				<div className="code-header">
					<div className="language-selector">
						<select
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							className="language-select"
						>
							<option value="cpp">C++</option>
							<option value="java">Java</option>
							<option value="python">Python</option>
						</select>
					</div>
				</div>

				<div className="code-editor-container">
					<CodeEditor
						code={code}
						setCode={setCode}
						language={language}
					/>
				</div>

				<div className="code-actions">
					<button
						className="action-btn run-btn"
						onClick={handleRunSolution}
					>
						<svg
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
						</svg>
						Run Code
					</button>
					<button
						className="action-btn submit-btn"
						onClick={handleSubmitSolution}
					>
						<svg
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M15.854.146a.5.5 0 0 1 0 .708L11.707 5l.647.646a.5.5 0 0 1-.708.708L11 5.707l-4.146 4.147a.5.5 0 0 1-.708-.708L10.293 5 9.646 4.354a.5.5 0 1 1 .708-.708L11 4.293l4.146-4.147a.5.5 0 0 1 .708 0z" />
							<path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
						</svg>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default Problem;
