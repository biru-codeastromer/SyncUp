import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Redirect to feed if already logged in
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // password validation
  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  // signup function
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validatePassword(formData.password, formData.confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Signup successful! Redirecting to feed...");
      setTimeout(() => navigate("/feed"), 2000);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us today and get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

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
            <p className="auth-link-text">
              <Link to="/clubs">Browse Clubs</Link> • <Link to="/feed">View Feed</Link> • <Link to="/profile">View Demo Profile</Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;