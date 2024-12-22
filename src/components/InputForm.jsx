import React, { useState, useRef } from 'react';
import { generateVerilogCode } from '../services/geminiService';

function InputForm({ onCodeGenerated }) {
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
    <div className="p-4 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your Verilog design
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the Verilog design you want to generate..."
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload circuit diagram or image (optional)
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
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
                <p className="text-green-600">Image uploaded successfully!</p>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="mt-2 text-red-600 text-sm"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-blue-600 hover:text-blue-800"
              >
                Drop an image here or click to upload
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading || (!description && !image)}
        >
          {loading ? 'Generating Code...' : 'Generate Verilog Code'}
        </button>
      </form>
    </div>
  );
}

export default InputForm;
