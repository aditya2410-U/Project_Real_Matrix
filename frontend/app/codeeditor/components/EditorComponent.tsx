"use client";
import React, { useRef, useState } from "react";
import SelectLanguage, { selectedLanguageOptionProps } from "./SelectLanguage";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ResizableComponent";
import Editor from "@monaco-editor/react";
import { 
  Button, 
  Tooltip, 
  IconButton 
} from "@mui/material";
import { 
  PlayArrow, 
  ContentCopy, 
  SettingsOutlined 
} from "@mui/icons-material";
import { 
  Loader, 
  TriangleAlert, 
  Maximize2, 
  Minimize2, 
  Rocket 
} from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";
import CollaborationDrawer from "./CollabComponent";

export default function EnhancedEditorComponent() {
  const [sourceCode, setSourceCode] = useState(
    codeSnippets[languageOptions[0].language]
  );
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleOnChange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }

  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
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
            background: '#333',
            color: '#fff',
          },
          icon: '🚀',
        });
      } else {
        setErr(true);
        toast.error("Compilation Failed", {
          style: {
            background: '#ff4500',
            color: '#fff',
          },
          icon: '❌',
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
      toast.success('Code Copied!', {
        style: {
          background: '#333',
          color: '#fff',
        },
        icon: '📋',
      });
    }
  }

  function toggleFullScreen() {
    setIsFullScreen(!isFullScreen);
  }

  return (
    <div 
      className={`
        ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[695px] bg-slate-900'} 
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
        </div>
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
          {/* Code Editor Panel */}
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
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-black w-2 hover:bg-purple-700 transition-colors" />

          {/* Output Panel */}
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-900 min-h-screen">
              <div className="flex items-center justify-between bg-slate-950 px-6 py-2 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <h2 className="text-white text-xl font-semibold">Output</h2>
                  {output.length > 0 && (
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs">
                      {output.length} lines
                    </span>
                  )}
                </div>
                {loading ? (
                  <Button
                    disabled
                    className="bg-slate-200 hover:bg-purple-700 text-dark-900"
                  >
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span>Running please wait...</span>
                  </Button>
                ) : (
                  <Button
                    onClick={executeCode}
                    variant="contained"
                    className="bg-purple-800 hover:bg-purple-500 text-white group"
                    startIcon={<PlayArrow className="group-hover:animate-pulse" />}
                  >
                    Run Code
                  </Button>
                )}
              </div>
              <div className="px-6 space-y-2 max-h-[400px] overflow-auto">
                {err ? (
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6 rounded-lg bg-red-950/30">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                    <p className="text-xs text-red-300">
                      Compilation Failed. Please check your code and try again!
                    </p>
                  </div>
                ) : (
                  <>
                    {output.map((item, index) => (
                      <p
                        key={`${item}-${index}`}
                        className="text-sm text-green-500 bg-green-950/30 px-3 py-1 rounded"
                      >
                        {item}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}