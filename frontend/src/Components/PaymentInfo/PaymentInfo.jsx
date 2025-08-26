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

const stripePromise = loadStripe('pk_test_51RzCd02YB6wMhtYr69r6wqhdRtBOqLSL5aPzPdhe9BJekE99TVZpNmeuDoB5tIqkLZIHiBZoHs2ErIvxR7bCT38D00EgvxLbGd');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [user, setUser] = useState({ name: '', email: '' }); // Still fetch but don't show
  const [loading, setLoading] = useState(true);

  const selectedPlan = location.state?.selectedPlan || '14-day';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Just call createPaymentIntent - it will handle everything
    createPaymentIntent();
    setLoading(false);
  };

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      
      if (response.ok) {
        setClientSecret(data.clientSecret);
        
        // Update user info with the REAL email from database (for backend use)
        if (data.userEmail && data.userName) {
          setUser({
            name: data.userName,
            email: data.userEmail
          });
        }
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment intent error:', error);
      setError('Failed to initialize payment');
      // Set fallback values if API fails
      setUser({
        name: 'Demo User',
        email: 'demo@example.com'
      });
    }
  };

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
          name: user.name,
          email: user.email,
        },
      }
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment succeeded - now confirm it and send email
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/payment/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id
          })
        });
        
        console.log('Payment confirmed and email sent');
      } catch (confirmError) {
        console.error('Error confirming payment:', confirmError);
        // Don't block navigation if confirmation fails
      }
      
      navigate('/m/final', { state: { paymentSuccess: true } });
    }
  };

  if (loading) {
    return (
      <div className="payment-form">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Payment Information</h2>
      
      {/* Removed user info display - data is still fetched for backend use */}
      
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