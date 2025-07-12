import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase'; // Adjust the import path as necessary   


const LoginSignup = ({ mode }) => {
  const [action, setAction] = useState(mode === "login" ? "Login" : "Sign Up");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isMismatch = action === "Sign Up" && confirmPassword && password !== confirmPassword;

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setMessage('');
    setLoading(true);

    if (isMismatch) {
      setError('Passwords do not match');
      return;
    }
    let body;
    const endpoint = action === "Login" ? "/login" : "/signup";
    if (action === "Sign Up") {
      const extractedUsername = email.split('@')[0];
      body = { username: extractedUsername, email, password };
    } else {
      body = { email, password };
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/auth${endpoint}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setMessage(response.data.message || 'Success!');
      setEmail('');
      navigate('/postlogin');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('Network error, please try again later');
      }
      setMessage('');
    } finally {
      setLoading(false);
    }
  };


  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In successful:', result);
      const user = result.user;
      const endpoint = action === "Login" ? "/login" : "/signup";
      let body;
      if (action === "Sign Up") {
        body = {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          password: 'google-auth' // Placeholder, as we don't use password for Google sign-in
        };
      } else {
        body = {
          email: user.email,
          password: 'google-auth'
        }; // Placeholder, as we don't use password for Google sign-in
      }

      const response = await axios.post(
        `http://localhost:5000/auth${endpoint}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      setMessage(response.data.message || 'Google Sign-In successful!');
      setEmail('');
      navigate('/');     
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google Sign-In error:', err);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="form-header">
          <div className="text">
            {action}
            <div className="underline"></div>
          </div>
        </div>

        <div className="inputs">
          <div className="input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {action === "Sign Up" && (
            <div className="input">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {isMismatch && (
            <div className="error-text">Passwords do not match</div>
          )}
          {error && <div className="error-text">{error}</div>}
          {message && <div className="success-text">{message}</div>}

          <div className="submit-container">
            <div className="submit" onClick={handleSubmit}>Submit</div>
          </div>
        </div>

        {action === "Sign Up" ? null : (
          <div className="forgot-password">
            Forgot Password? <span>Click Here!</span>
          </div>
        )}

        <div className="divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <div className="google-signin">
          <div className="google-signin-btn" onClick={handleGoogleSignIn} style={{ cursor: 'pointer' }}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
            />
            <span>{action === "Sign Up" ? "Sign up with Google" : "Log in with Google"}</span>
          </div>
        </div>

        <div className="switch-action">
          {action === "Sign Up" ? (
            <p>Already have an account? <span onClick={() => setAction("Login")}>Login</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setAction("Sign Up")}>Sign Up</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
