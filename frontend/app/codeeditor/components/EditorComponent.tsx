"use client";
import React, { useRef, useState } from "react";
import SelectLanguage, { selectedLanguageOptionProps } from "./SelectLanguage";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ResizableComponent";
import Editor from "@monaco-editor/react";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import { Loader, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function EditorComponent() {
  const [sourceCode, setSourceCode] = useState(
    codeSnippets[languageOptions[0].language]
  );
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const editorRef = useRef(null);

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
        setErr(false); // Set error state to false if run is 1
        setOutput(result.run.output.split("\n"));
        toast.success("Compiled Successfully");
      } else {
        setErr(true); // Set error state to true if run is not 1
        toast.error("Failed to compile the Code");
      }
    
      setLoading(false);
      console.log(result);
    } catch (error) {
      setErr(true);
      setLoading(false);
      toast.error("Failed to compile the Code");
      console.log(error);
    }
  }

  return (
    <div className="h-[695px] bg-slate-900 rounded-3xl shadow-2xl py-6 px-8 overflow-hidden">
      <div className="flex items-center justify-between py-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Codex
        </h2>
        <div className="flex">
          <SelectLanguage
            onSelect={onSelect}
            selectedLanguageOption={languageOption}
          />
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
              language={languageOption.language}
              value={sourceCode}
              onMount={handleEditorDidMount}
              onChange={handleOnChange}
            />
          </ResizablePanel>

          <ResizableHandle className="bg-black w-2" />

          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="space-y-3 bg-slate-900 min-h-screen">
              <div className="flex items-center justify-between  bg-slate-950 px-6 py-2">
                <h2 className="text-white text-xl font-semibold">Output</h2>
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
                    className="bg-purple-800 hover:bg-purple-500 text-white"
                    startIcon={<PlayArrow />}
                  >
                    Run
                  </Button>
                )}
              </div>
              <div className=" px-6 space-y-2">
                {err ? (
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-xs">
                      Failed to Compile the Code , Please try again !
                    </p>
                  </div>
                ) : (
                  <>
                    {output.map((item, index) => {
                      return (
                        <p
                          className="text-sm text-green-500"
                          key={`${item}-${index}`}
                        >
                          {item}
                        </p>
                      );
                    })}
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
