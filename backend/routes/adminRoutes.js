// const express = require('express');
// const router = express.Router();
// const {
//   getAllIssues,
//   updateIssueStatus,
//   resolveIssue,
//   adminDeleteIssue,
//   exportIssues,
//   getSystemStats
// } = require('../controllers/adminController');
// const { protect } = require('../middleware/authMiddleware');
// const { authorize } = require('../middleware/roleMiddleware');
// const { uploadResolutionImage, handleMulterError } = require('../middleware/uploadMiddleware');


// router.use(protect);
// router.use(authorize('admin'));

// // Admin routes
// router.get('/issues', getAllIssues);
// router.get('/stats', getSystemStats);
// router.get('/export', exportIssues);

// router.put('/issues/:id/status', updateIssueStatus);
// router.put(
//   '/issues/:id/resolve',
//   uploadResolutionImage,
//   handleMulterError,
//   resolveIssue
// );
// router.delete('/issues/:id', adminDeleteIssue);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getAllIssues,
  updateIssueStatus,
  resolveIssue,
  adminDeleteIssue,
  exportIssues,
  getSystemStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { uploadResolutionImage, handleMulterError } = require('../middleware/uploadMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.get('/issues', getAllIssues);
router.get('/stats', getSystemStats);
router.get('/export', exportIssues);

// Important: The order matters - put specific routes before parameterized routes
router.put('/issues/:id/status', updateIssueStatus);
router.put(
  '/issues/:id/resolve',
  uploadResolutionImage,
  handleMulterError,
  resolveIssue
);
router.delete('/issues/:id', adminDeleteIssue);

module.exports = router;