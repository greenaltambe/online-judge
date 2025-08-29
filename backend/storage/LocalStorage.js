import fs from "fs";
import path from "path";

class LocalStorage {
	constructor(basePath) {
		this.basePath = basePath;
	}

	getInputStream(problemId, inputFileName) {
		const inputPath = path.join(this.basePath, problemId, inputFileName);
		if (!fs.existsSync(inputPath)) {
			throw new Error(`Input file not found: ${inputPath}`);
		}
		return fs.createReadStream(inputPath, { encoding: "utf-8" });
	}

	getOutputStream(problemId, outputFileName) {
		const outputPath = path.join(this.basePath, problemId, outputFileName);
		if (!fs.existsSync(outputPath)) {
			throw new Error(`Output file not found: ${outputPath}`);
		}
		return fs.createReadStream(outputPath, { encoding: "utf-8" });
	}

	listTestCases(problemId) {
		const problemPath = path.join(this.basePath, problemId);
		if (!fs.existsSync(problemPath)) return [];
		const files = fs.readdirSync(problemPath);
		const testCases = [];
		files.forEach((file) => {
			if (file.startsWith("input_")) {
				const num = file.match(/\d+/)[0];
				const outputFile = `output_${num}.txt`;
				if (files.includes(outputFile)) {
					testCases.push({ input: file, output: outputFile });
				}
			}
		});
		return testCases;
	}
}

export default LocalStorage;
