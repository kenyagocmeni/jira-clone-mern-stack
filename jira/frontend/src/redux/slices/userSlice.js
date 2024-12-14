import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Kullanıcı Kaydı
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// Kullanıcı Giriş Yap
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, thunkAPI) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Login failed response:', errorData);
          throw new Error(errorData.message || 'Login failed.');
        }
  
        const data = await response.json();
        console.log('Received data:', data);
        localStorage.setItem('token', data.token); // Token'ı kaydet
        return data;
      } catch (error) {
        console.error('Error during login:', error.message);
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  );

// Kullanıcı Bilgilerini Getir
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token bulunamadı!');

      const response = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı bilgileri alınamadı.');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null, // Kullanıcı bilgileri (id, name, email)
    isLoading: false, // API çağrıları sırasında yüklenme durumu
    error: null, // Hataları tutar
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      // Kullanıcı oturumunu sonlandırır
      localStorage.removeItem('token');
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Kullanıcı Kaydı
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Kullanıcı Giriş Yap
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Kullanıcı Bilgilerini Getir
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
