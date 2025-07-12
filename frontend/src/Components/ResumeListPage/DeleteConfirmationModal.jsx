import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>x</button>
        <div className="modal-header">
          <h3>Are you sure you want to delete this Resume?</h3>
        </div>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="yes-btn" onClick={onDelete}>Yes, Delete</button>
          <button className="no-btn" onClick={onClose}>No, Do Not Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
