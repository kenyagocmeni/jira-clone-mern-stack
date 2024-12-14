"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchTaskDetails,
  updateTask,
  updateTaskStatus,
  assignTaskMember,
  unassignTaskMember,
  uploadTaskFile,
  deleteTaskFile,
  fetchTaskFiles,
} from "@components/redux/slices/taskSlice";
import {
  fetchSubtasks,
  createSubtask,
  deleteSubtask,
  updateSubtask,
  updateSubtaskStatus,
  uploadSubtaskFile,
  deleteSubtaskFile,
  fetchSubtaskFiles,
} from "@components/redux/slices/subtaskSlice";
import { fetchProjectMembers } from "@components/redux/slices/projectSlice";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export default function TaskDetailsPage({ projectId, taskId }) {
  const dispatch = useDispatch();
  const router = useRouter();

  console.log("ProjectId:", projectId);
  console.log("TaskId:", taskId);

  const { selectedTask, files, isLoading, error } = useSelector(
    (state) => state.task
  );
  const { subtasks } = useSelector((state) => state.subtask);
  const { members } = useSelector((state) => state.project);
  const { subtaskFiles } = useSelector((state) => state.subtask);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [status, setStatus] = useState("");
  const [newSubtask, setNewSubtask] = useState({ title: "", description: "" });
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [file, setFile] = useState(null);
  const [subtaskFile, setSubtaskFile] = useState(null);

  const { projectDetails } = useSelector((state) => state.project);

  useEffect(() => {
    if (selectedTask) {
      setTaskForm({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
      });
      setStatus(selectedTask.status);
    }
  }, [selectedTask]);

  const handleInputChange = (e) => {
    // Eğer bir event varsa (örneğin normal input için)
    if (e?.target) {
      const { name, value } = e.target;
      setTaskForm((prev) => ({ ...prev, [name]: value }));
    } else {
      // Eğer React Quill'den gelen bir değer varsa
      setTaskForm((prev) => ({ ...prev, description: e })); // `e` burada React Quill'in içeriği
    }
  };

  const handleTaskUpdate = () => {
    dispatch(updateTask({ projectId, taskId, updates: taskForm }));
  };

  const handleStatusUpdate = (newStatus) => {
    dispatch(updateTaskStatus({ projectId, taskId, status: newStatus }));
  };

  const handleSubtaskCreation = () => {
    dispatch(createSubtask({ taskId, ...newSubtask }));
    setNewSubtask({ title: "", description: "" });
  };

  const handleSubtaskDeletion = (subtaskId) => {
    dispatch(deleteSubtask({ projectId, taskId, subtaskId }))
      .unwrap()
      .then(() => {
        console.log("Alt görev başarıyla silindi!");
      })
      .catch((error) => {
        console.error("Alt görev silme başarısız:", error);
      });
  };

  const handleSubtaskSelection = (e, subtask) => {
    if (e.target.tagName !== "SELECT") {
      setSelectedSubtask(subtask);
    }
  };

  const handleSubtaskUpdate = () => {
    if (selectedSubtask) {
      dispatch(
        updateSubtask({
          taskId,
          subtaskId: selectedSubtask._id,
          updates: selectedSubtask,
        })
      );
    }
  };

  const handleSubtaskStatusUpdate = (subtaskId, newStatus) => {
    dispatch(updateSubtaskStatus({ taskId, subtaskId, status: newStatus }));
  };

  const handleSubtaskFileUpload = () => {
    dispatch(
      uploadSubtaskFile({
        projectId,
        taskId,
        subtaskId: selectedSubtask._id,
        file: subtaskFile,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          fetchSubtaskFiles({
            projectId,
            taskId,
            subtaskId: selectedSubtask._id,
          })
        );
        setSubtaskFile(null); // Yükleme sonrası input'u temizle
      })
      .catch((error) => console.error("Dosya yüklenemedi:", error));
  };

  const handleSubtaskFileDelete = (fileId) => {
    dispatch(
      deleteSubtaskFile({
        projectId,
        taskId,
        subtaskId: selectedSubtask._id,
        fileId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          fetchSubtaskFiles({
            projectId,
            taskId,
            subtaskId: selectedSubtask._id,
          })
        );
      })
      .catch((error) => console.error("Dosya silinemedi:", error));
  };

  const handleAssignMember = (userId) => {
    dispatch(assignTaskMember({ projectId, taskId, userId }))
      .unwrap()
      .then(() => {
        console.log("Üye başarıyla atandı!");
        dispatch(fetchTaskDetails({ projectId, taskId }));
      })
      .catch((error) => {
        console.error("Üye atama başarısız:", error.message);
      });
  };

  useEffect(() => {
    dispatch(fetchTaskDetails({ projectId, taskId }));
    dispatch(fetchSubtasks(taskId));
    dispatch(fetchProjectMembers(projectId));
    dispatch(fetchTaskFiles({ projectId, taskId }));
    if (selectedSubtask) {
      dispatch(
        fetchSubtaskFiles({ projectId, taskId, subtaskId: selectedSubtask._id })
      );
    }
  }, [dispatch, projectId, taskId, selectedSubtask]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (file) {
      dispatch(uploadTaskFile({ projectId, taskId, file }))
        .unwrap()
        .then(() => {
          setFile(null);
          dispatch(fetchTaskFiles({ projectId, taskId }));
        })
        .catch((err) => console.error("File upload failed:", err));
    }
  };

  const handleFileDelete = (fileId) => {
    dispatch(deleteTaskFile({ projectId, taskId, fileId }))
      .unwrap()
      .then(() => {
        dispatch(fetchTaskFiles({ projectId, taskId }));
      })
      .catch((err) => console.error("File delete failed:", err));
  };

  const filteredMembers = members.filter(
    (member) => member._id !== selectedTask?.leaderId
  );

  return (
    <div className="flex space-x-6 p-6">
      {selectedSubtask ? (
        <div className="flex w-full space-x-6 mt-10">
          {/* Subtask Details Right Section */}
          <div className="w-3/5 space-y-6">
            <h2 className="text-xl font-semibold">Subtask Details</h2>
            <input
              type="text"
              value={selectedSubtask.title}
              onChange={(e) =>
                setSelectedSubtask({
                  ...selectedSubtask,
                  title: e.target.value,
                })
              }
              placeholder="Subtask Title"
              className="w-full p-2 border rounded"
            />
            <ReactQuill
              theme="snow"
              value={selectedSubtask?.description || ""} // Varsayılan değer
              onChange={(content) =>
                setSelectedSubtask((prev) => ({
                  ...prev,
                  description: content, // Direkt içeriği kaydet
                }))
              }
              placeholder="Subtask Description"
              className="w-full p-2 border rounded"
            />
            <select
              value={selectedSubtask.status}
              onChange={(e) =>
                setSelectedSubtask({
                  ...selectedSubtask,
                  status: e.target.value,
                })
              }
              placeholder={selectedSubtask.status}
              className="w-full p-2 border rounded"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="verify">Verify</option>
              <option value="done">Done</option>
            </select>
            <button
              onClick={handleSubtaskUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Subtask
            </button>

            <button
              onClick={() => setSelectedSubtask(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>

            {/* Dosya Yönetimi */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Files</h3>
              <ul className="space-y-2">
                {subtaskFiles.length > 0 ? (
                  subtaskFiles.map((file) => (
                    <li
                      key={file._id}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded shadow"
                    >
                      <a
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate w-3/4"
                      >
                        {file.name}
                      </a>
                      <button
                        onClick={() => handleSubtaskFileDelete(file._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No files available for this subtask.
                  </p>
                )}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubtaskFileUpload();
                }}
                className="space-y-2"
              >
                <input
                  type="file"
                  onChange={(e) => setSubtaskFile(e.target.files[0])}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Upload File
                </button>
              </form>
            </div>
          </div>

          {/* Subtask Details Left Section */}
          <div className="w-2/5 space-y-6">
            <select
              value={selectedSubtask.status}
              onChange={(e) =>
                handleSubtaskStatusUpdate(selectedSubtask._id, e.target.value)
              }
              className="w-32 h-12 px-4 border rounded bg-blue-500 text-white"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="verify">Verify</option>
              <option value="done">Done</option>
            </select>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Atayan:</h3>
              {projectDetails?.leaderId ? (
                <p className="text-gray-700 mx-4">
                  {projectDetails.leaderId.name} (
                  {projectDetails.leaderId.email})
                </p>
              ) : (
                <p className="text-gray-500">Lider bilgisi yok.</p>
              )}
            </div>
            <div className=" flex items-center">
              <h3 className="text-lg font-semibold">Atanan:</h3>
              {selectedTask?.assigneeId ? (
                <div className="flex items-center">
                  <p className="text-gray-700 mx-4">
                    {selectedTask.assigneeId.name} (
                    {selectedTask.assigneeId.email})
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      dispatch(unassignTaskMember({ projectId, taskId }))
                        .unwrap()
                        .then(() => {
                          console.log("Member unassigned successfully");
                          dispatch(fetchTaskDetails({ projectId, taskId }));
                        })
                        .catch((error) =>
                          console.error(
                            "Failed to unassign member:",
                            error.message
                          )
                        )
                    }
                  >
                    Görevden al
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mx-4 bottom-2">
                  Bu göreve kimse atanmadı.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-3/5 space-y-6 mt-10 border-r-2 pr-5">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{taskForm.title}</h2>
              <div
    className="text-gray-700"
    dangerouslySetInnerHTML={{ __html: taskForm.description }}
  ></div>
              <p className="text-gray-500">Status: {taskForm.status}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Update Task</h2>
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleInputChange}
                placeholder="Task Title"
                className="w-full p-2 border rounded"
              />
              <ReactQuill
                theme="snow"
                value={taskForm.description || ""} // Varsayılan değer
                onChange={(content) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    description: content, // Direkt içeriği kaydet
                  }))
                }
                placeholder="Task Description"
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={taskForm.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="verify">Verify</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={handleTaskUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Task
              </button>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Files</h2>
              <ul className="space-y-2">
                {files.map((file) => (
                  <li
                    key={file._id}
                    className="flex justify-between items-center"
                  >
                    {/* Dosya ismini tıklanabilir yapmak */}
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}${file.url}`} // Dosya URL'si
                      target="_blank" // Yeni sekmede açılması için
                      rel="noopener noreferrer" // Güvenlik için
                      className="text-blue-500 hover:underline"
                    >
                      {file.name}
                    </a>
                    <button
                      onClick={() => handleFileDelete(file._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleFileUpload} className="space-y-2">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Upload File
                </button>
              </form>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Alt Konular</h2>
              <ul className="space-y-2">
                {subtasks.map((subtask) => (
                  <li
                    key={subtask._id}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
                    onClick={(e) => handleSubtaskSelection(e, subtask)}
                  >
                    <span>{subtask.title}</span>
                    <select
                      value={subtask.status}
                      onChange={(e) =>
                        handleSubtaskStatusUpdate(subtask._id, e.target.value)
                      }
                      className="p-1 border rounded"
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="verify">Verify</option>
                      <option value="done">Done</option>
                    </select>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={newSubtask.title}
                onChange={(e) =>
                  setNewSubtask((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Subtask Title"
                className="w-full p-2 border rounded"
              />
              <ReactQuill
                theme="snow"
                value={newSubtask.description || ""} // Varsayılan değer
                onChange={(content) =>
                  setNewSubtask((prev) => ({
                    ...prev,
                    description: content, // Direkt içeriği kaydet
                  }))
                }
                placeholder="Subtask Description"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSubtaskCreation}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Subtask
              </button>
            </div>
          </div>
          <div className="w-2/5 space-y-6 mt-10">
            <div className=" flex items-center space-y-4">
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setStatus(newStatus);
                  handleStatusUpdate(newStatus);
                }}
                className="w-32 h-12 px-4 border rounded bg-blue-500 text-white"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="verify">Verify</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Atayan:</h3>
              {projectDetails?.leaderId ? (
                <p className="text-gray-700 mx-4">
                  {projectDetails.leaderId.name} (
                  {projectDetails.leaderId.email})
                </p>
              ) : (
                <p className="text-gray-500">Lider bilgisi yok.</p>
              )}
            </div>
            <div className=" flex items-center">
              <h3 className="text-lg font-semibold">Atanan:</h3>
              {selectedTask?.assigneeId ? (
                <div className="flex items-center">
                  <p className="text-gray-700 mx-4">
                    {selectedTask.assigneeId.name} (
                    {selectedTask.assigneeId.email})
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      dispatch(unassignTaskMember({ projectId, taskId }))
                        .unwrap()
                        .then(() => {
                          console.log("Member unassigned successfully");
                          dispatch(fetchTaskDetails({ projectId, taskId }));
                        })
                        .catch((error) =>
                          console.error(
                            "Failed to unassign member:",
                            error.message
                          )
                        )
                    }
                  >
                    Görevden al
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mx-4 bottom-2">
                  Bu göreve kimse atanmadı.
                </p>
              )}
            </div>
            {!selectedTask?.assigneeId && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Proje Üyeleri</h3>
                {members
                  .filter(
                    (member) => member._id !== projectDetails?.leaderId?._id
                  )
                  .map((member) => (
                    <div
                      key={member._id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {member.name} ({member.email})
                      </span>
                      <button
                        onClick={() => handleAssignMember(member._id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Görevlendir
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
