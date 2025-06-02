"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getCurrentUser,
  isAuthenticated as checkAuth,
  logout as performLogout,
  UserProfile,
} from "@/lib/auth-client";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuth = () => {
    const authenticated = checkAuth();
    const currentUser = getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
  };
  const login = () => {
    // The token is already set in cookies by the server action
    // We just need to refresh the auth state immediately
    setTimeout(() => {
      refreshAuth();
    }, 50); // Small delay to ensure cookie is available
  };

  const logout = () => {
    performLogout();
    setIsAuthenticated(false);
    setUser(null);
  };
  useEffect(() => {
    refreshAuth();

    // Listen for window focus to refresh auth state
    const handleFocus = () => {
      refreshAuth();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
