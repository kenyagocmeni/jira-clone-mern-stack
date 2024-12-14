const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { checkProjectAccess } = require("../middleware/projectMiddleware");
const upload = require("../config/multerConfig"); // Multer config dosyası
const Task = require("../models/Task");
const Project = require("../models/Project");

const taskRouter = express.Router({ mergeParams: true });
const DOMPurify = require("isomorphic-dompurify");

// Görev güncelleme
taskRouter.put(
  "/:taskId/update",
  protect,
  checkProjectAccess,
  asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı!" });
    }

    const project = await Project.findById(task.projectId);

    if (project.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
    }

    // Güncellemeleri uygula, description HTML ise sanitize et
    Object.keys(updates).forEach((key) => {
      if (key === "description") {
        task[key] = DOMPurify.sanitize(updates[key]);
      } else {
        task[key] = updates[key];
      }
    });

    await task.save();
    res.json(task);
  })
);

//Görev oluşturma
taskRouter.post(
    "/create",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { title, description, status } = req.body; // Statü de alınacak
      const { projectId } = req.params;
  
      // Statü kontrolü
      const validStatuses = ["todo", "inProgress", "verify", "done"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Geçersiz görev statüsü!" });
      }
  
      const project = await Project.findById(projectId);
  
      if (project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      const task = await Task.create({
        projectId,
        title,
        description,
        status, // Statü de eklendi
      });
  
      project.tasks.push(task._id);
      await project.save();
  
      res.status(201).json(task);
    })
);

// Görev statüsü güncelleme
taskRouter.put(
  "/:taskId/status",
  protect,
  checkProjectAccess,
  asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    // Görevi bul
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı!" });
    }

    // Projeyi bul
    const project = await Project.findById(task.projectId);

    // Kullanıcının yetkisini kontrol et
    const isLeader = project.leaderId.toString() === req.user.id;
    const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user.id;

    if (!isLeader && !isAssignee) {
      return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
    }

    // İzin verilen statüler
    const allowedStatuses = isLeader
      ? ["todo", "inProgress", "verify", "done"]
      : ["todo", "inProgress", "verify"];

    // Geçersiz statü durumu
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Bu statüyü değiştirme yetkiniz yok! İzin verilen statüler: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    // Statüyü güncelle
    task.status = status;
    await task.save();
    res.status(200).json({ message: "Görev statüsü başarıyla güncellendi!", task });
  })
);

//Görev silme
taskRouter.delete(
    "/:taskId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      const project = await Project.findById(task.projectId);
  
      if (project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      await task.remove();
      project.tasks = project.tasks.filter(
        (t) => t.toString() !== taskId.toString()
      );
      await project.save();
  
      res.json({ message: "Görev başarıyla silindi!" });
    })
);

// Göreve dosya yükleme
taskRouter.post(
    "/:taskId/file",
    protect,
    checkProjectAccess,
    upload.single("file"), // 'file' alanı formdan alınan dosya adı olmalı
    asyncHandler(async (req, res) => {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "Dosya yüklenemedi!" });
      }
  
      // Dosya bilgilerini göreve ekle
      task.files.push({
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
      });
      await task.save();
  
      res.status(201).json({ message: "Dosya başarıyla yüklendi!", file: req.file });
    })
);

//Görev listeleme
taskRouter.get(
    "/",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
  
      const tasks = await Task.find({ projectId }).populate("assigneeId","name email");
      res.json(tasks);
    })
);

//Görev detaylarını getirme
taskRouter.get(
    "/:taskId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId)
        .populate("assigneeId", "name email") // Göreve atanan üye bilgisi
  
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      res.status(200).json(task);
    })
);
  
// Görevle ilişkili dosya silme
taskRouter.delete(
    "/:taskId/file/:fileId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId, fileId } = req.params;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      task.files = task.files.filter((file) => file._id.toString() !== fileId);
      await task.save();
  
      res.json({ message: "Dosya başarıyla silindi!" });
    })
);
  
// Görevle ilişkili dosyaları listeleme
taskRouter.get(
    "/:taskId/files",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      res.json(task.files);
    })
);

// Göreve üye atama
taskRouter.put(
    "/:taskId/assign/:userId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId, userId } = req.params;
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      task.assigneeId = userId;
      await task.save();
  
      res.json({ message: "Üye başarıyla atandı!" });
    })
);
  
// Görevden atanmış üyeyi kaldırma
taskRouter.delete(
    "/:taskId/unassign",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      task.assigneeId = null;
      await task.save();
  
      res.json({ message: "Üye görevden kaldırıldı!" });
    })
);

module.exports = taskRouter;