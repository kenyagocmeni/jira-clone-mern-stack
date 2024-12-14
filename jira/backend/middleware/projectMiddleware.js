const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

const checkProjectAccess = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proje bulunamadı!" });
    }

    const isLeader = project.leaderId.toString() === req.user.id;
    const isMember = project.membersId.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (!isLeader && !isMember) {
      return res
        .status(403)
        .json({ message: "Bu projeye erişim yetkiniz bulunmamaktadır!" });
    }

    // Proje bilgilerini request'e ekle
    req.project = project;

    next();
  } catch (error) {
    console.error("Proje erişim kontrolü sırasında hata:", error.message);
    res.status(500).json({ message: "Sunucu hatası!" });
  }
});

module.exports = { checkProjectAccess };