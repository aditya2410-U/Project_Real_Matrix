// // "use client";

// // import Layout from '../layout';
// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';

// // export default function AuthPage() {
// //   const router = useRouter();
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     password: '',
// //     passwordAgain: '',
// //   });
// //   const [msg, setMsg] = useState("");  // Message for errors

// //   // Handle form changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     router.push("/codeeditor");

// //     // Basic validation
// //     // if (formData.password !== formData.passwordAgain) {
// //     //   setMsg("Passwords do not match.");
// //     //   return;
// //     // }

// //     // // Reset message
// //     // setMsg("");

// //     // // Call your API endpoint
// //     // try {
// //     //   const res = await fetch(`/api/${'login'}`, {
// //     //     method: 'POST',
// //     //     headers: {
// //     //       'Content-Type': 'application/json',
// //     //     },
// //     //     body: JSON.stringify({
// //     //       username: formData.username,
// //     //       password: formData.password,
// //     //     }),
// //     //   });

// //     //   const result = await res.json();

// //     //   if (res.ok) {
// //     //     router.push("/codeeditor"); // Redirect after successful login/signup
// //     //   } else {
// //     //     setMsg(result.message || "An error occurred.");
// //     //   }
// //     // } catch (error) {
// //     //   setMsg("An error occurred while processing your request.");
// //     // }
// //   };

// //   return (
// // <>
// //       <div className="auth-container">
// //         <h2 className="auth-title">{"Login"}</h2>

// //         {msg && <p className="error-message">{msg}</p>}

// //         <form onSubmit={handleSubmit} className="auth-form">
// //           <div className="form-group">
// //             <input
// //               name="username"
// //               type="text"
// //               value={formData.username}
// //               onChange={handleInputChange}
// //               placeholder="Username"
// //               required
// //             />
// //           </div>

// //           <div className="form-group">
// //             <input
// //               name="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={handleInputChange}
// //               placeholder="Password"
// //               required
// //             />
// //           </div>

// //           <button type="submit" className="submit-btn">
// //             { "Log in"}
// //           </button>
// //         </form>

// //         <div className="toggle-auth">
// //           <p>
// //             {
// //                "Don't have an account? "}
// //             <button
// //               type="button"
// //               className="toggle-btn"
// //               onClick={() => router.push("/auth/signup")}
// //             >
// //               { "Sign up"}
// //             </button>
// //           </p>
// //         </div>
// //       </div>

// //       <style jsx>{`
// //         .auth-container {
// //           max-width: 400px;
// //           margin: auto;
// //           padding: 2rem;
// //           background-color: #f9f9f9;
// //           border-radius: 8px;
// //           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// //         }

// //         .auth-title {
// //           text-align: center;
// //           margin-bottom: 1.5rem;
// //         }

// //         .auth-form {
// //           display: flex;
// //           flex-direction: column;
// //         }

// //         .form-group {
// //           margin-bottom: 1rem;
// //         }

// //         input[type="text"],
// //         input[type="password"] {
// //           width: 100%;
// //           padding: 0.8rem;
// //           border: 1px solid #ccc;
// //           border-radius: 4px;
// //           font-size: 1rem;
// //         }

// //         .submit-btn {
// //           padding: 1rem;
// //           background-color: #007bff;
// //           color: white;
// //           border: none;
// //           border-radius: 4px;
// //           font-size: 1rem;
// //           cursor: pointer;
// //           transition: background-color 0.3s ease;
// //         }

// //         .submit-btn:hover {
// //           background-color: #0056b3;
// //         }

// //         .error-message {
// //           color: red;
// //           text-align: center;
// //           margin-bottom: 1rem;
// //         }

// //         .toggle-auth {
// //           text-align: center;
// //           margin-top: 1rem;
// //         }

// //         .toggle-btn {
// //           color: #007bff;
// //           background: none;
// //           border: none;
// //           cursor: pointer;
// //         }

// //         .toggle-btn:hover {
// //           text-decoration: underline;
// //         }
// //       `}</style>
// // </>
// //   );
// // }

// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     // Basic validation
//     if (!email || !password) {
//       setError("Please enter both email and password");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await login(email, password);
//       // Note: Redirect is now handled in AuthContext
//     } catch (err: any) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unexpected error occurred";

//       setError(errorMessage);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl mb-4 text-center">Login</h2>

//         {error && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               disabled={isLoading}
//             />
//             <Link
//               href="/forgot-password"
//               className="text-xs text-blue-500 hover:text-blue-700"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-2 rounded text-white font-bold transition duration-300 ${
//               isLoading
//                 ? "bg-blue-300 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600"
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="/auth/register"
//             className="text-blue-500 hover:text-blue-700 font-bold"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

// import LoginForm from "@/components/LoginForm";
import LoginForm from "@/components/ui/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

 function Login() {
   const router = useRouter();

   useEffect(() => {
     const user = localStorage.getItem("user");
     if (user) {
       router.push("/codeeditor"); // Redirect if already logged in
     }
   }, [router]);

   return (
     <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <LoginForm />
     </div>
   );
 }
export default Login;
