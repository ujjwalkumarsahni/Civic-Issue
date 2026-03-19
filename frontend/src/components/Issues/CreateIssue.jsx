import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaMapMarkerAlt, 
  FaCamera,
  FaTrash,
  FaCrosshairs,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRoad,
  FaBolt,
  FaWater,
  FaTrash as FaTrashIcon,
  FaLightbulb,
  FaQuestionCircle,
  FaArrowLeft,
  FaImage,
  FaInfoCircle,
  FaTimes,
  FaSearch 
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import issueService from '../../services/issueService';
import { useAlert } from '../../context/AlertContext';
import useLocation from '../../hooks/useLocation';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${isSelected ? 'var(--color-accent-500)' : 'var(--color-primary-500)'};
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
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

// Location Marker Component
function LocationMarker({ position, setPosition, address, setAddress }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const map = useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());
      getAddressFromCoordinates(newPos[0], newPos[1]);
    },
    dragstart() {
      setIsDragging(true);
    },
    dragend() {
      setIsDragging(false);
    }
  });

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('पता प्राप्त करने में समस्या');
    }
  };

  return position ? (
    <Marker 
      position={position} 
      icon={createCustomIcon(true)}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = [marker.getLatLng().lat, marker.getLatLng().lng];
          setPosition(newPos);
          getAddressFromCoordinates(newPos[0], newPos[1]);
        }
      }}
    >
      {isDragging && (
        <Circle
          center={position}
          radius={50}
          pathOptions={{ 
            color: 'var(--color-accent-500)', 
            fillColor: 'var(--color-accent-500)',
            fillOpacity: 0.1
          }}
        />
      )}
    </Marker>
  ) : null;
}

// Form validation schema
const issueSchema = z.object({
  title: z
    .string()
    .min(1, 'शीर्षक आवश्यक है')
    .min(5, 'शीर्षक कम से कम 5 अक्षर का होना चाहिए')
    .max(100, 'शीर्षक 100 अक्षरों से कम होना चाहिए'),
  
  category: z
    .string()
    .min(1, 'श्रेणी चुनें'),
  
  description: z
    .string()
    .min(1, 'विवरण आवश्यक है')
    .min(20, 'विवरण कम से कम 20 अक्षर का होना चाहिए')
    .max(2000, 'विवरण 2000 अक्षरों से कम होना चाहिए'),
  
  terms: z
    .boolean()
    .refine(val => val === true, 'नियम व शर्तें स्वीकार करें')
});

const CreateIssue = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useAlert();
  const { location: userLocation, loading: locationLoading, error: locationError } = useLocation();
  
  const [position, setPosition] = useState(
    userLocation ? [userLocation.lat, userLocation.lng] : [28.7041, 77.1025]
  );
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(issueSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: '',
      description: '',
      terms: false
    }
  });

  const formValues = watch();

  // Update position when user location loads
  useEffect(() => {
    if (userLocation && !position) {
      const newPos = [userLocation.lat, userLocation.lng];
      setPosition(newPos);
      getAddressFromCoordinates(newPos[0], newPos[1]);
    }
  }, [userLocation]);

  // Get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Search location
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
      showError('Location खोजने में समस्या हुई');
    } finally {
      setSearching(false);
    }
  };

  // Handle location selection from search
  const handleLocationSelect = (result) => {
    const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    setAddress(result.display_name);
    setShowLocationSearch(false);
    setSearchQuery('');
  };

  // Handle drag events for image upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageFile(file);
  };

  const handleImageFile = (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('कृपया केवल image फाइल अपलोड करें');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image 5MB से छोटी होनी चाहिए');
      return;
    }
    
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data) => {
    if (!selectedImage) {
      showError('कृपया एक image अपलोड करें');
      return;
    }

    if (!position) {
      showError('कृपया location चुनें');
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('longitude', position[1]);
    formData.append('latitude', position[0]);
    formData.append('image', selectedImage);

    try {
      const response = await issueService.createIssue(formData);
      showSuccess('Issue successfully reported!', {
        duration: 5000,
        icon: '🎉'
      });
      navigate(`/issues/${response.data._id}`);
    } catch (error) {
      showError(error.message || 'Issue report करने में समस्या हुई');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: 'Garbage', label: '🗑️ कचरा', icon: FaTrashIcon, color: '#10b981' },
    { value: 'Water Leakage', label: '💧 पानी का रिसाव', icon: FaWater, color: '#3b82f6' },
    { value: 'Road Damage', label: '🛣️ सड़क क्षतिग्रस्त', icon: FaRoad, color: '#8b5cf6' },
    { value: 'Street Light', label: '💡 स्ट्रीट लाइट', icon: FaLightbulb, color: '#f59e0b' },
    { value: 'Electricity', label: '⚡ बिजली', icon: FaBolt, color: '#ef4444' },
    { value: 'Other', label: '📌 अन्य', icon: FaQuestionCircle, color: '#6b7280' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-accent-500)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-primary-500)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <FaArrowLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform" />
            <span>वापस जाएं</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-primary-500)' }}>
            नई समस्या रिपोर्ट करें
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            अपने क्षेत्र की समस्या को फोटो और सही लोकेशन के साथ रिपोर्ट करें
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Form Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    शीर्षक <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.title 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="समस्या का संक्षिप्त शीर्षक"
                    disabled={submitting}
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm flex items-center"
                        style={{ color: 'var(--color-danger-500)' }}
                      >
                        <FaExclamationTriangle className="mr-1 text-xs" />
                        {errors.title.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formValues.title?.length || 0}/100
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    श्रेणी <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = formValues.category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setValue('category', cat.value, { shouldValidate: true })}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2
                            ${isSelected 
                              ? 'border-accent-500 bg-accent-50' 
                              : 'border-gray-200 hover:border-accent-200'
                            }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${cat.color}20` }}
                          >
                            <Icon style={{ color: cat.color }} />
                          </div>
                          <span className="text-sm font-medium">{cat.label}</span>
                          {isSelected && (
                            <FaCheckCircle className="ml-auto" style={{ color: 'var(--color-accent-500)' }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {errors.category && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm flex items-center"
                        style={{ color: 'var(--color-danger-500)' }}
                      >
                        <FaExclamationTriangle className="mr-1 text-xs" />
                        {errors.category.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    विस्तृत विवरण <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description')}
                    rows="5"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                      ${errors.description 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="समस्या के बारे में विस्तार से बताएं..."
                    disabled={submitting}
                  />
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm flex items-center"
                        style={{ color: 'var(--color-danger-500)' }}
                      >
                        <FaExclamationTriangle className="mr-1 text-xs" />
                        {errors.description.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formValues.description?.length || 0}/2000
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    फोटो <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
                      ${dragActive 
                        ? 'border-accent-500 bg-accent-50' 
                        : 'border-gray-300 hover:border-accent-400'
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={submitting}
                    />
                    
                    <AnimatePresence mode="wait">
                      {imagePreview ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative"
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto max-h-64 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center"
                        >
                          <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold text-accent-500">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      {...register('terms')}
                      type="checkbox"
                      className="sr-only"
                      disabled={submitting}
                    />
                    <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200
                      ${formValues.terms 
                        ? 'bg-accent-500 border-accent-500' 
                        : 'border-gray-300 group-hover:border-accent-500'
                      }`}
                    >
                      {formValues.terms && (
                        <FaCheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      मैं पुष्टि करता हूं कि दी गई जानकारी सही है{' '}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <AnimatePresence>
                    {errors.terms && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm"
                        style={{ color: 'var(--color-danger-500)' }}
                      >
                        {errors.terms.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedImage || !position}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center relative overflow-hidden group"
                  style={{ 
                    backgroundColor: 'var(--color-accent-500)',
                    boxShadow: '0 4px 14px 0 rgba(234, 142, 10, 0.3)'
                  }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>रिपोर्ट भेज रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <FaMapMarkerAlt className="mr-2 group-hover:scale-110 transition-transform" />
                      रिपोर्ट भेजें
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center" style={{ color: 'var(--color-primary-500)' }}>
                  <FaMapMarkerAlt className="mr-2" style={{ color: 'var(--color-accent-500)' }} />
                  स्थान चुनें <span className="text-red-500 ml-1">*</span>
                </h3>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLocationSearch(!showLocationSearch)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-accent-500 transition-colors flex items-center gap-2"
                  >
                    <FaSearch />
                    <span className="hidden sm:inline">खोजें</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (userLocation) {
                        const newPos = [userLocation.lat, userLocation.lng];
                        setPosition(newPos);
                        getAddressFromCoordinates(newPos[0], newPos[1]);
                      } else {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const newPos = [pos.coords.latitude, pos.coords.longitude];
                            setPosition(newPos);
                            getAddressFromCoordinates(newPos[0], newPos[1]);
                          },
                          () => showError('Location access denied')
                        );
                      }
                    }}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-accent-500 transition-colors flex items-center gap-2"
                    disabled={locationLoading}
                  >
                    <FaCrosshairs className={locationLoading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">मेरी लोकेशन</span>
                  </button>
                </div>
              </div>

              {/* Location Search */}
              <AnimatePresence>
                {showLocationSearch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
                        placeholder="जगह का नाम खोजें..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500"
                      />
                      <button
                        onClick={() => searchLocation(searchQuery)}
                        disabled={searching}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
                      >
                        {searching ? '...' : 'खोज'}
                      </button>
                    </div>

                    {/* Search Results */}
                    <AnimatePresence>
                      {searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                        >
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(result)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                            >
                              <p className="text-sm text-gray-700">{result.display_name}</p>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Location Info */}
              {address && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start"
                >
                  <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{address}</p>
                </motion.div>
              )}

              {/* Map */}
              {locationLoading ? (
                <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-accent-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Location लोड हो रही है...</p>
                  </div>
                </div>
              ) : locationError ? (
                <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Location access नहीं हो पाई</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-accent-500 hover:underline"
                    >
                      पुनः प्रयास करें
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationMarker 
                      position={position} 
                      setPosition={setPosition}
                      address={address}
                      setAddress={setAddress}
                    />
                    
                    {/* Show user location circle if available */}
                    {userLocation && (
                      <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={50}
                        pathOptions={{ 
                          color: 'var(--color-accent-500)', 
                          fillColor: 'var(--color-accent-500)',
                          fillOpacity: 0.1
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              )}

              {/* Coordinates Display */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  चुनी गई location:
                </span>
                <code className="bg-gray-100 px-3 py-1 rounded-lg">
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </code>
              </div>

              {/* Map Tips */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  मैप पर क्लिक करें या मार्कर को खींचकर location चुनें
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="font-medium mb-4">प्रगति</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${formValues.title?.length >= 5 ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {formValues.title?.length >= 5 ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">1</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">शीर्षक (कम से कम 5 अक्षर)</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${formValues.category ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {formValues.category ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">2</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">श्रेणी चुनें</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${formValues.description?.length >= 20 ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {formValues.description?.length >= 20 ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">3</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">विवरण (कम से कम 20 अक्षर)</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${selectedImage ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {selectedImage ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">4</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">फोटो अपलोड करें</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${position ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {position ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">5</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">लोकेशन चुनें</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${formValues.terms ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {formValues.terms ? (
                      <FaCheckCircle className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-xs">6</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">नियम स्वीकार करें</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateIssue;