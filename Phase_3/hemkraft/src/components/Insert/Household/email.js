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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from "../../../resources/progressBar";


function _() {

  // eslint-disable-next-line
  const EMAIL_REGEX = '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const [values, setValues] = useState({
    email: ''
  });

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validate = (val) => {

    if (!val.match(EMAIL_REGEX)) {
      setError(true);
      setErrorMessage("Email is not valid!");
      return false;
    }

    var myParams = {
      email: val
    }

    axios.post('http://127.0.0.1:5000/get/email', myParams)
      .then(response => {

        if (response.data["Status"] === 200) {
          setError(true);
          setErrorMessage("Email is already in use!");
          return response.data["Status"];
        } else {
          setError(false);
          routeChange(`/insert/location/${values.email}`)
          return response.data["Status"];
        }
      });
  }

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
          Please enter your email address:
        </Typography>
        <Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={values.email}
              onChange={handleChange('email')}
              label="Email"
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
              validate(values.email)
            }}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </Typography>
  );
}

export default _;
