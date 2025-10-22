import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validatePassword(formData.password, formData.confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    console.log("Signup form submitted:", formData);
    // Add your signup logic here (API call etc.)
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us today and get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="form-input"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="form-input"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-button">Create Account</button>

          <div className="auth-link">
            <p className="auth-link-text">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;