import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Davetiye Gönderme
export const sendInvitation = createAsyncThunk(
    'invitation/sendInvitation',
    async ({ projectId, recipientEmail, message }, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/invitations/send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipientEmail, message }), // recipientId yerine recipientEmail kullanılıyor
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Davetiye gönderme başarısız.');
        }
  
        return await response.json();
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
);

// Davetiye Kabul Etme
export const acceptInvitation = createAsyncThunk(
  'invitation/acceptInvitation',
  async ({ projectId, invitationId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/invitations/${invitationId}/accept`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Davetiye kabul etme başarısız.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Davetiye Reddetme
export const rejectInvitation = createAsyncThunk(
  'invitation/rejectInvitation',
  async ({ projectId, invitationId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/invitations/${invitationId}/reject`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Davetiye reddetme başarısız.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Kullanıcıya Gelen Davetiyeleri Listeleme
export const fetchUserInvitations = createAsyncThunk(
  'invitation/fetchUserInvitations',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/invitations/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Davetiyeler alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Davetiye Silme
export const deleteInvitation = createAsyncThunk(
  'invitation/deleteInvitation',
  async ({ projectId, invitationId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/invitations/${invitationId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Davetiye silme başarısız.');
      }

      return { invitationId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

const invitationSlice = createSlice({
  name: 'invitation',
  initialState: {
    invitations: [], // Kullanıcıya gelen davetiyeler
    isLoading: false, // API çağrıları sırasında yüklenme durumu
    error: null, // Hataları tutar
  },
  reducers: {
    resetInvitationState: (state) => {
      state.invitations = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Davetiye Gönderme
      .addCase(sendInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations.push(action.payload); // Yeni davetiye listeye eklenir
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Davetiyeyi Kabul Etme
      .addCase(acceptInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = state.invitations.filter(
          (invitation) => invitation.id !== action.payload.id
        );
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Davetiyeyi Reddetme
      .addCase(rejectInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = state.invitations.filter(
          (invitation) => invitation.id !== action.payload.id
        );
      })
      .addCase(rejectInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Kullanıcıya Gelen Davetiyeleri Listeleme
      .addCase(fetchUserInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = action.payload;
      })
      .addCase(fetchUserInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Davetiye Silme
      .addCase(deleteInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = state.invitations.filter(
          (invitation) => invitation.id !== action.payload.invitationId
        );
      })
      .addCase(deleteInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetInvitationState } = invitationSlice.actions;
export default invitationSlice.reducer;