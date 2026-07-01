import { runInDocker } from "./dockerExecutor.js";

export default function executePython(code, input) {
  const timeoutSec = process.env.EXECUTION_TIMEOUT || "5";
  return runInDocker({
    code,
    input,
    ext: "py",
    command: `bash -c "timeout ${timeoutSec}s python3 /code/Main.py < /code/input.txt"`,
  });
}
