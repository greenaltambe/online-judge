import React from "react";

function TestCaseSection({
  testCases,
  handleTestCaseChange,
  removeTestCase,
  addTestCase,
}) {
  return (
    <div className="form-group">
      <label>Test Cases</label>
      {testCases.map((tc, index) => (
        <div key={index} className="testcase-row">
          <textarea
            name="input"
            placeholder="Input"
            value={tc.input}
            onChange={(e) => handleTestCaseChange(index, e)}
            className="testcase-input"
          />
          <textarea
            name="expectedOutput"
            placeholder="Expected Output"
            value={tc.expectedOutput}
            onChange={(e) => handleTestCaseChange(index, e)}
            className="testcase-output"
          />
          <button
            type="button"
            onClick={() => removeTestCase(index)}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addTestCase}
        className="btn-add-testcase"
      >
        + Add Test Case
      </button>
    </div>
  );
}

export default TestCaseSection;
