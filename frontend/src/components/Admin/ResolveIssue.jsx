// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { FaCheckCircle, FaTimesCircle, FaCamera, FaArrowLeft } from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import adminService from '../../services/adminService';
// import issueService from '../../services/issueService';
// import { useAlert } from '../../context/AlertContext';
// import Loader from '../Common/Loader';

// // Fix for default markers
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const ResolveIssue = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showSuccess, showError } = useAlert();
  
//   const [issue, setIssue] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [resolutionType, setResolutionType] = useState('resolved');

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       status: 'resolved',
//       notes: ''
//     }
//   });

//   useEffect(() => {
//     fetchIssue();
//   }, [id]);

//   const fetchIssue = async () => {
//     try {
//       const response = await issueService.getIssueById(id);
//       setIssue(response.data);
//     } catch (error) {
//       showError('Issue लोड करने में समस्या हुई');
//       navigate('/admin/issues');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         showError('Image 5MB से छोटी होनी चाहिए');
//         return;
//       }
      
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (data) => {
//     // Validate based on resolution type
//     if (resolutionType === 'resolved' && !selectedImage) {
//       showError('समाधान की फोटो अपलोड करना आवश्यक है');
//       return;
//     }

//     setSubmitting(true);
    
//     const formData = new FormData();
//     formData.append('status', resolutionType);
//     if (data.notes) {
//       formData.append('notes', data.notes);
//     }
//     if (selectedImage) {
//       formData.append('resolvedImage', selectedImage);
//     }

//     try {
//       await adminService.resolveIssue(id, formData);
//       showSuccess(
//         resolutionType === 'resolved' 
//           ? 'Issue सफलतापूर्वक हल हो गया' 
//           : 'Issue अस्वीकृत कर दिया गया'
//       );
//       navigate(`/issues/${id}`);
//     } catch (error) {
//       showError(error.message || 'कार्रवाई में समस्या हुई');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (!issue) return <div>Issue नहीं मिला</div>;

//   return (
//     <div className="container-custom py-8">
//       {/* Header */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <FaArrowLeft className="mr-2" /> वापस जाएं
//         </button>
//         <h1 className="text-3xl font-bold">Issue का समाधान</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column - Issue Details */}
//         <div className="space-y-6">
//           {/* Issue Card */}
//           <div className="card p-6">
//             <h2 className="text-xl font-semibold mb-4">Issue जानकारी</h2>
            
//             <div className="space-y-4">
//               {/* Title */}
//               <div>
//                 <label className="text-sm font-medium text-gray-500">शीर्षक</label>
//                 <p className="text-lg font-medium">{issue.title}</p>
//               </div>

//               {/* Category & Status */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">श्रेणी</label>
//                   <p className="font-medium">{issue.category}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">वर्तमान स्थिति</label>
//                   <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium
//                     ${issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//                       issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
//                       'bg-red-100 text-red-800'}`}
//                   >
//                     {issue.status === 'pending' ? 'लंबित' :
//                      issue.status === 'in_progress' ? 'प्रगति पर' :
//                      issue.status === 'resolved' ? 'हल हो गया' :
//                      issue.status === 'rejected' ? 'अस्वीकृत' : issue.status}
//                   </p>
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="text-sm font-medium text-gray-500">विवरण</label>
//                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
//                   {issue.description}
//                 </p>
//               </div>

//               {/* Reporter Info */}
//               <div>
//                 <label className="text-sm font-medium text-gray-500">रिपोर्ट कर्ता</label>
//                 <p className="font-medium">{issue.user?.name}</p>
//                 <p className="text-sm text-gray-600">{issue.user?.email}</p>
//               </div>

//               {/* Date */}
//               <div>
//                 <label className="text-sm font-medium text-gray-500">रिपोर्ट दिनांक</label>
//                 <p className="text-gray-700">
//                   {new Date(issue.createdAt).toLocaleString('hi-IN')}
//                 </p>
//               </div>

//               {/* Upvotes & Comments */}
//               <div className="flex space-x-4 pt-2">
//                 <div className="flex items-center text-green-600">
//                   <span className="font-medium mr-1">{issue.upvotes}</span>
//                   <span className="text-sm">Upvotes</span>
//                 </div>
//                 <div className="flex items-center text-blue-600">
//                   <span className="font-medium mr-1">{issue.comments?.length || 0}</span>
//                   <span className="text-sm">टिप्पणियाँ</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Issue Image */}
//           <div className="card p-6">
//             <h2 className="text-xl font-semibold mb-4">Issue फोटो</h2>
//             <img
//               src={issue.image}
//               alt={issue.title}
//               className="w-full rounded-lg shadow-md"
//             />
//           </div>

//           {/* Location Map */}
//           {issue.location?.coordinates && (
//             <div className="card p-6">
//               <h2 className="text-xl font-semibold mb-4">स्थान</h2>
//               <div className="h-64 rounded-lg overflow-hidden">
//                 <MapContainer
//                   center={[issue.location.coordinates[1], issue.location.coordinates[0]]}
//                   zoom={15}
//                   style={{ height: '100%', width: '100%' }}
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                   />
//                   <Marker 
//                     position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
//                   />
//                 </MapContainer>
//               </div>
//               <p className="mt-2 text-sm text-gray-600">
//                 Coordinates: {issue.location.coordinates[1].toFixed(4)}, {issue.location.coordinates[0].toFixed(4)}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Resolution Form */}
//         <div className="lg:col-span-1">
//           <div className="card p-6 sticky top-4">
//             <h2 className="text-xl font-semibold mb-6">कार्रवाई करें</h2>

//             {/* Resolution Type Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 कार्रवाई का प्रकार *
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setResolutionType('resolved')}
//                   className={`p-4 rounded-lg border-2 transition ${
//                     resolutionType === 'resolved'
//                       ? 'border-green-500 bg-green-50'
//                       : 'border-gray-200 hover:border-green-300'
//                   }`}
//                 >
//                   <FaCheckCircle className={`mx-auto text-2xl mb-2 ${
//                     resolutionType === 'resolved' ? 'text-green-500' : 'text-gray-400'
//                   }`} />
//                   <span className={`font-medium ${
//                     resolutionType === 'resolved' ? 'text-green-700' : 'text-gray-600'
//                   }`}>
//                     हल हो गया
//                   </span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setResolutionType('rejected')}
//                   className={`p-4 rounded-lg border-2 transition ${
//                     resolutionType === 'rejected'
//                       ? 'border-red-500 bg-red-50'
//                       : 'border-gray-200 hover:border-red-300'
//                   }`}
//                 >
//                   <FaTimesCircle className={`mx-auto text-2xl mb-2 ${
//                     resolutionType === 'rejected' ? 'text-red-500' : 'text-gray-400'
//                   }`} />
//                   <span className={`font-medium ${
//                     resolutionType === 'rejected' ? 'text-red-700' : 'text-gray-600'
//                   }`}>
//                     अस्वीकृत करें
//                   </span>
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Resolution Image (Required for Resolved) */}
//               {resolutionType === 'resolved' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     समाधान फोटो * 
//                     <span className="text-red-500 ml-1">(आवश्यक)</span>
//                   </label>
                  
//                   {!imagePreview ? (
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition cursor-pointer">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                         id="resolution-image"
//                       />
//                       <label htmlFor="resolution-image" className="cursor-pointer">
//                         <FaCamera className="mx-auto text-3xl text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-600">
//                           समाधान की फोटो अपलोड करें
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           JPG, PNG, GIF (max 5MB)
//                         </p>
//                       </label>
//                     </div>
//                   ) : (
//                     <div className="relative">
//                       <img
//                         src={imagePreview}
//                         alt="Resolution Preview"
//                         className="w-full rounded-lg shadow-md"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setSelectedImage(null);
//                           setImagePreview(null);
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
//                       >
//                         <FaTimesCircle />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Resolution Notes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {resolutionType === 'resolved' ? 'समाधान टिप्पणी' : 'अस्वीकृति का कारण'}
//                 </label>
//                 <textarea
//                   {...register('notes', {
//                     required: resolutionType === 'rejected' ? 'कारण बताना आवश्यक है' : false
//                   })}
//                   rows="4"
//                   className="input-field"
//                   placeholder={
//                     resolutionType === 'resolved'
//                       ? 'समस्या का समाधान कैसे हुआ, यह बताएं...'
//                       : 'अस्वीकृत करने का कारण बताएं...'
//                   }
//                 ></textarea>
//                 {errors.notes && (
//                   <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
//                 )}
//               </div>

//               {/* Additional Information Display */}
//               {resolutionType === 'resolved' && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <h4 className="font-medium text-blue-800 mb-2">जानकारी:</h4>
//                   <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
//                     <li>समाधान फोटो अपलोड करना अनिवार्य है</li>
//                     <li>फोटो साफ और समस्या के समाधान को दर्शाती हो</li>
//                     <li>टिप्पणी में समाधान का विवरण दें</li>
//                   </ul>
//                 </div>
//               )}

//               {resolutionType === 'rejected' && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <h4 className="font-medium text-yellow-800 mb-2">सावधानी:</h4>
//                   <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
//                     <li>अस्वीकृत करने का कारण स्पष्ट रूप से बताएं</li>
//                     <li>नागरिक को इसकी सूचना मिलेगी</li>
//                     <li>यह कार्रवाई वापस नहीं ली जा सकती</li>
//                   </ul>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
//                     resolutionType === 'resolved'
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-red-600 hover:bg-red-700'
//                   } disabled:opacity-50`}
//                 >
//                   {submitting ? (
//                     'प्रोसेस हो रहा है...'
//                   ) : (
//                     resolutionType === 'resolved' ? '✅ हल हो गया' : '❌ अस्वीकृत करें'
//                   )}
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={() => navigate(`/issues/${id}`)}
//                   className="btn-secondary px-6"
//                 >
//                   रद्द करें
//                 </button>
//               </div>
//             </form>

//             {/* Issue History */}
//             {issue.comments && issue.comments.length > 0 && (
//               <div className="mt-8 pt-6 border-t">
//                 <h3 className="font-medium mb-4">हाल की टिप्पणियाँ</h3>
//                 <div className="space-y-3 max-h-60 overflow-y-auto">
//                   {issue.comments.slice(-3).map((comment, index) => (
//                     <div key={index} className="bg-gray-50 p-3 rounded-lg">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="font-medium text-sm">{comment.user?.name}</span>
//                         <span className="text-xs text-gray-500">
//                           {new Date(comment.createdAt).toLocaleDateString('hi-IN')}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-700">{comment.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResolveIssue;


import React from 'react'

const ResolveIssue = () => {
  return (
    <div>ResolveIssue</div>
  )
}

export default ResolveIssue