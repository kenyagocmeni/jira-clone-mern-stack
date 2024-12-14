import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Görev Oluşturma
export const createTask = createAsyncThunk(
    'task/createTask',
    async ({ projectId, title, description, status }, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, status }), // Status eklendi
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Görev oluşturulamadı.');
        }
  
        return await response.json();
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
);

// Görev Güncelleme
export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ projectId, taskId, updates }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/update`,
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
        throw new Error(errorData.message || 'Görev güncellenemedi.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görev Statüsü Güncelleme
export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ projectId, taskId, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görev statüsü güncellenemedi.');
      }

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görev Silme
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async ({ projectId, taskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görev silinemedi.');
      }

      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Göreve Dosya Ekleme
export const uploadTaskFile = createAsyncThunk(
  'task/uploadTaskFile',
  async ({ projectId, taskId, file }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/file`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Dosya yüklenemedi.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görev Listeleme
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görevler alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görev Detaylarını Getirme
export const fetchTaskDetails = createAsyncThunk(
  'task/fetchTaskDetails',
  async ({ projectId, taskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görev detayları alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görevle İlişkili Dosya Silme
export const deleteTaskFile = createAsyncThunk(
  'task/deleteTaskFile',
  async ({ projectId, taskId, fileId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/file/${fileId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Dosya silinemedi.');
      }

      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Görevle İlişkili Dosyaları Listeleme
export const fetchTaskFiles = createAsyncThunk(
  "task/fetchTaskFiles",
  async ({ projectId, taskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/files`, // Doğru rota kontrolü
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Dosyalar alınamadı.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Göreve Üye Atama
export const assignTaskMember = createAsyncThunk(
    'task/assignTaskMember',
    async ({ projectId, taskId, userId }, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/assign/${userId}`,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Üye atanamadı.');
        }
  
        return await response.json();
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  );

// Göreve Atanmış Üyeyi Kaldırma
export const unassignTaskMember = createAsyncThunk(
    'task/unassignTaskMember',
    async ({ projectId, taskId }, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/unassign`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Üye kaldırılamadı.');
        }
  
        return taskId;
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
);

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [], // Projeye bağlı görevler
    selectedTask: null, // Seçili görev detayları
    files: [], // Görev dosyaları
    isLoading: false, // API çağrıları sırasında yüklenme durumu
    error: null, // Hataları tutar
  },
  reducers: {
    resetTaskState: (state) => {
      state.tasks = [];
      state.selectedTask = null;
      state.files = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Görev Oluşturma
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Görev Güncelleme
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Görev Statüsü Güncelleme
      .addCase(updateTaskStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Görev Listeleme
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Görev Silme
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })

      // Göreve Dosya Ekleme
      .addCase(uploadTaskFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })

      // Görev Detaylarını Getirme
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })

      // Görevle İlişkili Dosya Silme
      .addCase(deleteTaskFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
      })

      // Görevle İlişkili Dosyaları Listeleme
      .addCase(fetchTaskFiles.fulfilled, (state, action) => {
        state.files = action.payload;
      })

      // Göreve Üye Atama
      .addCase(assignTaskMember.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.taskId);
        if (taskIndex >= 0) {
          state.tasks[taskIndex].assigneeId = action.payload.userId;
        }
      })

      // Göreve Atanmış Üyeyi Kaldırma
      .addCase(unassignTaskMember.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
        if (taskIndex >= 0) {
          state.tasks[taskIndex].assigneeId = null;
        }
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
