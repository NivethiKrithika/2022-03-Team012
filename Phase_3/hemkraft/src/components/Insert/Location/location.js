import {
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from "../../../resources/progressBar";

function _() {
  const POSTAL_CODE_REGEX = /\d{3,5}/g
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const [values, setValues] = useState({
    postal_code: ''
  });

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');

  const { email } = useParams()

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validate = (val) => {

    if (val.match(POSTAL_CODE_REGEX) && val.length >= 3 && val.length <= 5) {
      var myParams = {
        postal_code: val
      }


      axios.post('http://127.0.0.1:5000/get/postal_code', myParams)
        .then(response => {

          if (response.data["Status"] === 200) {
            setError(false);


            routeChange(`/insert/verifyLocation/${email}/${values.postal_code}`)
          } else {
            setError(true);
            setErrorMessage("Postal code not found. Please try again!")
            return response.data["Status"];
          }
        });
    }
    else {
      setError(true);
      setErrorMessage("Postal code must be between 3 and 5 digits long!");
    }
  }

  return (
    < Typography >
      <br />
      <ProgressBar step_number={0} />
      <br />
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Enter Household Information
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Please enter your five digit postal code:
        </Typography>
        <Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Postal Code</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={values.email}
              onChange={handleChange('postal_code')}
              label="postal_code"
            />
          </FormControl>
          {
            isError ?
              < Alert severity="error" > {errMessage}</Alert>
              :
              <></>
          }
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              validate(values.postal_code)
            }}
          >
            Submit
          </Button>
        </FormControl>
      </Container >
    </Typography >
  );
}

export default _;
