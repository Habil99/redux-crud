import {
  createAsyncThunk,
  createSlice,
  nanoid,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const postAnnouncement = createAsyncThunk(
  "announcement/postAnnouncement",
  async (payload) => {
    const res = await axios.post("http://localhost:3001/data", {
      id: nanoid(),
      ...payload,
    });

    return res.data;
  }
);

export const getAnnouncements = createAsyncThunk(
  "announcement/getAnnouncements",
  async () => {
    const res = await axios.get("http://localhost:3001/data");

    return res.data;
  }
);

export const updateAnnouncement = createAsyncThunk(
  "announcement/updateAnnouncement",
  async (body) => {
    const res = await axios.patch(`http://localhost:3001/data/${body.id}`, { ...body });

    return res.data
  }
)

export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id) => {
    const res = await axios.delete(`http://localhost:3001/data/${id}`,);

    return { response: res.data, id };
  }
);

const announcementAdapter = createEntityAdapter({
  selectId: (announcement) => announcement.id,
});

const announcementSlice = createSlice({
  name: "announcement",
  initialState: announcementAdapter.getInitialState({
    status: null,
    error: null,
    posting: null,
    deleting: null,
    updating: null
  }),
  reducers: {
    deleteAction: announcementAdapter.removeOne,
  },
  extraReducers: {
    [postAnnouncement.pending]: (state) => {
      state.posting = "loading";
    },
    [postAnnouncement.rejected]: (state, { payload }) => {
      state.posting = "rejected";

      state.error = payload;
    },
    [postAnnouncement.fulfilled]: (state, { payload }) => {
      state.posting = "success";

      announcementAdapter.addOne(state, payload);

      if (state.error) {
        state.error = null;
      }
    },
    [getAnnouncements.pending]: (state) => {
      state.status = "loading";
    },
    [getAnnouncements.rejected]: (state, { payload }) => {
      state.status = "rejected";

      state.error = payload;
    },
    [getAnnouncements.fulfilled]: (state, { payload }) => {
      state.status = "success";

      const entries = payload.map((announcement) => announcement);

      announcementAdapter.setAll(state, entries);

      if (state.error) {
        state.error = null;
      }
    },
    [deleteAnnouncement.pending]: (state) => {
      state.deleting = "loading";
    },
    [deleteAnnouncement.rejected]: (state, { payload }) => {
      state.deleting = "rejected";

      state.error = payload;
    },
    [deleteAnnouncement.fulfilled]: (state, { payload }) => {
      state.deleting = "success";

      announcementAdapter.removeOne(state, payload.id);

      if (state.error) {
        state.error = null;
      }
    },
    [updateAnnouncement.pending]: (state) => {
      state.updating = "loading";
    },
    [updateAnnouncement.rejected]: (state, { payload }) => {
      state.updating = "rejected";

      state.error = payload;
    },
    [updateAnnouncement.fulfilled]: (state, { payload }) => {
      state.updating = "success";

      announcementAdapter.updateOne(state, { id: payload.id, changes: payload });

      if (state.error) {
        state.error = null;
      }
    }
  },
});

export const { deleteAction } = announcementSlice.actions;

export const announcementSelector = announcementAdapter.getSelectors(
  (state) => state.announcement
);

export default announcementSlice.reducer;
