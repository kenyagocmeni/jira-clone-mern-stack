const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { type: String, default: "" }, // Açıklama için HTML string
    files: [
      {
        name: String,
        url: String,
      },
    ],
    status: {
      type: String,
      enum: ["todo", "inProgress", "verify", "done"], // Statü seçenekleri
      required: true, // Artık statü zorunlu olacak
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subtasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subtask",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);