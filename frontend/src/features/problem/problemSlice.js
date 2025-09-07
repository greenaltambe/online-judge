import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import problemService from "./problemService";

// Problem initial state
const initialState = {
	problems: [],
	currentProblem: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: "",
	runResult: null,
	submissions: null,
	submissionResult: null,
};

// Get problems
export const getProblems = createAsyncThunk(
	"problems/getAll",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.getProblems(token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

// Get single problem
export const getProblemById = createAsyncThunk(
	"problems/getById",
	async (id, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.getProblem(id, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const createProblem = createAsyncThunk(
	"problems/create",
	async (problemData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.createProblem(problemData, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const deleteProblem = createAsyncThunk(
	"problems/delete",
	async (id, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.deleteProblem(id, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const runSolution = createAsyncThunk(
	"problems/run",
	async (problemData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.runSolution(problemData, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const submitSolution = createAsyncThunk(
	"problems/submit",
	async (problemData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.submitSolution(problemData, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const getSubmissions = createAsyncThunk(
	"problems/getSubmissions",
	async (id, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await problemService.getSubmissions(id, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const problemsSlice = createSlice({
	name: "problems",
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProblems.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getProblems.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.problems = action.payload.problems;
			})
			.addCase(getProblems.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(createProblem.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createProblem.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.problems.push(action.payload);
			})
			.addCase(createProblem.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteProblem.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteProblem.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.problems = state.problems.filter(
					(problem) => problem._id !== action.payload.id
				);
			})
			.addCase(deleteProblem.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getProblemById.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getProblemById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.currentProblem = action.payload;
			})
			.addCase(getProblemById.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(runSolution.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(runSolution.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.runResult = action.payload;
			})
			.addCase(runSolution.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getSubmissions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getSubmissions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.submissions = action.payload;
			})
			.addCase(getSubmissions.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(submitSolution.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(submitSolution.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.submissionResult = action.payload;
			})
			.addCase(submitSolution.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.submissionResult = null;
			});
	},
});

export const { reset } = problemsSlice.actions;
export default problemsSlice.reducer;
