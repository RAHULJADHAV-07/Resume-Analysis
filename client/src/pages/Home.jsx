import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaKeyboard, FaRocket } from 'react-icons/fa';
import { resumeService } from '../services/api';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResult from '../components/AnalysisResult';

const Home = () => {
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'text'
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail.trim() || !emailRegex.test(userEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (inputMethod === 'file' && !selectedFile) {
      toast.error('Please select a file to upload');
      return false;
    }

    if (inputMethod === 'text' && resumeText.trim().length < 50) {
      toast.error('Resume text is too short. Please provide more details.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setResult(null);

    try {
      let response;

      if (inputMethod === 'file') {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('userName', userName);
        formData.append('userEmail', userEmail);

        response = await resumeService.analyzeFromFile(formData);
      } else {
        response = await resumeService.analyzeFromText({
          userName,
          userEmail,
          resumeText,
        });
      }

      setResult(response);
      toast.success('Resume analyzed successfully!');

      // Clear form
      setSelectedFile(null);
      setResumeText('');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error(
        error.response?.data?.message || 'Failed to analyze resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserName('');
    setUserEmail('');
    setSelectedFile(null);
    setResumeText('');
    setResult(null);
    setInputMethod('file');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">AI Resume Analyzer</h1>
        <p className="text-xl text-white/95 font-light">
          Get instant insights about your resume powered by AI
        </p>
      </div>

      <div className="px-4">
        {!result ? (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex gap-4 mb-8 p-2 bg-gray-100 rounded-xl">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg font-semibold text-base transition-all ${
                  inputMethod === 'file'
                    ? 'bg-white text-indigo-600 border-2 border-indigo-600 shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setInputMethod('file')}
              >
                <FaUpload />
                <span>Upload File</span>
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg font-semibold text-base transition-all ${
                  inputMethod === 'text'
                    ? 'bg-white text-indigo-600 border-2 border-indigo-600 shadow-md'
                    : 'bg-transparent text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setInputMethod('text')}
              >
                <FaKeyboard />
                <span>Paste Text</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="userName" className="block mb-2 font-semibold text-gray-800">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="userName"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base transition focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="userEmail" className="block mb-2 font-semibold text-gray-800">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base transition focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>

              {inputMethod === 'file' ? (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleClearFile}
                />
              ) : (
                <div className="mb-6">
                  <label htmlFor="resumeText" className="block mb-2 font-semibold text-gray-800">
                    Resume Text *
                  </label>
                  <textarea
                    id="resumeText"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base resize-y min-h-[300px] transition focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows="12"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-2 text-right">
                    Character count: {resumeText.length}
                  </p>
                </div>
              )}

              {loading ? (
                <LoadingSpinner message="Analyzing your resume with AI..." />
              ) : (
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition hover:bg-indigo-700 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 mt-4"
                >
                  <FaRocket />
                  <span>Analyze Resume</span>
                </button>
              )}
            </form>
          </div>
        ) : (
          <>
            <AnalysisResult result={result} />
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={handleReset} 
                className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold transition hover:bg-indigo-700 transform hover:-translate-y-1"
              >
                Analyze Another Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
