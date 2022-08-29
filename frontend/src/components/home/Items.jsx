// react and other modules
import { useDispatch } from "react-redux";

// material ui modules
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// material ui icons
import RestoreIcon from "@mui/icons-material/Restore";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

// custom modules
import { open } from "../../redux/features/viewFile/viewFileSlice";

// Items: Display the files
export default function Items({ title, files, reload }) {
  const dispatch = useDispatch();

  return (
    <>
      {files.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" gutterBottom>
              {title}
            </Typography>
            {reload && (
              <IconButton onClick={() => reload} size="small">
                <RestoreIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
            {files.map((file) => (
              <Card
                sx={{ width: 210, marginRight: "10px", marginBottom: "10px" }}
                variant="outlined"
                key={file.upload_id}
                title={file.name}
              >
                <CardActionArea onClick={() => dispatch(open({ file }))}>
                  <Box sx={{ height: 140 }} title={file.name}>
                    {file.type.split("/")[0] === "image" && (
                      <ImageIcon
                        sx={{
                          fontSize: "80px",
                          transform: "translateY(50%)",
                          width: "100%",
                        }}
                      />
                    )}
                    {file.type.split("/")[0] === "video" && (
                      <VideoFileIcon
                        sx={{
                          fontSize: "80px",
                          transform: "translateY(50%)",
                          width: "100%",
                        }}
                      />
                    )}
                    {file.type.split("/")[0] === "audio" && (
                      <AudioFileIcon
                        sx={{
                          fontSize: "80px",
                          transform: "translateY(50%)",
                          width: "100%",
                        }}
                      />
                    )}
                    {file.type === "application/pdf" ? (
                      <PictureAsPdfIcon
                        sx={{
                          fontSize: "80px",
                          transform: "translateY(50%)",
                          width: "100%",
                        }}
                      />
                    ) : (
                      file.type.split("/")[0] === "application" && (
                        <InsertDriveFileIcon
                          sx={{
                            fontSize: "80px",
                            transform: "translateY(50%)",
                            width: "100%",
                          }}
                        />
                      )
                    )}
                  </Box>
                  <Divider />
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: "13px",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {file.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </>
      )}
    </>
  );
}
