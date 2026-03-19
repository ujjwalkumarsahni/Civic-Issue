import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { 
  FaUser, 
  FaHeart, 
  FaRegHeart,
  FaReply,
  FaEdit,
  FaTrash,
  FaFlag,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisH,
  FaImage,
  FaSmile,
  FaPaperPlane,
  FaQuoteRight,
  FaShieldAlt,
  FaUserCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import issueService from '../../services/issueService';
import { Link } from 'react-router-dom';

const CommentSection = ({ issueId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [reportReason, setReportReason] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useAlert();
  const commentInputRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    // Load liked comments from localStorage
    const savedLikes = localStorage.getItem(`likedComments_${issueId}`);
    if (savedLikes) {
      setLikedComments(JSON.parse(savedLikes));
    }
  }, [issueId]);

  useEffect(() => {
    // Close options menu when clicking outside
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showInfo('कृपया पहले लॉगिन करें');
      return;
    }
    
    if (!newComment.trim()) {
      showError('कृपया कुछ लिखें');
      return;
    }
    
    setSubmitting(true);
    try {
      const commentData = {
        text: newComment,
        parentId: replyTo?._id
      };
      
      const response = await issueService.addComment(issueId, commentData);
      const newCommentData = response.data;
      
      if (replyTo) {
        // Add as reply
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === replyTo._id 
              ? { ...comment, replies: [...(comment.replies || []), newCommentData] }
              : comment
          )
        );
      } else {
        // Add as top-level comment
        setComments([...comments, newCommentData]);
      }
      
      setNewComment('');
      setReplyTo(null);
      showSuccess('टिप्पणी जोड़ दी गई');
      
      // Focus back on input
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    } catch (error) {
      showError(error.message || 'टिप्पणी जोड़ने में समस्या हुई');
    } finally {
      setSubmitting(false);
    }
  };

 const handleLike = async (commentId) => {
  if (!user) {
    showInfo('कृपया पहले लॉगिन करें');
    return;
  }

  const newLikedState = !likedComments[commentId];

  // ⭐ optimistic UI update
  setLikedComments(prev => {
    const updated = { ...prev, [commentId]: newLikedState };
    localStorage.setItem(`likedComments_${issueId}`, JSON.stringify(updated));
    return updated;
  });

  try {
    const res = await issueService.likeComment(commentId);

    // ⭐ update likes count in state (VERY IMPORTANT)
    setComments(prev =>
      prev.map(c => {
        if (c._id === commentId) {
          return { ...c, likes: res.likes };
        }

        // ⭐ handle replies like also
        if (c.replies?.length) {
          return {
            ...c,
            replies: c.replies.map(r =>
              r._id === commentId ? { ...r, likes: res.likes } : r
            )
          };
        }

        return c;
      })
    );

  } catch (error) {

    // revert
    setLikedComments(prev => {
      const updated = { ...prev, [commentId]: !newLikedState };
      localStorage.setItem(`likedComments_${issueId}`, JSON.stringify(updated));
      return updated;
    });

    showError('Like करने में समस्या हुई');
  }
};

  const handleEdit = async (commentId, newText) => {
    if (!newText.trim()) {
      showError('कृपया कुछ लिखें');
      return;
    }

    try {
      const response = await issueService.editComment(commentId, { text: newText });
      
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId
            ? { ...comment, text: newText, edited: true }
            : comment
        )
      );
      
      setEditingComment(null);
      showSuccess('टिप्पणी अपडेट कर दी गई');
    } catch (error) {
      showError('टिप्पणी अपडेट करने में समस्या हुई');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('क्या आप सच में इस टिप्पणी को हटाना चाहते हैं?')) {
      return;
    }

    try {
      await issueService.deleteComment(commentId);
      
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
      
      showSuccess('टिप्पणी हटा दी गई');
    } catch (error) {
      showError('टिप्पणी हटाने में समस्या हुई');
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      showError('कृपया रिपोर्ट का कारण बताएं');
      return;
    }

    try {
      await issueService.reportComment(selectedComment._id, { reason: reportReason });
      showSuccess('टिप्पणी रिपोर्ट कर दी गई');
      setShowReportModal(false);
      setReportReason('');
      setSelectedComment(null);
    } catch (error) {
      showError('रिपोर्ट करने में समस्या हुई');
    }
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = user?._id === comment.user?._id;
    const isAdmin = user?.role === 'admin';
    const canModify = isOwner || isAdmin;
    const isLiked = likedComments[comment._id];

    return (
      <motion.div
        key={comment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${isReply ? 'ml-12 mt-3' : 'mb-4'}`}
      >
        <div className="flex items-start group">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.user?.avatar ? (
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{ borderColor: isOwner ? 'var(--color-accent-500)' : 'transparent' }}
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: isOwner ? 'var(--color-accent-100)' : 'var(--color-primary-100)',
                  color: isOwner ? 'var(--color-accent-500)' : 'var(--color-primary-600)'
                }}
              >
                <FaUserCircle className="text-2xl" />
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="ml-3 flex-1">
            <div className="bg-gray-50 rounded-2xl px-4 py-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-primary-500)' }}>
                    {comment.user?.name || 'अज्ञात'}
                  </span>
                  
                  {/* User Badges */}
                  {comment.user?.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium flex items-center">
                      <FaShieldAlt className="mr-1 text-xs" />
                      Admin
                    </span>
                  )}
                  
                  {isOwner && (
                    <span className="px-2 py-0.5 bg-accent-100 text-accent-600 rounded-full text-xs">
                      आप
                    </span>
                  )}
                  
                  {comment.edited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: hi,
                    })}
                  </span>
                  
                  {/* Options Menu */}
                  <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setShowOptions(showOptions === comment._id ? null : comment._id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FaEllipsisH className="text-xs text-gray-500" />
                    </button>
                    
                    <AnimatePresence>
                      {showOptions === comment._id && (
                        <motion.div
                          ref={optionsRef}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10"
                        >
                          {canModify && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingComment(comment);
                                  setShowOptions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FaEdit className="text-gray-500" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(comment._id);
                                  setShowOptions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                              >
                                <FaTrash />
                                Delete
                              </button>
                            </>
                          )}
                          
                          {!isOwner && (
                            <button
                              onClick={() => {
                                setSelectedComment(comment);
                                setShowReportModal(true);
                                setShowOptions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                            >
                              <FaFlag />
                              Report
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Comment Text */}
              {editingComment?._id === comment._id ? (
                <div className="mt-2">
                  <textarea
                    defaultValue={comment.text}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 text-sm"
                    rows="3"
                    ref={(el) => el?.focus()}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        const textarea = document.querySelector('textarea');
                        handleEdit(comment._id, textarea.value);
                      }}
                      className="px-3 py-1 bg-accent-500 text-white rounded-lg text-sm hover:bg-accent-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {comment.text}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-2 ml-2">
              <button
                onClick={() => handleLike(comment._id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{comment.likes || 0}</span>
              </button>
              
              <button
                onClick={() => {
                  setReplyTo(comment);
                  commentInputRef.current?.focus();
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-accent-500 transition-colors"
              >
                <FaReply />
                <span>जवाब दें</span>
              </button>
            </div>

            {/* Replies */}
            {comment.replies?.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map(reply => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center" style={{ color: 'var(--color-primary-500)' }}>
            टिप्पणियाँ
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {comments.length}
            </span>
          </h2>
          
          {user && (
            <span className="text-sm text-gray-500">
              <FaCheckCircle className="inline mr-1 text-green-500" />
              टिप्पणी कर सकते हैं
            </span>
          )}
        </div>
      </div>

      {/* Report Modal */}
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
                टिप्पणी रिपोर्ट करें
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                कृपया बताएं कि आप इस टिप्पणी को क्यों रिपोर्ट करना चाहते हैं
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
                  className="flex-1 px-4 py-2 bg-danger-500 text-white rounded-xl hover:bg-danger-600 transition-colors"
                >
                  रिपोर्ट करें
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Form */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        {replyTo && (
          <div className="mb-3 p-3 bg-accent-50 rounded-lg flex items-center justify-between">
            <p className="text-sm text-accent-700">
              <span className="font-medium">{replyTo.user?.name}</span> को जवाब दे रहे हैं
            </p>
            <button
              onClick={() => setReplyTo(null)}
              className="text-accent-500 hover:text-accent-700"
            >
              <FaTimesCircle />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-primary-600" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-1">
              <div className="relative">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={user ? "अपनी टिप्पणी लिखें..." : "टिप्पणी करने के लिए लॉगिन करें"}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                    ${!user ? 'bg-gray-100 cursor-not-allowed' : ''}
                    ${newComment.length > 500 ? 'border-yellow-500' : 'border-gray-300'}
                    focus:border-accent-500 focus:ring-accent-200`}
                  rows="3"
                  disabled={!user || submitting}
                  maxLength={1000}
                />
                
                {/* Character Count */}
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {newComment.length}/1000
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-accent-500 transition-colors"
                    title="Emoji"
                  >
                    <FaSmile />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-accent-500 transition-colors"
                    title="Add image"
                  >
                    <FaImage />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !user || !newComment.trim()}
                  className="px-6 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>भेज रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm" />
                      <span>टिप्पणी भेजें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="p-6">
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaQuoteRight className="text-3xl text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">अभी तक कोई टिप्पणी नहीं है</p>
            <p className="text-sm text-gray-400">पहली टिप्पणी करें और चर्चा शुरू करें!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {comments.map(comment => renderComment(comment))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          टिप्पणी करके, आप हमारे 
          <Link to="/terms" className="text-accent-500 hover:underline mx-1">
            नियमों
          </Link>
          से सहमत होते हैं
        </p>
      </div>
    </div>
  );
};

export default CommentSection;