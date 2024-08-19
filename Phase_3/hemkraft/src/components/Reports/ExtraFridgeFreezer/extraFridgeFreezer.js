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
  FormControl,
  Button,
  Paper,
} from "@mui/material";
import { useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../resources/Loading";

function _() {
  const [axiosResponse, setResponse] = useState({
    count: [],
    topten: [],
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.post("http://127.0.0.1:5000/get/extraFridge").then((res) => {
      if (res.data["Status"] === 200)
        setResponse({
          count: res.data["Result1"],
          topten: res.data["Result2"],
        });
      else {
        <Alert severity="error"> There was a problem retrieving data!</Alert>;
      }
    });
  }, []);

  return (
    <Typography>
      <Container component="main" maxWidth="md">
        <br />
        <Typography component="h1" variant="h3">
          Extra Fridge or Freezer
        </Typography>
        <br />
        <br />
        {axiosResponse.count.length === 0 &&
        axiosResponse.topten.length === 0 ? (
          Loading()
        ) : (
          <>
            {axiosResponse.count.map((count) => (
              <Typography component="subtitle" variant="subtitle">
                <br />
                Total household counts with more than one fridge or freezer:
                <b> {count[0]}</b>
                <br />
                <br />
              </Typography>
            ))}
            <TableContainer component={Paper} sx={{ height: 500 }}>
              <Table
                aria-label="simple table"
                sx={{ minWidth: 650, height: "max-content" }}
              >
                <TableHead sx={{ background: "#d4d4d4" }}>
                  <TableRow>
                    <TableCell>
                      <b>State</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        Count of household with more than one fridge or freezer
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>Percentage of households with chest freezers</b>
                    </TableCell>
                    <TableCell>
                      <b>Percentage of households with upright freezer</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        Percentage of households with other fridge or freezer
                      </b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {axiosResponse.topten.map((topten) => (
                    <TableRow
                      key={topten[0]}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <b>{topten[0]}</b>
                      </TableCell>
                      <TableCell>{topten[1]}</TableCell>
                      <TableCell>{topten[2]}</TableCell>
                      <TableCell>{topten[3]}</TableCell>
                      <TableCell>{topten[4]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <br />
        <br />
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
