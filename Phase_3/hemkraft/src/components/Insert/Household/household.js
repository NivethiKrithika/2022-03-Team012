import {
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  ButtonGroup,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../../../resources/progressBar";

function _() {
  const SQ_REGEX = /^[0-9]*$/g;
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const [values, setValues] = useState({
    type: "",
    sq: "",
    occupant_count: 1,
    bedroom_count: 0
  });

  const { email, postal_code, phone_number, type } = useParams();

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleIncrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] + 1 });
  };

  const handleDecrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] - 1 });
  };

  const validate = (home_type, sq, occupant_count, bedroom_count) => {
    if (sq.match(SQ_REGEX)) {
      var myParams = {
        home_type: values.home_type,
        sq: values.sq,
        occupant_count: values.occupant_count,
        bedroom_count: values.bedroom_count,
        email: email,
        postal_code: postal_code,
        phone_number: phone_number,
        type: type,
      };

      axios
        .post("http://127.0.0.1:5000/insert/household", myParams)
        .then((response) => {
          if (response.data["Status"] === 200) {
            routeChange(`/insert/bathroom/${email}/1`);

            return response.data["Status"];
          } else if (response.data["Status"] === 500) {
            setError(true);
            setErrorMessage(response.data["Message"]);
          } else {
            setError(true);
            setError("Something went wrong when creating this household!");
            return response.data["Status"];
          }
        });

      return true;
    } else {
      setError(true);
      setErrorMessage("Square footage must be an integer!");
    }
  };

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={0} />
      <br></br>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Enter Household Info
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Please enter the following details for your household.
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel id="typle">Type</InputLabel>
            <Select
              value={values.home_type}
              label="type"
              onChange={handleChange("home_type")}
            >
              <MenuItem value={`House`}>House</MenuItem>
              <MenuItem value={`Apartment`}>Apartment</MenuItem>
              <MenuItem value={`Townhome`}>Townhome</MenuItem>
              <MenuItem value={`Condominium`}>Condominium</MenuItem>
              <MenuItem value={`Mobile`}>Mobile Home</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              Square Footage
            </InputLabel>
            <OutlinedInput
              required
              inputProps={{ maxLength: 7 }}
              value={values.sq}
              onChange={handleChange("sq")}
              label="sq"
            />
          </FormControl>
        </Typography>
        <Typography>
          Occupants:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  values.occupant_count === 1 ? (
                    <Alert severity="error">
                      You are required to have at least one occupant
                    </Alert>
                  ) : (
                    handleDecrement("occupant_count") &&
                    handleChange("occupant_count")
                  );
                }}
              >
                -
              </Button>
              <Button disabled>{values.occupant_count}</Button>
              <Button
                onClick={() => {
                  handleIncrement("occupant_count") &&
                    handleChange("occupant_count");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>
        <Typography>
          Bedrooms:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  values.bedroom_count === 0 ? (
                    <Alert severity="error">
                      Bedroom count cannot be negative!
                    </Alert>
                  ) : (
                    handleDecrement("bedroom_count") &&
                    handleChange("bedroom_count")
                  );
                }}
              >
                -
              </Button>
              <Button disabled>{values.bedroom_count}</Button>
              <Button
                onClick={() => {
                  handleIncrement("bedroom_count") &&
                    handleChange("bedroom_count");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
          {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              if (values.sq <= 0) {
                setError(true);
                setErrorMessage(
                  "Cannot have a household with square footage less than or equal to 0!"
                );
              } else if (values.home_type === undefined) {
                setError(true);
                setErrorMessage("A home type must be selected!");
              } else if (values.sq === "") {
                setError(true);
                setErrorMessage("Square footage cannot be empty!");
              } else {
                validate(
                  values.home_type,
                  values.sq,
                  values.occupant_count,
                  values.bedroom_count
                );
              }
            }}
          >
            Next
          </Button>
        </FormControl>
      </Container>
    </Typography>
  );
}

export default _;
