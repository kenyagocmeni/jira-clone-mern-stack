const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcı bilgisini yükle ve request'e ekle
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Kullanıcı bulunamadı, yetkisiz erişim!" });
      }

      next();
    } catch (error) {
      console.error("Token doğrulama hatası:", error.message);
      return res.status(401).json({ message: "Token geçersiz veya süresi dolmuş!" });
    }
  } else {
    res.status(401).json({ message: "Token bulunamadı, lütfen giriş yapın!" });
  }
});

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Yalnızca admin kullanıcılar bu işlemi gerçekleştirebilir!" });
  }
  next();
};

module.exports = { protect, isAdmin };