import express from "express";
import executeCpp from "./executors/cppExecutor.js";
import executeJava from "./executors/javaExecutor.js";
import executePython from "./executors/pythonExecutor.js";

const app = express();

app.use(express.json());

app.post("/run", async (req, res) => {
	const { code, language, input } = req.body;
	let output = null;
	let errorMsg = null;

	try {
		if (language === "cpp") {
			output = await executeCpp(code, input);
		} else if (language === "python") {
			output = await executePython(code, input);
		} else if (language === "java") {
			output = await executeJava(code, input);
		} else {
			errorMsg = "Invalid language";
		}
	} catch (error) {
		errorMsg = error?.toString() || "Unknown error occurred";
	}

	res.status(200).json({
		output: output || null,
		error: errorMsg || null,
	});
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
