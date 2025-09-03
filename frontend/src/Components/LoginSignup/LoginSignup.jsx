import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase'; // Adjust path as needed

const LoginSignup = ({ mode }) => {
  const [action, setAction] = useState(mode === "login" ? "Login" : "Sign Up");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMismatch = action === "Sign Up" && confirmPassword && password !== confirmPassword;

  // Password condition checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) return 'Strong';
    return 'Medium';
  };

  const passwordStrength = password ? evaluatePasswordStrength(password) : '';

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setMessage('');
    setLoading(true);

    if (isMismatch) {
      setError('Passwords do not match');
      setLoading(false);
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
      localStorage.setItem('token', response.data.token);
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const endpoint = action === "Login" ? "/login" : "/signup";
      let body;
      if (action === "Sign Up") {
        body = {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          password: 'google-auth'
        };
      } else {
        body = {
          email: user.email,
          password: 'google-auth'
        };
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
      localStorage.setItem('token', response.data.token);
      navigate('/postlogin/');     
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

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? '/view.png' : '/eyebrow.png'}
                alt={showPassword ? "Hide password" : "Show password"}
                className="eye-img"
              />
            </span>
          </div>

          {action === "Sign Up" && (
            <>
              <div className="password-checks">
                <span className={hasLower ? 'check-active' : 'check-inactive'}>Lower</span>
                <span className={hasUpper ? 'check-active' : 'check-inactive'}>Upper</span>
                <span className={hasNumber ? 'check-active' : 'check-inactive'}>Number</span>
                <span className={hasSymbol ? 'check-active' : 'check-inactive'}>Symbol</span>
              </div>

              {password && (
                <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Password strength is {passwordStrength}
                </p>
              )}

              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? '/view.png' : '/eyebrow.png'}
                    alt={showConfirmPassword ? "Hide password" : "Show password"}
                    className="eye-img"
                  />
                </span>
              </div>
            </>
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
