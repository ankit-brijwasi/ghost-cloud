// react and react router dom modules
import { useState } from "react";
import { Outlet } from "react-router-dom";

// material ui modules
import Box from "@mui/material/Box";

// custom components
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ViewFile from "../redux/features/viewFile/ViewFile";

// Layout Component: Defines the structure of the application
function Layout() {
  const DRAWER_WIDTH = 300;
  const [open, setOpen] = useState(true);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar handleDrawerToggle={() => setOpen(!open)} />
        <SideBar drawerWidth={DRAWER_WIDTH} open={open} setOpen={setOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2.3,
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: "calc(100vh - 48px)",
          }}
        >
          <br />
          <br />
          <Outlet />
        </Box>
      </Box>
      <ViewFile />
    </>
  );
}

export default Layout;
