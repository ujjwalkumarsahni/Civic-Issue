// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
// import { useAlert } from '../../context/AlertContext';
// import adminService from '../../services/adminService';
// import Loader from '../Common/Loader';
// import IssueFilters from '../Issues/IssueFilters';

// const AdminIssueList = () => {
//   const navigate = useNavigate();
//   const { showSuccess, showError } = useAlert();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({});
//   const [updatingId, setUpdatingId] = useState(null);

//   useEffect(() => {
//     fetchIssues();
//   }, [filters]);

//   const fetchIssues = async () => {
//     setLoading(true);
//     try {
//       const response = await adminService.getAllIssues(filters);
//       setIssues(response.data);
//     } catch (error) {
//       showError('Issues लोड करने में समस्या हुई');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     setUpdatingId(id);
//     try {
//       await adminService.updateStatus(id, newStatus);
//       showSuccess('Status updated successfully');
//       fetchIssues();
//     } catch (error) {
//       showError('Status update करने में समस्या हुई');
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('क्या आप सच में इस issue को delete करना चाहते हैं?')) {
//       return;
//     }
    
//     setUpdatingId(id);
//     try {
//       await adminService.deleteIssue(id);
//       showSuccess('Issue deleted successfully');
//       fetchIssues();
//     } catch (error) {
//       showError('Delete करने में समस्या हुई');
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'resolved': return 'bg-green-100 text-green-800';
//       case 'in_progress': return 'bg-blue-100 text-blue-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'लंबित';
//       case 'in_progress': return 'प्रगति पर';
//       case 'resolved': return 'हल हो गया';
//       case 'rejected': return 'अस्वीकृत';
//       default: return status;
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="container-custom py-8">
//       <h1 className="text-3xl font-bold mb-8">Manage Issues</h1>

//       <IssueFilters onFilterChange={setFilters} />

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Issue
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Reporter
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Upvotes
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Comments
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {issues.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                     कोई issue नहीं मिला
//                   </td>
//                 </tr>
//               ) : (
//                 issues.map((issue) => (
//                   <tr key={issue._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <img
//                           src={issue.image}
//                           alt={issue.title}
//                           className="h-10 w-10 rounded-lg object-cover mr-3"
//                         />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {issue.title}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {new Date(issue.createdAt).toLocaleDateString('hi-IN')}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">{issue.category}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
//                         {getStatusText(issue.status)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">{issue.user?.name}</div>
//                       <div className="text-sm text-gray-500">{issue.user?.email}</div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {issue.upvotes}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {issue.comments?.length || 0}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => navigate(`/issues/${issue._id}`)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="View"
//                         >
//                           <FaEye />
//                         </button>
                        
//                         {/* Status Dropdown */}
//                         <select
//                           value={issue.status}
//                           onChange={(e) => handleStatusChange(issue._id, e.target.value)}
//                           disabled={updatingId === issue._id}
//                           className="text-sm border rounded px-2 py-1"
//                         >
//                           <option value="pending">लंबित</option>
//                           <option value="in_progress">प्रगति पर</option>
//                           <option value="resolved">हल हो गया</option>
//                           <option value="rejected">अस्वीकृत</option>
//                         </select>

//                         <button
//                           onClick={() => navigate(`/admin/issues/${issue._id}/resolve`)}
//                           className="text-green-600 hover:text-green-900"
//                           title="Resolve with Image"
//                         >
//                           <FaCheck />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(issue._id)}
//                           disabled={updatingId === issue._id}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminIssueList;


import React from 'react'

const AdminIssueList = () => {
  return (
    <div>AdminIssueList</div>
  )
}

export default AdminIssueList