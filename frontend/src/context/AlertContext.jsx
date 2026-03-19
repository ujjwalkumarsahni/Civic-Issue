import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showSuccess = (message) => {
    toast.success(message);
    setAlerts((prev) => [...prev, { type: 'success', message }]);
  };

  const showError = (message) => {
    toast.error(message);
    setAlerts((prev) => [...prev, { type: 'error', message }]);
  };

  const showInfo = (message) => {
    toast(message);
    setAlerts((prev) => [...prev, { type: 'info', message }]);
  };

  const showWarning = (message) => {
    toast.custom(message);
    setAlerts((prev) => [...prev, { type: 'warning', message }]);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const value = {
    alerts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    clearAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};