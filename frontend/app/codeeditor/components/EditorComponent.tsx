"use client";
import React, { useRef, useState, useEffect } from "react";
import SelectLanguage, { selectedLanguageOptionProps } from "./SelectLanguage";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ResizableComponent";
import Editor from "@monaco-editor/react";
import { Button, Tooltip, IconButton } from "@mui/material";
import { PlayArrow, ContentCopy, SettingsOutlined } from "@mui/icons-material";
import {
  Loader,
  TriangleAlert,
  Maximize2,
  Minimize2,
  Rocket,
} from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";
import CollaborationDrawer from "./CollabComponent";
import { WebSocketService } from "backend/app/lib/websocket";

interface Props {
  sessionId: string;
}

export default function EnhancedEditorComponent({ sessionId }: Props) {
  const [sourceCode, setSourceCode] = useState(
    codeSnippets[languageOptions[0].language]
  );
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef<any>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const wsRef = useRef<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocketService(
        sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (content: any, language: string) => {
          // Handle incoming changes
          if (content !== sourceCode) {
            setSourceCode(content);
            if (language && language !== languageOption.language) {
              const newLangOption = languageOptions.find(
                (opt) => opt.language === language
              );
              if (newLangOption) {
                setLanguageOption(newLangOption);
              }
            }
          }
        }
      );
      setIsConnected(true);
    }

    return () => {
      wsRef.current?.disconnect();
    };
  }, [sessionId]);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();

    // Add cursor position event listener
    editor.onDidChangeCursorPosition((e: any) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // Parse the stored JSON string
      const email = user.email;
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
      setTooltipText(
        // `Cursor is at line ${e.position.lineNumber}, column ${e.position.column} by User : ${email}`
        `${email}`
      );
      setTooltipVisible(true);
    });
  }

  function handleOnChange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
      // Broadcast changes to other clients
      wsRef.current?.sendMessage(value, languageOption.language);
    }
  }

  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    const newCode = codeSnippets[value.language];
    setSourceCode(newCode);
    // Broadcast language change to other clients
    wsRef.current?.sendMessage(newCode, value.language);
  }

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    try {
      const result = await compileCode(requestData);

      if (result.run.code === 0) {
        setErr(false);
        setOutput(result.run.output.split("\n"));
        toast.success("Compiled Successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
          icon: "🚀",
        });
      } else {
        setErr(true);
        toast.error("Compilation Failed", {
          style: {
            background: "#ff4500",
            color: "#fff",
          },
          icon: "❌",
        });
      }

      setLoading(false);
    } catch (error) {
      setErr(true);
      setLoading(false);
      toast.error("Failed to Compile the Code");
    }
  }

  function handleCopyCode() {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code);
      toast.success("Code Copied!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        icon: "📋",
      });
    }
  }

  function toggleFullScreen() {
    setIsFullScreen(!isFullScreen);
  }

  return (
    <div
      className={`
        ${
          isFullScreen
            ? "fixed inset-0 z-50 bg-slate-900"
            : "h-[fixed] bg-slate-900"
        } 
        rounded-3xl shadow-2xl py-6 px-8 overflow-hidden 
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center">
            <Rocket className="mr-3 text-purple-500" />
            Codex
          </h2>
          <div className="bg-purple-900/30 px-3 py-1 rounded-full text-purple-300 text-sm">
            {languageOption.language.toUpperCase()}
          </div>
          {isConnected && (
            <div className="bg-green-900/30 px-3 py-1 rounded-full text-green-300 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Connected
            </div>
          )}
        </div>

        {/* Rest of your header content remains the same */}
        <div className="flex items-center space-x-4">
          <Tooltip title="Copy Code">
            <IconButton onClick={handleCopyCode}>
              <ContentCopy className="text-white hover:text-purple-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editor Settings">
            <IconButton>
              <SettingsOutlined className="text-white hover:text-purple-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton onClick={toggleFullScreen}>
              {isFullScreen ? (
                <Minimize2 className="text-white hover:text-purple-500" />
              ) : (
                <Maximize2 className="text-white hover:text-purple-500" />
              )}
            </IconButton>
          </Tooltip>
          <CollaborationDrawer />
          <SelectLanguage
            onSelect={onSelect}
            selectedLanguageOption={languageOption}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="bg-black p-2 rounded-2xl border border-black/50 shadow-xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border border-black/30 md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="relative h-full">
              <Editor
                theme="vs-dark"
                height="90vh"
                language={languageOption.language}
                value={sourceCode}
                onMount={handleEditorDidMount}
                onChange={handleOnChange}
                options={{
                  minimap: { enabled: false },
                  lineNumbersMinChars: 3,
                  glyphMargin: false,
                }}
              />
              {tooltipVisible && (
                <div
                  style={{
                    position: "absolute",
                    top: cursorPosition.line * 20, // Adjust based on line height
                    left: cursorPosition.column * 8, // Adjust based on column width
                    backgroundColor: "#f7f7f7", // Light background for readability
                    color: "#333", // Dark text color for contrast
                    padding: "8px 12px", // More padding for comfortable readability
                    borderRadius: "6px", // Softer, rounded corners
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", // A subtle, more defined shadow
                    fontSize: "14px", // Slightly larger text size for better legibility
                    fontFamily: "'Fira Code', monospace", // Monospace font for code style
                    maxWidth: "300px", // Limit the width of the tooltip
                    wordWrap: "break-word", // Ensure long lines break appropriately
                    zIndex: 10,
                    transition: "opacity 0.2s ease-in-out", // Smooth fade-in/out effect
                    opacity: tooltipVisible ? 1 : 0, // Ensure smooth fade effect
                    pointerEvents: "none", // Prevent the tooltip from interfering with mouse actions
                  }}
                >
                  {tooltipText}
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-black w-2 hover:bg-purple-700 transition-colors" />

          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-900 min-h-screen">
              <div className="flex items-center justify-between bg-slate-950 px-6 py-2 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <h2 className="text-white text-xl font-semibold">Output</h2>
                  {output.length > 0 && (
                    <span className="text-green-500 text-sm">
                      {output.length} lines
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Tooltip title="Run Code">
                    <Button
                      variant="contained"
                      className="bg-blue-600 text-white hover:bg-blue-500"
                      startIcon={
                        loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <PlayArrow />
                        )
                      }
                      onClick={executeCode}
                      disabled={loading}
                    >
                      {loading ? "Running..." : "Run"}
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div
                className={`overflow-auto bg-black/80 p-6 h-3/4 text-sm text-white ${
                  err ? "border-l-4 border-red-500" : ""
                }`}
              >
                {err ? (
                  <TriangleAlert className="text-red-500 h-8 w-8 mx-auto" />
                ) : (
                  output.map((line, index) => <p key={index}>{line}</p>)
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
