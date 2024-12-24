import React, { useState } from 'react';
import { generateVerilogCode } from '../services/geminiService';

function FileUpload({ onCodeGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result.split(',')[1];
          const prompt = `Analyze this circuit diagram image and generate Verilog code.
            1. First, identify the circuit components and their connections
            2. Create a Verilog design module that implements this circuit
            3. Create a comprehensive testbench that verifies the functionality
            
            Return the response in the following format:
            ---DESIGN---
            [design code here]
            ---TESTBENCH---
            [testbench code here]`;
          
          const { designCode, testbenchCode } = await generateVerilogCode(prompt, base64Data);
          onCodeGenerated({ designCode, testbenchCode });
        } catch (err) {
          setError('Error processing image: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setLoading(false);
      };
    } catch (err) {
      setError('Error processing image: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="max-w-xl">
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium text-gray-600">
              {loading ? 'Processing...' : 'Drop circuit diagram or click to upload'}
            </span>
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
