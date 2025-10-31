import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading, error, setError } = useAuth();
  
  const [formError, setFormError] = useState("");
  
  useEffect(() => {
    return () => {
      setError("");
    };
  }, [setError]);


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
    setError(""); 
    
    const validationError = validatePassword(formData.password, formData.confirmPassword);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");
    
    signup(formData.name, formData.email, formData.password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us today and get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {(formError || error) && (
            <p className="error-message">{formError || error}</p>
          )}

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
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
              placeholder="Create a password (min. 6 characters)"
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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

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