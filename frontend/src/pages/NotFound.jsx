import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Typography
      variant="body1"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      404 | Resource Not Found
    </Typography>
  );
}
