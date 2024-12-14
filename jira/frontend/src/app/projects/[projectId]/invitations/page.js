"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendInvitation } from "@components/redux/slices/invitationSlice";

export default function InvitationPage({ params }) {
  const { projectId } = params;
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendInvitation = async () => {
    try {
      await dispatch(
        sendInvitation({
          projectId,
          recipientEmail: form.email, // recipientId yerine recipientEmail kullanıyoruz
          message: form.message,
        })
      ).unwrap();
      setStatus('Invitation sent successfully!');
      setForm({ email: '', message: '' }); // Formu sıfırla
    } catch (error) {
      setStatus('Failed to send invitation.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Send Invitation</h1>
      <div>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="Recipient's Email"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleInputChange}
          placeholder="Optional Message"
          style={{
            width: '100%',
            padding: '10px',
            height: '100px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        ></textarea>
        <button
          onClick={handleSendInvitation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send Invitation
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}