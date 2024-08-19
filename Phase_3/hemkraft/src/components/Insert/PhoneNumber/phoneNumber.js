import {
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../../../resources/progressBar";

function _() {
  const AC_REGEX = /\d{3}/g;
  const NUM_REGEX = /\d{7}/g;
  const [onOff, setOnOff] = useState("Yes");
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const { email, postal_code } = useParams();
  const [values, setValues] = useState({
    type: "",
    area_code: "",
    number: "",
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleOnOff = (event, newSwitch) => {
    setOnOff(newSwitch);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validate = (area_code, number, type) => {
    area_code = area_code.replace("-", "");
    number = number.replace("-", "");

    if (
      area_code.match(AC_REGEX) &&
      area_code.length === 3 &&
      number.match(NUM_REGEX) &&
      number.length === 7 &&
      `${type}`.length > 0
    ) {
      var myParams = {
        area_code: values.area_code,
        number: values.number,
        type: values.type,
      };

      axios
        .post("http://127.0.0.1:5000/get/phone_number", myParams)
        .then((response) => {
          if (response.data["Status"] === 200) {
            setError(true);
            setErrorMessage("This phone number is already in use!");
            return response.data["Status"];
          } else {
            setError(false);
            routeChange(
              `/insert/household/${email}/${postal_code}/${values.area_code}${values.number}/${values.type}`
            );
            return response.data["Status"];
          }
        });

      return true;
    } else if (onOff === "No") {
      routeChange(`/insert/household/${email}/${postal_code}/na/na`);
      return true;
    } else {
      setError(true);
      setErrorMessage(
        "Area code must be 3 digits. Number must be 7 digits. Type cannot be left empty!"
      );
      return false;
    }
  };

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={0} />
      <br></br>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Enter Household Information
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Would you like to enter a phone number?
          <FormControl fullWidth sx={{ m: 1 }}>
            <ToggleButtonGroup
              value={onOff}
              exclusive
              onChange={handleOnOff}
              aria-label="text alignment"
            >
              <ToggleButton
                value="Yes"
                aria-label="left aligned"
                color="primary"
              >
                Yes
              </ToggleButton>
              <ToggleButton value="No" aria-label="centered" color="primary">
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Typography>
        {onOff === "Yes" ? (
          <>
            <Typography>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Area Code
                </InputLabel>
                <OutlinedInput
                  required
                  inputProps={{ maxLength: 3 }}
                  value={values.area_code}
                  onChange={handleChange("area_code")}
                  label="area_code"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Number
                </InputLabel>
                <OutlinedInput
                  required
                  inputProps={{ maxLength: 8 }}
                  value={values.number}
                  onChange={handleChange("number")}
                  label="number"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Type</InputLabel>
                <Select
                  value={values.type}
                  label="type"
                  onChange={handleChange("type")}
                >
                  <MenuItem value={`Home`}>Home</MenuItem>
                  <MenuItem value={`Mobile`}>Mobile</MenuItem>
                  <MenuItem value={`Work`}>Work</MenuItem>
                  <MenuItem value={`Other`}>Other</MenuItem>
                </Select>
              </FormControl>
              {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}
            </Typography>
          </>
        ) : (
          <></>
        )}
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              validate(
                values.area_code,
                values.number,
                values.type,
                values.alert_text
              );
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
