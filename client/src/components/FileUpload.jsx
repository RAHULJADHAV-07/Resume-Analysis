import { useState } from 'react';
import { FaUpload, FaFileAlt, FaTimes } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, selectedFile, onClear }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['application/pdf', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or TXT file only');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should not exceed 5MB');
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="my-6">
      {!selectedFile ? (
        <div
          className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all bg-gray-50 ${
            dragActive 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-600 hover:bg-indigo-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FaUpload className="text-5xl text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-800 mb-2">
            Drag and drop your resume here, or{' '}
            <label htmlFor="file-input" className="text-indigo-600 font-semibold underline cursor-pointer hover:text-indigo-700">
              browse
            </label>
          </p>
          <p className="text-sm text-gray-500">Supports: PDF, TXT (Max 5MB)</p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-300">
          <FaFileAlt className="text-4xl text-indigo-600" />
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800 mb-1">{selectedFile.name}</p>
            <p className="text-sm text-gray-600">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button 
            className="bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-600 transition transform hover:scale-110"
            onClick={onClear}
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
