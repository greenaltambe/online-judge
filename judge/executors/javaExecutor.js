import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) {
	fs.mkdirSync(TEMP_DIR);
}

export default function executeJava(code, input) {
	return new Promise((resolve, reject) => {
		const jobId = uuidv4();
		const javaFile = path.join(TEMP_DIR, `Main.java`); // Fixed filename
		const inputFile = path.join(TEMP_DIR, `${jobId}.txt`);

		fs.writeFileSync(javaFile, code);
		fs.writeFileSync(inputFile, input);

		const dockerCommand = `
			docker run --rm \
			--memory=256m \
			--cpus=0.5 \
			--network=none \
			-v ${TEMP_DIR}:/code \
			judge \
			bash -c "javac /code/Main.java && timeout 5s java -cp /code Main < /code/${jobId}.txt"
		`;

		exec(dockerCommand, { timeout: 10000 }, (error, stdout, stderr) => {
			cleanup(jobId);
			if (error) {
				return reject(
					(stderr && stderr.trim()) ||
						(stdout && stdout.trim()) ||
						error.message ||
						"Unknown execution error"
				);
			}
			resolve(stdout);
		});
	});
}

function cleanup(jobId) {
	const files = [
		path.join(TEMP_DIR, `Main_${jobId}.java`),
		path.join(TEMP_DIR, `${jobId}.txt`),
		path.join(TEMP_DIR, `Main_${jobId}.class`),
	];
	files.forEach((f) => {
		if (fs.existsSync(f)) fs.unlinkSync(f);
	});
}
