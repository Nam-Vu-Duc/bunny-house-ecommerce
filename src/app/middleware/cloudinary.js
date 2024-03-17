const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
  cloud_name: 'bunny-store', 
  api_key: '261424777746663', 
  api_secret: 'FLDgGGLFusd2I8Wtscx8ZdHY9AI' 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    // format: async (req, file) => 'png',
  },
});

const upload = multer({ storage: storage })

  
module.exports = upload