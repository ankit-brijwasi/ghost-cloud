import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import Items from "../components/home/Items";
import Nothing from "../components/Nothing";

export default function Saved() {
  const [savedFiles, setSavedFiles] = useState([]);

  useEffect(() => {
    let items = localStorage.getItem("saved_items");
    if (items) {
      setSavedFiles(JSON.parse(items));
    }
  }, []);

  return (
    <Box sx={{ height: "100%", pt: "15px" }}>
      {savedFiles.length <= 0 && (
        <Nothing title="You haven't saved any files yet!" />
      )}
      <Items title="Saved Items" files={savedFiles} reload={false} />
    </Box>
  );
}
