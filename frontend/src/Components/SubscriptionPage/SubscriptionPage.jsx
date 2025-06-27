import React, { useState } from 'react';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('14-day');

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '30px 20px',
        borderBottom: '1px solid #e9ecef',
        gap: '60px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 1
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: '#6c7a3a',
            color: 'white'
          }}>✓</div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#495057'
          }}>HOME PAGE</span>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 1
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white'
          }}>2</div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#495057'
          }}>CHOOSE ACCESS</span>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.4
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: '#e9ecef',
            color: '#6c757d'
          }}>3</div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#495057'
          }}>PAYMENT DETAILS</span>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.4
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: '#e9ecef',
            color: '#6c757d'
          }}>4</div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: '#495057'
          }}>FINISHED!</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#212529',
          marginBottom: '60px',
          lineHeight: 1.1
        }}>Subscription Plans</h1>
        
        {/* Pricing Plans */}
        <div style={{
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: '0 auto 80px auto',
          width: '100%',
          maxWidth: '900px'
        }}>
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
              cursor: 'pointer'
            }}
            onClick={() => setSelectedPlan('14-day')}
          >
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#6c7a3a',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>MOST POPULAR</div>
            
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
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                Create matching cover letters
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                After 14 days, auto-renews at $23.95 billed every 4 weeks
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                <strong>Cancel anytime</strong>
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
              onClick={() => setSelectedPlan('14-day')}
            >
              CONTINUE
            </button>
          </div>

          {/* Annual Access Plan */}
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px 30px',
              width: '400px',
              position: 'relative',
              border: selectedPlan === 'annual' ? '3px solid #6c7a3a' : '3px solid transparent',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedPlan('annual')}
          >
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#212529',
              margin: '20px 0 30px 0',
              textAlign: 'center'
            }}>Annual Access</h2>
            
            <div style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#6c7a3a',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: 1
            }}>
              $5.95
              <span style={{
                fontSize: '1.2rem',
                color: '#6c757d',
                fontWeight: 400
              }}>/month</span>
            </div>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                Priority customer support
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                Early access to new features
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                No auto-renewal surprises
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#495057'
              }}>
                <span style={{
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginTop: '2px'
                }}>✓</span>
                <strong>Best value for long-term use</strong>
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
                backgroundColor: selectedPlan === 'annual' ? '#6c7a3a' : '#e9ecef',
                color: selectedPlan === 'annual' ? 'white' : '#6c757d'
              }}
              onClick={() => setSelectedPlan('annual')}
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