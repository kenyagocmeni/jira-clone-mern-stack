'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails, updateProject } from '@components/redux/slices/projectSlice';
import { sendInvitation } from '@components/redux/slices/invitationSlice';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditProjectPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId'); // URL'den projectId alınır
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedProject, isLoading: projectLoading, error: projectError } = useSelector(
    (state) => state.project
  );
  const { isLoading: invitationLoading, error: invitationError } = useSelector(
    (state) => state.invitation
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetails(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (selectedProject) {
      setName(selectedProject.name);
      setDescription(selectedProject.description);
    }
  }, [selectedProject]);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const updates = { name, description };
    const result = await dispatch(updateProject({ projectId, updates }));
    if (!result.error) {
      alert('Project updated successfully!');
      router.push(`/projects/${projectId}`);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    const result = await dispatch(sendInvitation({ projectId, recipientId: email, message }));
    if (!result.error) {
      alert('Invitation sent successfully!');
      setEmail('');
      setMessage('');
    }
  };

  if (projectLoading) return <p>Loading project details...</p>;
  if (projectError) return <p className="error">{projectError}</p>;

  return (
    <div className="edit-project-container">
      <h1>Edit Project</h1>

      <form onSubmit={handleUpdateProject}>
        <div>
          <label htmlFor="name">Project Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit" disabled={projectLoading}>
          {projectLoading ? 'Updating...' : 'Update Project'}
        </button>
      </form>

      <h2>Send Invitation</h2>
      <form onSubmit={handleSendInvitation}>
        <div>
          <label htmlFor="email">Recipient Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" disabled={invitationLoading}>
          {invitationLoading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>

      {invitationError && <p className="error">{invitationError}</p>}
    </div>
  );
}