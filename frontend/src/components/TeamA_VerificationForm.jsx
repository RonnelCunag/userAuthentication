/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Auth.css'; // Import a CSS file for styling

function TeamA_VerificationForm() {
  const [verification, setVerification] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [showResendButton, setShowResendButton] = useState(true);
  const [emailFromRegistration, setEmailFromRegistration] = useState('');
  const [resending, setResending] = useState(false);
  const [codeExpired, setCodeExpired] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if the user is already verified
    if (verificationStatus === 'Verification successful') {
      setShowResendButton(false);
      setIsVerified(true);
      navigate('/login'); // Redirect to /login if already verified
    }
  }, [verificationStatus, navigate]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    console.log('Stored Email:', storedEmail);
    
    if (storedEmail) {
      setEmailFromRegistration(storedEmail);
      console.log('Setting emailFromRegistration:', storedEmail);
      
      // Check verification code expiration after setting emailFromRegistration
      checkVerificationCodeExpiration(storedEmail);
    }
  }, []);

  const checkVerificationCodeExpiration = async (email) => {
    try {
      const response = await fetch(`http://localhost:8085/api/v1/auth/checkCodeExpiration?email=${email}`);
  
      if (response.ok) {
        const { codeExpired, expirationTime } = await response.json();
        setCodeExpired(codeExpired);
        setShowResendButton(codeExpired);
  
        if (expirationTime) {
          const now = new Date().getTime();
          const timeDifference = Math.floor((expirationTime - now) / (60 * 1000)); // Convert milliseconds to minutes
          console.log('Verification code expires in:', timeDifference, 'minutes');
        } else {
          console.log('Verification code does not expire');
        }
      } else {
        console.error('Failed to fetch verification code expiration status. Response:', response.status);
      }
    } catch (error) {
      console.error('Error during code expiration check:', error);
    }
  };
  


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8085/api/v1/auth/verifyCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode: verification, recipient: emailFromRegistration }),
      });

      if (response.ok) {
        setVerificationStatus('Verification successful');
        setShowResendButton(false);
      } else {
        setVerificationStatus('Verification failed');
        setShowResendButton(codeExpired);
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  const handleResendCode = async () => {
    try {
      setResending(true);
  
      const resendResponse = await fetch('http://localhost:8085/api/v1/auth/resendCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient: emailFromRegistration }),
      });
  
      if (resendResponse.ok) {
        setVerificationStatus('Verification code resent successfully');
        setShowResendButton(false);
      } else {
        setVerificationStatus('Failed to resend verification code');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error during code resend:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-forms-container">
      {!isVerified && (  // Only show the form if not verified
        <form className="template-form" onSubmit={handleFormSubmit}>
          <Link to="/forgot" className="wBackbutton">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
            </button>
          </Link>
          <h1 className="verification-title">Email Verification</h1>
          <p className="center-text">Please enter the verification code sent to {emailFromRegistration}</p>
          <div className="verification-input-field">
            <input
              type="text"
              placeholder="Verification Code"
              id="verification"
              name="verification"
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              required
            />
            {resending ? (
              <p>Resending verification code...</p>
            ) : codeExpired ? (
              <>
                {showResendButton && (
                  <button type="button" className="TeamA-button" onClick={handleResendCode} disabled={resending}>
                    {resending ? 'Resending...' : 'Resend Code'}
                  </button>
                )}
                <button type="submit" className="TeamA-button">Send</button>
              </>
            ) : (
              <button type="submit" className="TeamA-button">Send</button>
            )}
          </div>
        </form>
      )}

      <div className="verification-panels-container">
        {verificationStatus && <p>{verificationStatus}</p>}
        {showResendButton && resendStatus && <p>{resendStatus}</p>}
      </div>
    </div>
  );
}

export default TeamA_VerificationForm;
