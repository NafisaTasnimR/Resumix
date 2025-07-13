import React, { useState } from 'react';
import './UserDashboard.css';
import { Link } from 'react-router-dom'; 
import ShareResumeModal from '../ResumeListPage/ShareResumeModal';
import DownloadResumeModal from '../ResumeListPage/DownloadResumeModal';  
import DeleteConfirmationModal from '../ResumeListPage/DeleteConfirmationModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false); 
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeName, setResumeName] = useState('Nishat_Tasnim_Resume');
  const [downloadLink, setDownloadLink] = useState('https://myresume.com/resume12345.pdf'); 

  const resumes = [
    {
      name: 'Nishat_Tasnim_Resume',
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
    console.log(`Deleted resume: ${selectedResume.name}`);
    setIsModalOpen(false);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleDownloadClick = (resume) => {
    setResumeName(resume.name);
    setDownloadLink(`https://myresume.com/${resume.name}_Resume.pdf`);
    setIsDownloadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsShareModalOpen(false);
    setIsDownloadModalOpen(false); 
  };

  return (
    <div className="resume-fullpage">
      <div className="resume-header">
        <h2>My Resumes</h2>
        <div className="header-actions">
          <Link to="/resumebuilder" className="create-btn">Create New Resume</Link>
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
              <button onClick={() => handleDownloadClick(resume)}>Download</button>
              <button onClick={() => handleShareClick()}>Link</button>
              <button onClick={() => handleRemoveClick(resume)}>Remove</button>
            </span>
          </div>
        ))}
      </div>

      <ShareResumeModal 
        isOpen={isShareModalOpen} 
        onClose={handleCloseModal} 
      />
      <DownloadResumeModal 
        isOpen={isDownloadModalOpen} 
        onClose={handleCloseModal} 
        resumeName={resumeName} 
        downloadLink={downloadLink} 
      />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
