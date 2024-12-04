import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { login, register, verifyToken } from "../services/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check token and verify on initial load
    const token = Cookies.get("token");
    if (token) {
      verifyToken(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid, logout
          logout();
        });
    }
  }, []);

  const loginHandler = async (email: string, password: string) => {
    try {
      const { token, user_id } = await login(email, password);

      // Store token in cookie
      Cookies.set("token", token, { expires: 1 }); // 1 day expiry

      // Set user state
      setUser({ id: user_id, email });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const registerHandler = async (email: string, password: string) => {
    try {
      await register(email, password);

      // Automatically log in after registration
      await loginHandler(email, password);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    // Remove token and user data
    Cookies.remove("token");
    setUser(null);

    // Redirect to login
    router.push("/login");
  };

  const isAuthenticated = () => {
    return !!Cookies.get("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginHandler,
        register: registerHandler,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
