import React from "react";
import TestCasePanel from "./TestCasePanel";

const ProblemDescription = ({ description, testCases }) => {
  return (
    <>
      <div className="problem-description">
        <p>{description}</p>
      </div>
      {testCases && <TestCasePanel testCases={testCases} />}
    </>
  );
};

export default ProblemDescription;
