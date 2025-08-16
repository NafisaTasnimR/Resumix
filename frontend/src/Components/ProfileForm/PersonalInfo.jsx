import React from 'react';
import CountryDropdown from './CountryDropdown';

const PersonalInfo = ({
  showAddressDetails,
  setShowAddressDetails,
  personalInfo,
  setPersonalInfo
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressClick = () => {
    setShowAddressDetails(true);
  };

  const handleCountrySelect = (country) => {
    setPersonalInfo((prev) => ({ ...prev, country }));
  };

  return (
    <>
      <div className="personal-info-header">
        <h2>Personal Information</h2>
        <div className="info-line3"></div>
      </div>

      <div className="form-fields">
        <div className="field-group">
          <label className="required">Name:</label>
          <input
            type="text"
            name="fullName"
            className="input-field"
            placeholder="Sal Khan"
            value={personalInfo.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label className="required">Email:</label>
          <input
            type="email"
            name="professionalEmail"
            className="input-field"
            placeholder="hello@khanacademy.org"
            value={personalInfo.professionalEmail}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            className="input-field"
            value={personalInfo.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label className="required">Phone:</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            placeholder="(123) 456-7890"
            value={personalInfo.phone}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            className={`input-field ${showAddressDetails ? 'expanded' : ''}`}
            placeholder="123 Main Street"
            value={personalInfo.address}
            onChange={handleChange}
            onClick={handleAddressClick}
          />
        </div>

        {showAddressDetails && (
          <div className="address-details">
            <div className="field-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                className="input-field city-field"
                placeholder="Mountain View"
                value={personalInfo.city}
                onChange={handleChange}
              />
            </div>

            <div className="field-row">
              <div className="field-group half-width">
                <label>District:</label>
                <input
                  type="text"
                  name="district"
                  className="input-field"
                  placeholder="Santa Clara County"
                  value={personalInfo.district}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group half-width">
                <label>Country:</label>
                <CountryDropdown
                  placeholder="Select Country"
                  onSelect={handleCountrySelect}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Zip Code:</label>
              <input
                type="text"
                name="zipCode"
                className="input-field"
                placeholder="94041"
                value={personalInfo.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalInfo;