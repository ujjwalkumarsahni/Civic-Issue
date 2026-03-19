const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  upvoteIssue,
  getUserIssues,
  likeComment
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { checkOwnership } = require('../middleware/roleMiddleware');
const { uploadIssueImage, handleMulterError } = require('../middleware/uploadMiddleware');
const Issue = require('../models/Issue');

router.route('/')
  .get(protect, getIssues)
  .post(
    protect,
    uploadIssueImage,
    handleMulterError,
    createIssue
  );


router.get('/user/me', protect, getUserIssues);

router.route('/:id')
  .get(getIssueById)
  .put(
    protect,
    checkOwnership(Issue),
    uploadIssueImage,
    handleMulterError,
    updateIssue
  )
  .delete(protect, checkOwnership(Issue), deleteIssue);

router.post('/:id/comment', protect, addComment);
router.post('/comments/:commentId/like', protect, likeComment);
router.post('/:id/upvote', protect, upvoteIssue);

module.exports = router;