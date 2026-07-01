import { runInDocker } from "./dockerExecutor.js";

export default function executeCpp(code, input) {
  const timeoutSec = process.env.EXECUTION_TIMEOUT || "5";
  return runInDocker({
    code,
    input,
    ext: "cpp",
    command: `bash -c "g++ /code/Main.cpp -o /code/main && timeout ${timeoutSec}s /code/main < /code/input.txt"`,
  });
}

