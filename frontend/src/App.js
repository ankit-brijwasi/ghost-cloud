// react and react router dom modules
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// material ui modules
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// custom components
import Layout from "./components/Layout";

// custom modules
import { darkTheme } from "./utils/theme";

// pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Saved from "./pages/Saved";

// css
import "./index.css";

// App component: Contains all the routes
function App() {

  const theme = createTheme(darkTheme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/saved/" element={<Saved />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
