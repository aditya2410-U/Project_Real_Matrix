"use client";

import Layout from '../layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordAgain: '',
  });
  const [msg, setMsg] = useState("");  // Message for errors

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push("/codeeditor");

    // Basic validation
    // if (formData.password !== formData.passwordAgain) {
    //   setMsg("Passwords do not match.");
    //   return;
    // }

    // // Reset message
    // setMsg("");

    // // Call your API endpoint
    // try {
    //   const res = await fetch(`/api/${'login'}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       username: formData.username,
    //       password: formData.password,
    //     }),
    //   });

    //   const result = await res.json();

    //   if (res.ok) {
    //     router.push("/codeeditor"); // Redirect after successful login/signup
    //   } else {
    //     setMsg(result.message || "An error occurred.");
    //   }
    // } catch (error) {
    //   setMsg("An error occurred while processing your request.");
    // }
  };

  return (
<>
      <div className="auth-container">
        <h2 className="auth-title">{"Login"}</h2>

        {msg && <p className="error-message">{msg}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </div>

          
          <button type="submit" className="submit-btn">
            { "Log in"}
          </button>
        </form>

        <div className="toggle-auth">
          <p>
            {
               "Don't have an account? "}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => router.push("/auth/signup")}
            >
              { "Sign up"}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: auto;
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .auth-title {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .submit-btn {
          padding: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #0056b3;
        }

        .error-message {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }

        .toggle-auth {
          text-align: center;
          margin-top: 1rem;
        }

        .toggle-btn {
          color: #007bff;
          background: none;
          border: none;
          cursor: pointer;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }
      `}</style>
</>
  );
}
