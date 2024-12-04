// "use client";

// import Layout from '../layout';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AuthPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     passwordAgain: '',
//   });
//   const [msg, setMsg] = useState("");  // Message for errors

//   // Handle form changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     router.push("/codeeditor");

//     // Basic validation
//     // if (formData.password !== formData.passwordAgain) {
//     //   setMsg("Passwords do not match.");
//     //   return;
//     // }

//     // // Reset message
//     // setMsg("");

//     // // Call your API endpoint
//     // try {
//     //   const res = await fetch(`/api/${'login'}`, {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({
//     //       username: formData.username,
//     //       password: formData.password,
//     //     }),
//     //   });

//     //   const result = await res.json();

//     //   if (res.ok) {
//     //     router.push("/codeeditor"); // Redirect after successful login/signup
//     //   } else {
//     //     setMsg(result.message || "An error occurred.");
//     //   }
//     // } catch (error) {
//     //   setMsg("An error occurred while processing your request.");
//     // }
//   };

//   return (
// <>
//       <div className="auth-container">
//         <h2 className="auth-title">{"Login"}</h2>

//         {msg && <p className="error-message">{msg}</p>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <input
//               name="username"
//               type="text"
//               value={formData.username}
//               onChange={handleInputChange}
//               placeholder="Username"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <input
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               required
//             />
//           </div>

//           <button type="submit" className="submit-btn">
//             { "Log in"}
//           </button>
//         </form>

//         <div className="toggle-auth">
//           <p>
//             {
//                "Don't have an account? "}
//             <button
//               type="button"
//               className="toggle-btn"
//               onClick={() => router.push("/auth/signup")}
//             >
//               { "Sign up"}
//             </button>
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         .auth-container {
//           max-width: 400px;
//           margin: auto;
//           padding: 2rem;
//           background-color: #f9f9f9;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .auth-title {
//           text-align: center;
//           margin-bottom: 1.5rem;
//         }

//         .auth-form {
//           display: flex;
//           flex-direction: column;
//         }

//         .form-group {
//           margin-bottom: 1rem;
//         }

//         input[type="text"],
//         input[type="password"] {
//           width: 100%;
//           padding: 0.8rem;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           font-size: 1rem;
//         }

//         .submit-btn {
//           padding: 1rem;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           font-size: 1rem;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//         }

//         .submit-btn:hover {
//           background-color: #0056b3;
//         }

//         .error-message {
//           color: red;
//           text-align: center;
//           margin-bottom: 1rem;
//         }

//         .toggle-auth {
//           text-align: center;
//           margin-top: 1rem;
//         }

//         .toggle-btn {
//           color: #007bff;
//           background: none;
//           border: none;
//           cursor: pointer;
//         }

//         .toggle-btn:hover {
//           text-decoration: underline;
//         }
//       `}</style>
// </>
//   );
// }

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          Don&apos;t have an account?
          <Link href="/register" className="text-blue-500 ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
