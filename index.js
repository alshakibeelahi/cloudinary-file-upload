const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'Enter your cloud name',
  api_key: 'Enter your API key',
  api_secret: 'Enter your API secret'
});

const app = express();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), (req, res, next) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Upload file to Cloudinary
  const uploadOptions = {
    public_id: req.body.fileName|| req.file.filename,// Set the public_id of the file (name)
    resource_type: 'auto' // Automatically determine the type of file
  };

  cloudinary.uploader.upload_stream(uploadOptions,(error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Upload to Cloudinary failed', error: error });
    }
    // File uploaded successfully, return Cloudinary URL
    res.json({ url: result.secure_url });
  }).end(req.file.buffer);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
