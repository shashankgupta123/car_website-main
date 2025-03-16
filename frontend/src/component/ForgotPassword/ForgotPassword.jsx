import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success("OTP sent to your email.");
      setShowOTPInput(true);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerify = () => {
    if (otp === generatedOTP) {
      toast.success("OTP Verified! Redirecting to reset password...");
      setTimeout(() => {
        navigate("/reset-password");
      }, 5000); // Wait for 5 seconds before navigating
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="loginbg">
      <div className="innerContainer">
        <div className="glassBox">
          <h1>Forgot Password</h1>
          {!showOTPInput ? (
            <form onSubmit={sendOTP}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ backgroundColor: "white", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.8rem 1.2rem",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: "50px",
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.boxShadow = "0px 15px 25px rgba(0, 0, 0, 0.3)")}
                onMouseOut={(e) => (e.target.style.boxShadow = "none")}
              >
                Send OTP
              </button>
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
                style={{ backgroundColor: "white", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <button
                onClick={handleVerify}
                style={{
                  width: "100%",
                  padding: "0.8rem 1.2rem",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: "50px",
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.boxShadow = "0px 15px 25px rgba(0, 0, 0, 0.3)")}
                onMouseOut={(e) => (e.target.style.boxShadow = "none")}
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
