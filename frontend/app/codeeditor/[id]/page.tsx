"use client";


import { useParams } from "next/navigation";
import React from "react";

const CodeEditorPage: React.FC = () => {
    const params = useParams();
    const id = params?.id;
  console.log(id);

  return (
    <div>
      <h1>Collaboration Session: {id}</h1>
    </div>
  );
};

export default CodeEditorPage;
