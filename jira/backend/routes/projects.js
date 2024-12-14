const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { checkProjectAccess } = require("../middleware/projectMiddleware");
const Project = require("../models/Project");

const projectRouter = express.Router();

//Proje oluşturma
projectRouter.post(
  "/create",
  protect,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      leaderId: req.user.id,
      membersId: [req.user.id], // Proje lideri aynı zamanda bir üye olarak eklenir
    });

    res.status(201).json(project);
  })
)

//Proje detaylarını getirme
projectRouter.get(
    "/:projectId/details",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
      const project = await Project.findById(projectId).populate("membersId", "name email").populate("leaderId", "name email");
      res.json(project);
    })
)

//Proje üyelerini getirme
projectRouter.get(
    "/:projectId/members",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
      const project = await Project.findById(projectId).populate("membersId", "name email");
      res.json(project.membersId);
    })
);

//Kullanıcının dahil olduğu projeleri getirme
projectRouter.get(
    "/my-projects",
    protect,
    asyncHandler(async (req, res) => {
      const projects = await Project.find({
        $or: [{ leaderId: req.user.id }, { membersId: req.user.id }],
      }).select("name description");
      res.json(projects);
    })
);

//Projeyi güncelleme
projectRouter.put(
    "/:projectId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
      const updates = req.body;
  
      const project = await Project.findById(projectId);
      if (!project || project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      Object.keys(updates).forEach((key) => {
        project[key] = updates[key];
      });
  
      await project.save();
      res.json(project);
    })
);

//Projeyi silme
projectRouter.delete(
    "/:projectId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
  
      const project = await Project.findById(projectId);
      if (!project || project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      await project.remove();
      res.status(200).json({ message: "Proje başarıyla silindi!" });
    })
);

//Projeden üye çıkarma
projectRouter.delete(
    "/:projectId/member/:userId",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId, userId } = req.params;
  
      const project = await Project.findById(projectId);
      if (!project || project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      project.membersId = project.membersId.filter(
        (memberId) => memberId.toString() !== userId
      );
  
      // Atanan görevlerin kontrolü
      const tasks = await Task.find({ projectId, assigneeId: userId });
      tasks.forEach(async (task) => {
        task.assigneeId = null;
        await task.save();
      });
  
      await project.save();
      res.json({ message: "Üye projeden çıkarıldı." });
    })
);

//Projeyi terk etme
projectRouter.post(
    "/:projectId/leave",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { projectId } = req.params;
  
      const project = await Project.findById(projectId);
      if (project.leaderId.toString() === req.user.id) {
        return res
          .status(400)
          .json({ message: "Proje lideri projeden ayrılamaz!" });
      }
  
      project.membersId = project.membersId.filter(
        (memberId) => memberId.toString() !== req.user.id
      );
  
      await project.save();
      res.json({ message: "Projeden ayrıldınız." });
    })
);

module.exports = projectRouter;