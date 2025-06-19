
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Dummy users for testing
const dummyUsers: { [key: string]: User } = {
  'user@aurak.ac.ae': {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    department: 'Computer Science',
    email: 'user@aurak.ac.ae',
    phone: '+971501234567'
  },
  'admin@aurak.ac.ae': {
    id: 2,
    first_name: 'Admin',
    last_name: 'User',
    department: 'Administration',
    email: 'admin@aurak.ac.ae',
    phone: '+971507654321'
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail && dummyUsers[userEmail]) {
      setUser(dummyUsers[userEmail]);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login with dummy emails
    if (dummyUsers[email]) {
      localStorage.setItem('user_email', email);
      setUser(dummyUsers[email]);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('user_email');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
