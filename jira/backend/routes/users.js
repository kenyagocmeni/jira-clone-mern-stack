const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır!" });
      }

    // Kullanıcı zaten kayıtlı mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı!" });
    }

    // Yeni kullanıcı oluştur
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  })
);

userRouter.post(
    "/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
  
      // Kullanıcı var mı?
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Geçersiz e-posta veya parola!" });
      }
  
      // Parola doğrulama
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Geçersiz e-posta veya parola!" });
      }
  
      // Token oluştur
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    })
  )

userRouter.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  })
);

module.exports = userRouter;