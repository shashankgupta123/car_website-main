import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/reset-password", { email, newPassword });
      toast.success("Password reset successful! Redirecting to login...");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000); // 3-second delay before navigation
    } catch (error) {
      console.error("Reset error:", error.response?.data?.message);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="loginbg">
      <div className="innerContainer">
        <div className="glassBox">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" value={email} readOnly className="inputField" style={inputStyle} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="inputField" style={inputStyle} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="inputField" style={inputStyle} />
            <button type="submit" style={buttonStyle}>Reset Password</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const inputStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  fontSize: "1rem",
  marginBottom: "10px",
};

const buttonStyle = {
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
};

export default ResetPassword;