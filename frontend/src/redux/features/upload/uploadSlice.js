import { createSlice } from "@reduxjs/toolkit";

export const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    files: [],
    error: null,
  },
  reducers: {
    addFile: (state, action) => {
      state.files.push({
        blob: action.payload,
        uploadProgress: 0,
        isUploading: false,
      });
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(
        (file) => file.blob.name !== action.payload
      );
    },
    removeAll: (state) => {
      state.files = [];
    },
    upload: (state, action) => {
      const fileIdx = state.files.findIndex(
        (file) => file.blob.name === action.payload.name
      );
      state.files[fileIdx].uploadProgress = action.payload.percentage;
      state.files[fileIdx].isUploading = true;
    },
    error: (state, action) => {
      state.error = action.payload
    }
  },
});

export const { addFile, removeFile, removeAll, upload, error } = uploadSlice.actions;

export default uploadSlice.reducer;
