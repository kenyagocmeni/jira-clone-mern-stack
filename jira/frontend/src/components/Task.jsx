import React from "react";
import { useDrag } from "react-dnd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Task = ({ task, projectId }) => {
  const router = useRouter();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 mb-1 flex flex-col bg-white shadow-sm rounded cursor-pointer hover:shadow-lg border-1 border-black ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() =>
        router.push(`/projects/${projectId}/tasks/${task._id}/edit`)
      }
    >
      <p className="font-normal">{task.title || "Untitled Task"}</p>
      {task.assigneeId ? (
        <div className="flex justify-end">
          <Image src="/images/oncelik.jpg" width={15} height={15}></Image>
          <p className="text-sm self-end text-gray-600 ml-1">
            {task.assigneeId.name}
          </p>
        </div>
      ) : (
        <div className="flex justify-end">
          <Image src="/images/oncelik.jpg" width={15} height={15}></Image>
          <p className="text-sm self-end text-gray-400 ml-1">Unassigned</p>
        </div>
      )}
    </div>
  );
};

export default Task;
