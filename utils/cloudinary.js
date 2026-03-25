const cloudinaryLib = require('cloudinary')
const cloudinary = cloudinaryLib.v2
const cloudinaryStorageModule = require('multer-storage-cloudinary')
const CloudinaryStorage = cloudinaryStorageModule.CloudinaryStorage || cloudinaryStorageModule

// Configure v2 instance (used by both our code and storage via cloudinaryLib.v2)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  // multer-storage-cloudinary expects the top-level cloudinary module (accesses .v2 internally)
  cloudinary: cloudinaryLib,
  params: {
    folder: 'KostKita',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
})

module.exports = {
  cloudinary,
  storage,
}
