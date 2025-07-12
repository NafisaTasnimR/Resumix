import React, { useState } from 'react';
import './PaymentInfo.css';

const PaymentInfo = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [cardNumber, setCardNumber] = useState('1234 5678 6789 7890');
  const [cvv, setCvv] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('MRITTIKA JAHAN');
  const [month, setMonth] = useState('Month');
  const [year, setYear] = useState('Year');

  return (
    <div className="payment-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Builder</span>
        </div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span>Choose Access</span>
        </div>
        <div className="step active">
          <div className="step-number">3</div>
          <span>PAYMENT DETAILS</span>
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
                    <img src="/Paypal.jpg" alt="Paypal" />
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
                    />
                  </div>
                  <div className="form-group cvv">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
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
                    className="validated"
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
                  By clicking "Get My Subscription" below you agree to be charged $1.70 (which includes unlimited edits, downloads, and emails). You also agree to our Terms of Use and Privacy Policy. After 14 days you will be billed $23.95 every 4 weeks until your subscription ends. <strong>you can cancel at any time</strong>
                </p>
              </div>

              <button className="subscribe-btn">Get My Subscription</button>

              <div className="secure-checkout">
                <span className="lock-icon">🔒</span>
                <span>SECURE CHECKOUT</span>
                <span className="powered-by">DigiCert</span>
              </div>

              <div className="cancel-section">
                <h3>How Would I Cancel?</h3>
                <p>
                  We'd be sorry to see you go! You can cancel at any time online or by phone. If you're not satisfied during your 14 days trial, let us know and we'll refund your money.
                </p>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default PaymentInfo;