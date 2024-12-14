// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import {
//   fetchTaskDetails,
//   updateTask,
//   updateTaskStatus,
//   assignTaskMember,
// } from "@components/redux/slices/taskSlice";
// import {
//   fetchSubtasks,
//   createSubtask,
//   deleteSubtask,
// } from "@components/redux/slices/subtaskSlice";
// import { fetchProjectMembers } from "@components/redux/slices/projectSlice";
// import { unassignTaskMember } from "@components/redux/slices/taskSlice";
// import { fetchProjectDetails } from "@components/redux/slices/projectSlice"; // Proje detaylarını almak için

// export default function TaskDetailsPage({ params }) {
//   const { projectId, taskId } = params;
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { selectedTask, isLoading, error } = useSelector((state) => state.task);
//   const { subtasks } = useSelector((state) => state.subtask);
//   const { members } = useSelector((state) => state.project);

//   const [taskForm, setTaskForm] = useState({
//     title: "",
//     description: "",
//     status: "",
//   });
//   const [status, setStatus] = useState("");
//   const [newSubtask, setNewSubtask] = useState({ title: "", description: "" });

//   // Proje detaylarından lider bilgisini çek
//   const { projectDetails } = useSelector((state) => state.project);

//   useEffect(() => {
//     if (selectedTask) {
//       setTaskForm({
//         title: selectedTask.title,
//         description: selectedTask.description,
//         status: selectedTask.status,
//       });
//       setStatus(selectedTask.status);
//     }
//   }, [selectedTask]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTaskForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTaskUpdate = () => {
//     dispatch(updateTask({ projectId, taskId, updates: taskForm }));
//   };

//   const handleStatusUpdate = () => {
//     dispatch(updateTaskStatus({ projectId, taskId, status }));
//   };

//   const handleSubtaskCreation = () => {
//     dispatch(createSubtask({ taskId, ...newSubtask }));
//     setNewSubtask({ title: "", description: "" });
//   };

//   const handleSubtaskDeletion = (subtaskId) => {
//     dispatch(deleteSubtask({ projectId, taskId, subtaskId }))
//       .unwrap()
//       .then(() => {
//         console.log("Alt görev başarıyla silindi!");
//         // Redux durumu zaten güncellendiği için ek işlem gerekmez
//       })
//       .catch((error) => {
//         console.error("Alt görev silme başarısız:", error);
//       });
//   };

//   const handleAssignMember = (userId) => {
//     dispatch(assignTaskMember({ projectId, taskId, userId }))
//       .unwrap()
//       .then(() => {
//         console.log("Üye başarıyla atandı!");
//         dispatch(fetchTaskDetails({ projectId, taskId })); // Görev detaylarını yeniden getir
//       })
//       .catch((error) => {
//         console.error("Üye atama başarısız:", error.message);
//       });
//   };

//   useEffect(() => {
//     dispatch(fetchTaskDetails({ projectId, taskId }));
//     dispatch(fetchSubtasks(taskId));
//     dispatch(fetchProjectMembers(projectId));
//   }, [dispatch, projectId, taskId]);

//   // Proje liderini üyelerden çıkarıyoruz
//   const filteredMembers = members.filter(
//     (member) => member._id !== selectedTask?.leaderId
//   );

//   return (
//     <div>
//       <h1>Task Details</h1>

//       {/* Görev Detayları */}
//       <div>
//         <h2>{taskForm.title}</h2>
//         <p>{taskForm.description}</p>
//         <p>Status: {taskForm.status}</p>
//         {selectedTask?.assigneeId ? (
//           <div>
//             <h3>Assigned To:</h3>
//             <p>
//               {selectedTask.assigneeId.name} ({selectedTask.assigneeId.email})
//             </p>
//             <button
//               onClick={() =>
//                 dispatch(unassignTaskMember({ projectId, taskId }))
//                   .unwrap()
//                   .then(() => {
//                     console.log("Member unassigned successfully");
//                     dispatch(fetchTaskDetails({ projectId, taskId })); // Görev detaylarını yeniden getir
//                   })
//                   .catch((error) =>
//                     console.error("Failed to unassign member:", error.message)
//                   )
//               }
//             >
//               Remove
//             </button>
//           </div>
//         ) : (
//           <p>No one is assigned to this task.</p>
//         )}
//       </div>

//       <div>
//         <h3>Assigned By:</h3>
//         {projectDetails?.leaderId ? (
//           <p>
//             {projectDetails.leaderId.name} ({projectDetails.leaderId.email})
//           </p>
//         ) : (
//           <p>No leader information available.</p>
//         )}
//       </div>

//       {/* Görev Güncelleme Formu */}
//       <div>
//         <h2>Update Task</h2>
//         <input
//           type="text"
//           name="title"
//           value={taskForm.title}
//           onChange={handleInputChange}
//           placeholder="Task Title"
//         />
//         <textarea
//           name="description"
//           value={taskForm.description}
//           onChange={handleInputChange}
//           placeholder="Task Description"
//         ></textarea>
//         <select
//           name="status"
//           value={taskForm.status}
//           onChange={handleInputChange}
//         >
//           <option value="todo">To Do</option>
//           <option value="inProgress">In Progress</option>
//           <option value="verify">Verify</option>
//           <option value="done">Done</option>
//         </select>
//         <button onClick={handleTaskUpdate}>Save Task</button>
//       </div>

//       {/* Durum Güncelleme */}
//       <div>
//         <h2>Update Status</h2>
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="todo">To Do</option>
//           <option value="inProgress">In Progress</option>
//           <option value="verify">Verify</option>
//           <option value="done">Done</option>
//         </select>
//         <button onClick={handleStatusUpdate}>Update Status</button>
//       </div>

//       {/* Alt Görevler */}
//       <div>
//         <h2>Subtasks</h2>
//         <ul>
//           {subtasks.map((subtask) => (
//             <li key={subtask._id}>
//               {subtask.title} - {subtask.status}
//               <button onClick={() => handleSubtaskDeletion(subtask._id)}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//         <input
//           type="text"
//           value={newSubtask.title}
//           onChange={(e) =>
//             setNewSubtask((prev) => ({ ...prev, title: e.target.value }))
//           }
//           placeholder="Subtask Title"
//         />
//         <textarea
//           value={newSubtask.description}
//           onChange={(e) =>
//             setNewSubtask((prev) => ({ ...prev, description: e.target.value }))
//           }
//           placeholder="Subtask Description"
//         ></textarea>
//         <button onClick={handleSubtaskCreation}>Add Subtask</button>
//       </div>

//       {/* Üye Atama */}
// {!selectedTask?.assigneeId && (
//   <div>
//     <h2>Assign Member</h2>
//     {members
//       .filter((member) => member._id !== projectDetails?.leaderId?._id) // Lideri filtreliyoruz
//       .map((member) => (
//         <div key={member._id}>
//           <span>
//             {member.name} ({member.email})
//           </span>
//           <button onClick={() => handleAssignMember(member._id)}>
//             Assign
//           </button>
//         </div>
//       ))}
//   </div>
// )}

//       <button onClick={() => router.push(`/projects/${projectId}`)}>
//         Back to Project
//       </button>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import TaskDetailsContent from "@components/components/tasks/TaskDetailsContent";
import ModalWrapper from "@components/components/ui/ModalWrapper";

export default function TaskDetailsPage({ params }) {
  const { projectId, taskId } = params;
  const router = useRouter();

  return (
    <ModalWrapper onClose={() => router.push(`/projects/${projectId}`)}>
      <TaskDetailsContent projectId={projectId} taskId={taskId} />
    </ModalWrapper>
  );
}