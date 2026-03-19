import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { 
  FaMapMarkerAlt, 
  FaComment, 
  FaImage,
  FaEye,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRoad,
  FaBolt,
  FaWater,
  FaTrash,
  FaLightbulb,
  FaQuestionCircle,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-800', 
      text: 'लंबित',
      icon: FaClock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    in_progress: { 
      color: 'bg-blue-100 text-blue-800', 
      text: 'प्रगति पर',
      icon: FaClock,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    resolved: { 
      color: 'bg-green-100 text-green-800', 
      text: 'हल हो गया',
      icon: FaCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    rejected: { 
      color: 'bg-red-100 text-red-800', 
      text: 'अस्वीकृत',
      icon: FaExclamationTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`${config.color} text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
      <Icon className="text-xs" />
      {config.text}
    </span>
  );
};

// Category Icon Component
const CategoryIcon = ({ category }) => {
  const getCategoryConfig = (category) => {
    const configs = {
      'Garbage': { icon: FaTrash, color: '#10b981', bgColor: 'bg-green-100' },
      'Water Leakage': { icon: FaWater, color: '#3b82f6', bgColor: 'bg-blue-100' },
      'Road Damage': { icon: FaRoad, color: '#8b5cf6', bgColor: 'bg-purple-100' },
      'Street Light': { icon: FaLightbulb, color: '#f59e0b', bgColor: 'bg-yellow-100' },
      'Electricity': { icon: FaBolt, color: '#ef4444', bgColor: 'bg-red-100' },
    };
    
    return configs[category] || { icon: FaQuestionCircle, color: '#6b7280', bgColor: 'bg-gray-100' };
  };

  const config = getCategoryConfig(category);
  const Icon = config.icon;

  return (
    <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
      <Icon style={{ color: config.color }} className="text-sm" />
    </div>
  );
};

// Priority Indicator
const PriorityIndicator = ({ priority }) => {
  const priorityConfig = {
    high: { color: 'bg-red-500', text: 'उच्च' },
    medium: { color: 'bg-yellow-500', text: 'मध्यम' },
    low: { color: 'bg-green-500', text: 'निम्न' }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-gray-500">{config.text}</span>
    </div>
  );
};

// Truncate location text function
const truncateLocation = (location, maxLength = 30) => {
  if (!location) return '';
  if (location.length <= maxLength) return location;
  return location.substring(0, maxLength) + '...';
};

const IssueCard = ({ issue, featured = false, onSave }) => {
  const { user } = useAuth();
  const { showInfo } = useAlert();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
    locale: hi,
  });

  const formattedDate = format(new Date(issue.createdAt), 'dd MMM yyyy', { locale: hi });

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showInfo('कृपया पहले लॉगिन करें');
      return;
    }
    
    setIsSaved(!isSaved);
    if (onSave) onSave(issue._id, !isSaved);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showInfo('कृपया पहले लॉगिन करें');
      return;
    }
    
    setIsLiked(!isLiked);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.origin + `/issues/${issue._id}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/issues/${issue._id}`);
      showInfo('Link copied to clipboard');
    }
  };

  // Get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const imageUrl = getFullImageUrl(issue.image);
  
  // Get location text (use address if available, otherwise coordinates)
  const locationText = issue.location?.address || 
    (issue.location?.coordinates 
      ? `${issue.location.coordinates[1].toFixed(4)}, ${issue.location.coordinates[0].toFixed(4)}`
      : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group ${featured ? 'lg:col-span-2' : ''}`}
    >
      <Link to={`/issues/${issue._id}`} className="block h-full">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {!imageError ? (
              <img
                src={imageUrl}
                alt={issue.title}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <FaImage className="text-4xl text-gray-400" />
              </div>
            )}
            
            {/* Loading Skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-10">
              <StatusBadge status={issue.status} />
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
                <CategoryIcon category={issue.category} />
                <span className="text-gray-700">{issue.category}</span>
              </div>
            </div>

            {/* Quick Actions Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute top-3 left-3 z-10 flex gap-2"
            >
              <button
                onClick={handleSave}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                {isSaved ? (
                  <FaBookmark className="text-accent-500" />
                ) : (
                  <FaRegBookmark className="text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <FaShare className="text-gray-600 text-sm" />
              </button>
            </motion.div>

            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  विशेष
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-accent-500 transition-colors">
              {issue.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {issue.description}
            </p>

            {/* Location - with truncation */}
            {locationText && (
              <div className="flex items-center text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
                <FaMapMarkerAlt className="mr-1.5 flex-shrink-0 text-xs" style={{ color: 'var(--color-accent-500)' }} />
                <span className="truncate" title={locationText}>
                  {truncateLocation(locationText, 35)}
                </span>
              </div>
            )}

            {/* Stats - Only Comments and Likes count with icons */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
              {/* Left side - empty or can add category tag */}
              <div className="text-xs text-gray-400">
                {formattedDate}
              </div>
              
              {/* Right side - Comments and Likes */}
              <div className="flex items-center gap-4">
                {/* Comments */}
                <div className="flex items-center gap-1.5 text-gray-600">
                  <FaComment className="text-sm text-blue-500" />
                  <span className="text-sm font-medium">{issue.comments?.length || 0}</span>
                </div>
                
                {/* Likes */}
                <button onClick={handleLike} className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors">
                  {isLiked ? (
                    <FaHeart className="text-sm text-red-500" />
                  ) : (
                    <FaRegHeart className="text-sm" />
                  )}
                  <span className="text-sm font-medium">{issue.upvotes || 0}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hover Border Effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default IssueCard;