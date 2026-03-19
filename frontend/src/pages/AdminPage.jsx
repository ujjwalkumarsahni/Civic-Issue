import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminIssueList from '../components/Admin/AdminIssueList';
import ResolveIssue from '../components/Admin/ResolveIssue.jsx';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/issues" element={<AdminIssueList />} />
        <Route path="/issues/:id/resolve" element={<ResolveIssue />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminPage;