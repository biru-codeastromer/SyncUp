import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loading, error, setError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  

  useEffect(() => {
    return () => {
      setError("");
    };
  }, [setError]);

  // Redirect to feed if already logged in
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);
  
  // Mock user for demo purposes
  useEffect(() => {
    // Auto-fill demo credentials
    setFormData({
      email: "demo@example.com",
      password: "password123"
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  // use context's loading/error
  setError("");

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password");
        return;
      }

      // Call the login function from AuthContext
      await login(formData.email, formData.password);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      // loading is managed by AuthContext
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative elements */}
      <div className="auth-bg-decoration"></div>
      
      <div className="auth-card auth-card-login">
        {/* Logo/Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <span className="auth-logo-icon">🚀</span>
          </div>
          <h1 className="auth-brand-name">SyncUp</h1>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue to your account</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="demo-credentials-box">
          <div className="demo-credentials-header">
            <span className="demo-icon">🎯</span>
            <span className="demo-title">Demo Credentials</span>
          </div>
          <div className="demo-credentials-content">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>

        <form className="auth-form auth-form-single" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i className="ri-mail-line"></i>
              Email address
            </label>
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
            <label htmlFor="password" className="form-label">
              <i className="ri-lock-line"></i>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-button-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <i className="ri-arrow-right-line"></i>
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-link">
            <p className="auth-link-text">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
