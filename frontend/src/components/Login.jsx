import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);
    // Add your login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
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
      

          <button type="submit" className="auth-button">
            Sign in
          </button>

          <div className="auth-link">
            <p className="auth-link-text">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
