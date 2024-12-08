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

import React from "react";
import { AuthProvider } from "../context/AuthContext";
import Login from "./auth/login/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Login />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
