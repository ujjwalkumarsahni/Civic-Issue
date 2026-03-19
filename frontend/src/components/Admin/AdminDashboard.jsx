import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaExclamationTriangle, FaCheckCircle, 
  FaClock, FaDownload 
} from 'react-icons/fa';
import { useAlert } from '../../context/AlertContext';
import adminService from '../../services/adminService';
import Loader from '../Common/Loader';

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      showError('Statistics लोड करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await adminService.exportIssues();
      showSuccess('CSV export शुरू हो गया है');
    } catch (error) {
      showError('Export करने में समस्या हुई');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary flex items-center"
        >
          <FaDownload className="mr-2" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUsers}
          title="कुल उपयोगकर्ता"
          value={stats?.users?.total || 0}
          color="bg-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={FaExclamationTriangle}
          title="कुल Issues"
          value={stats?.issues?.total || 0}
          color="bg-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={FaCheckCircle}
          title="हल हो गए"
          value={stats?.issues?.byStatus?.find(s => s._id === 'resolved')?.count || 0}
          color="bg-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={FaClock}
          title="लंबित Issues"
          value={stats?.issues?.byStatus?.find(s => s._id === 'pending')?.count || 0}
          color="bg-red-600"
          bgColor="bg-red-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>
          <div className="space-y-4">
            {stats?.issues?.byStatus?.map((item) => (
              <div key={item._id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item._id === 'pending' ? 'लंबित' :
                     item._id === 'in_progress' ? 'प्रगति पर' :
                     item._id === 'resolved' ? 'हल हो गया' :
                     item._id === 'rejected' ? 'अस्वीकृत' : item._id}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item._id === 'resolved' ? 'bg-green-600' :
                      item._id === 'in_progress' ? 'bg-blue-600' :
                      item._id === 'rejected' ? 'bg-red-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${(item.count / stats.issues.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="space-y-4">
            {stats?.issues?.byCategory?.map((item) => (
              <div key={item._id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item._id}</span>
                  <span className="text-sm font-medium text-gray-700">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(item.count / stats.issues.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">हाल की रिपोर्ट्स</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentIssues?.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{issue.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {issue.status === 'pending' ? 'लंबित' :
                       issue.status === 'in_progress' ? 'प्रगति पर' :
                       issue.status === 'resolved' ? 'हल हो गया' :
                       issue.status === 'rejected' ? 'अस्वीकृत' : issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{issue.user?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString('hi-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/issues/${issue._id}`)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;