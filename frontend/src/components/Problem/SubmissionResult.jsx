import React from "react";

const SubmissionResult = ({ runResult, submissionResult }) => {
  return (
    <>
      {/* Run Results */}
      {runResult && (
        <div className="results-section">
          <h3>Test Results</h3>
          {runResult.response.map((res, index) => (
            <div
              key={index}
              className={`result-box ${res.passed ? "passed" : "failed"}`}
            >
              <div className="result-header">
                <span>Test Case {index + 1}</span>
                <span className={`status-badge ${res.passed ? "pass" : "fail"}`}>
                  {res.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              <div className="result-content">
                <div className="io-section">
                  <div className="io-label">Input:</div>
                  <code className="io-value">{res.input}</code>
                </div>
                <div className="io-section">
                  <div className="io-label">Expected:</div>
                  <code className="io-value">{res.expectedOutput}</code>
                </div>
                <div className="io-section">
                  <div className="io-label">Your Output:</div>
                  <code className="io-value">{res.output}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Results */}
      {submissionResult && (
        <div className="results-section">
          <h3>Submission Result</h3>
          {submissionResult.status ? (
            <div className="submission-success">
              <div className="submission-status">
                Status: <strong>{submissionResult.status}</strong>
              </div>
              {submissionResult.results?.map((r, i) => (
                <div
                  key={i}
                  className={`result-box ${r.passed ? "passed" : "failed"}`}
                >
                  <div className="result-content">
                    <div className="io-section">
                      <div className="io-label">Input:</div>
                      <code className="io-value">{r.input}</code>
                    </div>
                    <div className="io-section">
                      <div className="io-label">Expected:</div>
                      <code className="io-value">{r.expectedOutput}</code>
                    </div>
                    <div className="io-section">
                      <div className="io-label">Output:</div>
                      <code className="io-value">{r.output}</code>
                    </div>
                    <div className="result-status">
                      {r.passed ? "✅ Passed" : "❌ Failed"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="submission-error">
              Error: {submissionResult.message || "Unknown error"}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SubmissionResult;
