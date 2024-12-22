import React, { useState } from 'react';
import InputForm from './components/InputForm';
import CodeOutput from './components/CodeOutput';

function App() {
  const [generatedCode, setGeneratedCode] = useState({ designCode: '', testbenchCode: '' });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">ChatVerilog</h1>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <InputForm onCodeGenerated={setGeneratedCode} />
        {(generatedCode.designCode || generatedCode.testbenchCode) && (
          <CodeOutput
            designCode={generatedCode.designCode}
            testbenchCode={generatedCode.testbenchCode}
          />
        )}
      </main>
    </div>
  );
}

export default App;