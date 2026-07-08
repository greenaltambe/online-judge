# Judge Service

The Judge Service is a sandboxed environment built to safely compile and run untrusted user submissions. It prevents malicious code execution, handles runtime environments, enforces constraints, and records execution metrics.

---

## Docker Execution & Sandboxing

To run code safely, the Judge Service does not run user submissions on the host system. Instead, it spins up temporary, isolated Docker containers on demand.

### Sandbox Isolation
* **Network Isolation**: Containers are created with `--network=none` to prevent code from making network requests or interacting with internal infrastructure.
* **CPU Constraints**: CPU usage is capped (configurable via `MAX_CPU` in `.env`, e.g., `0.5` cores) to prevent container locks or CPU exhaustion.
* **Memory Constraints**: Memory limits are set (configurable via `MAX_MEMORY` in `.env`, e.g., `256m`). If code exceeds this limit, it is automatically terminated.
* **Privilege Level**: The container runs with minimal system privileges.

---

## Supported Languages

The Judge Service builds a dedicated base execution image (`oj-executor`) containing compilers and runtimes for the following languages:

| Language | Extension | Compiler / Interpreter | Command |
| :--- | :--- | :--- | :--- |
| **C++** | `.cpp` | `g++` (GCC) | `g++ /code/Main.cpp -o /code/main` |
| **Python** | `.py` | `python3` (Python 3.x) | `python3 /code/Main.py` |
| **Java** | `.java` | `openjdk-17` (Java 17) | `java -cp /code Main` |

---

## Execution Flow

For every code run request:
1. **File Setup**: Code is written to a temporary file (`Main.<ext>`) and inputs to `input.txt` inside a local `temp/` folder.
2. **Container Provisioning**: A container is created dynamically using the base executor image.
3. **File Copying**: Source code and input files are copied into the container via `docker cp`.
4. **Execution Run**: The Judge starts the container and runs the compiled binary or interpreter, passing `input.txt` via stdin. The command is prefixed with a timeout utility (`timeout 5s`).
5. **Metric Capturing**: The execution process runs under the system utility `/usr/bin/time` to measure resource consumption.
6. **Cleanup**: Once execution finishes (or terminates), the Judge retrieves the logs, reads the metrics file, deletes the Docker container, and cleans up the temporary files on the host filesystem.

---

## Verdicts

The Judge Service classifies low-level execution outcomes into the following verdicts based on process behavior:

* **Compile Error**: The compiler (`g++`, `javac`, or Python compiler check) returned a non-zero exit code. Compiler diagnostics are captured and returned.
* **Time Limit Exceeded**: The execution did not complete within the timeout threshold (`EXECUTION_TIMEOUT`), triggering a process termination.
* **Memory Limit Exceeded**: The container was terminated by the Docker daemon due to exceeding the memory limit (detected via `OOMKilled` state).
* **Runtime Error**: The program compiled but crashed during execution (exit code is non-zero).
* **Success**: The program executed to completion within limits and exited with code `0`.

> [!NOTE]
> The backend compares the raw output of successful executions against the expected output to yield final user-facing statuses such as **Accepted** or **Wrong Answer**.

---

## Performance Metrics

* **Runtime**: Tracked in milliseconds using system execution time.
* **Memory Usage**: Tracked in bytes by monitoring maximum resident set size during the run lifecycle.
