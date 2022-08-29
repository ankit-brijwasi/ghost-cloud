// react and other modules
import { forwardRef, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// material ui modules
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";

// material ui icons
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

// custom modules
import { close } from "./viewFileSlice";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ViewFile: ViewFile the files
export default function ViewFile() {
  const [width, setWidth] = useState();
  const imgEl = useRef(null);

  const open = useSelector((state) => state.viewFile.open);
  const data = useSelector((state) => state.viewFile.data);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(close());
  };

  useEffect(() => {
    if (open && data.file) {
      setWidth(() => (data.file.type.split("/")[0] === "image" ? 500 : 700));
    }
  }, [open, data.file]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { background: "#000" },
      }}
    >
      {open && (
        <>
          <AppBar
            elevation={0}
            sx={{ position: "relative", backgroundColor: "#000" }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {data.file.name}
                <span style={{ marginLeft: "10px" }} />
                {data.file.status === "compressing" && (
                  <Chip
                    label="compressing"
                    color="success"
                    variant="outlined"
                  />
                )}
                {data.file.status === "compressed" && (
                  <Chip label="compressed" color="success" variant="filled" />
                )}
              </Typography>
              {data.file.type.split("/")[0] === "image" && (
                <>
                  <IconButton
                    onClick={() => {
                      if (width > window.screen.width) return;
                      setWidth((width) => (width += 100));
                      imgEl.current.style.maxWidth = width + "px";
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (width === 500) {
                        return;
                      }
                      setWidth((width) => (width -= 100));
                      imgEl.current.style.maxWidth = width + "px";
                    }}
                  >
                    <ZoomOutIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                onClick={() => {
                  let items = localStorage.getItem("saved_items");
                  if (!items) items = [data.file];
                  else items = [data.file, ...JSON.parse(items)];
                  localStorage.setItem("saved_items", JSON.stringify(items));
                }}
              >
                <BookmarkAddIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent
            sx={{ padding: 0, display: "flex", alignItems: "center" }}
          >
            {data.file.type.split("/")[0] === "image" && (
              <img
                ref={imgEl}
                src={`http://127.0.0.1:8001/files/${data.file.upload_id}/resource`}
                alt={data.file.name}
                style={{
                  maxWidth: width,
                  width: "100%",
                  objectFit: "contain",
                  display: "block",
                  margin: "auto",
                }}
              />
            )}
            {data.file.type.split("/")[0] === "audio" && (
              <audio
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxWidth: width + "px",
                  margin: "auto",
                  display: "block",
                }}
                controlsList="nodownload"
                autoPlay
                controls
                src={`http://127.0.0.1:8001/files/${data.file.upload_id}/resource`}
              ></audio>
            )}
            {data.file.type.split("/")[0] === "video" && (
              <video
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxWidth: width + "px",
                  margin: "auto",
                  display: "block",
                }}
                controlsList="nodownload"
                autoPlay
                controls
                src={`http://127.0.0.1:8001/files/${data.file.upload_id}/resource`}
              ></video>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
