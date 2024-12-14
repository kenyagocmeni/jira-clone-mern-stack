const multer = require("multer");
const path = require("path");

// Dosya depolama konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Yüklenecek dosyalar için bir 'uploads' klasörü
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Dosya türü filtreleme
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
  const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Geçersiz dosya türü. Yalnızca jpeg, jpg, png, pdf, doc, docx, txt desteklenir."));
  }
};

// Multer yapılandırması
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum dosya boyutu: 5MB
  fileFilter,
});

module.exports = upload;