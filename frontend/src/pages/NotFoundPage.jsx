import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-6xl text-yellow-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - पेज नहीं मिला
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          हो सकता है कि यह पेज हटा दिया गया हो या URL गलत हो
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn-primary flex items-center">
            <FaHome className="mr-2" />
            होम पेज पर जाएं
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            वापस जाएं
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-gray-500 mb-4">ये पेज भी देख सकते हैं:</p>
          <div className="flex justify-center space-x-6">
            <Link to="/issues" className="text-primary-600 hover:underline">
              सभी Issues
            </Link>
            <Link to="/create-issue" className="text-primary-600 hover:underline">
              नया Issue
            </Link>
            <Link to="/login" className="text-primary-600 hover:underline">
              लॉगिन
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;