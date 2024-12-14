const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { checkProjectAccess } = require("../middleware/projectMiddleware");
const Invitation = require("../models/Invitation");
const Project = require("../models/Project");
const User = require("../models/User");

const invitationRouter = express.Router({ mergeParams: true });

// Davetiye gönderme
invitationRouter.post(
    "/send",
    protect,
    checkProjectAccess,
    asyncHandler(async (req, res) => {
      const { recipientEmail, message } = req.body; // recipientId yerine recipientEmail alınıyor
      const { projectId } = req.params;
  
      const project = await Project.findById(projectId);
  
      if (project.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok!" });
      }
  
      // E-posta üzerinden kullanıcıyı bul
      const recipient = await User.findOne({ email: recipientEmail });
      if (!recipient) {
        return res.status(404).json({ message: "Alıcı bulunamadı." });
      }
  
      // Davet oluştur
      const invitation = await Invitation.create({
        projectId,
        inviterId: req.user.id,
        recipientId: recipient._id, // ObjectId olarak atanıyor
        status: "pending",
        message,
        projectName: project.name,
        projectDescription: project.description,
      });
  
      res.status(201).json(invitation);
    })
  );

// Davetiye Kabul Etme
invitationRouter.post(
    '/:invitationId/accept',
    protect,
    asyncHandler(async (req, res) => {
      const { invitationId } = req.params;
  
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation) {
        return res.status(404).json({ message: 'Davetiye bulunamadı!' });
      }
  
      if (invitation.status !== 'pending') {
        return res.status(400).json({ message: 'Davetiye zaten işleme alınmış.' });
      }
  
      // Davetiye kabul edilir ve ilgili işlem yapılır (ör. kullanıcı projeye eklenir)
      const project = await Project.findById(invitation.projectId);
      project.membersId.push(invitation.recipientId);
      await project.save();
  
      // Davetiyeyi veri tabanından sil
      await Invitation.findByIdAndDelete(invitationId);
  
      res.status(200).json({ message: 'Davetiye kabul edildi ve silindi.' });
    })
);

// Davetiye Reddetme
invitationRouter.post(
    '/:invitationId/reject',
    protect,
    asyncHandler(async (req, res) => {
      const { invitationId } = req.params;
  
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation) {
        return res.status(404).json({ message: 'Davetiye bulunamadı!' });
      }
  
      if (invitation.status !== 'pending') {
        return res.status(400).json({ message: 'Davetiye zaten işleme alınmış.' });
      }
  
      // Davetiyeyi veri tabanından sil
      await Invitation.findByIdAndDelete(invitationId);
  
      res.status(200).json({ message: 'Davetiye reddedildi ve silindi.' });
    })
);

//Kullanıcıya gelen davetiyeleri  listeleme
invitationRouter.get(
    "/list",
    protect,
    asyncHandler(async (req, res) => {
      const invitations = await Invitation.find({ recipientId: req.user.id });
      res.json(invitations);
    })
);

//Davetiyeyi silme
invitationRouter.delete(
    "/:invitationId",
    protect,
    asyncHandler(async (req, res) => {
      const { invitationId, projectId } = req.params;
  
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation || invitation.projectId.toString() !== projectId) {
        return res.status(404).json({ message: "Davetiye bulunamadı!" });
      }
  
      if (invitation.recipientId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bu davetiyeyi silemezsiniz!" });
      }
  
      await invitation.remove();
  
      res.json({ message: "Davetiye silindi!" });
    })
);

module.exports = invitationRouter;