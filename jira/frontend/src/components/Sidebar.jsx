import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserProjects } from "@components/redux/slices/projectSlice";
import Image from "next/image";

export const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projects } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  return (
    <div
      className={`flex flex-col justify-between fixed top-[4rem] left-0 h-[calc(100vh-4rem)] bg-[#fff] text-gray-700 transition-all duration-300 ease-in-out border-r-4 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div>
        {/* Toggle Button */}
        <button
          className="absolute top-20 right-[-15px] bg-gray-300 text-gray-700 px-2 font-bold rounded-full"
          onClick={toggleSidebar}
        >
          <p className="">{isExpanded ? "< " : ">"}</p>
        </button>

        {/* Sidebar Title */}
        <div className="flex justify-between mt-6 px-4 font-semibold text-lg overflow-hidden">
          <span
            className={`mx-2 inline-block transition-transform duration-300 ease-in-out ${
              isExpanded ? "translate-x-0" : "-translate-x-32"
            }`}
          >
            Projeler
          </span>
          <span
            className="bg-gray-300 rounded-full px-2 cursor-pointer"
            onClick={() => router.push("/projects/create")}
          >
            +
          </span>
        </div>

        {/* Project List */}
        <ul className="mt-6 px-4 space-y-2 overflow-hidden">
          {projects.map((project) => (
            <li
              key={project._id}
              className={`flex items-center cursor-pointer py-2 px-4 hover:bg-gray-400 rounded-md whitespace-nowrap overflow-hidden transition-transform duration-300 ease-in-out ${
                isExpanded ? "translate-x-0" : "-translate-x-32"
              }`}
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              <Image
                src="/images/projectIcon.jpg"
                width={30}
                height={15}
              ></Image>
              <p className="font-semibold ml-3">{project.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`self-center my-6 whitespace-nowrap transition-transform duration-300 ease-in-out ${
          isExpanded ? "translate-x-0" : "-translate-x-32"
        }`}
      >
        <Image
          src="/images/takimTarafindan.jpg"
          width={230}
          height={150}
          alt="Takım Tarafından"
        />
      </div>
    </div>
  );
};
