const multer = require("multer");
const path = require("path");

const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Extension Name
  }
});

const upload = multer({ storage: storage })

module.exports = upload;