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


function Dryer({ manufacturer, model_name, type, email, count }) {

  const [values, setValues] = useState({
    type: '',
  });
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');


  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  const handleValidation = (prop) => (event) => {
    setError(false);
    let form_data = {
      "appliance_count": count,
      "manufacturer": manufacturer,
      "model_name": model_name,
      'heat_source': values.type,
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
      setErrorMessage("You must select a heat source type!");
      return false;
    }
    axios.post(`http://127.0.0.1:5000/insert/appliances`, form_data)
      .then(res => {
        if (res.data["Status"] === 200)
          routeChange(`/insert/applianceListing/${email}/${Number(form_data['appliance_count']) + 1}`);
        else {
          setError(true);
          setErrorMessage("There was a problem adding this appliance");
        }
      });
  }
  return (
    <Typography>
      <br />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="typle">Heat Source:</InputLabel>
        <Select
          value={values.type}
          label="type"
          onChange={handleChange('type')}
        >
          <MenuItem value={`gas`}>Gas</MenuItem>
          <MenuItem value={`electric`}>Electric</MenuItem>
          <MenuItem value={`none`}>None</MenuItem>
        </Select>
      </FormControl>
      {
        isError ? <Alert severity="error">{errMessage}</Alert> : <></>
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

export default Dryer;