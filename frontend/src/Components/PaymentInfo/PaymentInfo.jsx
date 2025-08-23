import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import TopBar from '../ResumeEditorPage/TopBar';
import './PaymentInfo.css';



const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Get the selected plan from navigation state
  const selectedPlan = location.state?.selectedPlan || '14-day';

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
   fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: 'Demo User',
        },
      }
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // For demo purposes, we'll navigate to success regardless
      navigate('/m/final', { state: { paymentSuccess: true } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
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

        <div className="form-group">
          <label>Card Details</label>
          <div className="stripe-card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="terms-section">
        <p>
          By clicking "Get My Subscription" below you agree to be charged <strong>$1.70</strong> 
          (which includes unlimited edits, downloads, and emails). You also agree to our Terms of 
          Use and Privacy Policy.
        </p>
      </div>

      <button 
        className="subscribe-btn"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : 'Get My Subscription'}
      </button>
    </form>
  );
};

const PaymentInfo = () => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  return (
    <div className="payment-container">
      <TopBar />
      
      {/* Progress Steps */}
      <div className="progress-steps">
        <div 
          className="step completed"
          onClick={() => navigate('/postlogin/')}
          style={{cursor: 'pointer'}}
        >
          <div className="step-icon">✓</div>
          <span>Home page</span>
        </div>
        <div 
          className="step completed"
          onClick={() => navigate('/subscription')}
          style={{cursor: 'pointer'}}
        >
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
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
