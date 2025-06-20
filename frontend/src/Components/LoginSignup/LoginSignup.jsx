import React, { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = ({ mode }) => {
  const [action, setAction] = useState(mode === "login" ? "Login" : "Sign Up");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isMismatch = action === "Sign Up" && confirmPassword && password !== confirmPassword;

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
            <input type="email" placeholder="Email" />
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

          <div className="submit-container">
            <div className="submit">Submit</div>
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
          <div className="google-signin-btn">
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
