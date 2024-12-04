// import React from "react";
// // import EditSpace from './codeEditor/EditSpace';
// import Login from "./auth/login/page";
// export default function Home() {
//   return (
//     <div className="h-screen dark:bg-slate-800 bg-slate-600 p-4 overflow-hidden">
//       {/* <EditSpace /> */}
//       <Login />
//     </div>
//   );
// }

// "use client";
// import React from "react";
// import { AuthProvider } from "../context/AuthContext";
// import Login from "./auth/login/page";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           <Login />
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

// 'use client';
// import { AuthProvider } from '@/context/AuthContext';
// import Login from './auth/login/page';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           {children}
//           <Login />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

"use client";

// import LoginForm from '../components/LoginForm';
import LoginForm from "@/components/ui/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
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

export default MyApp;
