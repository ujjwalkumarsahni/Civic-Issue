import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import authService from '../services/authService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(data);
      updateUser(response.data);
      setEditing(false);
      showSuccess('प्रोफाइल अपडेट हो गया');
    } catch (error) {
      showError(error.message || 'प्रोफाइल अपडेट में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showSuccess('लॉगआउट हो गया');
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">मेरा प्रोफाइल</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-5xl text-primary-600" />
            </div>
            
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <p className="text-sm">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                {user?.role === 'admin' ? 'प्रशासक' : 'नागरिक'}
              </span>
            </p>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setEditing(!editing)}
                className="w-full btn-secondary"
              >
                प्रोफाइल एडिट करें
              </button>
              <button
                onClick={handleLogout}
                className="w-full btn-danger"
              >
                लॉगआउट
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card p-6 mt-6">
            <h3 className="font-semibold mb-4">आंकड़े</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ज्वाइन किया</span>
                <span className="font-medium">
                  {new Date(user?.createdAt).toLocaleDateString('hi-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">कुल रिपोर्ट्स</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">कमेंट्स</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">अपवोट्स</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          {editing ? (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">प्रोफाइल एडिट करें</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    नाम *
                  </label>
                  <input
                    {...register('name', { 
                      required: 'नाम आवश्यक है'
                    })}
                    className="input-field"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ईमेल *
                  </label>
                  <input
                    {...register('email', { 
                      required: 'ईमेल आवश्यक है',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'मान्य ईमेल दर्ज करें'
                      }
                    })}
                    type="email"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Change Option */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">पासवर्ड बदलें</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        नया पासवर्ड
                      </label>
                      <input
                        type="password"
                        {...register('newPassword')}
                        className="input-field"
                        placeholder="नया पासवर्ड (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        नया पासवर्ड दोबारा
                      </label>
                      <input
                        type="password"
                        {...register('confirmNewPassword')}
                        className="input-field"
                        placeholder="नया पासवर्ड दोबारा"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {loading ? 'सेव हो रहा है...' : 'सेव करें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    कैंसल
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">प्रोफाइल जानकारी</h2>
              
              <div className="space-y-4">
                <div className="flex border-b pb-3">
                  <span className="w-32 text-gray-600">नाम:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex border-b pb-3">
                  <span className="w-32 text-gray-600">ईमेल:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex border-b pb-3">
                  <span className="w-32 text-gray-600">रोल:</span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
                <div className="flex border-b pb-3">
                  <span className="w-32 text-gray-600">अकाउंट ID:</span>
                  <span className="font-medium text-sm">{user?._id}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="font-medium mb-4">त्वरित कार्रवाई</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/create-issue')}
                    className="btn-primary"
                  >
                    नया Issue
                  </button>
                  <button
                    onClick={() => navigate('/my-issues')}
                    className="btn-secondary"
                  >
                    मेरे Issues
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;