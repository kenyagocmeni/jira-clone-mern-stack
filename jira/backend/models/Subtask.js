const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
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
      enum: ["todo", "inProgress", "verify", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subtask", subtaskSchema);
