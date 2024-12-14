'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserInvitations,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation,
} from '@components/redux/slices/invitationSlice';

export default function InvitationsPage() {
  const dispatch = useDispatch();
  const { invitations, isLoading, error } = useSelector((state) => state.invitation);

  useEffect(() => {
    dispatch(fetchUserInvitations());
  }, [dispatch]);

  const handleAccept = async (projectId, invitationId) => {
    await dispatch(acceptInvitation({ projectId, invitationId }));
    dispatch(fetchUserInvitations()); // Listeyi güncelle
  };

  const handleReject = async (projectId, invitationId) => {
    await dispatch(rejectInvitation({ projectId, invitationId }));
    dispatch(fetchUserInvitations()); // Listeyi güncelle
  };

  const handleDelete = async (projectId, invitationId) => {
    await dispatch(deleteInvitation({ projectId, invitationId }));
    dispatch(fetchUserInvitations()); // Listeyi güncelle
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Invitations</h1>

        {isLoading && <p className="text-blue-600">Loading invitations...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!isLoading && invitations.length === 0 && (
          <p className="text-gray-600">No invitations found.</p>
        )}

        <ul className="space-y-4">
          {invitations.map((invitation) => (
            <li
              key={invitation._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <p className="text-gray-800">
                <strong>Project:</strong> {invitation.projectName}
              </p>
              <p className="text-gray-600">
                <strong>Message:</strong>{' '}
                {invitation.message || 'No message provided'}
              </p>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleAccept(invitation.projectId, invitation._id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(invitation.projectId, invitation._id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(invitation.projectId, invitation._id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}