import {
  Typography,
  Container,
  Button,
  FormControl,
  ButtonGroup,
  InputLabel,
  OutlinedInput,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function HalfBathroom({ is_primary }) {

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');
  const { email, count } = useParams();
  const [values, setValues] = useState({
    bath_id: count,
    email: email,
    sinks: 0,
    commodes: 0,
    bidets: 0,
    non_unique_name: ''
  });


  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const handleIncrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] + 1 });
  };

  const handleDecrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] - 1 });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validateInput = () => {
    if (values.sinks === 0 && values.commodes === 0 && values.bidets === 0) {
      setError(true);
      setErrorMessage("You must have at least one sink, commode and/or bidet");
      return false
    }
    else
      return true
  }

  const insertHalf = () => {
    axios.post('http://127.0.0.1:5000/insert/half', values)
      .then(response => {

        if (response.data["Status"] === 200) {
          routeChange(`/insert/bathroomListing/${email}/${Number(values.bath_id) + 1}`);
          return true;
        } else {
          return false;
        }
      });
  }




  return (
    <Typography>
      <Container component="main" maxWidth="xs">
        <Typography>
          Sinks:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.sinks === 0) {
                    setError(true);
                    setErrorMessage("You cannot have sink count less than 0");
                  }
                  else {
                    setError(false);
                    handleDecrement('sinks') && handleChange('sinks');
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.sinks}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement('sinks') && handleChange('sinks');
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Commodes:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.commodes === 0) {
                    setError(true);
                    setErrorMessage("You cannot have commode count less than 0");
                  }
                  else {
                    setError(false);
                    handleDecrement('commodes') && handleChange('commodes');
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.commodes}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement('commodes') && handleChange('commodes');
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Bidets:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.bidets === 0) {
                    setError(true);
                    setErrorMessage("You cannot have bidet count less than 0");
                  }
                  else {
                    setError(false);
                    handleDecrement('bidets') && handleChange('bidets');
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.bidets}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement('bidets') && handleChange('bidets');
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount"> Name</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={values.non_unique_name}
              onChange={handleChange('non_unique_name')}
              label="Name"
            />
          </FormControl>
        </Typography>

        {
          isError ? <Alert severity="error">{errMessage}</Alert> : <></>
        }

        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              if (validateInput() === true) {
                if (insertHalf() === false) {
                  setError(true);
                  setErrorMessage("There was a problem in adding half bathroom!");
                }
              }
            }}
          >
            Add
          </Button>
        </FormControl>
      </Container>
    </Typography>
  )
}

export default HalfBathroom;