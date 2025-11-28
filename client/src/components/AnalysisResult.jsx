import { FaBriefcase, FaLightbulb, FaUser, FaClock } from 'react-icons/fa';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const { data } = result;

  return (
    <div className="mt-8 animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-indigo-600 text-4xl font-bold mb-2">Analysis Complete! 🎉</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <FaClock />
          <span>Processed in {data.processingTime}ms</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Professional Summary */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-600 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-2xl text-indigo-600" />
            <h3 className="text-gray-800 text-xl font-semibold">Professional Summary</h3>
          </div>
          <p className="text-gray-800 leading-relaxed text-base">{data.analysis.summary}</p>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-600 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaLightbulb className="text-2xl text-indigo-600" />
            <h3 className="text-gray-800 text-xl font-semibold">Key Skills</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.analysis.skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-center font-semibold text-sm transition transform hover:-translate-y-1 hover:shadow-lg"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Roles */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-600 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaBriefcase className="text-2xl text-indigo-600" />
            <h3 className="text-gray-800 text-xl font-semibold">Suggested Job Roles</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {data.analysis.suggestedRoles.map((role, index) => (
              <li 
                key={index} 
                className="bg-gray-50 p-4 pl-12 rounded-xl text-gray-800 font-medium relative transition hover:bg-indigo-50 hover:translate-x-2 before:content-['💼'] before:absolute before:left-4 before:text-xl"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-8 pt-6 border-t-2 border-gray-200 text-gray-600 text-sm">
        <p className="mb-2">
          <strong className="text-gray-800">Analyzed for:</strong> {data.userName} ({data.userEmail})
        </p>
        {data.fileName && (
          <p>
            <strong className="text-gray-800">File:</strong> {data.fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
