import { Typography, Container, FormControl, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableOne from "./table_one";
import TableTwo from "./table_two";

function _() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  return (
    <Typography>
      <br />
      <br />
      <Container component="main" maxWidth="m" align="center">
        <Typography component="h1" variant="h3">
          Laundry Center Report
        </Typography>
      </Container>
      <br />

      <TableOne />
      <TableTwo />
      <Container component="main" maxWidth="xs">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/reports`);
            }}
          >
            View Reports
          </Button>
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/`);
            }}
          >
            Main Menu
          </Button>
        </FormControl>
      </Container>
    </Typography>
  );
}

export default _;
