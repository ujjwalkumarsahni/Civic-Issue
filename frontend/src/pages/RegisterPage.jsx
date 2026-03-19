import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';

// Registration schema validation (only original fields)
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'नाम आवश्यक है')
    .min(2, 'नाम कम से कम 2 अक्षर का होना चाहिए')
    .max(50, 'नाम बहुत लंबा है')
    .regex(/^[a-zA-Z\s]+$/, 'नाम में केवल अक्षर होने चाहिए'),
  
  email: z
    .string()
    .min(1, 'ईमेल आवश्यक है')
    .email('मान्य ईमेल दर्ज करें'),
  
  password: z
  .string()
  .min(1, 'पासवर्ड आवश्यक है')
  .min(6, 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
    'पासवर्ड में कम से कम एक अक्षर और एक संख्या होनी चाहिए'
  ),

  
  confirmPassword: z
    .string()
    .min(1, 'पासवर्ड दोबारा दर्ज करें'),
  
  terms: z
    .boolean()
    .refine(val => val === true, 'नियम व शर्तें स्वीकार करें')
}).refine((data) => data.password === data.confirmPassword, {
  message: "पासवर्ड मेल नहीं खाते",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const { showSuccess, showError, showInfo } = useAlert();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Watch fields
  const password = watch('password', '');
  const email = watch('email', '');

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  // Check email availability (debounced)
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (email && !errors.email) {
        setCheckingEmail(true);
        try {
          // Simulate API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 500));
          // Mock check - replace with actual API call
          const isAvailable = !['test@example.com', 'admin@example.com'].includes(email);
          setIsEmailAvailable(isAvailable);
          if (!isAvailable) {
            setError('email', { 
              type: 'manual', 
              message: 'यह ईमेल पहले से पंजीकृत है' 
            });
          } else {
            clearErrors('email');
          }
        } catch (error) {
          console.error('Email check failed:', error);
        } finally {
          setCheckingEmail(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkEmailAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [email, errors.email, setError, clearErrors]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      showSuccess('रजिस्ट्रेशन सफल! स्वागत है', {
        duration: 5000,
        position: 'top-center'
      });
      
      showInfo('कृपया अपना ईमेल वेरिफाई करें', {
        duration: 8000
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('email', { 
          type: 'manual', 
          message: 'यह ईमेल पहले से पंजीकृत है' 
        });
      } else if (error.code === 'auth/weak-password') {
        setError('password', { 
          type: 'manual', 
          message: 'पासवर्ड कमजोर है' 
        });
      } else {
        showError(error.message || 'रजिस्ट्रेशन में समस्या हुई');
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'var(--color-danger-500)';
    if (passwordStrength <= 50) return 'var(--color-danger-500)';
    if (passwordStrength <= 75) return 'var(--color-accent-500)';
    return '#10b981'; // Green for strong
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'बहुत कमजोर';
    if (passwordStrength <= 50) return 'कमजोर';
    if (passwordStrength <= 75) return 'मध्यम';
    return 'मजबूत';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-accent-500)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" 
          style={{ backgroundColor: 'var(--color-primary-500)' }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full relative z-10"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <FaArrowLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform" />
            <span>वापस जाएं</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: 'var(--color-primary-50)' }}
          >
            <FaUserPlus className="text-3xl" style={{ color: 'var(--color-primary-500)' }} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-hindi">
            नया अकाउंट बनाएं
          </h1>
          <p className="text-gray-600">
            शहर की समस्याओं को रिपोर्ट करने के लिए जुड़ें
          </p>
        </motion.div>

        {/* Registration Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पूरा नाम <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 group-focus-within:text-accent-500 transition-colors" />
                  </div>
                  <input
                    {...register('name')}
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.name 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="अपना पूरा नाम"
                    disabled={loading}
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm flex items-center"
                      style={{ color: 'var(--color-danger-500)' }}
                    >
                      <span className="mr-1">•</span>
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ईमेल <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-accent-500 transition-colors" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.email 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="your@email.com"
                    disabled={loading}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {checkingEmail ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-accent-500 rounded-full animate-spin" />
                    ) : email && !errors.email && isEmailAvailable ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : email && errors.email ? (
                      <FaTimesCircle style={{ color: 'var(--color-danger-500)' }} />
                    ) : null}
                  </div>
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm flex items-center"
                      style={{ color: 'var(--color-danger-500)' }}
                    >
                      <span className="mr-1">•</span>
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पासवर्ड <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-accent-500 transition-colors" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.password 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="••••••"
                    disabled={loading}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <AnimatePresence>
                  {password && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className="h-full rounded-full transition-all duration-300"
                            style={{ backgroundColor: getPasswordStrengthColor() }}
                          />
                        </div>
                        <span className="text-xs ml-2" style={{ color: getPasswordStrengthColor() }}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex items-center">
                          {password.length >= 6 ? (
                            <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-1 text-xs" />
                          )}
                          <span className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                            6+ अक्षर
                          </span>
                        </div>
                        <div className="flex items-center">
                          {/[a-z]/.test(password) ? (
                            <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-1 text-xs" />
                          )}
                          <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                            lowercase
                          </span>
                        </div>
                        <div className="flex items-center">
                          {/[A-Z]/.test(password) ? (
                            <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-1 text-xs" />
                          )}
                          <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                            UPPERCASE
                          </span>
                        </div>
                        <div className="flex items-center">
                          {/[0-9]/.test(password) ? (
                            <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-1 text-xs" />
                          )}
                          <span className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                            संख्या
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm flex items-center"
                      style={{ color: 'var(--color-danger-500)' }}
                    >
                      <span className="mr-1">•</span>
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पासवर्ड दोबारा <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-accent-500 transition-colors" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.confirmPassword 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="••••••"
                    disabled={loading}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm flex items-center"
                      style={{ color: 'var(--color-danger-500)' }}
                    >
                      <span className="mr-1">•</span>
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Terms & Conditions */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center cursor-pointer group">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200
                    ${watch('terms') 
                      ? 'bg-accent-500 border-accent-500' 
                      : 'border-gray-300 group-hover:border-accent-500'
                    }`}
                  >
                    {watch('terms') && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-accent-500 transition-colors">
                    मैं{' '}
                    <Link to="/terms" className="font-medium underline hover:no-underline">
                      नियम व शर्तें
                    </Link>{' '}
                    स्वीकार करता हूं <span className="text-red-500">*</span>
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
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading || !isEmailAvailable}
                  className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center relative overflow-hidden group"
                  style={{ 
                    backgroundColor: 'var(--color-accent-500)',
                    boxShadow: '0 4px 14px 0 rgba(234, 142, 10, 0.3)'
                  }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>रजिस्टर हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2 group-hover:translate-x-1 transition-transform" />
                      रजिस्टर करें
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                पहले से अकाउंट है?{' '}
                <Link
                  to="/login"
                  state={{ from }}
                  className="font-medium transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--color-primary-500)' }}
                >
                  लॉगिन करें
                </Link>
              </p>
            </motion.div>

            {/* Security Note */}
            <motion.div 
              variants={itemVariants} 
              className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start"
            >
              <FaShieldAlt className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                आपकी जानकारी सुरक्षित है। हम कभी भी आपकी जानकारी तीसरे पक्ष के साथ साझा नहीं करते।
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;