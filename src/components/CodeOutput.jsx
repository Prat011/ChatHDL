import React, { useState } from 'react';
import { downloadCode } from '../utils/downloadUtils';
import CodeEditor from './CodeEditor';

function CodeOutput({ designCode, testbenchCode }) {
  const [activeTab, setActiveTab] = useState('design');
  const [editedDesignCode, setEditedDesignCode] = useState(designCode);
  const [editedTestbenchCode, setEditedTestbenchCode] = useState(testbenchCode);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when props change
  React.useEffect(() => {
    setEditedDesignCode(designCode);
    setEditedTestbenchCode(testbenchCode);
  }, [designCode, testbenchCode]);

  const handleDownload = () => {
    const code = activeTab === 'design' ? editedDesignCode : editedTestbenchCode;
    const filename = `verilog_${activeTab}.v`;
    downloadCode(code, filename);
  };

  const handleCodeChange = (newCode) => {
    if (activeTab === 'design') {
      setEditedDesignCode(newCode);
    } else {
      setEditedTestbenchCode(newCode);
    }
  };

  return (
    <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl border border-[#2D2D2D] overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-[#2D2D2D]">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              activeTab === 'design'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2D2D2D]'
            }`}
            onClick={() => setActiveTab('design')}
          >
            Design Module
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              activeTab === 'testbench'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2D2D2D]'
            }`}
            onClick={() => setActiveTab('testbench')}
          >
            Testbench
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium
              ${isEditing 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-[#2D2D2D] text-gray-400 hover:text-white'
              }`}
          >
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium 
              hover:bg-emerald-700 transition-all duration-200"
          >
            Download
          </button>
        </div>
      </div>

      <div className="p-4">
        <CodeEditor
          code={activeTab === 'design' ? editedDesignCode : editedTestbenchCode}
          onChange={isEditing ? handleCodeChange : undefined}
          readOnly={!isEditing}
          theme="vs-dark"
          options={{
            fontSize: 14,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineHeight: 1.6,
          }}
        />
      </div>
    </div>
  );
}

export default CodeOutput;