import { configureStore } from '@reduxjs/toolkit';
import announcementSlice from './features/announcement/announcement.slice';

export const store = configureStore({
  reducer: {
    announcement: announcementSlice,
  },
});
