import React, { useState } from 'react';
import './ResumeListPage.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';  

const ResumeListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const resumes = [
    {
      name: 'Nishat_Tasnim_R...',
      modificationDate: '5/16/2025',
      creationDate: '5/14/2025',
      strength: 45,
    },
    
  ];

  const handleRemoveClick = (resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    // Simulate the delete action 
    console.log(`Deleted resume: ${selectedResume.name}`);
    setIsModalOpen(false);

  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="resume-fullpage">
      <div className="resume-header">
        <h2>My Resumes</h2>
        <div className="header-actions">
          <button className="create-btn">Create New Resume</button>
        </div>
      </div>

      <div className="resume-table">
        <div className="resume-table-header">
          <span>MY RESUMES</span>
          <span>MODIFICATION</span>
          <span>CREATION</span>
          <span>STRENGTH</span>
          <span>ACTIONS</span>
        </div>
        {resumes.map((resume, index) => (
          <div className="resume-table-row" key={index}>
            <span>{resume.name}</span>
            <span>{resume.modificationDate}</span>
            <span>{resume.creationDate}</span>
            <span className="strength-badge">{resume.strength}</span>

            <span className="actions">
              <button>Edit</button>
              <button>Download</button>
              <button>Link</button>
              <button onClick={() => handleRemoveClick(resume)}>Remove</button>
            </span>
          </div>
        ))}
      </div>

   
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ResumeListPage;