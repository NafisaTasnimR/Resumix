import React, { useState } from 'react';
import './PaymentInfo.css';
import TopBar from '../ResumeEditorPage/TopBar';

import { useNavigate } from 'react-router-dom';

const PaymentInfo = () => {
 
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(3);
  const [cardNumber, setCardNumber] = useState('1234 5678 6789 7890');
  const [cvv, setCvv] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('MRITTIKA JAHAN');
  const [month, setMonth] = useState('Month');
  const [year, setYear] = useState('Year');

  // Sample data values for comparison
  const sampleData = {
    cardNumber: '1234 5678 6789 7890',
    cvv: '123',
    nameOnCard: 'MRITTIKA JAHAN'
  };

  const handleSubscription = () => {
    
    navigate('/m/final');
  };

  return (
    <div className="payment-container">
      <TopBar />
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Home page</span>
        </div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Choose Access</span>
        </div>
        <div className="step active" style={{color: '#007bff'}}>
        <div className="step-number" style={{backgroundColor: '#007bff', color: 'white'}}>3</div>
            <span>Payment Details</span>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <span>Finished!</span>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          {currentStep === 3 && (
            <div className="payment-form">
              <h2>Payment Information</h2>
              
              <div className="card-section">
                <div className="section-header">
                  <span>Card Information</span>
                  <div className="card-icons">
                    <img src="/Visa.jpg" alt="Visa" />
                    <img src="/MasterCard.jpg" alt="Mastercard" />
                    <img src="/JCB.jpg" alt="JCB" />
                    <img src="/AmericanExpress.jpg" alt="American Express" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group card-number">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 6789 7890"
                      className={cardNumber === sampleData.cardNumber ? 'sample-data' : ''}
                    />
                  </div>
                  <div className="form-group cvv">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className={cvv === sampleData.cvv ? 'sample-data' : ''}
                    />
                    <div className="info-icon">?</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Name On Card ✓</label>
                  <input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className={nameOnCard === sampleData.nameOnCard ? 'sample-data validated' : 'validated'}
                  />
                </div>

                <div className="form-group">
                  <label>Expiration Date</label>
                  <div className="form-row">
                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                      <option>Month</option>
                      <option>01</option>
                      <option>02</option>
                      <option>03</option>
                      <option>04</option>
                      <option>05</option>
                      <option>06</option>
                      <option>07</option>
                      <option>08</option>
                      <option>09</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                      <option>Year</option>
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                      <option>2029</option>
                      <option>2030</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="terms-section">
                <p>
                  By clicking "Get My Subscription" below you agree to be charged <strong>$1.70</strong> (which includes unlimited edits, downloads, and emails). You also agree to our Terms of Use and Privacy Policy. <strong></strong>
                </p>
              </div>

              <button 
                className="subscribe-btn"
                onClick={handleSubscription}
              >
                Get My Subscription
              </button>

              

              
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default PaymentInfo;