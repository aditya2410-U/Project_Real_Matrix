// import { useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import Cookies from "js-cookie";

// // Authentication Context
// import { createContext, useContext, ReactNode } from "react";

// interface AuthContextType {
//   user: { id: string; email: string } | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: () => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<{ id: string; email: string } | null>(null);
//   const router = useRouter();

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await axios.post("http://localhost:8080/login", {
//         email,
//         password,
//       });

//       // Store token in cookies
//       Cookies.set("token", response.data.token, { expires: 1 }); // 1 day expiry

//       // Set user data
//       setUser({
//         id: response.data.userId,
//         email: email,
//       });

//       // Redirect to dashboard
//       router.push("/dashboard");
//     } catch (error) {
//       throw new Error("Login failed");
//     }
//   };

//   const register = async (email: string, password: string) => {
//     try {
//       await axios.post("http://localhost:8080/register", { email, password });

//       // Optionally log in after registration
//       await login(email, password);
//     } catch (error) {
//       throw new Error(`Registration failed : ${error}`);
//     }
//   };

//   const logout = () => {
//     Cookies.remove("token");
//     setUser(null);
//     router.push("/login");
//   };

//   const isAuthenticated = () => {
//     return !!Cookies.get("token");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, isAuthenticated }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(email, password);
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          Already have an account?
          <Link href="/login" className="text-blue-500 ml-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
