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
  const { searchTerm } = useParams();

  const [axiosResponse, setResponse] = useState({
    searchResult: [],
  });
  const [isLoading, setLoading] = useState("");
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  useEffect(() => {
    setLoading("y");
    axios
      .post("http://127.0.0.1:5000/get/manufacturer_model_search", {
        search: searchTerm,
      })
      .then((res) => {
        if (res.data["Status"] === 200) {
          let results = [];
          // eslint-disable-next-line
          res.data["Rows"].map(function (row) {
            if (
              row[0].toLowerCase().includes(searchTerm.toLowerCase()) &&
              row[1].toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              results.push([row[0], "#46e363", row[1], "#46e363"]);
            } else if (
              row[0].toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              results.push([row[0], "#46e363", row[1], "white"]);
            } else if (
              row[0].toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              results.push([row[0], "white", row[1], "#46e363"]);
            } else {
              results.push([row[0], "white", row[1], "#46e363"]);
            }
          });

          setResponse({
            searchResult: results,
          });
          setLoading("n");
        } else {
          setError(true);
          setErrorMessage("There was a problem conducting the search!");
        }
      });
  }, [searchTerm]);

  return (
    <Typography>
      <Container component="main" maxWidth="m">
        <br />
        <Typography component="h1" variant="h3">
          Manufacturer/Model Search
        </Typography>
        <br />
        <Typography component="h5" variant="h5">
          Search Results for '{searchTerm}'
        </Typography>
        {(() => {
          if (isLoading === "y") {
            return Loading();
          } else if (
            isLoading === "n" &&
            axiosResponse.searchResult.length === 0
          ) {
            return (
              <Container component="main" maxWidth="xs">
                <br />
                <br />
                <Typography maxWidth="xs">
                  <Alert severity="warning">
                    There were no search results found containing '{searchTerm}'
                  </Alert>
                </Typography>
              </Container>
            );
          } else {
            return (
              <Typography>
                <TableContainer component={Paper} sx={{ height: 650 }}>
                  <Table
                    aria-label="simple table"
                    sx={{ height: "max-content" }}
                  >
                    <TableHead sx={{ background: "#d4d4d4" }}>
                      <TableRow>
                        <TableCell>
                          <b>Manufacturer</b>
                        </TableCell>
                        <TableCell align="left">
                          <b>Model Name</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {axiosResponse.searchResult.map((res) => (
                        <TableRow
                          key={res[0] + res[2]}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ background: res[1] }}
                          >
                            {res[0]}
                          </TableCell>
                          <TableCell align="left" sx={{ background: res[3] }}>
                            {res[2]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            );
          }
        })()}

        {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}
      </Container>
      <br />
      <br />
      <br />
      <br />
      <Container component="main" maxWidth="xs">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/reports/search`);
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
