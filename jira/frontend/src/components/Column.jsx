import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Column = ({ status, tasks, onDropTask, projectId }) => {
  const router = useRouter();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => onDropTask(item, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Statü rengi ve başlık haritası
  const statusStyles = {
    todo: { bgColor: "bg-gray-200", textColor: "text-gray-700", title: "Yapılacaklar" },
    inProgress: { bgColor: "bg-blue-200", textColor: "text-blue-700", title: "Devam Ediyor" },
    verify: { bgColor: "bg-blue-200", textColor: "text-blue-700", title: "Verify" },
    done: { bgColor: "bg-green-200", textColor: "text-green-700", title: "Tamam" },
  };

  const { bgColor, textColor, title } = statusStyles[status];

  return (
    <div
      ref={drop}
      className={`p-1 w-80 rounded-lg shadow-md flex flex-col ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
      style={{ height: "500px", overflowY: "scroll" }}
    >
      {/* Başlık ve Sayaç */}
      <div className="flex items-center justify-start px-2 py-3  mb-2">
      <Image className="mx-2" src="/images/columnIcon.jpg" width={10} height={20}></Image>
        <div className={`${bgColor} mr-4 flex items-center`}>
          
          <span className={`font-bold ${textColor} uppercase text-sm`}>{title}</span>
        </div>
        <span className="text-sm font-medium text-gray-600">{tasks.length}</span>
      </div>

      {/* Görevler */}
      {tasks.map((task) => (
        <Task key={task._id} task={task} projectId={projectId} />
      ))}

      {/* Oluştur Butonu */}
      <button
        className={"text-start text-[15px] text-stone-600 mt-auto py-2 px-4 w-full text-sm font-medium rounded hover:opacity-90"}
        onClick={() => router.push(`/projects/${projectId}/tasks/create?status=${status}`)} // Statüyü query parametresi olarak gönderiyoruz
      >
        + Oluştur
      </button>
    </div>
  );
};

export default Column;