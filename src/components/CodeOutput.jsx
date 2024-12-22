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
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center border-b p-2">
        <div className="flex">
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'design'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('design')}
          >
            Design Module
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'testbench'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('testbench')}
          >
            Testbench
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 text-sm rounded ${
              isEditing
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
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
        />
      </div>
    </div>
  );
}

export default CodeOutput;