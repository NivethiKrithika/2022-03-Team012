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
  Button,
  Link,
  FormControl,
} from "@mui/material";
import { useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../resources/Loading";

function zero_to_blank(avg) {
  if (avg > 0.0){
    return avg
  }
  else {
    return ''
  }
}

function _() {
  const [axiosResponse, setResponse] = useState({
    avgTV: [],
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.post("http://127.0.0.1:5000/get/avgTVSize").then((res) => {
      if (res.data["Status"] === 200)
        setResponse({
          avgTV: res.data["Result1"],
        });
      else {
        <Alert severity="error"> There was a problem retrieving data!</Alert>;
      }
    });
  }, []);

  return (
    <Typography>
      <Container component="main" maxWidth="sm">
        <br />
        <Typography component="h1" variant="h4">
          Average TV Display Size by State
        </Typography>
        <br />
        <br />
        {axiosResponse.avgTV.length === 0 ? (
          Loading()
        ) : (
          <Typography>
            <TableContainer component={Paper} sx={{ height: 500 }}>
              <Table aria-label="simple table" sx={{ height: "max-content" }}>
                <TableHead sx={{ background: "#d4d4d4" }}>
                  <TableRow>
                    <TableCell>
                      <b>State</b>
                    </TableCell>
                    <TableCell>
                      <b>Average TV Display Size</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {axiosResponse.avgTV.map((avgTV) => (
                    <TableRow
                      key={avgTV[0]}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Link href={`/reports/avgTV/${avgTV[0]}`}>
                          {avgTV[0]}
                        </Link>
                      </TableCell>
                      <TableCell>{zero_to_blank((Math.round(avgTV[1]*10)/10).toFixed(1))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
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
