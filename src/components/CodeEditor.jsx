import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ 
  code, 
  onChange, 
  language = 'verilog',
  height = '500px',
  readOnly = false 
}) {
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="border rounded" style={{ height }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on'
        }}
      />
    </div>
  );
}

export default CodeEditor;