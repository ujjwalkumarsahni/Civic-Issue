import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaEnvelope, 
  FaLock, 
  FaSignInAlt, 
  FaEye, 
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaGoogle,
  FaGithub
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';

// Login schema validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'ईमेल आवश्यक है')
    .email('मान्य ईमेल दर्ज करें'),
  password: z
    .string()
    .min(1, 'पासवर्ड आवश्यक है')
    .min(6, 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए')
    .max(50, 'पासवर्ड बहुत लंबा है'),
  rememberMe: z.boolean().optional()
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const { showSuccess, showError, showInfo } = useAlert();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Handle account lock after multiple failed attempts
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      setLockTimer(300); // 5 minutes lock
      showInfo('बहुत अधिक असफल प्रयास। कृपया 5 मिनट बाद पुनः प्रयास करें');
    }
  }, [loginAttempts, showInfo]);

  // Lock timer countdown
  useEffect(() => {
    let timer;
    if (isLocked && lockTimer > 0) {
      timer = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
    } else if (lockTimer === 0) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimer]);

  const formatLockTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data) => {
    if (isLocked) return;
    
    setLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      showSuccess('लॉगिन सफल! स्वागत है', {
        duration: 5000,
        position: 'top-center'
      });
      navigate(from, { replace: true });
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      
      // Handle specific error cases
      if (error.code === 'auth/user-not-found') {
        setError('email', { 
          type: 'manual', 
          message: 'यह ईमेल पंजीकृत नहीं है' 
        });
      } else if (error.code === 'auth/wrong-password') {
        setError('password', { 
          type: 'manual', 
          message: 'गलत पासवर्ड' 
        });
      } else if (error.code === 'auth/too-many-requests') {
        setIsLocked(true);
        setLockTimer(300);
      } else {
        showError(error.message || 'लॉगिन में समस्या हुई');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (isLocked) return;
    
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'github') {
        await loginWithGithub();
      }
      showSuccess('लॉगिन सफल! स्वागत है');
      navigate(from, { replace: true });
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        showError('यह ईमेल पहले से किसी अन्य विधि से पंजीकृत है');
      } else {
        showError(error.message || 'सोशल लॉगिन में समस्या हुई');
      }
    } finally {
      setSocialLoading(null);
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
            <FaShieldAlt className="text-3xl" style={{ color: 'var(--color-primary-500)' }} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-hindi">
            स्वागत है
          </h1>
          <p className="text-gray-600">
            अपने अकाउंट में लॉगिन करें
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Account Lock Alert */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4" style={{ backgroundColor: 'var(--color-danger-50)' }}>
                  <p className="text-sm flex items-center" style={{ color: 'var(--color-danger-700)' }}>
                    <FaShieldAlt className="mr-2" />
                    अकाउंट अस्थायी रूप से लॉक है। पुनः प्रयास करें {formatLockTime(lockTimer)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${errors.email 
                        ? 'border-danger-500 focus:ring-danger-200' 
                        : 'border-gray-300 focus:ring-accent-200 focus:border-accent-500'
                      }`}
                    placeholder="your@email.com"
                    disabled={isLocked}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm flex items-center"
                    style={{ color: 'var(--color-danger-500)' }}
                  >
                    <span className="mr-1">•</span>
                    {errors.email.message}
                  </motion.p>
                )}
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
                    disabled={isLocked}
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
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm flex items-center"
                    style={{ color: 'var(--color-danger-500)' }}
                  >
                    <span className="mr-1">•</span>
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="sr-only"
                    disabled={isLocked}
                  />
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200
                    ${watch('rememberMe') 
                      ? 'bg-accent-500 border-accent-500' 
                      : 'border-gray-300 group-hover:border-accent-500'
                    }`}
                  >
                    {watch('rememberMe') && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-accent-500 transition-colors">
                    याद रखें
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--color-primary-500)' }}
                >
                  पासवर्ड भूल गए?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading || isLocked}
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
                      <span>लॉगिन हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2 group-hover:translate-x-1 transition-transform" />
                      लॉगिन करें
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                नए उपयोगकर्ता हैं?{' '}
                <Link
                  to="/register"
                  state={{ from }}
                  className="font-medium transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--color-primary-500)' }}
                >
                  रजिस्टर करें
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;