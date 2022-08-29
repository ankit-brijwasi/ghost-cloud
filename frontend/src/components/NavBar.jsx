// react and react router dom
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

// material ui modules
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// material ui styles api
import { styled, alpha } from "@mui/material/styles";

// material ui icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

// custom modules
import { open as openFile } from "../redux/features/viewFile/viewFileSlice";

// images
import appLogo from "../assets/img/app-logo.svg";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));

const SearchBox = ({ open, results, clearResults }) => {
  const dispatch = useDispatch();
  const paper = {
    height: "auto",
    position: "absolute",
    transform: "translate(8px, 4px)",
    width: "42.3ch",
  };

  const ellipsis = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  return (
    <Grow
      in={open}
      style={{ transformOrigin: "0 0 0" }}
      onExit={(e) => {
        clearResults();
      }}
      mountOnEnter
      unmountOnExit
    >
      <Paper sx={paper}>
        <>
          <List
            component="nav"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Search results
              </ListSubheader>
            }
            dense
          >
            {results.map((result, i) => (
              <Fragment key={i}>
                <ListItem
                  button
                  onClick={() => dispatch(openFile({ file: result }))}
                >
                  <ListItemIcon>
                    {result.type.split("/")[0] === "image" && (
                      <ImageIcon fontSize="small" style={{ color: "#95f" }} />
                    )}
                    {result.type.split("/")[0] === "video" && (
                      <VideoFileIcon
                        fontSize="small"
                        style={{ color: "#95f" }}
                      />
                    )}
                    {result.type.split("/")[0] === "audio" && (
                      <AudioFileIcon
                        fontSize="small"
                        style={{ color: "#95f" }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={result.name} style={ellipsis} />
                </ListItem>
              </Fragment>
            ))}
          </List>
        </>
      </Paper>
    </Grow>
  );
};

// NavBar Component: Navbar for the application
export default function NavBar({ handleDrawerToggle }) {
  const [openSearch, setOpenSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      (async () => {
        const response = await axios.get(
          `http://127.0.0.1:8000/search/${keyword}`
        );
        setSearchResults(response.data);
      })();
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [keyword]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        color="default"
        position="fixed"
        sx={{
          borderLeft: "none",
        }}
      >
        <Toolbar
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignContent: "flex-end",
            [theme.breakpoints.down("sm")]: {
              width: "100%",
            },
          })}
        >
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              mt: 0.5,
              pt: { xs: 0, lg: 1.5 },
              display: { lg: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <img src={appLogo} alt="Ghost Cloud" className="nav-logo" />
          </Link>
          <ClickAwayListener onClickAway={() => setOpenSearch(false)}>
            <Box
              sx={{
                marginRight: "auto",
                marginLeft: "10px",
                position: "relative",
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onFocus={() => setOpenSearch(true)}
                />
              </Search>
              <SearchBox
                open={openSearch}
                results={searchResults}
                clearResults={() => setSearchResults([])}
              />
            </Box>
          </ClickAwayListener>
          <Box>
            <IconButton
              color="inherit"
              // onClick={() => setOpen(true)}
            >
              <PowerSettingsNewIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
