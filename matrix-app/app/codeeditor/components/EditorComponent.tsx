import React from "react";
import SelectLanguage from "./SelectLanguage";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/ResizableComponent";

export default function EditorComponent() {
  return (
    <div className="h-[695px] bg-slate-900 rounded-3xl shadow-2xl py-6 px-8 overflow-hidden">
      <div className="flex items-center justify-between">
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
            <div className="flex h-[200px] items-center justify-center p-6 bg-slate-800 border border-black">
              <span className="font-semibold text-white">One</span>
            </div>
          </ResizablePanel>

          {/* Adjusted handle style to match black border */}
          <ResizableHandle className="bg-black w-2" />

          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="flex h-[200px] items-center justify-center p-6 bg-slate-800 border border-black">
              <span className="font-semibold text-white">Two</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
