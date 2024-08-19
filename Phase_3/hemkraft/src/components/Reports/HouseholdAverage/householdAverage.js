import {
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper

} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../resources/Loading";

function _() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  const [values, setValues] = useState({
    postal_code: "",
    radius: "",
  });

  const [axiosResponse, setResponse] = useState({
    sqloutput: [],
    postal_code: '',
    radius: 0,
  });

  const [errMessage, setErrorMessage] = useState("");
  const [errorOutside, setErrorOutside] = useState("");

  const [isTableShown, setIsTableShown] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validate = (postal_code, radius) => {
    var myParams = {
      postal_code: values.postal_code,
      radius: values.radius,
    };

    axios
      .post("http://127.0.0.1:5000/reports/householdAvg", myParams)
      .then((response) => {
        if (response.data["Status"] === 404) {
          setErrorOutside(true);
          setErrorMessage(
            "Postal code is not found in the database!  Please try again!"
          );
          return response.data["Status"];
        } else if (response.data["Status"] === 204) {
          if (
            response.data["SQLOUTPUT"][0].includes(null, 0) === true &&
            response.data["SQLOUTPUT"][0].includes(null, 1) === true &&
            response.data["SQLOUTPUT"][0].includes(null, 2) === true
          ) {
            setIsTableShown(false);
            setErrorOutside(true);
            setErrorMessage(
              "There are no households found within the given postal code and radius!  Please try again!"
            );
          }
        } else {
          setResponse({
            sqloutput: response.data["SQLOUTPUT"],
            postal_code: values.postal_code,
            radius: values.radius,
          });

          setIsTableShown(true);

          return response.data["Status"];
        }
      });

    return true;
  };

  return (
    <Typography>
      <Container component="main" maxWidth="md">
        <br />
        <br />
        <Typography component="h1" variant="h2">
          Household Average by Radius Report
        </Typography>
        <br />
        <Typography component="subtitle" variant="subtitle">
          Please enter the following details for your household.
          <br />
          <br />
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              Postal Code
            </InputLabel>
            <OutlinedInput
              required
              inputProps={{ maxLength: 9 }}
              value={values.postal_code}
              onChange={handleChange("postal_code")}
              label="postal_code"
            />
          </FormControl>
        </Typography>
        <Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Radius</InputLabel>
            <Select
              variant="outlined"
              value={values.radius}
              onChange={handleChange("radius")}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={250}>250</MenuItem>
            </Select>
          </FormControl>
          {errorOutside ? <Alert severity="error">{errMessage}</Alert> : <></>}
        </Typography>
        <br />
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              if (values.postal_code === "" && values.radius === "") {
                setIsTableShown(false);
                setErrorOutside(true);
                setErrorMessage(
                  "Postal code and radius cannot be empty! Please try again!"
                );
              } else if (values.postal_code === "") {
                setIsTableShown(false);
                setErrorOutside(true);
                setErrorMessage(
                  "Postal code cannot be empty! Please try again!"
                );
              } else if (values.radius === "") {
                setIsTableShown(false);
                setErrorOutside(true);
                setErrorMessage("Radius cannot be empty! Please try again!");
              } else if (!/^\d+$/.test(values.postal_code)) {
                setErrorOutside(true);
                setErrorMessage(
                  "Postal code must contain a non-negative number! Please try again!!"
                );
                setIsTableShown(false);
              } else {
                validate(values.postal_code, values.radius);
                setErrorOutside(false);
              }
            }}
          >
            Submit
          </Button>
        </FormControl>

        <br />
        <br />

        {values.postal_code !== "" &&
        values.radius !== "" &&
        !errorOutside &&
        isTableShown ? (
          axiosResponse.sqloutput === [] ? (
            Loading()
          ) : (
            <>
              <TableContainer component={Paper} sx={{ height: 200 }}>
                <Table
                  aria-label="simple table"
                  sx={{ minWidth: 650, height: "max-content" }}
                >
                  <TableHead sx={{ background: "#d4d4d4" }}>
                    <TableRow>
                      <TableCell>
                        <b>Postal Code</b>
                      </TableCell>
                      <TableCell>
                        <b>Search Radius</b>
                      </TableCell>
                      <TableCell>
                        <b>Average Bedroom Count</b>
                      </TableCell>
                      <TableCell>
                        <b>Average Bathroom Count</b>
                      </TableCell>
                      <TableCell>
                        <b>Average Occupant Count</b>
                      </TableCell>
                      <TableCell>
                        <b>Ratio of Commodes to Occupants</b>
                      </TableCell>
                      <TableCell>
                        <b>Average Appliance Count</b>
                      </TableCell>
                      <TableCell>
                        <b>Most Common Heat Source</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {axiosResponse.sqloutput.map((sqloutput) => (
                      <TableRow
                        key={sqloutput[0]}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{sqloutput[0]}</TableCell>
                        <TableCell>{sqloutput[1]}</TableCell>
                        <TableCell component="th" scope="row">
                          {sqloutput[2]}
                        </TableCell>
                        <TableCell>{sqloutput[3]}</TableCell>
                        <TableCell>{sqloutput[4]}</TableCell>
                        <TableCell>{sqloutput[5]}</TableCell>
                        <TableCell>{sqloutput[6]}</TableCell>
                        <TableCell>{sqloutput[7]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )
        ) : (
          <></>
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
