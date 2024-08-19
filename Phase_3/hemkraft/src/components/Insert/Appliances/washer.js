import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Washer({ manufacturer, model_name, type, email, count }) {

  const [values, setValues] = useState({
    type: '',
  });


  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  const handleValidation = (prop) => (event) => {
    setError(false);
    let form_data = {
      "appliance_count": count,
      "manufacturer": manufacturer,
      "model_name": model_name,
      'loading_type': values.type,
      "email": email,
      "type": type,

    }
    if (manufacturer === '') {
      setError(true);
      setErrorMessage("You must select a manufacturer");
      return false;
    }
    if (values.type === '') {
      setError(true);
      setErrorMessage("You must select a loading type!");
      return false;
    }
    axios.post(`http://127.0.0.1:5000/insert/appliances`, form_data)
      .then(res => {
        if (res.data["Status"] === 200)
          routeChange(`/insert/applianceListing/${email}/${Number(form_data['appliance_count']) + 1}`);
        else {
          setError(true);
          setErrorMessage("There was a problem adding this appliancer");
        }
      });
  }


  return (
    <Typography>
      <br />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="typle">Loading Type:</InputLabel>
        <Select
          value={values.type}
          label="type"
          onChange={handleChange('type')}
        >
          <MenuItem value={`Top`}>Top</MenuItem>
          <MenuItem value={`Front`}>Front</MenuItem>
        </Select>
      </FormControl>
      {
        isError ? <Alert severity="error">{errMessage} </Alert> : <></>
      }

      <FormControl fullWidth sx={{ m: 1 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleValidation()}
        >
          Add
        </Button>
      </FormControl>
    </Typography >
  )
}

export default Washer;