import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { 
  FaArrowUp, 
  FaComment, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaShare,
  FaFlag,
  FaExclamationTriangle,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaCopy,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaFileAlt,
  FaMapPin,
  FaLocationArrow,
  FaStreetView,
  FaBuilding,
  FaRoad,
  FaHome,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import issueService from '../../services/issueService';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import CommentSection from './CommentSection';
import Loader from '../Common/Loader';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon based on status
const createCustomIcon = (status) => {
  let color;
  switch(status) {
    case 'resolved':
      color = '#10b981';
      break;
    case 'in_progress':
      color = 'var(--color-accent-500)';
      break;
    case 'rejected':
      color = 'var(--color-danger-500)';
      break;
    default:
      color = 'var(--color-primary-500)';
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Component to fetch address from coordinates
// Component to fetch address from coordinates - FIXED VERSION
const AddressFetcher = ({ lat, lng, onAddressFetched }) => {
  const hasFetched = useRef(false); // Add this ref to track if already fetched

  useEffect(() => {
    // Prevent fetching if already fetched for these coordinates
    if (hasFetched.current) return;
    
    const fetchAddress = async () => {
      try {
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
          const addressParts = {
            full: data.display_name,
            road: data.address?.road || data.address?.pedestrian || '',
            neighbourhood: data.address?.neighbourhood || data.address?.suburb || '',
            city: data.address?.city || data.address?.town || data.address?.village || '',
            state: data.address?.state || '',
            country: data.address?.country || '',
            pincode: data.address?.postcode || ''
          };
          onAddressFetched(addressParts);
          hasFetched.current = true; // Mark as fetched
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        // Try to get approximate location from coordinates as fallback
        const approximateAddress = {
          full: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          road: '',
          neighbourhood: '',
          city: '',
          state: '',
          country: '',
          pincode: ''
        };
        onAddressFetched(approximateAddress);
        hasFetched.current = true;
      }
    };

    fetchAddress();
  }, [lat, lng]); // Remove onAddressFetched from dependencies

  return null;
};

// Status Update Modal Component
const StatusUpdateModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showError } = useAlert();

  const handleSubmit = async () => {
    if (status === currentStatus) {
      showError('कृपया कोई अलग स्टेटस चुनें');
      return;
    }

    setUpdating(true);
    try {
      await onUpdate(status, note);
      onClose();
    } catch (error) {
      showError('स्टेटस अपडेट करने में समस्या हुई');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary-500)' }}>
          स्टेटस अपडेट करें
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              नया स्टेटस चुनें
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500"
            >
              <option value="pending">लंबित</option>
              <option value="in_progress">प्रगति पर</option>
              <option value="resolved">हल हो गया</option>
              <option value="rejected">अस्वीकृत</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              नोट (वैकल्पिक)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="स्टेटस बदलने का कारण..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500"
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            रद्द करें
          </button>
          <button
            onClick={handleSubmit}
            disabled={updating}
            className="flex-1 px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {updating ? (
              <>
                <FaClock className="animate-spin mr-2" />
                अपडेट हो रहा है...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                अपडेट करें
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useAlert();
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [resolvedImageError, setResolvedImageError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [address, setAddress] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await issueService.getIssueById(id);
      setIssue(response.data);
    } catch (error) {
      showError('Issue लोड करने में समस्या हुई');
      navigate('/issues');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      showInfo('कृपया पहले लॉगिन करें');
      navigate('/login', { state: { from: `/issues/${id}` } });
      return;
    }
    
    setUpvoting(true);
    try {
      const response = await issueService.upvoteIssue(id);
      setIssue(prev => ({
        ...prev,
        upvotes: response.data.upvotes,
        userUpvoted: response.data.upvoted
      }));
      showSuccess(response.data.upvoted ? 'Upvote किया गया' : 'Upvote हटा दिया गया');
    } catch (error) {
      showError('Upvote करने में समस्या हुई');
    } finally {
      setUpvoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('क्या आप सच में इस issue को delete करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।')) {
      return;
    }
    
    setDeleting(true);
    try {
      if (isAdmin) {
        await adminService.deleteIssue(id);
      } else {
        await issueService.deleteIssue(id);
      }
      showSuccess('Issue successfully deleted');
      navigate('/issues');
    } catch (error) {
      showError('Delete करने में समस्या हुई');
    } finally {
      setDeleting(false);
    }
  };

const handleStatusUpdate = async (newStatus, note) => {
  setUpdatingStatus(true);
  try {
    const response = await adminService.updateStatus(id, { 
      status: newStatus, 
      note: note 
    });
    
    // Update the issue with the response data
    setIssue(prev => ({
      ...prev,
      status: response.data.status,
      statusNote: response.data.statusNote,
      updatedAt: response.data.updatedAt
    }));
    
    showSuccess('स्टेटस सफलतापूर्वक अपडेट किया गया');
    setShowStatusModal(false);
  } catch (error) {
    showError(error.message || 'स्टेटस अपडेट करने में समस्या हुई');
  } finally {
    setUpdatingStatus(false);
  }
};

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this issue: ${issue.title}`;
    
    let shareUrl;
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    showSuccess('Link copied to clipboard');
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      showError('कृपया रिपोर्ट का कारण बताएं');
      return;
    }
    
    setSubmittingReport(true);
    try {
      await issueService.reportIssue(id, { reason: reportReason });
      showSuccess('Issue reported successfully');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      showError('Report करने में समस्या हुई');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleAddressFetched = (addressData) => {
    setAddress(addressData);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      case 'in_progress':
        return <FaClock className="text-accent-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-danger-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return { text: 'लंबित', color: 'text-yellow-700', bg: 'bg-yellow-100' };
      case 'in_progress':
        return { text: 'प्रगति पर', color: 'text-accent-700', bg: 'bg-accent-100' };
      case 'resolved':
        return { text: 'हल हो गया', color: 'text-green-700', bg: 'bg-green-100' };
      case 'rejected':
        return { text: 'अस्वीकृत', color: 'text-red-700', bg: 'bg-red-100' };
      default:
        return { text: status, color: 'text-gray-700', bg: 'bg-gray-100' };
    }
  };

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <Loader fullScreen />;
  if (!issue) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue नहीं मिला</h2>
        <p className="text-gray-600 mb-4">यह issue मौजूद नहीं है या हटा दिया गया है</p>
        <button
          onClick={() => navigate('/issues')}
          className="btn-primary"
        >
          सभी Issues देखें
        </button>
      </div>
    </div>
  );

  const isOwner = user?._id === issue.user?._id;
  const canEdit = isOwner || isAdmin;
  const coordinates = issue.location?.coordinates;
  const statusConfig = getStatusText(issue.status);
  const imageUrl = getFullImageUrl(issue.image);
  const resolvedImageUrl = getFullImageUrl(issue.resolvedImage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-accent-500)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-primary-500)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <FaChevronLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform" />
          <span>वापस जाएं</span>
        </motion.button>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeImage || (imageError ? '/placeholder-image.jpg' : imageUrl)}
                  alt={issue.title}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                  }}
                />
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
                >
                  <FaTimesCircle />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Modal - Only for non-admin users */}
        <AnimatePresence>
          {showReportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
              onClick={() => setShowReportModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary-500)' }}>
                  Issue रिपोर्ट करें
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  कृपया बताएं कि आप इस issue को क्यों रिपोर्ट करना चाहते हैं
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="रिपोर्ट का कारण..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 mb-4"
                  rows="4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    रद्द करें
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={submittingReport}
                    className="flex-1 px-4 py-2 bg-danger-500 text-white rounded-xl hover:bg-danger-600 transition-colors disabled:opacity-50"
                  >
                    {submittingReport ? 'भेज रहे हैं...' : 'रिपोर्ट करें'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Update Modal - Only for Admin */}
        <AnimatePresence>
          {showStatusModal && (
            <StatusUpdateModal
              isOpen={showStatusModal}
              onClose={() => setShowStatusModal(false)}
              currentStatus={issue.status}
              onUpdate={handleStatusUpdate}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-primary-500)' }}>
                {issue.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                {getStatusIcon(issue.status)}
                {statusConfig.text}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center">
                <FaUser className="mr-1" />
                {issue.user?.name || 'अज्ञात'}
              </span>
              <span className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                {format(new Date(issue.createdAt), 'dd MMMM yyyy', { locale: hi })}
              </span>
              <span className="flex items-center">
                <FaMapPin className="mr-1" style={{ color: 'var(--color-accent-500)' }} />
                श्रेणी: {issue.category}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Admin Status Update Button */}
            {isAdmin && (
              <button
                onClick={() => setShowStatusModal(true)}
                disabled={updatingStatus}
                className="px-4 py-3 bg-accent-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-accent-600 flex items-center gap-2"
              >
                <FaEdit />
                <span>स्टेटस अपडेट करें</span>
              </button>
            )}

            {/* Share Button - Hide for Admin */}
            {!isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <FaShare className="text-gray-600" />
                </button>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10"
                    >
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <FaWhatsapp className="text-green-500" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <FaTwitter className="text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <FaFacebook className="text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        {copySuccess ? <FaCheckCircle className="text-green-500" /> : <FaCopy className="text-gray-600" />}
                        <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Report Button - Only for logged in non-owners and non-admins */}
            {user && !isOwner && !isAdmin && (
              <button
                onClick={() => setShowReportModal(true)}
                className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
                title="Report this issue"
              >
                <FaFlag className="text-gray-600" />
              </button>
            )}

            {/* Edit/Delete Buttons - Only for owners and admins */}
            {canEdit && !isAdmin && (
              <>
                <button
                  onClick={() => navigate(`/issues/${id}/edit`)}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 text-primary-500 hover:text-primary-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 text-danger-500 hover:text-danger-600 disabled:opacity-50"
                >
                  {deleting ? <FaClock className="animate-spin" /> : <FaTrash />}
                </button>
              </>
            )}

            {/* Delete Button Only for Admin - Without Edit */}
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 text-danger-500 hover:text-danger-600 disabled:opacity-50"
                title="Delete Issue"
              >
                {deleting ? <FaClock className="animate-spin" /> : <FaTrash />}
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div 
                className="relative group cursor-pointer bg-gray-100" 
                onClick={() => setShowImageModal(true)}
              >
                {!imageError ? (
                  <img
                    src={imageUrl}
                    alt={issue.title}
                    className="w-full h-[400px] object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <FaImage className="text-5xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Image not available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {issue.resolvedImage && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    समाधान फोटो
                  </h3>
                  <div 
                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                    onClick={() => {
                      setActiveImage(resolvedImageUrl);
                      setShowImageModal(true);
                    }}
                  >
                    {!resolvedImageError ? (
                      <img
                        src={resolvedImageUrl}
                        alt="Resolved"
                        className="w-full h-full object-contain"
                        onError={() => setResolvedImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <FaImage className="text-3xl text-gray-400 mx-auto mb-1" />
                          <p className="text-sm text-gray-500">Image not available</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'var(--color-primary-500)' }}>
                <FaFileAlt className="mr-2" />
                विस्तृत विवरण
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {issue.description}
              </p>

              {/* Metadata Tags */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    श्रेणी: {issue.category}
                  </span>
                  {issue.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CommentSection issueId={id} comments={issue.comments || []} />
            </motion.div>
          </div>

          {/* Right Column - Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">स्थिति</h3>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>प्रगति</span>
                  <span>
                    {issue.status === 'pending' ? '0%' :
                     issue.status === 'in_progress' ? '50%' :
                     issue.status === 'resolved' ? '100%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: issue.status === 'pending' ? '0%' :
                                      issue.status === 'in_progress' ? '50%' :
                                      issue.status === 'resolved' ? '100%' : '0%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full"
                    style={{ backgroundColor: issue.status === 'resolved' ? '#10b981' :
                                           issue.status === 'in_progress' ? 'var(--color-accent-500)' :
                                           issue.status === 'rejected' ? 'var(--color-danger-500)' :
                                           'var(--color-primary-500)' }}
                  />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                    <FaCheckCircle className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">रिपोर्ट किया गया</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(issue.createdAt), 'dd MMM yyyy', { locale: hi })}
                    </p>
                  </div>
                </div>
                
                {issue.status !== 'pending' && (
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5
                      ${issue.status === 'in_progress' ? 'bg-accent-100' : 
                        issue.status === 'resolved' ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                      {issue.status === 'in_progress' ? (
                        <FaClock className="text-accent-500 text-sm" />
                      ) : issue.status === 'resolved' ? (
                        <FaCheckCircle className="text-green-500 text-sm" />
                      ) : (
                        <FaTimesCircle className="text-gray-400 text-sm" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {issue.status === 'in_progress' ? 'प्रगति पर' :
                         issue.status === 'resolved' ? 'हल हो गया' :
                         issue.status === 'rejected' ? 'अस्वीकृत' : ''}
                      </p>
                      {issue.updatedAt && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(issue.updatedAt), 'dd MMM yyyy', { locale: hi })}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Note - Show if admin added a note */}
              {issue.statusNote && (
                <div className="mt-4 p-3 bg-accent-50 rounded-lg">
                  <p className="text-xs font-medium text-accent-700 mb-1">नोट:</p>
                  <p className="text-sm text-gray-700">{issue.statusNote}</p>
                </div>
              )}
            </motion.div>

            {/* Map and Address */}
            {coordinates && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2" style={{ color: 'var(--color-accent-500)' }} />
                  स्थान
                </h3>
                
                {/* Address Display - Now showing properly */}
                <div className="mb-4 p-3 bg-accent-50 rounded-lg">
                  {address ? (
                    <>
                      <p className="text-sm text-gray-700 mb-1 font-medium">पूरा पता:</p>
                      <p className="text-sm text-gray-600">{address.full}</p>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        {address.road && (
                          <div className="flex items-center text-gray-500">
                            <FaRoad className="mr-1" /> {address.road}
                          </div>
                        )}
                        {address.city && (
                          <div className="flex items-center text-gray-500">
                            <FaBuilding className="mr-1" /> {address.city}
                          </div>
                        )}
                        {address.state && (
                          <div className="flex items-center text-gray-500">
                            <FaStreetView className="mr-1" /> {address.state}
                          </div>
                        )}
                        {address.pincode && (
                          <div className="flex items-center text-gray-500">
                            <FaHome className="mr-1" /> {address.pincode}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 animate-pulse">
                        पता लोड हो रहा है...
                      </p>
                    </>
                  )}
                </div>

                {/* Map */}
                <div className="h-64 rounded-xl overflow-hidden">
                  <MapContainer
                    center={[coordinates[1], coordinates[0]]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker 
                      position={[coordinates[1], coordinates[0]]}
                      icon={createCustomIcon(issue.status)}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-medium text-sm">{issue.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{issue.category}</p>
                          {address?.road && (
                            <p className="text-xs text-gray-500 mt-1">{address.road}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Fetch address component */}
                    <AddressFetcher 
                      lat={coordinates[1]} 
                      lng={coordinates[0]} 
                      onAddressFetched={handleAddressFetched} 
                    />
                  </MapContainer>
                </div>
                
                {/* Coordinates */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500">निर्देशांक:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
                  </code>
                </div>
              </motion.div>
            )}

            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              {/* Upvote Button - Hide for Admin */}
              {!isAdmin && (
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4
                    ${issue.userUpvoted 
                      ? 'bg-accent-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <FaArrowUp className={`mr-2 ${upvoting ? 'animate-bounce' : ''}`} />
                  {issue.upvotes} {issue.upvotes === 1 ? 'Upvote' : 'Upvotes'}
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <FaComment className="mx-auto text-xl text-gray-600 mb-1" />
                  <span className="text-lg font-semibold">{issue.comments?.length || 0}</span>
                  <p className="text-xs text-gray-600">टिप्पणियाँ</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <FaShieldAlt className="mx-auto text-xl text-gray-600 mb-1" />
                  <span className="text-lg font-semibold">{issue.views || 0}</span>
                  <p className="text-xs text-gray-600">देखा गया</p>
                </div>
              </div>

              {/* Location Info */}
              {coordinates && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaLocationArrow className="mr-2 text-accent-500" />
                    <span>सटीकता: {issue.location?.accuracy ? `${issue.location.accuracy}m` : '±10m'}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;