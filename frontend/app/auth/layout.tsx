// import Head from "next/head";
// import React, { ReactNode } from "react";
// import Link from "next/link";

// interface LayoutProps {
//   children: ReactNode;
//   pageTitle?: string;
//   pageDescription?: string;
// }

// const Layout: React.FC<LayoutProps> = ({
//   children,
//   pageTitle,
//   pageDescription,
// }) => {
//   return (
//     <div>
//       <Head>
//         <title>{pageTitle || "My App"}</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta charSet="UTF-8" />
//         <meta
//           name="description"
//           content={pageDescription || "This is my Next.js app."}
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <header style={styles.header}>
//         <div style={styles.logo}>
//           <Link href="/">
//             <h1 style={styles.logoText}>My App</h1>
//           </Link>
//         </div>
//         <nav style={styles.nav}>
//           <Link href="/" style={styles.navLink}>
//             Home
//           </Link>
//           <Link href="/auth/signup" style={styles.navLink}>
//             Sign Up
//           </Link>
//           <Link href="/auth/login" style={styles.navLink}>
//             Log In
//           </Link>
//         </nav>
//       </header>

//       <main style={styles.main}>{children}</main>

//       <footer style={styles.footer}>
//         <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   header: {
//     padding: "20px 40px",
//     background: "#0070f3",
//     color: "white",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   },
//   logo: {
//     display: "flex",
//     alignItems: "center",
//   },
//   logoText: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     color: "white",
//     textDecoration: "none",
//   },
//   nav: {
//     display: "flex",
//     gap: "20px",
//   },
//   navLink: {
//     color: "white",
//     textDecoration: "none",
//     fontWeight: "500",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     transition: "background-color 0.3s ease, color 0.3s ease",
//   },
//   navLinkHover: {
//     backgroundColor: "#005bb5",
//   },
//   main: {
//     padding: "40px",
//     minHeight: "80vh",
//   },
//   footer: {
//     textAlign: "center",
//     padding: "20px 0",
//     background: "#f1f1f1",
//     color: "#555",
//     boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.05)",
//   },
// };

// // Make links active with a CSS class or custom styles for highlighting
// // This will need logic in the component (perhaps using `useRouter` to check the active link)
// export default Layout;

"use client";

// import RegisterForm from "../../components/RegisterForm";
import RegisterForm from "@/components/ui/RegisterForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm />
    </div>
  );
}
