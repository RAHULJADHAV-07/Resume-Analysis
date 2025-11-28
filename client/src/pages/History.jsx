import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaEye, FaSearch, FaClock, FaEnvelope } from 'react-icons/fa';
import { resumeService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async (email = '') => {
    setLoading(true);
    try {
      const params = email ? { email } : {};
      const response = await resumeService.getAll(params);
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resume history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResumes(searchEmail);
  };

  const handleClearSearch = () => {
    setSearchEmail('');
    fetchResumes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await resumeService.delete(id);
      setResumes(resumes.filter((resume) => resume._id !== id));
      if (selectedResume?._id === id) {
        setSelectedResume(null);
      }
      toast.success('Analysis deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete analysis');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await resumeService.getById(id);
      setSelectedResume(response.data);
    } catch (error) {
      console.error('Error fetching resume details:', error);
      toast.error('Failed to fetch resume details');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">Resume Analysis History</h1>
        <p className="text-lg text-white/95">View and manage your previous analyses</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Search by email address..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl transition focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <button 
            type="submit" 
            className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold transition hover:bg-indigo-700"
          >
            Search
          </button>
          {searchEmail && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold transition hover:bg-gray-200"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading history..." />
      ) : resumes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-2xl text-center">
          <p className="text-gray-600 text-lg">
            {searchEmail
              ? 'No analyses found for this email'
              : 'No resume analyses yet. Upload your first resume to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="bg-white rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-800 text-xl font-bold">{resume.userName}</h3>
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                    <FaEnvelope /> {resume.userEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(resume._id)}
                    className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition transform hover:scale-110"
                    title="View details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="w-9 h-9 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition transform hover:scale-110"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                {resume.fileName && (
                  <p className="text-gray-700 font-medium mb-2">📄 {resume.fileName}</p>
                )}
                <div className="flex gap-6 flex-wrap">
                  <span className="text-gray-600 text-sm flex items-center gap-2">
                    <FaClock /> {formatDate(resume.createdAt)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ⚡ {resume.processingTime}ms
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-gray-700 mb-2 text-sm">
                  <strong className="text-indigo-600">Skills:</strong>{' '}
                  {resume.analysis.skills.slice(0, 3).join(', ')}
                  {resume.analysis.skills.length > 3 && '...'}
                </div>
                <div className="text-gray-700 text-sm">
                  <strong className="text-indigo-600">Top Role:</strong> {resume.analysis.suggestedRoles[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResume && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedResume(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b-2 border-gray-200">
              <h2 className="text-indigo-600 text-3xl font-bold">Analysis Details</h2>
              <button
                onClick={() => setSelectedResume(null)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-3xl transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-gray-800 text-lg font-semibold mb-3">User Information</h3>
                <p className="text-gray-700 mb-2 leading-relaxed">
                  <strong>Name:</strong> {selectedResume.userName}
                </p>
                <p className="text-gray-700 mb-2 leading-relaxed">
                  <strong>Email:</strong> {selectedResume.userEmail}
                </p>
                {selectedResume.fileName && (
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    <strong>File:</strong> {selectedResume.fileName}
                  </p>
                )}
                <p className="text-gray-700 leading-relaxed">
                  <strong>Date:</strong> {formatDate(selectedResume.createdAt)}
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 text-lg font-semibold mb-3">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">{selectedResume.analysis.summary}</p>
              </div>

              <div>
                <h3 className="text-gray-800 text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.analysis.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-800 text-lg font-semibold mb-3">Suggested Roles</h3>
                <ul className="space-y-2">
                  {selectedResume.analysis.suggestedRoles.map((role, index) => (
                    <li 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg text-gray-700"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
