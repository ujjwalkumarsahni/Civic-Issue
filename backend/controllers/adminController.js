// const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');
// const Issue = require('../models/Issue');
// const User = require('../models/User');
// const APIFeatures = require('../utils/apiFeatures');
// const csvExporter = require('../utils/csvExporter');
// const path = require('path');
// const fs = require('fs');

// // @desc    Get all issues (admin view)
// // @route   GET /api/v1/admin/issues
// // @access  Private/Admin
// const getAllIssues = asyncHandler(async (req, res) => {
//   const features = new APIFeatures(
//     Issue.find().populate('user', 'name email'),
//     req.query
//   )
//     .filter()
//     .search()
//     .sort()
//     .limitFields()
//     .paginate();

//   const issues = await features.query;
//   const totalCount = await Issue.countDocuments();

//   // Get statistics
//   const stats = await Issue.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   const categoryStats = await Issue.aggregate([
//     {
//       $group: {
//         _id: '$category',
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   res.json({
//     success: true,
//     count: issues.length,
//     total: totalCount,
//     stats: {
//       byStatus: stats,
//       byCategory: categoryStats
//     },
//     data: issues
//   });
// });

// // @desc    Update issue status
// // @route   PUT /api/v1/admin/issues/:id/status
// // @access  Private/Admin
// const updateIssueStatus = [
//   body('status').isIn(['pending', 'in_progress', 'resolved', 'rejected'])
//     .withMessage('Invalid status'),
  
//   asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const issue = await Issue.findById(req.params.id);

//     if (!issue) {
//       res.status(404);
//       throw new Error('Issue not found');
//     }

//     issue.status = req.body.status;
    
//     if (req.body.status === 'resolved' && !issue.resolvedImage) {
//       return res.status(400).json({
//         success: false,
//         message: 'Resolution image is required when marking as resolved'
//       });
//     }

//     await issue.save();

//     res.json({
//       success: true,
//       data: issue
//     });
//   })
// ];

// // @desc    Resolve issue with image
// // @route   PUT /api/v1/admin/issues/:id/resolve
// // @access  Private/Admin
// const resolveIssue = [
//   body('status').isIn(['resolved', 'rejected']).withMessage('Status must be resolved or rejected'),
  
//   asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array()
//       });
//     }

//     const issue = await Issue.findById(req.params.id);

//     if (!issue) {
//       res.status(404);
//       throw new Error('Issue not found');
//     }

//     // Check if resolution image is provided for resolved status
//     if (req.body.status === 'resolved' && !req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Resolution image is required when marking as resolved'
//       });
//     }

//     issue.status = req.body.status;
    
//     if (req.file) {
//       issue.resolvedImage = req.file.path;
//     }

//     await issue.save();

//     res.json({
//       success: true,
//       data: issue
//     });
//   })
// ];

// // @desc    Delete any issue (admin only)
// // @route   DELETE /api/v1/admin/issues/:id
// // @access  Private/Admin
// const adminDeleteIssue = asyncHandler(async (req, res) => {
//   const issue = await Issue.findById(req.params.id);

//   if (!issue) {
//     res.status(404);
//     throw new Error('Issue not found');
//   }

//   await issue.deleteOne();

//   res.json({
//     success: true,
//     message: 'Issue deleted successfully by admin'
//   });
// });

// // @desc    Export issues as CSV
// // @route   GET /api/v1/admin/export
// // @access  Private/Admin
// const exportIssues = asyncHandler(async (req, res) => {
//   // Get all issues with populated user data
//   const issues = await Issue.find()
//     .populate('user', 'name email')
//     .sort('-createdAt');

//   if (issues.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: 'No issues to export'
//     });
//   }

//   // Export to CSV
//   const exportResult = await csvExporter.exportIssues(issues);

//   // Clean up old exports
//   csvExporter.cleanupOldExports();

//   // Send file
//   res.download(exportResult.filePath, exportResult.fileName, (err) => {
//     if (err) {
//       console.error('Download error:', err);
//       // Don't send another response if headers are already sent
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           message: 'Error downloading file'
//         });
//       }
//     }
    
//     // Delete file after download (optional - uncomment if you want immediate deletion)
//     // setTimeout(() => {
//     //   fs.unlinkSync(exportResult.filePath);
//     // }, 5000);
//   });
// });

// // @desc    Get system statistics
// // @route   GET /api/v1/admin/stats
// // @access  Private/Admin
// const getSystemStats = asyncHandler(async (req, res) => {
//   // User statistics
//   const totalUsers = await User.countDocuments();
//   const totalAdmins = await User.countDocuments({ role: 'admin' });
//   const totalCitizens = await User.countDocuments({ role: 'user' });

//   // Issue statistics
//   const totalIssues = await Issue.countDocuments();
//   const issuesByStatus = await Issue.aggregate([
//     { $group: { _id: '$status', count: { $sum: 1 } } }
//   ]);
  
//   const issuesByCategory = await Issue.aggregate([
//     { $group: { _id: '$category', count: { $sum: 1 } } }
//   ]);

//   // Recent activity
//   const recentIssues = await Issue.find()
//     .sort('-createdAt')
//     .limit(5)
//     .populate('user', 'name');

//   const mostUpvoted = await Issue.find()
//     .sort('-upvotes')
//     .limit(5)
//     .select('title upvotes status');

//   // Time-based statistics (last 30 days)
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//   const issuesLast30Days = await Issue.countDocuments({
//     createdAt: { $gte: thirtyDaysAgo }
//   });

//   const resolvedLast30Days = await Issue.countDocuments({
//     status: 'resolved',
//     updatedAt: { $gte: thirtyDaysAgo }
//   });

//   res.json({
//     success: true,
//     data: {
//       users: {
//         total: totalUsers,
//         admins: totalAdmins,
//         citizens: totalCitizens
//       },
//       issues: {
//         total: totalIssues,
//         byStatus: issuesByStatus,
//         byCategory: issuesByCategory,
//         last30Days: issuesLast30Days,
//         resolvedLast30Days: resolvedLast30Days
//       },
//       recentIssues,
//       mostUpvoted
//     }
//   });
// });

// module.exports = {
//   getAllIssues,
//   updateIssueStatus,
//   resolveIssue,
//   adminDeleteIssue,
//   exportIssues,
//   getSystemStats
// };



const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const csvExporter = require('../utils/csvExporter');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all issues (admin view)
// @route   GET /api/v1/admin/issues
// @access  Private/Admin
const getAllIssues = asyncHandler(async (req, res) => {
  const features = new APIFeatures(
    Issue.find().populate('user', 'name email'),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const issues = await features.query;
  const totalCount = await Issue.countDocuments();

  // Get statistics
  const stats = await Issue.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const categoryStats = await Issue.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    count: issues.length,
    total: totalCount,
    stats: {
      byStatus: stats,
      byCategory: categoryStats
    },
    data: issues
  });
});

// @desc    Update issue status
// @route   PUT /api/v1/admin/issues/:id/status
// @access  Private/Admin
const updateIssueStatus = [
  body('status').isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  
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

    // Update status
    issue.status = req.body.status;
    
    // Add note if provided
    if (req.body.note) {
      issue.statusNote = req.body.note;
    }

    // Save the updated issue
    await issue.save();

    // ⭐ send mail to issue creator
const issueOwner = await User.findById(issue.user);

if (issueOwner) {
  sendEmail({
    email: issueOwner.email,
    subject: "Update on Your Reported Issue",
    html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
      
      <h2 style="color:#2980b9;">Issue Status Updated</h2>

      <p>Dear ${issueOwner.name || 'User'},</p>

      <p>
        We would like to inform you that the status of your reported issue has been updated.
      </p>

      <table style="border-collapse: collapse; margin-top:10px;">
        <tr>
          <td style="padding:6px;"><strong>Issue Title:</strong></td>
          <td style="padding:6px;">${issue.title}</td>
        </tr>
        <tr>
          <td style="padding:6px;"><strong>New Status:</strong></td>
          <td style="padding:6px;">${issue.status}</td>
        </tr>
      </table>

      ${
        issue.statusNote
          ? `<p style="margin-top:12px;"><strong>Admin Note:</strong> ${issue.statusNote}</p>`
          : ''
      }

      <p style="margin-top:15px;">
        Thank you for your contribution in improving civic services.
      </p>

      <br/>

      <p>
        Regards,<br/>
        <strong>City Issue Management Team</strong>
      </p>

    </div>
    `
  }).catch(console.error);
}

    // Return updated issue with populated user
    const updatedIssue = await Issue.findById(req.params.id).populate('user', 'name email');

    res.json({
      success: true,
      data: updatedIssue
    });
  })
];

// @desc    Resolve issue with image
// @route   PUT /api/v1/admin/issues/:id/resolve
// @access  Private/Admin
const resolveIssue = [
  body('status').isIn(['resolved', 'rejected']).withMessage('Status must be resolved or rejected'),
  
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

    // Check if resolution image is provided for resolved status
    if (req.body.status === 'resolved' && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resolution image is required when marking as resolved'
      });
    }

    issue.status = req.body.status;
    
    if (req.file) {
      issue.resolvedImage = req.file.path;
    }

    if (req.body.note) {
      issue.statusNote = req.body.note;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(req.params.id).populate('user', 'name email');

    res.json({
      success: true,
      data: updatedIssue
    });
  })
];

// @desc    Delete any issue (admin only)
// @route   DELETE /api/v1/admin/issues/:id
// @access  Private/Admin
const adminDeleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error('Issue not found');
  }

  await issue.deleteOne();

  res.json({
    success: true,
    message: 'Issue deleted successfully by admin'
  });
});

// @desc    Export issues as CSV
// @route   GET /api/v1/admin/export
// @access  Private/Admin
const exportIssues = asyncHandler(async (req, res) => {
  // Get all issues with populated user data
  const issues = await Issue.find()
    .populate('user', 'name email')
    .sort('-createdAt');

  if (issues.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No issues to export'
    });
  }

  // Export to CSV
  const exportResult = await csvExporter.exportIssues(issues);

  // Clean up old exports
  csvExporter.cleanupOldExports();

  // Send file
  res.download(exportResult.filePath, exportResult.fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      // Don't send another response if headers are already sent
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        });
      }
    }
    
    // Delete file after download (optional - uncomment if you want immediate deletion)
    // setTimeout(() => {
    //   fs.unlinkSync(exportResult.filePath);
    // }, 5000);
  });
});

// @desc    Get system statistics
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
const getSystemStats = asyncHandler(async (req, res) => {
  // User statistics
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalCitizens = await User.countDocuments({ role: 'user' });

  // Issue statistics
  const totalIssues = await Issue.countDocuments();
  const issuesByStatus = await Issue.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const issuesByCategory = await Issue.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  // Recent activity
  const recentIssues = await Issue.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name');

  const mostUpvoted = await Issue.find()
    .sort('-upvotes')
    .limit(5)
    .select('title upvotes status');

  // Time-based statistics (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const issuesLast30Days = await Issue.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  const resolvedLast30Days = await Issue.countDocuments({
    status: 'resolved',
    updatedAt: { $gte: thirtyDaysAgo }
  });

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        admins: totalAdmins,
        citizens: totalCitizens
      },
      issues: {
        total: totalIssues,
        byStatus: issuesByStatus,
        byCategory: issuesByCategory,
        last30Days: issuesLast30Days,
        resolvedLast30Days: resolvedLast30Days
      },
      recentIssues,
      mostUpvoted
    }
  });
});

module.exports = {
  getAllIssues,
  updateIssueStatus,
  resolveIssue,
  adminDeleteIssue,
  exportIssues,
  getSystemStats
};