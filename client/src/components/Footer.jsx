import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/95 backdrop-blur-lg shadow-2xl mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-indigo-600 text-xl font-bold mb-2">AI Resume Analyzer</h3>
            <p className="text-gray-600 leading-relaxed">Powered by AI to help you understand and improve your resume</p>
          </div>
          
          <div>
            <h4 className="text-gray-800 text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-indigo-600 transition">Home</a></li>
              <li><a href="/history" className="text-gray-600 hover:text-indigo-600 transition">History</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 text-sm">&copy; {currentYear} AI Resume Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
