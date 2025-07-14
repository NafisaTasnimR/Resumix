import React from 'react';

const PersonalInfo = ({ showAddressDetails, setShowAddressDetails }) => {
  const handleAddressClick = () => {
    setShowAddressDetails(true);
  };

  return (
    <>
      <div className="personal-info-header">
        <h2>Personal Information</h2>
        <div className="info-line"></div>
      </div>

      <div className="form-fields">
        <div className="field-group">
          <label>Name:</label>
          <input type="text" className="input-field" placeholder="Sal Khan" />
        </div>

        <div className="field-group">
          <label>Email:</label>
          <input type="email" className="input-field" placeholder="hello@khanacademy.org" />
        </div>

        <div className="field-group">
          <label>Date of Birth:</label>
          <input type="date" className="input-field" placeholder="1976-10-11" />
        </div>

        <div className="field-group">
          <label>Phone:</label>
          <input type="tel" className="input-field" placeholder="(123) 456-7890" />
        </div>

        <div className="field-group">
          <label>Address:</label>
          <input 
            type="text" 
            className={`input-field ${showAddressDetails ? 'expanded' : ''}`}
            onClick={handleAddressClick}
            placeholder="123 Main Street"
          />
        </div>

        {showAddressDetails && (
          <div className="address-details">
            <div className="field-group">
              <label>City:</label>
              <input type="text" className="input-field city-field" placeholder="Mountain View" />
            </div>

            <div className="field-row">
              <div className="field-group half-width">
                <label>District:</label>
                <input type="text" className="input-field" placeholder="Santa Clara County" />
              </div>
              <div className="field-group half-width">
                <label>Country:</label>
                <input type="text" className="input-field" placeholder="USA" />
              </div>
            </div>

            <div className="field-group">
              <label>Zip Code:</label>
              <input type="text" className="input-field" placeholder="94041" />
            </div>

            <div className="field-group">
              <label>Country:</label>
              <input type="text" className="input-field" placeholder="United States" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalInfo;