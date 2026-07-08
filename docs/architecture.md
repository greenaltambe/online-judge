# Architecture

GreenCode is designed as a decoupled system featuring a modern frontend interface, a central API backend, and an isolated microservice for code execution.

---

## Component Overview

### Frontend
A single-page application (SPA) built using React and Vite. It serves as the primary user interface, rendering the problem dashboard, the interactive code editor, submission history, discussion boards, and user profile statistics.
* **Development Mode**: Served directly by Vite on port `5173`.
* **Production Mode**: Statically compiled and served by Nginx on port `80`, which also acts as a reverse proxy routing `/api` calls directly to the **Backend** service.

### Backend
A Node.js and Express server that implements the core business logic. It handles HTTP requests, authenticates users (JWT), manages problem metadata, processes problem imports, serves discussions/notes, and orchestrates code submissions.

### Judge Service
A standalone Node.js microservice focused entirely on compiling and running untrusted user submissions. To ensure security, execution occurs within isolated Docker containers containing restricted resources.

### Database
A MongoDB database configured to store persistent application state, including:
* User profiles and credentials.
* Problem metadata (titles, descriptions, difficulty, and sample test cases).
* Submission records (code, language, status, execution metrics).
* Discussion threads and private markdown user notes.

### Storage
An abstraction layer for storing actual test cases (large input/output files). It supports:
* **Local**: Filesystem storage inside a container volume.
* **MinIO**: Self-hosted object storage.
* **S3**: AWS S3 cloud storage.

---

## Request and Submission Flow

The following describes how data moves through the system when a user submits a coding solution:

1. **Submission Request**: The user enters their code in the frontend editor and clicks **Submit**. The frontend sends a POST request containing the code, language, and problem ID to the **Backend API**.
2. **Retrieve Test Cases**: The Backend retrieves the corresponding problem record from the **Database** and lists the test case files from the configured **Storage** (Local, MinIO, or S3).
3. **Trigger Execution**: For each test case, the Backend downloads the inputs/outputs and sends a POST request with the source code and input content to the **Judge Service**.
4. **Sandbox Run**: The Judge Service writes the source code to temporary files, creates an isolated Docker container with CPU and memory limits, copies the files in, and starts execution.
5. **Collect Metrics**: The execution output is captured, and performance statistics (runtime, memory usage) are collected from system metrics within the sandbox. The sandbox container is then deleted.
6. **Verdict Determination**: The Judge Service returns execution details (exit code, output, errors, execution stats) to the Backend. The Backend compares the output against the expected test output.
7. **Record Submission**: The Backend saves the final result (e.g., *Accepted*, *Wrong Answer*, *Time Limit Exceeded*, *Runtime Error*) and execution metrics in the **Database**.
8. **UI Update**: The Backend returns the submission results to the Frontend, which displays them to the user.
