import {
  Typography,
  Container,
  Alert,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useState, React } from 'react';
import { useNavigate } from 'react-router-dom';

function _() {
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');
  const [search, setValues] = useState('');
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const handleChange = (prop) => (event) => {

    setValues(event.target.value);


  };

  const handleValidation = (prop) => (event) => {
    if (search === '') {
      setError(true);
      setErrorMessage("Search term cannot be empty!");
      return false;
    }
    else {
      routeChange(`/reports/search/${search}`);
    }
  };



  return (
    <Typography>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h3">
          Manufacturer/Model Search
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Please enter a search term to conduct the manufacturer/model search.
        </Typography>
        <br />
        <FormControl fullWidth sx={{ m: 1 }}>

          <InputLabel htmlFor="outlined-adornment-amount">{`Search`}</InputLabel>
          <OutlinedInput
            required
            id="outlined-adornment-amount"
            value={search}
            onChange={handleChange('search')}
            label="search"
          />

        </FormControl>
        <br />
        <br />
        <FormControl>
          <Button
            variant="contained"
            size="medium"
            onClick={handleValidation()}
          >
            Search!
          </Button>
        </FormControl>


        {
          isError ? <Alert severity="error">{errMessage}</Alert> : <></>
        }
      </Container>
      <br />
      <br />
      <Container component="main" maxWidth="xs">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/reports`)
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
              routeChange(`/`)
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
