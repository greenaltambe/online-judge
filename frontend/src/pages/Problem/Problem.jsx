import "./Problem.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/Common/Spinner";
import { useAuthStore } from "../../stores/authStore";
import { useProblemStore } from "../../stores/problemStore";
import { useSubmissionStore } from "../../stores/submissionStore";
import { toast } from "react-toastify";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import LanguageSelector from "../../components/CodeEditor/LanguageSelector";
import RunButtons from "../../components/CodeEditor/RunButtons";
import ProblemDescription from "../../components/Problem/ProblemDescription";
import SubmissionResult from "../../components/Problem/SubmissionResult";

const Problem = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("cpp");
	const [activeTab, setActiveTab] = useState("description");

	const user = useAuthStore((state) => state.user);
	const {
		currentProblem,
		getProblemById,
		deleteProblem,
		reset: resetProblem,
		isLoading: isProblemLoading,
		isError: isProblemError,
		message: problemMessage,
	} = useProblemStore();

	const {
		runResult,
		submissionResult,
		runSolution,
		submitSolution,
		reset: resetSubmission,
		isLoading: isSubmissionLoading,
		isError: isSubmissionError,
		message: submissionMessage,
	} = useSubmissionStore();

	const handleClickDelete = async () => {
		await deleteProblem(id);
		toast.success("Problem deleted");
		navigate("/problems");
	};

	const handleRunSolution = () => {
		const payload = {
			problemId: id,
			language: language,
			code: code,
		};
		runSolution(payload);
	};

	const handleSubmitSolution = () => {
		const payload = {
			problemId: id,
			language: language,
			code: code,
		};
		submitSolution(payload);
	};

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}
		getProblemById(id);

		return () => {
			resetProblem();
			resetSubmission();
		};
	}, [id, user, navigate, getProblemById, resetProblem, resetSubmission]);

	useEffect(() => {
		if (isProblemError) {
			toast.error(problemMessage);
		}
	}, [isProblemError, problemMessage]);

	useEffect(() => {
		if (isSubmissionError) {
			toast.error(submissionMessage);
		}
	}, [isSubmissionError, submissionMessage]);

	const isLoading = isProblemLoading || isSubmissionLoading;

	if (isLoading) {
		return <Spinner />;
	}

	if (!currentProblem && !isProblemLoading) {
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
							<ProblemDescription
								description={currentProblem.problem.description}
								testCases={currentProblem.problem.testCases}
							/>
							<SubmissionResult
								runResult={runResult}
								submissionResult={submissionResult}
							/>
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
					<LanguageSelector
						language={language}
						setLanguage={setLanguage}
					/>
				</div>

				<div className="code-editor-container">
					<CodeEditor
						code={code}
						setCode={setCode}
						language={language}
					/>
				</div>

				<RunButtons
					handleRunSolution={handleRunSolution}
					handleSubmitSolution={handleSubmitSolution}
				/>
			</div>
		</div>
	);
};

export default Problem;
