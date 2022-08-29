// react router dom
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

// material ui hooks
import { useTheme, alpha } from "@mui/material/styles";

// material ui modules
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";

// material ui icons
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// custom modules
import { removeFile } from "../redux/features/upload/uploadSlice";

const mainLinks = [
  {
    name: "Home",
    path: "/",
    icon: <HomeIcon fontSize="small" />,
  },
  {
    name: "Saved",
    path: "/saved",
    icon: <BookmarkIcon fontSize="small" />,
  }
];

// Custom loader component
function CustomCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        sx={{
            color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={props.size}
        thickness={4}
        value={100}
        variant="determinate"
      />
      <CircularProgress
        variant="indeterminate"
        sx={{
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

// Desktop Side Links
const DesktopLinks = ({ links }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const color = alpha(theme.palette.primary.main, 0.23);

  return (
    <List dense={true}>
      {links.map((link) => {
        return (
          <ListItem
            key={link.name}
            sx={{ borderRadius: "4px 30px 30px 4px" }}
            component={Link}
            to={link.path}
            style={pathname === link.path ? { backgroundColor: color } : {}}
            button
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.name} />
          </ListItem>
        );
      })}
    </List>
  );
};

// files being uploading
const UploadingFiles = () => {
  const files = useSelector((state) => state.upload.files);
  const dispatch = useDispatch();

  useEffect(() => {
    files.forEach((file) => {
      if (file.uploadProgress === 100) dispatch(removeFile(file.blob.name));
    });
  }, [files, dispatch]);

  return (
    <List
      dense={true}
      subheader={
        files.length ? <ListSubheader>Files uploading</ListSubheader> : ""
      }
    >
      {files.map((file, i) => {
        return (
          <Tooltip key={i} title={file.blob.name} placement="right-start">
            <ListItem sx={{ borderRadius: "4px 30px 30px 4px" }}>
              <ListItemIcon>
                <CustomCircularProgress
                  value={file.uploadProgress}
                  variant="determinate"
                  size={25}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  file.blob.name.length >= 26
                    ? file.blob.name.slice(0, 22) + "..."
                    : file.blob.name
                }
              />
            </ListItem>
          </Tooltip>
        );
      })}
    </List>
  );
};

// SideBar: The main sidebar component
export default function SideBar({ drawerWidth, open, setOpen }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          zIndex: theme.zIndex.appBar - 1,
        }}
      >
        <Drawer
          variant={matches ? "permanent" : "temporary"}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              pt: matches ? "70px" : "0",
            },
          }}
          open={matches ? open : !open}
          onClose={() => setOpen(!open)}
        >
          <DesktopLinks links={mainLinks} />
          <Divider />
          <UploadingFiles />
        </Drawer>
      </Box>
    </>
  );
}
