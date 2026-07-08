# GreenCode

GreenCode is an open-source online judge platform designed for practicing coding problems, running real-time tests, and submitting solutions. The system executes user submissions inside a sandboxed environment to assess code correctness, execution time, and memory usage.

## Features

### Problem Solving
* **Multi-Language Code Execution**: Support for C++, Python, and Java.
* **Interactive Editor**: Integrated code editor with syntax highlighting and theme support.
* **Real-Time Verification**: Run code against sample tests or submit for full test suite validation.

### Learning Features
* **Private Notes**: Maintain personal markdown notes for each problem.
* **Performance Insights**: View detailed run times, memory usage metrics, and compilation errors.

### Community Features
* **Discussion Forums**: Share solutions and discuss approaches directly under each problem.
* **Curated Playlists**: Group and star problems to create custom lists.

### Admin Features
* **Problem Package Import**: Import single or bulk problems using structured ZIP files.
* **Management Console**: Control database records, uploads, and execution settings.

### Platform
* **Authentication**: Secure user signup and sign-in using JWT tokens.
* **Storage Options**: Support for local directories, MinIO, or AWS S3.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Judge** | Node.js, Express, Docker |
| **Storage** | Local, MinIO, AWS S3 |
| **Containerization** | Docker, Docker Compose |
| **UI Library** | Mantine UI |

## Project Structure

* **`backend/`**: Express API server managing users, problems, submissions, discussions, notes, and file storage.
* **`frontend/`**: Vite-based React client interface styled with Mantine UI.
* **`judge/`**: Isolated execution service that receives user code and evaluates it within sandboxed containers.
* **`scripts/`**: Automation scripts to build, start, stop, and reset the platform containers.

## Getting Started

### Prerequisites

* Docker and Docker Compose
* Bash shell

### Setup and Execution

1. **Clone the Repository**
   ```bash
   git clone https://github.com/greenaltambe/online-judge.git
   cd online-judge
   ```

2. **Configure Environment Variables**
   Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Modify the `.env` file to configure secrets, storage options, and ports. For production execution, create a `.env.production` file following the same format.

3. **Start the Application in Development Mode**
   Build the executor image and run all services in the foreground:
   ```bash
   ./scripts/dev.sh
   ```
   *The dev frontend will be accessible at `http://localhost:5173`, the backend at `http://localhost:5000`, and the judge service at `http://localhost:5010`.*

4. **Start the Application in Production Mode**
   Build and start the application in the background utilizing production configurations:
   ```bash
   ./scripts/prod.sh
   ```
   *The production site is served using Nginx on port `80`, proxying API requests to the backend.*

5. **Resume/Start Stopped Containers**
   ```bash
   ./scripts/start.sh
   ```

6. **Stop the Application**
   ```bash
   ./scripts/stop.sh
   ```

7. **Reset Containers and Volumes**
   To delete all database records, cached volumes, and uploads:
   ```bash
   ./scripts/reset.sh
   ```

## Environment Variables

The root `.env` (or `.env.production` in production) file contains settings categorized as follows:
* **Environment**: Platform mode (`NODE_ENV`).
* **JWT**: Secret keys and expiration limits for user authentication.
* **Judge Authentication**: Shared token for secure backend-to-judge communication.
* **Storage Configuration**: Local, MinIO, or S3 toggle.
* **Storage Credentials**: Credentials for MinIO and AWS S3 connections.
* **Frontend**: API connection URLs for Vite.

## Problem Import

Problems can be imported using standard ZIP archives.

### Single Problem Import
A single problem ZIP archive must contain a single root folder (or files directly at the root) with this structure:
```text
├── problem.json
└── tests/
    ├── input_1.txt
    ├── output_1.txt
    ├── input_2.txt
    └── output_2.txt
```

### Bulk Import
A bulk import ZIP archive must contain multiple problem directories at the root level, each matching the Single Problem Import format:
```text
├── problem-one/
│   ├── problem.json
│   └── tests/
│       ├── input_1.txt
│       └── output_1.txt
└── problem-two/
    ├── problem.json
    └── tests/
        ├── input_1.txt
        └── output_1.txt
```

## Screenshots

### Problem Dashboard

### Code Editor & Execution Panel

### Discussion Thread

### Admin Import Console