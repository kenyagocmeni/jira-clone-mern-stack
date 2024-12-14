import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Alt Görev Oluşturma
export const createSubtask = createAsyncThunk(
  "subtask/createSubtask",
  async ({ taskId, title, description, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/tasks/${taskId}/subtasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Alt görev oluşturulamadı.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Görev Güncelleme
export const updateSubtask = createAsyncThunk(
  "subtask/updateSubtask",
  async ({ taskId, subtaskId, updates }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/tasks/${taskId}/subtasks/${subtaskId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Alt görev güncellenemedi.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Görev Statüsü Güncelleme
export const updateSubtaskStatus = createAsyncThunk(
  "subtask/updateSubtaskStatus",
  async ({ taskId, subtaskId, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/tasks/${taskId}/subtasks/${subtaskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Alt görev statüsü güncellenemedi."
        );
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Göreve Dosya Ekleme
export const uploadSubtaskFile = createAsyncThunk(
  "subtask/uploadSubtaskFile",
  async ({ projectId, taskId, subtaskId, file }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Dosya yüklenemedi.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Görevden Dosya Silme
export const deleteSubtaskFile = createAsyncThunk(
  "subtask/deleteSubtaskFile",
  async ({ projectId, taskId, subtaskId, fileId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/${fileId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Dosya silinemedi.");
      }

      return fileId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Göreve Bağlı Dosyaları Listeleme
export const fetchSubtaskFiles = createAsyncThunk(
  "subtask/fetchSubtaskFiles",
  async ({ projectId, taskId, subtaskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files`,
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

// Alt Görev Silme
export const deleteSubtask = createAsyncThunk(
  "subtask/deleteSubtask",
  async ({ projectId, taskId, subtaskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Alt görev silinemedi.");
      }

      return subtaskId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Göreve Bağlı Alt Görevleri Listeleme
export const fetchSubtasks = createAsyncThunk(
  "subtask/fetchSubtasks",
  async (taskId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/tasks/${taskId}/subtasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Alt görevler alınamadı.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Alt Görevin Detaylarını Getirme
export const fetchSubtaskDetails = createAsyncThunk(
  "subtask/fetchSubtaskDetails",
  async ({ taskId, subtaskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/:projectId/tasks/${taskId}/subtasks/${subtaskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Alt görev detayları alınamadı.");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

const subtaskSlice = createSlice({
  name: "subtask",
  initialState: {
    subtasks: [],
    selectedSubtask: null,
    subtaskFiles: [], // Alt görev dosyaları
    isLoading: false,
    error: null,
  },
  reducers: {
    resetSubtaskState: (state) => {
      state.subtasks = [];
      state.selectedSubtask = null;
      state.subtaskFiles = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Alt Görev Oluşturma
      .addCase(createSubtask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubtask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks.push(action.payload);
      })
      .addCase(createSubtask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Alt Görev Güncelleme
      .addCase(updateSubtask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubtask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks = state.subtasks.map((subtask) =>
          subtask.id === action.payload.id ? action.payload : subtask
        );
      })
      .addCase(updateSubtask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Alt Görev Silme
      .addCase(deleteSubtask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks = state.subtasks.filter(
          (subtask) => subtask.id !== action.payload
        );
      })
      .addCase(deleteSubtask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Alt Görev Listeleme
      .addCase(fetchSubtasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks = action.payload;
      })
      .addCase(fetchSubtasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Alt Görevin Detaylarını Getirme
      .addCase(fetchSubtaskDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubtaskDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSubtask = action.payload;
      })
      .addCase(fetchSubtaskDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Alt Görev Statüsü Güncelleme
      .addCase(updateSubtaskStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubtaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks = state.subtasks.map((subtask) =>
          subtask._id === action.payload.subtask._id
            ? action.payload.subtask
            : subtask
        );
      })
      .addCase(updateSubtaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Dosya Ekleme
      .addCase(uploadSubtaskFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadSubtaskFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtaskFiles.push(action.payload);
      })
      .addCase(uploadSubtaskFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Dosya Silme
      .addCase(deleteSubtaskFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubtaskFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtaskFiles = state.subtaskFiles.filter((file) => file.id !== action.payload);
      })
      .addCase(deleteSubtaskFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Dosya Listeleme
      .addCase(fetchSubtaskFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubtaskFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtaskFiles = action.payload;
      })
      .addCase(fetchSubtaskFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetSubtaskState } = subtaskSlice.actions;
export default subtaskSlice.reducer;
