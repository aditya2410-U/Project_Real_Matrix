// 'use client';

// import { useState } from 'react';

// function LoginForm() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Login successful!");
//         // Save user data in localStorage or context
//         localStorage.setItem("user", JSON.stringify(data.user));
//       } else {
//         setError(data.message || "Failed to log in.");
//       }
//     } catch (err) {
//       setError(`Something went wrong: ${err} Please try again.`);
//     } finally {
//       setIsLoading(false); // End loading here
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//         />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//         >
//           Login
//         </button>
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <p>
//             Don&apos;t have a account?{" "}
//             <a href="/register">
//               <span style={{ color: "blue", cursor: "pointer" }}>Register</span>
//             </a>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;

"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect user to dashboard if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/codeeditor");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); //123123123

      if (response.ok) {
        // Save user data to localStorage or any state management
        localStorage.setItem("user", JSON.stringify({ email, password }));
        router.push("/codeeditor");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(`An unexpected error occurred: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Login
      </button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>
          Don&apos;t have a account?{" "}
          <a href="/auth/register">
            <span style={{ color: "blue", cursor: "pointer" }}>Register</span>
          </a>
        </p>
      </div>
    </form>
  );
}
