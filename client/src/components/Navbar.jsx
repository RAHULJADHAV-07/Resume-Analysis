import { Link, useLocation } from 'react-router-dom';
import { FaBrain, FaHistory, FaHome } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resumes');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-indigo-600 text-2xl font-bold transition-transform hover:text-indigo-700 hover:scale-105">
          <FaBrain className="text-4xl" />
          <span>AI Resume Analyzer</span>
        </Link>
        
        <ul className="flex gap-8 items-center">
          <li>
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                location.pathname === '/' 
                  ? 'text-indigo-600 bg-indigo-100' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/history" 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                location.pathname === '/history' 
                  ? 'text-indigo-600 bg-indigo-100' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <FaHistory />
              <span>History</span>
            </Link>
          </li>
          <li>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
              backendStatus === 'online' 
                ? 'bg-green-100 text-green-700' 
                : backendStatus === 'offline'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' 
                  ? 'bg-green-500 animate-pulse' 
                  : backendStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
              }`} />
              <span className="text-sm">
                {backendStatus === 'online' ? 'Backend Online' : backendStatus === 'offline' ? 'Backend Offline' : 'Checking...'}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
