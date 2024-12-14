import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Proje oluşturma
export const createProject = createAsyncThunk(
  'project/createProject',
  async ({ name, description }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Proje oluşturulamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Proje detaylarını getirme
export const fetchProjectDetails =              createAsyncThunk(
    'project/fetchProjectDetails',
    async (projectId, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Proje detayları alınamadı.');
        }
  
        const data = await response.json();
        console.log("Fetched project details:", data); // Log ekledik
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
);

// Kullanıcının dahil olduğu projeleri getirme
export const fetchUserProjects = createAsyncThunk(
  'project/fetchUserProjects',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/my-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Projeler alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Projeyi güncelleme
export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, updates }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Proje güncellenemedi.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Projeyi silme
export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Proje silinemedi.');
      }

      return projectId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Projeden üye çıkarma
export const removeProjectMember = createAsyncThunk(
  'project/removeProjectMember',
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/member/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Üye projeden çıkarılamadı.');
      }

      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Projeyi terk etme
export const leaveProject = createAsyncThunk(
  'project/leaveProject',
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/leave`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Projeden ayrılamadınız.');
      }

      return projectId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Proje üyelerini getirme
export const fetchProjectMembers = createAsyncThunk(
  'project/fetchProjectMembers',
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Proje üyeleri alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    projectDetails: null,
    members: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetProjectState: (state) => {
      state.projects = [];
      state.projectDetails = null;
      state.members = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchProjectDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        console.log("Fetched project details:", action.payload); // Gelen veri
        state.isLoading = false;
        state.projectDetails = action.payload;
        console.log("Redux State Updated with:", state.projectDetails); // Güncellenen state
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member.id !== action.payload
        );
      })
      .addCase(leaveProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
