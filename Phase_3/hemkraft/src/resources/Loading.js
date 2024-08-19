import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Loading() {
  return (
    <Typography>
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </Typography>
  );
}
