const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Function to create storage dynamically based on folder name
const getStorage = (folderName) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName, // Dynamically set folder name
        allowed_formats: [
            "jpg", "jpeg", "png", "gif", "webp", "avif", // Images
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", // Documents
            "mp3", "wav", "ogg", "aac", "flac" // Audio
        ],
    },
});

// Function to return a Multer instance with dynamic storage
const upload = (folderName) => multer({ storage: getStorage(folderName) });

module.exports = upload;