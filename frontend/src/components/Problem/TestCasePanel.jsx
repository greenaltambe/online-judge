import React from "react";

const TestCasePanel = ({ testCases }) => {
  return (
    <div className="examples-section">
      <h3>Examples</h3>
      {testCases.map((testCase, index) => (
        <div key={index} className="example-box">
          <div className="example-header">
            <strong>Example {index + 1}</strong>
          </div>
          <div className="example-content">
            <div className="io-section">
              <div className="io-label">Input:</div>
              <code className="io-value">{testCase.input}</code>
            </div>
            <div className="io-section">
              <div className="io-label">Output:</div>
              <code className="io-value">{testCase.expectedOutput}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCasePanel;
