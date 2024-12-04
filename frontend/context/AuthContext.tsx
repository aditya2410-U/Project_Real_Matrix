"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        verifyToken(token)
          .then((userData) => {
            setUser(userData);
          })
          .catch(() => {
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const loginHandler = async (email: string, password: string) => {
    try {
      const { token, user_id } = await login(email, password);
      Cookies.set("token", token, { expires: 1 });
      setUser({ id: user_id, email });
      router.push("/codeeditor");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const registerHandler = async (email: string, password: string) => {
    try {
      await register(email, password);
      await loginHandler(email, password);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/auth/login");
  };

  const isAuthenticated = () => {
    return typeof window !== "undefined" && !!Cookies.get("token");
  };

  // Prevent rendering until client-side check is complete
  if (isLoading) {
    return null;
  }

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

export const useAuth = () => {
  const context = useContext(AuthContext);

  // if (context === undefined) {
  //   throw new Error("useAuth must be used within an AuthProvider");
  // }

  return context;
};
