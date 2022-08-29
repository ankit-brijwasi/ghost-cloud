// react and other modules
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// material ui components
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// custom modules
import { addFile, removeFile } from "./uploadSlice";

function checkMimeType(file) {
  const baseType = file.type.split("/")[0];
  if (baseType === "image" || baseType === "video" || baseType === "audio") return false;
  if (file.type === "application/pdf") return false;
  return true
}

// Upload: This component handles the logic for file uploades
export default function Upload(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = useSelector((state) => state.upload.files);

  const dispatch = useDispatch();
  const handleDelete = (blobName) => {
    dispatch(removeFile(blobName));
  };

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles.filter(checkMimeType).length > 0) {
        toast("You can only add images, audios, videos(mp4) and pdfs", {
          type: "error",
        });
        return;
      }

      acceptedFiles.forEach((file) => dispatch(addFile(file)));
    }
  }, [acceptedFiles, dispatch]);

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          padding: "20px",
          border: "1.5px dashed #ccc",
          borderRadius: "2px",
          minHeight: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Box>
      <br />
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {files.map((file, i) => (
          <Chip
            key={i}
            label={file.blob.name}
            variant="outlined"
            onDelete={(e) => handleDelete(file.blob.name)}
          />
        ))}
      </Stack>
    </>
  );
}
