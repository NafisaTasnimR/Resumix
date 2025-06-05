import React from "react";

const Preview = ({ title, answers = [] }) => (
  <div className="preview">
    <div className="preview-box">
      <h1 className="resume-title">{title}</h1>
      <section>
        <h2>Work Experience</h2>
        <p>{answers[0]?.trim() ? answers[0] : <span className="placeholder">No work experience added yet.</span>}</p>
      </section>
      <section>
        <h2>Education</h2>
        <p>{answers[1]?.trim() ? answers[1] : <span className="placeholder">No education details added yet.</span>}</p>
      </section>
      <section>
        <h2>Skills</h2>
        <p>{answers[2]?.trim() ? answers[2] : <span className="placeholder">No skills added yet.</span>}</p>
      </section>
      <section>
        <h2>Projects</h2>
        <p>{answers[3]?.trim() ? answers[3] : <span className="placeholder">No projects added yet.</span>}</p>
      </section>
    </div>
  </div>
);

export default Preview;