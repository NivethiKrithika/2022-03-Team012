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

function Fridge({ manufacturer, model_name, type, email, count }) {

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
      'refrigerator_type': values.type,
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
      setErrorMessage("You must select a fridge or freezer type!");
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
        <InputLabel id="typle">Type:</InputLabel>
        <Select
          value={values.type}
          label="type"
          onChange={handleChange('type')}
        >
          <MenuItem value={`bottom freezer`}>Bottom freezer</MenuItem>
          <MenuItem value={`french door`}>French door</MenuItem>
          <MenuItem value={`side-by-side`}>Side-by-side</MenuItem>
          <MenuItem value={`top freezer`}>Top freezer</MenuItem>
          <MenuItem value={`chest freezer`}>Chest freezer</MenuItem>
          <MenuItem value={`upright freezer`}>Upright freezer</MenuItem>
        </Select>
      </FormControl>
      {
        isError ? <Alert severity="error">{errMessage}</Alert> : <></>
      }

      <FormControl fullWidth sx={{ m: 1 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleValidation()} //</FormControl>=> { routeChange(`/insert/applianceListing/${email}/`); }}
        >
          Add
        </Button>
      </FormControl>
    </Typography >
  )
}

export default Fridge;