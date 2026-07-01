import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Runs code in a sandboxed Docker container using create, cp, start, and rm.
 * 
 * @param {Object} params
 * @param {string} params.code The source code to run
 * @param {string} params.input The input data for stdin
 * @param {string} params.ext The file extension (e.g. 'cpp', 'py', 'java')
 * @param {string} params.command The command to execute in the container
 * @returns {Promise<string>} The stdout of the execution
 */
export async function runInDocker({ code, input, ext, command }) {
  const jobId = uuidv4();
  const codeFile = path.join(TEMP_DIR, `Main_${jobId}.${ext}`);
  const inputFile = path.join(TEMP_DIR, `input_${jobId}.txt`);

  // Write temporary files inside the judge container
  fs.writeFileSync(codeFile, code);
  fs.writeFileSync(inputFile, input);

  let containerId = null;

  try {
    const maxMemory = process.env.MAX_MEMORY || "256m";
    const maxCpu = process.env.MAX_CPU || "0.5";

    // 1. Create the container
    const createCmd = `docker create --memory=${maxMemory} --cpus=${maxCpu} --network=none oj-executor ${command}`;
    const { stdout: createStdout } = await execPromise(createCmd);
    containerId = createStdout.trim();

    if (!containerId) {
      throw new Error("Failed to create docker container: No container ID returned");
    }

    // 2. Copy the files into the container, renaming them to Main.<ext> and input.txt
    await execPromise(`docker cp "${codeFile}" "${containerId}:/code/Main.${ext}"`);
    await execPromise(`docker cp "${inputFile}" "${containerId}:/code/input.txt"`);

    // 3. Start the container and attach to it to capture output
    const { stdout } = await execPromise(`docker start -a ${containerId}`, { timeout: 10000 });
    return stdout;
  } catch (error) {
    // Extract container output or fallback
    const stderr = error.stderr || "";
    const stdout = error.stdout || "";
    const errorMsg = stderr.trim() || stdout.trim() || error.message || "Unknown execution error";
    throw errorMsg;
  } finally {
    // 4. Remove the container
    if (containerId) {
      try {
        await execPromise(`docker rm -f ${containerId}`);
      } catch (rmError) {
        console.error(`Failed to remove container ${containerId}:`, rmError);
      }
    }

    // 5. Clean up local files
    try {
      if (fs.existsSync(codeFile)) fs.unlinkSync(codeFile);
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
    } catch (cleanupError) {
      console.error(`Failed to clean up files for job ${jobId}:`, cleanupError);
    }
  }
}
