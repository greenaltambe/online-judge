import React from "react";

const RunButtons = ({ handleRunSolution, handleSubmitSolution }) => {
  return (
    <div className="code-actions">
      <button
        className="action-btn run-btn"
        onClick={handleRunSolution}
      >
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
        </svg>
        Run Code
      </button>
      <button
        className="action-btn submit-btn"
        onClick={handleSubmitSolution}
      >
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M15.854.146a.5.5 0 0 1 0 .708L11.707 5l.647.646a.5.5 0 0 1-.708.708L11 5.707l-4.146 4.147a.5.5 0 0 1-.708-.708L10.293 5 9.646 4.354a.5.5 0 1 1 .708-.708L11 4.293l4.146-4.147a.5.5 0 0 1 .708 0z" />
          <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        </svg>
        Submit
      </button>
    </div>
  );
};

export default RunButtons;
