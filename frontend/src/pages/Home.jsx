// react and other modules
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// material ui components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Fab from "@mui/material/Fab";

// material ui colors
import { red } from "@mui/material/colors";

// material ui icons
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

// custom modules
import UploadFiles from "../redux/features/upload/Upload";
import {
  removeAll,
  upload,
  error as uploadError,
} from "../redux/features/upload/uploadSlice";
import Loader from "../components/Loader";
import Items from "../components/home/Items";
import Nothing from "../components/Nothing";

const uploadFile = async (dispatch, file, updateFiles) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.put("http://127.0.0.1:8001/files/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        const { loaded, total } = event;
        let percentage = Math.floor((loaded * 100) / total);
        dispatch(upload({ name: file.name, percentage }));
      },
    });
    updateFiles(prevState => [{ ...response.data }, ...prevState])
  } catch (error) {
    dispatch(uploadError(error.request));
  }
};

const fetchFiles = async (setFiles, setLoading) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/files/");
    setFiles(response.data);
  } catch (error) {
    try {
      let message = JSON.parse(error.request.responseText);
      toast(message.msg, { type: "error" });
    } catch {
      toast("Unable to fetch the files! Please try again later", {
        type: "error",
      });
    }
  } finally {
    setLoading(false);
  }
};

// Home Page Container: holds all the components and API calls
function Home() {
  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedFiles = useSelector((state) => state.upload.files);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFiles(setFiles, setLoading);
  }, []);

  const handleCancel = (e) => {
    setOpen(!open);
    dispatch(removeAll());
  };

  const reload = () => {
    setLoading(true);
    fetchFiles(setFiles, setLoading);
  };

  const handleUpload = (e) => {
    (async () => {
      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];

        // return if the current file is already uploading
        if (file.isUploading) return;
        await uploadFile(dispatch, file.blob, setFiles);
      }
    })();
    setOpen(!open);
  };

  useEffect(() => {});

  return (
    <>
      <Box sx={{ height: "100%", pt: "15px" }}>
        {loading && <Loader />}
        {!loading && files.length >= 0 && (
          <Items title="Home" files={files} reload={reload} />
        )}
        {!loading && files.length <= 0 && (
          <Nothing title="No files are there in the system at this moment" />
        )}
      </Box>
      <Fab
        aria-label="upload"
        sx={{
          backgroundColor: red[700],
          position: "fixed",
          bottom: "60px",
          right: "40px",
          "&:hover": {
            backgroundColor: red[800],
          },
        }}
        onClick={() => setOpen(!open)}
      >
        <CloudUploadOutlinedIcon sx={{ color: "#fff" }} />
      </Fab>
      <Dialog
        maxWidth="md"
        fullWidth
        onClose={() => setOpen(!open)}
        open={open}
      >
        <DialogTitle>Upload New Files</DialogTitle>
        <DialogContent>
          <UploadFiles />
        </DialogContent>
        <DialogActions sx={{ mr: "10px" }}>
          <Button color="inherit" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpload} color="success">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
