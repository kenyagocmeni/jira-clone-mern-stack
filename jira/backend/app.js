const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/users")
const projectRoutes = require("./routes/projects");
const subtaskRoutes = require("./routes/subtasks");
const taskRoutes = require("./routes/tasks");
const invitationRoutes = require("./routes/invitations");
require("dotenv").config();
const path = require("path");

const app = express();

// Veritabanı bağlantısı
connectDB();

// Statik dosya servisi
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Rotalar
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/projects/:projectId/tasks/:taskId/subtasks", subtaskRoutes);
app.use("/api/projects/:projectId/invitations", invitationRoutes);

// Varsayılan rota
app.use((req, res, next) => {
  res.status(404).json({ message: "Rota bulunamadı." });
});

// Hata yönetimi middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Sunucuda bir hata oluştu.",
  });
});

module.exports = app;