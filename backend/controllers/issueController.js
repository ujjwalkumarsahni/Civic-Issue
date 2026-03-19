const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const { getDistance } = require('geolib');
const sendEmail = require('../utils/sendEmail');


const createIssue = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('category').isIn(['Garbage', 'Water Leakage', 'Road Damage', 'Street Light', 'Other'])
    .withMessage('Invalid category'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, category, longitude, latitude } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Check for duplicate issue within 50 meters
    const nearbyIssues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 50
        }
      },

      status: { $ne: 'resolved' },

      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    });

    if (nearbyIssues.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A similar issue has already been reported in this area within the last 24 hours',
        nearbyIssue: nearbyIssues[0]._id
      });
    }

    // Create issue
    const issue = await Issue.create({
      user: req.user._id,
      title,
      description,
      category,
      image: req.file.path,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });


    // USER
    sendEmail({
      email: req.user.email,
      subject: "Issue Report Successfully Registered",
      html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    
    <h2 style="color:#2c3e50;">Issue Registration Confirmation</h2>

    <p>Dear ${req.user.name || 'User'},</p>

    <p>
      We would like to inform you that your reported issue has been 
      <strong>successfully registered</strong> in our City Issue Management System.
    </p>

    <table style="border-collapse: collapse; margin-top:10px;">
      <tr>
        <td style="padding:6px;"><strong>Issue Title:</strong></td>
        <td style="padding:6px;">${title}</td>
      </tr>
      <tr>
        <td style="padding:6px;"><strong>Category:</strong></td>
        <td style="padding:6px;">${category}</td>
      </tr>
      <tr>
        <td style="padding:6px;"><strong>Status:</strong></td>
        <td style="padding:6px;">Pending Review</td>
      </tr>
    </table>

    <p style="margin-top:15px;">
      Our administrative team will review the issue and take appropriate action 
      as soon as possible.
    </p>

    <p>
      Thank you for helping us improve city services.
    </p>

    <br/>

    <p>
      Regards,<br/>
      <strong>City Issue Management Team</strong>
    </p>

  </div>
  `
    }).catch(console.error);


    // ADMIN 
    const admins = await User.find({ role: 'admin' });

    for (const admin of admins) {
      sendEmail({
        email: admin.email,
        subject: "New Issue Reported in System",
        html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

    <h2 style="color:#e74c3c;">New Issue Notification</h2>

    <p>Dear Admin,</p>

    <p>
      A new issue has been reported by a user and requires your attention.
    </p>

    <table style="border-collapse: collapse; margin-top:10px;">
      <tr>
        <td style="padding:6px;"><strong>Reported By:</strong></td>
        <td style="padding:6px;">${req.user.name}</td>
      </tr>
      <tr>
        <td style="padding:6px;"><strong>Email:</strong></td>
        <td style="padding:6px;">${req.user.email}</td>
      </tr>
      <tr>
        <td style="padding:6px;"><strong>Issue Title:</strong></td>
        <td style="padding:6px;">${title}</td>
      </tr>
      <tr>
        <td style="padding:6px;"><strong>Category:</strong></td>
        <td style="padding:6px;">${category}</td>
      </tr>
    </table>

    <p style="margin-top:15px;">
      Please review the issue in the admin dashboard and take necessary action.
    </p>

    <br/>

    <p>
      System Generated Notification<br/>
      <strong>City Issue Management Platform</strong>
    </p>

  </div>
  `
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      data: issue
    });
  })
];

const getIssues = asyncHandler(async (req, res) => {

  let query;

  // ⭐ अगर admin है → सब issues
  if (req.user.role === 'admin') {
    query = Issue.find();
  }
  // ⭐ अगर normal user है → सिर्फ उसके issues
  else {
    query = Issue.find({ user: req.user._id });
  }

  const features = new APIFeatures(query, req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  if (req.query.longitude && req.query.latitude) {
    features.nearby(req.query.longitude, req.query.latitude, req.query.maxDistance || 5000);
  }

  const issues = await features.query
    .populate('user', 'name email')
    .populate('comments.user', 'name');

  const totalCount = await Issue.countDocuments(
    req.user.role === 'admin'
      ? {}
      : { user: req.user._id }
  );

  res.json({
    success: true,
    count: issues.length,
    total: totalCount,
    data: issues
  });
});

const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('user', 'name email')
    .populate('comments.user', 'name');

  if (issue) {
    res.json({
      success: true,
      data: issue
    });
  } else {
    res.status(404);
    throw new Error('Issue not found');
  }
});

const updateIssue = asyncHandler(async (req, res) => {
  let issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  // Check ownership
  if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this issue');
  }

  // Update fields
  const { title, description, category } = req.body;

  issue.title = title || issue.title;
  issue.description = description || issue.description;
  issue.category = category || issue.category;

  // Update image if new one provided
  if (req.file) {
    issue.image = req.file.path;
  }

  const updatedIssue = await issue.save();

  res.json({
    success: true,
    data: updatedIssue
  });
});

const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  // Check ownership
  if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this issue');
  }

  await issue.deleteOne();

  res.json({
    success: true,
    message: 'Issue removed successfully'
  });
});

// @desc    Add comment to issue
// @route   POST /api/v1/issues/:id/comment
// @access  Private
const addComment = [
  body('text').notEmpty().withMessage('Comment text is required').trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date()
    };

    issue.comments.push(comment);
    await issue.save();

    // Populate user details for the new comment
    const populatedIssue = await Issue.findById(req.params.id)
      .populate('comments.user', 'name');

    const newComment = populatedIssue.comments[populatedIssue.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment
    });
  })
];

const likeComment = asyncHandler(async (req, res) => {

  const issue = await Issue.findOne({
    "comments._id": req.params.commentId
  });

  if (!issue) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const comment = issue.comments.id(req.params.commentId);

  if (!comment.likes) comment.likes = 0;
  if (!comment.likedBy) comment.likedBy = [];

  const alreadyLiked = comment.likedBy.includes(req.user._id);

  if (alreadyLiked) {
    comment.likes -= 1;
    comment.likedBy = comment.likedBy.filter(
      id => id.toString() !== req.user._id.toString()
    );
  } else {
    comment.likes += 1;
    comment.likedBy.push(req.user._id);
  }

  await issue.save();

  res.json({
    success: true,
    likes: comment.likes
  });

});

// @desc    Upvote issue
// @route   POST /api/v1/issues/:id/upvote
// @access  Private
const upvoteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  // Check if user already upvoted
  const alreadyUpvoted = issue.upvotedBy.includes(req.user._id);

  if (alreadyUpvoted) {
    // Remove upvote
    issue.upvotes -= 1;
    issue.upvotedBy = issue.upvotedBy.filter(
      id => id.toString() !== req.user._id.toString()
    );
  } else {
    // Add upvote
    issue.upvotes += 1;
    issue.upvotedBy.push(req.user._id);
  }

  await issue.save();

  res.json({
    success: true,
    data: {
      upvotes: issue.upvotes,
      upvoted: !alreadyUpvoted
    }
  });
});

// @desc    Get user's issues
// @route   GET /api/v1/issues/user/me
// @access  Private
const getUserIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('user', 'name email');

  res.json({
    success: true,
    count: issues.length,
    data: issues
  });
});

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  upvoteIssue,
  getUserIssues,
  likeComment
};