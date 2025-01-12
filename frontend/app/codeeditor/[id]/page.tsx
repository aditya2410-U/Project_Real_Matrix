"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EnhancedEditorComponent from "../components/EditorComponent";
import { Loader } from "lucide-react";
import Card from "@mui/material/Card/Card";

const CodeEditorPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Verify session ID
    if (!id) {
      setConnectionError("Invalid session ID");
      setIsConnecting(false);
      return;
    }

    // Test WebSocket connection
    const testConnection = new WebSocket(`ws://localhost:8080/ws?sessionId=${id}`);
    
    testConnection.onopen = () => {
      setIsConnecting(false);
      testConnection.close(); // Close test connection as actual connection will be made by EnhancedEditorComponent
    };

    testConnection.onerror = () => {
      setConnectionError("Failed to connect to collaboration server");
      setIsConnecting(false);
    };

    return () => {
      if (testConnection) {
        testConnection.close();
      }
    };
  }, [id]);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Card className="p-8 flex flex-col items-center space-y-4 bg-slate-800 border-slate-700">
          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-white">Connecting to collaboration session...</p>
        </Card>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Card className="p-8 flex flex-col items-center space-y-4 bg-slate-800 border-slate-700">
          <div className="text-red-500 text-xl">⚠️ Connection Error</div>
          <p className="text-white">{connectionError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry Connection
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Collaboration Session</h1>
            <div className="px-3 py-1 bg-purple-900/30 rounded-full">
              <code className="text-purple-300 text-sm">{id}</code>
            </div>
          </div>
          
          {/* Optional: Add any additional session controls here */}
        </div>

        <EnhancedEditorComponent 
          sessionId={id}
          key={id} // Force new instance when session ID changes
        />
      </div>
    </div>
  );
};

export default CodeEditorPage;