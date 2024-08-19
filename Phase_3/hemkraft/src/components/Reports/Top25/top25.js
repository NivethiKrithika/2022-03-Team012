import {
  Typography,
  Container,
  Link,
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../resources/Loading";

function _() {
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  const [axiosResponse, setResponse] = useState({
    manufacturers: [],
  });
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/get/top25").then((res) => {
      if (res.data["Status"] === 200) {
        setResponse({
          manufacturers: res.data["Rows"],
        });
      } else {
        setError(true);
        setErrorMessage(
          "There was a problem retrieving the Top 25 Manufacturers!"
        );
      }
    });
  }, []);

  return (
    <Typography>
      <br />
      <br />
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h3">
          Top 25 Popular Manufacturers
        </Typography>
        <br />
        <br />
        {axiosResponse.manufacturers.length === 0 ? (
          Loading()
        ) : (
          <Typography>
            <br />
            <TableContainer component={Paper} sx={{ height: 650 }}>
              <Table aria-label="simple table" sx={{ height: "max-content" }}>
                <TableHead sx={{ background: "#d4d4d4" }}>
                  <TableRow>
                    <TableCell>
                      <b>Manufacturer</b>
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
                        <Link href={`/reports/top25/${manufacturer[0]}`}>
                          {manufacturer[0]}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{manufacturer[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        )}
        {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}
      </Container>
      <br />
      <br />
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
