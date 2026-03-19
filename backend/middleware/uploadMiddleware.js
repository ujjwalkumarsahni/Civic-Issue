const multer = require('multer');
const { issueStorage, resolutionStorage } = require('../config/cloudinary');

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Multer configuration for issue images
const uploadIssueImage = multer({
  storage: issueStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only one file at a time
  },
  fileFilter: fileFilter
});

// Multer configuration for resolution images
const uploadResolutionImage = multer({
  storage: resolutionStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1
  },
  fileFilter: fileFilter
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = {
  uploadIssueImage: uploadIssueImage.single('image'),
  uploadResolutionImage: uploadResolutionImage.single('resolvedImage'),
  handleMulterError
};