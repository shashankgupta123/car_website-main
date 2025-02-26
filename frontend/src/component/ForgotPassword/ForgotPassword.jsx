import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const navigate = useNavigate();

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOTP = async (e) => {
    e.preventDefault();
    const newOTP = generateOTP();
    setGeneratedOTP(newOTP);
    localStorage.setItem("resetOTP", newOTP);
    localStorage.setItem("resetEmail", email);

    const templateParams = {
      user_email: email,
      otp: newOTP,
    };

    try {
      await emailjs.send(
        "service_9d0vkl5",
        "template_bzpyoj6",
        templateParams,
        "nJ9Wi4028UfQqBbCi"
      );
      alert("OTP sent to your email.");
      setShowOTPInput(true);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerify = () => {
    if (otp === generatedOTP) {
      alert("OTP Verified! Redirecting to reset password...");
      navigate("/reset-password");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {!showOTPInput ? (
        <form onSubmit={sendOTP}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={handleVerify}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
