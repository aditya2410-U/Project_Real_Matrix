// components/EditorComponent.tsx
"use client";

import React, { useRef, useState } from "react";
import SelectLanguage from "./SelectLanguage";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/ResizableComponent";
import Editor from "@monaco-editor/react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";

export default function EditorComponent() {
  const [sourceCode, setSourceCode] = useState("");
  const [languageOptions,setLanguageOption] = useState([languageOptions[0]]);
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

  function onSelect(value: string){
    setLanguageOption(value);
  }

  return (
    <div className="h-[695px] bg-slate-900 rounded-3xl shadow-2xl py-6 px-8 overflow-hidden">
      <div className="flex items-center justify-between py-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Codex
        </h2>
        <div className="flex">
          <SelectLanguage />
        </div>
      </div>
      {/* This is the resizable component */}
      <div className="bg-black p-2 rounded-2xl border border-black">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border border-black md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
            <Editor
              theme="vs-dark"
              height="90vh"
              defaultLanguage={languageOptions.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              onChange={handleOnChange}
            />
          </ResizablePanel>

          {/* Adjusted handle style to match black border */}
          <ResizableHandle className="bg-black w-2" />

          <ResizablePanel defaultSize={50} minSize={35}>
            {/* head */}
            <div className="p-4">
              <div className="flex items-center justify-between bg-slate-900 px-6 py-2">
                <h2 className="text-white text-xl font-semibold">Output</h2>
                <Button
                  variant="contained"
                  className="bg-purple-800 hover:bg-purple-500 text-white" // Dark purple normal, light purple on hover
                  startIcon={<PlayArrow />}
                >
                  Run
                </Button>
              </div>
              <div className="h-full bg-slate-900 mt-4 p-6 rounded-lg">
                <h2 className="text-white text-xl font-semibold text-center">
                  Hello World
                </h2>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
