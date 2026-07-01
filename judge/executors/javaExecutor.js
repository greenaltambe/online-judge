import { runInDocker } from "./dockerExecutor.js";

export default function executeJava(code, input) {
  const timeoutSec = process.env.EXECUTION_TIMEOUT || "5";
  return runInDocker({
    code,
    input,
    ext: "java",
    command: `bash -c "javac /code/Main.java && timeout ${timeoutSec}s java -cp /code Main < /code/input.txt"`,
  });
}

