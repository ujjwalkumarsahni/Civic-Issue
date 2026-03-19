const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage for issue images
const issueStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civic-issues/issues',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 750, crop: 'limit' }],
    resource_type: 'image'
  }
});

// Create storage for resolution images
const resolutionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civic-issues/resolutions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 750, crop: 'limit' }],
    resource_type: 'image'
  }
});

module.exports = {
  cloudinary,
  issueStorage,
  resolutionStorage
};