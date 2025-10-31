import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested routes will render inside MainLayout's <Outlet /> */}
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;