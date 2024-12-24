import { useState } from 'react';
import InputForm from './components/InputForm';
import CodeOutput from './components/CodeOutput';

function App() {
  const [generatedCode, setGeneratedCode] = useState({ designCode: '', testbenchCode: '' });
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
    setIsExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-xl font-medium text-white">ChatVerilog</h1>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-500 ease-in-out ${
          isExpanded ? 'py-12' : 'py-6'
        }`}>
          <div className={`transition-all duration-500 ease-in-out ${
            isExpanded ? 'mb-12' : 'mb-0'
          }`}>
            <h1 className={`text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-white to-white text-transparent bg-clip-text transition-all duration-500 ease-in-out ${
              isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'
            }`}>
              Generate Verilog Code with AI
            </h1>
            <p className={`text-gray-400 text-center text-lg transition-all duration-500 ease-in-out ${
              isExpanded ? 'opacity-100 transform translate-y-0 mt-4' : 'opacity-0 transform -translate-y-10'
            }`}>
              Describe your circuit or upload a diagram - we'll handle the rest
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <InputForm 
              onCodeGenerated={handleCodeGenerated} 
              isExpanded={isExpanded}
              onExpand={() => setIsExpanded(true)}
            />
            <div className={`transition-all duration-500 ease-in-out ${
              !isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10 hidden'
            }`}>
              {(generatedCode.designCode || generatedCode.testbenchCode) && (
                <CodeOutput
                  designCode={generatedCode.designCode}
                  testbenchCode={generatedCode.testbenchCode}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

