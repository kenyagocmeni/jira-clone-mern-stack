const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { checkTaskAccess } = require("../middleware/taskMiddleware");
const Subtask = require("../models/Subtask");
const Task = require("../models/Task");
const multer = require("../config/multerConfig");

const subtaskRouter = express.Router({ mergeParams: true });
const DOMPurify = require("isomorphic-dompurify");

// Alt görev güncelleme
subtaskRouter.put(
  "/:subtaskId/update",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const updates = req.body;

    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    // Güncellemeleri uygula, description HTML ise sanitize et
    Object.keys(updates).forEach((key) => {
      if (key === "description") {
        subtask[key] = DOMPurify.sanitize(updates[key]);
      } else {
        subtask[key] = updates[key];
      }
    });

    await subtask.save();
    res.json(subtask);
  })
);

//Alt görev oluşturma
subtaskRouter.post(
  "/create",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { title, description, status } = req.body;
    const { taskId } = req.params;

    const subtask = await Subtask.create({
      taskId,
      title,
      description,
      status,
    });

    const task = await Task.findById(taskId);
    task.subtasks.push(subtask._id);
    await task.save();

    res.status(201).json(subtask);
  })
);

// Alt görev statüsü güncelleme
subtaskRouter.put(
  "/:subtaskId/status",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const { status } = req.body;

    // Alt görevi bul
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    // Alt görev statüsünü güncelle
    subtask.status = status;
    await subtask.save();

    res.status(200).json({ message: "Alt görev statüsü başarıyla güncellendi!", subtask });
  })
);

// Alt görev silme
subtaskRouter.delete(
    "/:subtaskId",
    protect,
    checkTaskAccess,
    asyncHandler(async (req, res) => {
      const { subtaskId, taskId } = req.params;
  
      const subtask = await Subtask.findById(subtaskId);
  
      if (!subtask) {
        return res.status(404).json({ message: "Alt görev bulunamadı!" });
      }
  
      // Modern yöntem: deleteOne
      await subtask.deleteOne();
  
      const task = await Task.findById(taskId);
      task.subtasks = task.subtasks.filter(
        (st) => st.toString() !== subtaskId.toString()
      );
      await task.save();
  
      res.json({ message: "Alt görev başarıyla silindi!" });
    })
);

// Alt göreve dosya ekleme
subtaskRouter.post(
  "/:subtaskId/file",
  protect,
  checkTaskAccess,
  multer.single("file"), // Dosyayı yüklemek için multer middleware
  asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenemedi!" });
    }

    // Dosya bilgilerini alt göreve ekle
    subtask.files.push({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    });
    await subtask.save();

    res.status(201).json({ message: "Dosya başarıyla yüklendi!", file: req.file });
  })
);

// Alt görevden dosya silme
subtaskRouter.delete(
  "/:subtaskId/files/:fileId",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { subtaskId, fileId } = req.params;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    // Dosyayı alt görev dosya listesinden sil
    subtask.files = subtask.files.filter(
      (file) => file._id.toString() !== fileId.toString()
    );
    await subtask.save();

    res.json({ message: "Dosya başarıyla silindi!" });
  })
);

// Alt göreve bağlı dosyaları listeleme
subtaskRouter.get(
  "/:subtaskId/files",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    res.json(subtask.files);
  })
);

//Göreve bağlı alt görevleri listeleme
subtaskRouter.get(
  "/",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const subtasks = await Subtask.find({ taskId });
    res.json(subtasks);
  })
);

//Alt görevin detaylarını getirme
subtaskRouter.get(
  "/:subtaskId",
  protect,
  checkTaskAccess,
  asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;

    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ message: "Alt görev bulunamadı!" });
    }

    res.json(subtask);
  })
);

module.exports = subtaskRouter;