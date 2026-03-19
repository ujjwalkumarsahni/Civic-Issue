import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FaMapMarkedAlt, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaCog,
  FaBars,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Color classes based on the specified palette
  const colors = {
    primary: '#0B234A',    // Dark Navy
    accent: '#EA8E0A',     // Orange
    danger: '#E22213'      // Red
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: colors.primary }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaMapMarkedAlt 
              className="text-2xl transition-transform duration-300 group-hover:scale-110" 
              style={{ color: colors.accent }}
            />
            <span className="font-bold text-xl text-white">
              CivicConnect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            
            <Link 
              to="/issues" 
              className="text-white px-3 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              सभी Issues
            </Link>

            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="text-whitepx-3 text-white py-2 rounded-lg transition-all duration-300 flex items-center font-medium"
                >
                  <FaSignInAlt className="mr-2" /> लॉगिन
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.primary
                  }}
                >
                  <FaUserPlus className="mr-2" /> रजिस्टर
                </Link>
              </>
            ) : (
              <>
                {/* Only Normal Users Can Create Issue */}
                {!isAdmin && (
                  <Link
                    to="/create-issue"
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg hover:scale-105"
                    style={{ 
                      backgroundColor: colors.accent,
                      color: colors.primary
                    }}
                  >
                    + नया Issue
                  </Link>
                )}

                {/* Admin Panel Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-white px-3 py-2 rounded-lg transition-all duration-300 flex items-center font-medium"
                  >
                    <FaCog className="mr-2" style={{ color: colors.accent }} /> Admin
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2  px-3 py-2 rounded-lg transition-all duration-300 text-white font-medium"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <FaUser style={{ color: colors.primary, fontSize: '0.9rem' }} />
                    </div>
                    <span>{user?.name?.split(' ')[0]}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium" style={{ color: colors.primary }}>{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700  transition-colors duration-200"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        प्रोफाइल
                      </Link>
                      
                      {!isAdmin && (
                        <Link 
                          to="/my-issues" 
                          className="block px-4 py-2 text-gray-700 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          मेरे Issues
                        </Link>
                      )}
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 flex items-center transition-colors duration-200"
                        style={{ color: colors.danger }}
                      >
                        <FaSignOutAlt className="mr-3" /> लॉगआउट
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-300"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20 animate-slideDown">
            <div className="flex flex-col space-y-2">
              
              <Link 
                to="/issues" 
                className="text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                onClick={toggleMobileMenu}
              >
                सभी Issues
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="text-white hover:bg-opacity-20 hover:bg-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center font-medium"
                    onClick={toggleMobileMenu}
                  >
                    <FaSignInAlt className="mr-3" /> लॉगिन
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
                    style={{ 
                      backgroundColor: colors.accent,
                      color: colors.primary
                    }}
                    onClick={toggleMobileMenu}
                  >
                    <FaUserPlus className="mr-3" /> रजिस्टर
                  </Link>
                </>
              ) : (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <FaUser style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-sm text-white text-opacity-80">{user?.email}</p>
                    </div>
                  </div>

                  {/* Only Normal Users Can Create Issue */}
                  {!isAdmin && (
                    <Link
                      to="/create-issue"
                      className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                      onClick={toggleMobileMenu}
                    >
                      + नया Issue
                    </Link>
                  )}

                  {/* Admin Panel Link */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-white hover:bg-opacity-20 hover:bg-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center font-medium"
                      onClick={toggleMobileMenu}
                    >
                      <FaCog className="mr-3" style={{ color: colors.accent }} /> Admin
                    </Link>
                  )}

                  <Link 
                    to="/profile" 
                    className="text-white hover:bg-opacity-20 hover:bg-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                    onClick={toggleMobileMenu}
                  >
                    प्रोफाइल
                  </Link>
                  
                  {!isAdmin && (
                    <Link 
                      to="/my-issues" 
                      className="text-white hover:bg-opacity-20 hover:bg-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      onClick={toggleMobileMenu}
                    >
                      मेरे Issues
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium flex items-center"
                    style={{ backgroundColor: colors.danger, color: 'white' }}
                  >
                    <FaSignOutAlt className="mr-3" /> लॉगआउट
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;