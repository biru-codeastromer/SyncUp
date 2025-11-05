import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-login for demo purposes
  useEffect(() => {
    const mockUserData = {
      id: 'user123',
      email: 'user@example.com',
      user_metadata: {
        full_name: 'John Doe',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    };
    
    const timer = setTimeout(() => {
      setUser(mockUserData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUserData = {
      id: 'user123',
      email: email,
      user_metadata: {
        full_name: 'John Doe',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    };
    setUser(mockUserData);
    setLoading(false);
    return { user: mockUserData, error: null };
  };

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      id: 'user' + Math.random().toString(36).substr(2, 9),
      email,
      user_metadata: {
        full_name: fullName,
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    };
    setUser(newUser);
    setLoading(false);
    return { user: newUser, error: null };
  };

  const signOut = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
