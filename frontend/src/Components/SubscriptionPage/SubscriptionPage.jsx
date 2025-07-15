import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import TopBar from '../ResumeEditorPage/TopBar';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const navigate = useNavigate(); 

  
  const handleContinue = () => {
    navigate('/m/payment', { state: { selectedPlan } });
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
    
  <TopBar />
  
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '0 30px',
        color: '#656d4a',
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
       

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 20px 60px 20px'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#212529',
          marginBottom: '60px',
          lineHeight: 1.1
        }}>Subscription Plans</h1>
        
        {/* Pricing Plans - Side by Side */}
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
                  Limited templates
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  Upgrade anytime
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
                  Unlimited Downloads
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '16px', lineHeight: 1.5, color: '#495057' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginTop: '2px' }}>✓</span>
                  <strong>Sharable URL</strong>
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

        {/* Features Section */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#212529',
            marginBottom: '60px'
          }}>What You Get With Your Subscription</h2>
          
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
              }}>Edit and download your resume in multiple formats including PDF, Word, RTF, and TXT</p>
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
              }}>18+ Templates & 600+ Designs</h3>
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
              }}>✏️</div>
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
              }}>ATS Checker that checks more than 30+ common issues and improvements</p>
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