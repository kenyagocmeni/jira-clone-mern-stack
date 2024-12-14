"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { createTask } from "@components/redux/slices/taskSlice";

export default function CreateTaskPage({ params }) {
  const { projectId } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultStatus = searchParams.get("status") || "todo"; // Default status based on query param

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus); // Initialize with defaultStatus
  const { isLoading, error } = useSelector((state) => state.task);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createTask({ projectId, title, description, status })
    );

    if (!result.error) {
      router.push(`/projects/${projectId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Task
        </h1>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="verify">Verify</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
