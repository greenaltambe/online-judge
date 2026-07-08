# Problem Importer

The GreenCode Importer allows administrators to add coding problems to the platform in batches or individually using structured ZIP packages. 

---

## GreenCode Problem Package

A problem package is a standard ZIP archive containing a metadata descriptor and test cases.

### Directory Layout
```text
├── problem.json
└── tests/
    ├── input_1.txt
    ├── output_1.txt
    ├── input_2.txt
    └── output_2.txt
```

### `problem.json` Schema
The JSON descriptor defines metadata for the problem.
* **`title`**: String. The name of the problem.
* **`description`**: String. Detailed problem statement (supports HTML/markdown).
* **`difficulty`**: String. Difficulty rating (must be `easy`, `medium`, or `hard`).
* **`tags`**: Array of strings. Topic tags (e.g. `arrays`, `math`, `strings`, etc.).
* **`testCases`**: Array of objects (optional). Used for sample tests shown on the UI:
  ```json
  [
    {
      "input": "2\n3",
      "expectedOutput": "5"
    }
  ]
  ```
  *If this field is empty, the importer auto-generates sample cases using the contents of `input_1.txt`/`output_1.txt` and `input_2.txt`/`output_2.txt`.*

---

## Import Modes

### Single Import
Used to upload a single problem. The ZIP file must contain the files (`problem.json` and the `tests/` directory) at the root level, or wrapped within a single top-level directory.

### Bulk Import
Used to upload multiple problems at once. The ZIP file must contain multiple subfolders at the root. Each subfolder represents a standalone problem package containing its own `problem.json` and `tests/` directory.

---

## Validation Rules

Before saving a problem, the importer performs strict validations:

### 1. Structural Checks
* The package must contain a `problem.json` file.
* A `tests/` directory must exist and contain at least one input/output file pair.

### 2. Metadata Checks
* The `title` and `description` must be non-empty strings.
* The `difficulty` must match one of the allowed categories: `easy`, `medium`, or `hard`.
* All tags in the `tags` array must map to valid tags defined on the platform.

### 3. Test Case Checks
* Test files in the `tests/` directory must follow the naming pattern `input_<id>.txt` and `output_<id>.txt`, where `<id>` is a positive integer.
* Every `input_<id>.txt` file must have a corresponding `output_<id>.txt` file, and vice-versa. Mismatched test files will trigger a validation error.
