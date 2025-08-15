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

export default function executePython(code, input) {
	return new Promise((resolve, reject) => {
		const jobId = uuidv4();
		const codeFile = path.join(TEMP_DIR, `${jobId}.py`);
		const inputFile = path.join(TEMP_DIR, `${jobId}.txt`);

		fs.writeFileSync(codeFile, code);
		fs.writeFileSync(inputFile, input);

		const dockerCommand = `
            docker run --rm \
            --memory=256m \
            --cpus=0.5 \
            --network=none \
            -v ${TEMP_DIR}:/code \
            judge \
            bash -c "timeout 5s python3 /code/${jobId}.py < /code/${jobId}.txt"
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
		path.join(TEMP_DIR, `${jobId}.py`),
		path.join(TEMP_DIR, `${jobId}.txt`),
	];
	files.forEach((f) => {
		if (fs.existsSync(f)) fs.unlinkSync(f);
	});
}
