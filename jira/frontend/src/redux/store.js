import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import subtaskReducer from './slices/subtaskSlice';
import invitationReducer from './slices/invitationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    task: taskReducer,
    subtask: subtaskReducer,
    invitation: invitationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Non-serializable values (e.g., errors) are handled here
    }),
});

export default store;