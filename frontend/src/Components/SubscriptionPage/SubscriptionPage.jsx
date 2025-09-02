import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TopBar from '../ResumeEditorPage/TopBar';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // Fetch subscription status on component mount
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      
      if (!token) {
        setSubscriptionStatus('free');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.hasActiveSubscription ? 'paid' : 'free');
        setSubscriptionData(data);
      } else {
        setSubscriptionStatus('free');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinue = () => {
    navigate('/m/payment', { state: { selectedPlan } });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: 0, padding: 0 }}>
        <TopBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
    
      <TopBar />
      
      {/* Progress Bar - Only show for FREE users */}
      {subscriptionStatus === 'free' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          padding: '20px 0',
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          marginTop: '80px'
        }}>
          <div 
            onClick={() => navigate('/postlogin/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0 30px',
              color: '#656d4a',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#656d4a',
              color: 'white'
            }}>✓</div>
            <span>Home Page</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 30px',
            color: '#007bff',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#007bff',
              color: 'white'
            }}>2</div>
            <span>Choose Access</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 30px',
            color: '#6c757d',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#e9ecef',
              color: '#6c757d'
            }}>3</div>
            <span>Payment Details</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 30px',
            color: '#6c757d',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#e9ecef',
              color: '#6c757d'
            }}>4</div>
            <span>Finished!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 20px 60px 20px',
        marginTop: subscriptionStatus === 'paid' ? '100px' : '0'
      }}>
        
        {/* Title changes based on subscription status */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#212529',
          marginBottom: '60px',
          lineHeight: 1.1
        }}>
          {subscriptionStatus === 'paid' ? 'Your Subscription' : 'Subscription Plans'}
        </h1>
        
        {/* FOR PRO USERS - Show current subscription details */}
        {subscriptionStatus === 'paid' && subscriptionData && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '80px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px 30px',
              width: '500px',
              border: '3px solid #28a745',
              boxShadow: '0 4px 20px rgba(40, 167, 69, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                ACTIVE SUBSCRIPTION
              </div>
              
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#212529',
                margin: '20px 0 10px 0'
              }}>PRO Access</h2>
              
              <p style={{
                fontSize: '1.1rem',
                color: '#6c757d',
                marginBottom: '30px'
              }}>
                Expires on {formatDate(subscriptionData.subscriptionEndDate)}
              </p>

              <div style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#28a745',
                marginBottom: '30px'
              }}>
                {subscriptionData.daysRemaining} days remaining
              </div>

              <div style={{ textAlign: 'left', marginTop: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  Unlimited Edits and Template Access
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  Unlimited use of ATS Checker
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  Unlimited Downloads
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  Personalized URL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOR FREE USERS - Show pricing plans */}
        {subscriptionStatus === 'free' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}>
            {/* Free User Plan */}
            <div 
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px 30px',
                width: '400px',
                position: 'relative',
                border: selectedPlan === 'free' ? '3px solid #6c7a3a' : '3px solid transparent',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => setSelectedPlan('free')}
            >
              <div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#212529',
                  margin: '20px 0 30px 0',
                  textAlign: 'center'
                }}>Free User</h2>
                
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 800,
                  color: '#6c757d',
                  textAlign: 'center',
                  marginBottom: '40px',
                  lineHeight: 1
                }}>
                  $0
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Basic resume builder access 
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Can Download Resumes 3 times
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Can use ATS Checker once only
                  </div>
                </div>
              </div>

              {/* Empty placeholder to match button height */}
              <div style={{ height: '52px' }}></div>
            </div>

            {/* 14-Day Access Plan */}
            <div 
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px 30px',
                width: '400px',
                position: 'relative',
                border: selectedPlan === '14-day' ? '3px solid #6c7a3a' : '3px solid transparent',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => setSelectedPlan('14-day')}
            >
              <div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#212529',
                  margin: '20px 0 30px 0',
                  textAlign: 'center'
                }}>14-Day Access</h2>
                
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 800,
                  color: '#6c7a3a',
                  textAlign: 'center',
                  marginBottom: '40px',
                  lineHeight: 1
                }}>$1.70</div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Unlimited Edits and Template Access
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Unlimited use of ATS Checker
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                    Unlimited Downloads
                  </div>
                </div>
              </div>

              <button 
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  backgroundColor: selectedPlan === '14-day' ? '#6c7a3a' : '#e9ecef',
                  color: selectedPlan === '14-day' ? 'white' : '#6c757d'
                }}
                onClick={(e) => {
                  e.stopPropagation(); 
                  setSelectedPlan('14-day');
                  handleContinue(); 
                }}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#212529',
            marginBottom: '60px'
          }}>
            {subscriptionStatus === 'paid' ? 'Your Pro Features' : 'What You Get With Your Subscription'}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'white',
              padding: '30px 20px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>📝</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '16px',
                lineHeight: 1.3
              }}>Unlimited Edits & Downloads</h3>
              <p style={{
                color: '#6c757d',
                lineHeight: 1.6,
                fontSize: '15px'
              }}>Edit and download your resume in PDF.</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 20px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>📄</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '16px',
                lineHeight: 1.3
              }}>All Templates &  Designs</h3>
              <p style={{
                color: '#6c757d',
                lineHeight: 1.6,
                fontSize: '15px'
              }}>Choose from professionally designed templates optimized to beat ATS systems</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 20px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>✅</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '16px',
                lineHeight: 1.3
              }}>Resume Check</h3>
              <p style={{
                color: '#6c757d',
                lineHeight: 1.6,
                fontSize: '15px'
              }}>Unlimited access to ATS Checker that checks  common issues and improvements</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 20px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px'
              }}>🔗</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '16px',
                lineHeight: 1.3
              }}>Personalized URL</h3>
              <p style={{
                color: '#6c757d',
                lineHeight: 1.6,
                fontSize: '15px'
              }}>Get a custom URL to share your professional profile with employers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;