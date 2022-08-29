// material ui modules
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// custom modules
import emptyImg from "../assets/img/empty.svg";

export default function Nothing({ title }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexFlow: "column wrap",
      }}
    >
      <img
        style={{ width: "170px", height: "auto" }}
        src={emptyImg}
        alt={title}
      />
      <Typography variant="caption">
        {title}
      </Typography>
    </Box>
  );
}
