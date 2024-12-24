import React, { useState, useRef } from 'react';
import { generateVerilogCode } from '../services/geminiService';

function InputForm({ onCodeGenerated, isExpanded, onExpand }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result.split(',')[1];
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateVerilogCode(description, image);
      onCodeGenerated(result);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleImageUpload({ target: { files: [file] } });
    }
  };

  return (
    <div className={`bg-[#1C1C1C] rounded-2xl shadow-2xl border border-[#2D2D2D] overflow-hidden transition-all duration-500 ease-in-out ${
      isExpanded ? '' : 'ring-1 ring-blue-500'
    }`}>
      <form onSubmit={handleSubmit}>
        <div className={`transition-all duration-500 ease-in-out ${
          isExpanded ? 'p-6' : 'p-3'
        }`}>
          <div className={`transition-all duration-500 ease-in-out ${
            isExpanded ? 'space-y-6' : 'flex items-center space-x-4'
          }`}>
            <div className={`transition-all duration-500 ease-in-out ${
              isExpanded ? 'w-full' : 'flex-1'
            }`}>
              <label className={`block text-sm font-medium text-gray-300 mb-2 transition-all duration-500 ${
                isExpanded ? 'opacity-100' : 'opacity-0 hidden'
              }`}>
                Describe your Verilog design
              </label>
              <textarea
                className={`w-full bg-[#2D2D2D] border border-[#3D3D3D] rounded-xl 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-100 placeholder-gray-500 transition-all duration-500
                  ${isExpanded ? 'p-4' : 'p-2 h-10'}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isExpanded ? "Describe the digital circuit..." : "Click to describe or upload a new circuit..."}
                rows={isExpanded ? 4 : 1}
                onClick={!isExpanded ? onExpand : undefined}
                readOnly={!isExpanded}
              />
            </div>

            <div className={`transition-all duration-500 ease-in-out ${
              isExpanded ? '' : 'flex-shrink-0'
            }`}>
              <label className={`block text-sm font-medium text-gray-300 mb-2 transition-opacity duration-500 ${
                isExpanded ? 'opacity-100' : 'opacity-0 hidden'
              }`}>
                Upload circuit diagram (optional)
              </label>
              <div className={`border-2 border-dashed border-[#3D3D3D] rounded-xl
                text-center bg-[#2D2D2D] transition-all duration-500 
                hover:border-blue-500 hover:bg-[#2D2D2D]/50
                ${isExpanded ? 'p-8' : 'p-2'}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {image ? (
                  <div className="mt-2">
                    <p className="text-emerald-400 font-medium">Image uploaded successfully!</p>
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="mt-2 text-red-400 text-sm hover:text-red-300 transition-colors duration-200"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-gray-400 hover:text-blue-400 flex items-center justify-center w-full transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Drop an image here or click to upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${
          isExpanded ? 'px-6 py-4 bg-[#151515] border-t border-[#2D2D2D]' : 'hidden'
        }`}>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium
              hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#151515]
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
              flex items-center justify-center space-x-2"
            disabled={loading || (!description && !image)}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating Code...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <span>Generate Verilog Code</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InputForm;
