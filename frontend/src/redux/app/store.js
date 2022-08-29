import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "../features/upload/uploadSlice";
import viewFileReducer from "../features/viewFile/viewFileSlice"

export default configureStore({
  reducer: {
    upload: uploadReducer,
    viewFile: viewFileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["upload/addFile", "upload/removeFile"],
        ignoredPaths: ["upload.files"],
      },
    }),
});
