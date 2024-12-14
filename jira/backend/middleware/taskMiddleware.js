const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Project = require("../models/Project");

// Görev erişimi kontrolü
const checkTaskAccess = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId).populate("projectId");

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı!" });
    }

    const project = task.projectId;

    const isLeader = project.leaderId.toString() === req.user.id;
    const isMember = project.membersId.some(
      (memberId) => memberId.toString() === req.user.id
    );
    const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user.id;

    if (!isLeader && !isMember && !isAssignee) {
      return res
        .status(403)
        .json({ message: "Bu göreve erişim yetkiniz bulunmamaktadır!" });
    }

    // Görev bilgilerini request'e ekle
    req.task = task;

    next();
  } catch (error) {
    console.error("Görev erişim kontrolü sırasında hata:", error.message);
    res.status(500).json({ message: "Sunucu hatası!" });
  }
})

const checkTaskEditPermission = asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;
  
    try {
      const task = await Task.findById(taskId).populate("projectId");
  
      if (!task) {
        return res.status(404).json({ message: "Görev bulunamadı!" });
      }
  
      const project = task.projectId;
  
      const isLeader = project.leaderId.toString() === req.user.id;
      const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user.id;
  
      if (!isLeader && !isAssignee) {
        return res
          .status(403)
          .json({ message: "Bu görevi değiştirme yetkiniz bulunmamaktadır!" });
      }
  
      next();
    } catch (error) {
      console.error("Görev düzenleme kontrolü sırasında hata:", error.message);
      res.status(500).json({ message: "Sunucu hatası!" });
    }
  });
  
  module.exports = { checkTaskAccess, checkTaskEditPermission };