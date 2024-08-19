import {
  Typography,
  Container,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Button,
} from "@mui/material";
import { useState, useEffect, React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../../resources/Loading";

function _() {
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const { manufacturer } = useParams();
  const [axiosResponse, setResponse] = useState({
    manufacturers: [],
  });
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios
      .post("http://127.0.0.1:5000/get/drilldown/manufacturer", {
        manufacturer: manufacturer,
      })
      .then((res) => {
        if (res.data["Status"] === 200) {
          setResponse({
            manufacturers: res.data["Rows"],
          });
        } else {
          setError(true);
          setErrorMessage(
            "There was a problem retrieving the drilldown report!"
          );
        }
      });
  }, [manufacturer]);

  return (
    <Typography>
      <br />
      <br />
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h5">
          Drilldown Report for Manufacturer: <br /> '{manufacturer}'
        </Typography>
        <br />
        {axiosResponse.length === 0 ? (
          Loading()
        ) : (
          <Typography>
            <br />
            <br />
            <TableContainer component={Paper} sx={{ height: "xs" }}>
              <Table aria-label="simple table" sx={{ height: "max-content" }}>
                <TableHead sx={{ background: "#d4d4d4" }}>
                  <TableRow>
                    <TableCell>
                      <b>Appliance Type</b>
                    </TableCell>
                    <TableCell align="left">
                      <b>Raw Count</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {axiosResponse.manufacturers.map((manufacturer) => (
                    <TableRow
                      key={manufacturer[0]}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {manufacturer[0]}
                      </TableCell>
                      <TableCell align="left">{manufacturer[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        )}
      </Container>
      {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}
      <br />
      <br />
      <Container component="main" maxWidth="xs">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/reports/top25`);
            }}
          >
            Back
          </Button>
        </FormControl>
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
