import React, { useState } from 'react';
import { Section, Input, Button } from '@telegram-apps/telegram-ui';

export const PhoneAuth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  // Sends the OTP using our backend endpoint
  const sendOTP = async () => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (response.ok) {
        setSent(true);
        setMessage('OTP sent successfully! Check your SMS.');
      } else {
        const error = await response.json();
        setMessage(`Error sending OTP: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error sending OTP.');
    }
  };

  // Verifies the OTP entered by the user
  const verifyOTP = async () => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (response.ok) {
        setMessage('Phone number verified successfully!');
        // Here you can set user session info, update state, etc.
      } else {
        const error = await response.json();
        setMessage(`Verification failed: ${error.message}`);
      }
    } catch (error) {
      setMessage('Verification failed.');
    }
  };

  return (
    <Section header="Sign In / Sign Up">
      {!sent ? (
        <>
          <Input
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={sendOTP}>Send OTP</Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Enter the OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={verifyOTP}>Verify OTP</Button>
        </>
      )}
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
    </Section>
  );
};
