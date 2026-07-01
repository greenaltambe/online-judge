import React from "react";

function BasicInfoSection({ title, description, difficulty, onChange }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows="5"
          value={description}
          onChange={onChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="difficulty">Difficulty</label>
        <select
          name="difficulty"
          id="difficulty"
          value={difficulty}
          onChange={onChange}
          className="form-control"
        >
          <option value="">-- Select Difficulty --</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </>
  );
}

export default BasicInfoSection;
