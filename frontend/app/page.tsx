// import React from 'react';
// // import EditSpace from './codeEditor/EditSpace';
// import SignupPage from './auth/register/page';
// export default function Home() {
//   return (
//     <div className="h-screen dark:bg-slate-800 bg-slate-600 p-4 overflow-hidden">
//       {/* <EditSpace /> */}
//       <SignupPage/>
//     </div>
//   );
// }

import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
