import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkedAlt, 
  FaUsers, 
  FaCheckCircle, 
  FaClock,
  FaArrowRight,
  FaCamera,
  FaMapPin,
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaFilter,
  FaLocationArrow,
  FaExclamationTriangle,
  FaLightbulb,
  FaWater,
  FaBolt,
  FaTrash,
  FaRoad,
  FaBuilding
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import issueService from '../services/issueService';
import IssueCard from '../components/Issues/IssueCard';
import Loader from '../components/Common/Loader';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Map Controller Component
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Category icons mapping
const categoryIcons = {
  road: FaRoad,
  electricity: FaBolt,
  water: FaWater,
  garbage: FaTrash,
  streetlight: FaLightbulb,
  other: FaExclamationTriangle
};

const HomePage = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([28.7041, 77.1025]); // Delhi default
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const statsRef = useRef(null);

  useEffect(() => {
    fetchData();
    getUserLocation();
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get recent issues
      const issuesRes = await issueService.getIssues({ limit: 6 });
      setRecentIssues(issuesRes.data);

      // Get stats from issues
      const allIssues = await issueService.getIssues({ limit: 100 });
      const issues = allIssues.data;
      
      setStats({
        total: allIssues.total || issues.length,
        resolved: issues.filter(i => i.status === 'resolved').length,
        pending: issues.filter(i => i.status === 'pending').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        users: [...new Set(issues.map(i => i.user?._id))].length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userLoc);
          setMapCenter(userLoc);
        },
        (error) => {
          console.log('Using default location');
        }
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const statCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          style={{ backgroundColor: 'var(--color-accent-500)' }}
        >
          <FaChevronUp className="text-white text-xl group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br opacity-90"
            style={{ 
              background: `linear-gradient(135deg, ${'var(--color-primary-500)'} 0%, ${'var(--color-primary-700)'} 100%)`
            }} 
          />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="white" />
            </svg>
          </div>
        </div>

        <div className="relative container-custom min-h-[600px] flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center py-20">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  style={{ backgroundColor: 'var(--color-accent-500)', color: 'white' }}
                >
                  🏙️ नागरिक सहभागिता मंच
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                अपने शहर की समस्याओं को{' '}
                <span style={{ color: 'var(--color-accent-500)' }}>
                  करें रिपोर्ट
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl text-white/90 mb-8 max-w-lg"
              >
                सड़क, बिजली, पानी या कचरे की समस्या हो, तुरंत रिपोर्ट करें और समाधान पाएं। आपकी आवाज़, आपका शहर।
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link
                  to="/create-issue"
                  className="group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center"
                  style={{ 
                    backgroundColor: 'var(--color-accent-500)',
                    color: 'white'
                  }}
                >
                  <FaCamera className="mr-2 group-hover:rotate-12 transition-transform" />
                  रिपोर्ट करें
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/issues"
                  className="group px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-300 flex items-center"
                >
                  <FaMapMarkedAlt className="mr-2" />
                  देखें सभी Issues
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants} className="mt-12 flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">{stats.total}+</div>
                  <div className="text-white/70">कुल रिपोर्ट्स</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.resolved}+</div>
                  <div className="text-white/70">समाधान हुए</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.users}+</div>
                  <div className="text-white/70">सक्रिय नागरिक</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Illustration */}
           
<motion.div
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.5 }}
  className="hidden md:flex justify-center items-center relative"
>
  
  {/* Glow Background */}
  <div className="absolute w-[420px] h-[420px] bg-accent-500/20 blur-3xl rounded-full" />

  {/* Floating Image */}
  <motion.img
    src="https://cdni.iconscout.com/illustration/premium/thumb/city-reporting-illustration-4557376-3784089.png"
    alt="Report Issue Illustration"
    className="relative z-10 w-[420px] max-w-full drop-shadow-2xl"
    animate={{ y: [0, -18, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />

</motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection(statsRef)}
        >
          <FaChevronDown className="text-white text-2xl" />
        </motion.div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section ref={statsRef} className="py-20 relative">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-primary-500)' }}>
              हमारी उपलब्धियां
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              आपके सहयोग से हम शहर को बेहतर बना रहे हैं
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${'var(--color-primary-500)'}, ${'var(--color-accent-500)'})` }}
              />
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: 'var(--color-primary-100)' }}
                >
                  <FaMapMarkedAlt className="text-3xl" style={{ color: 'var(--color-primary-500)' }} />
                </div>
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: 'var(--color-primary-500)' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {stats.total}+
                </motion.div>
                <div className="text-gray-600 font-medium">कुल रिपोर्ट्स</div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              />
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-green-100">
                  <FaCheckCircle className="text-3xl text-green-600" />
                </div>
                <motion.div 
                  className="text-4xl font-bold mb-2 text-green-600"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {stats.resolved}+
                </motion.div>
                <div className="text-gray-600 font-medium">समाधान हुए</div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${'var(--color-accent-500)'}, #d97706)` }}
              />
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: 'var(--color-accent-100)' }}
                >
                  <FaClock className="text-3xl" style={{ color: 'var(--color-accent-500)' }} />
                </div>
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: 'var(--color-accent-500)' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {stats.pending}
                </motion.div>
                <div className="text-gray-600 font-medium">लंबित</div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              />
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-blue-100">
                  <FaUsers className="text-3xl text-blue-600" />
                </div>
                <motion.div 
                  className="text-4xl font-bold mb-2 text-blue-600"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {stats.users}+
                </motion.div>
                <div className="text-gray-600 font-medium">सक्रिय नागरिक</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-primary-500)' }}>
              कैसे काम करता है
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              तीन सरल कदमों में अपनी समस्या का समाधान पाएं
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative text-center group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity" />
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold" style={{ color: 'var(--color-primary-500)' }}>1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
                  रिपोर्ट करें
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  फोटो खींचें, लोकेशन मार्क करें और समस्या की पूरी जानकारी दें
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative text-center group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity" />
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold" style={{ color: 'var(--color-primary-500)' }}>2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
                  ट्रैक करें
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  अपनी रिपोर्ट की स्थिति देखें और रियल-टाइम अपडेट पाएं
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative text-center group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity" />
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold" style={{ color: 'var(--color-primary-500)' }}>3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-primary-500)' }}>
                  समाधान पाएं
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  प्रशासन द्वारा समस्या का समाधान होने पर नोटिफिकेशन मिले
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;