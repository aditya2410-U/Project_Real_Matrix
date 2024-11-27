import React from 'react';
import EditSpace from './codeEditor/EditSpace';
import SignupPage from './auth/signupandlogin/page';

export default function Home() {
  return (
    <div className="h-screen dark:bg-slate-800 bg-slate-600 p-4 overflow-hidden">
      {/* <EditSpace /> */}
      <SignupPage/>
    </div>
  );
}
