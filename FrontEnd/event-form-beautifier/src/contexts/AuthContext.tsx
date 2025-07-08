import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/services/api';

interface AuthContextType {
  user: Partial<User> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  verifyOtpAndSetUser: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setUser: (user: Partial<User> | null) => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const bootstrap = async () => {
      if (token) {
        try {
          const freshUser = await apiService.getCurrentUser();  // e.g., /api/auth/me/
          setUser(freshUser);
          // optional: store it again
          localStorage.setItem("current_user", JSON.stringify(freshUser));
        } catch (error) {
          console.error("❌ Token invalid or expired. Logging out.");
          logout();
        }
      } else {
        logout(); // ⛔ No token? Force logout
      }

      setIsLoading(false);
    };

    bootstrap();
  }, []);

  const login = async (email: string) => {
    await apiService.loginWithEmail(email); // just sends OTP
  };

  const verifyOtpAndSetUser = async (email: string, otp: string) => {
    const userData = await apiService.verifyOTP(email, otp); // stores token + user
    if (userData && !('detail' in userData)) {
      setUser(userData);
    } else {
      setUser(null);
      // Optionally, handle error here (e.g., show a message)
      console.error("OTP verification failed:", userData?.detail);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyOtpAndSetUser,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
