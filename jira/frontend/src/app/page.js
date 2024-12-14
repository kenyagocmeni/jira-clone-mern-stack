'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProjects } from '@components/redux/slices/projectSlice';
import { useRouter } from 'next/navigation';
import "react-quill/dist/quill.snow.css";

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projects, isLoading, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-start justify-start w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
      {projects.length === 0 ? (
        <p className="text-gray-500">You are not part of any projects yet.</p>
      ) : (
        <ul className="space-y-4 w-full">
          {projects.map((project) => (
            <li
              key={project._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer bg-white"
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              <h2 className="font-semibold text-lg text-blue-600 hover:underline">
                {project.name}
              </h2>
              <p className="text-gray-600">
                {project.description?.slice(0, 100)}...
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
