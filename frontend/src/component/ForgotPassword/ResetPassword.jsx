import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/reset-password", { email, newPassword });
      alert("Password reset successful!");
      localStorage.removeItem("resetEmail"); // Clear email from localStorage
      localStorage.removeItem("resetOTP"); // Clear email from localStorage
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Reset error:", error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} readOnly />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
