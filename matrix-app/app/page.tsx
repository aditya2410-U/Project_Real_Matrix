import React from 'react';
import EditSpace from './codeEditor/EditSpace';

export default function Home() {
  return (
    <div className="h-screen dark:bg-slate-800 bg-slate-600 p-4 overflow-hidden">
      <EditSpace />
    </div>
  );
}
