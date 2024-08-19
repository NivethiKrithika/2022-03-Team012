import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// eslint-disable-next-line
const SIZE_REGEX = /^[0-9]*(\.[0-9]{0,1})?$/g

function TV({ manufacturer, model_name, type, email, count }) {

  const [values, setValues] = useState({
    type: '',
    size: 0.0,
    resolution: '',
  });


  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validateSize = (value) => {
    if (value.toString().match(SIZE_REGEX) !== null) {
      return true;
    }
    else {
      return false;
    }

  }

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');




  const handleValidation = (prop) => (event) => {
    setError(false);
    let form_data = {
      "appliance_count": count,
      "manufacturer": manufacturer,
      "model_name": model_name,
      'display_type': values.type,
      "display_size": values.size,
      "max_resolution": values.resolution,
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
      setErrorMessage("You must select a display type");
      return false;
    }
    if (values.size === '' || values.size === 0) {
      setError(true);
      setErrorMessage("You must enter a display size!");
      return false;
    }
    if (values.size === '0.0'){
      setError(true);
      setErrorMessage("Display size cannot be 0!");
      return false;
    }
    if (values.resolution === '') {
      setError(true);
      setErrorMessage("You must select a maximum resolution");
      return false;
    }
    if (!validateSize(values.size)) {
      setError(true);
      setErrorMessage("Display size must be to the tenth of an inch and cannot be 0!");
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
        <InputLabel id="typle">Display Type:</InputLabel>
        <Select
          value={values.type}
          label="type"
          onChange={handleChange('type')}
        >
          <MenuItem value={`tube`}>tube</MenuItem>
          <MenuItem value={`DLP`}>DLP</MenuItem>
          <MenuItem value={`plasma`}>plasma</MenuItem>
          <MenuItem value={`LCD`}>LCD</MenuItem>
          <MenuItem value={`LED`}>LED</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="outlined-adornment-amount">{`Display Size (inches):`}</InputLabel>
        <OutlinedInput
          required
          id="outlined-adornment-amount"
          value={values.size}
          onChange={handleChange('size')}
          label="size"
        />
      </FormControl>

      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="typle">Maximum Resolution:</InputLabel>
        <Select
          value={values.resolution}
          label="resolution"
          onChange={handleChange('resolution')}
        >
          <MenuItem value={`480i`}>{`480i`}</MenuItem>
          <MenuItem value={`576i`}>{`576i`}</MenuItem>
          <MenuItem value={`720p`}>{`720p`}</MenuItem>
          <MenuItem value={`1080i`}>{`1080i`}</MenuItem>
          <MenuItem value={`1080p`}>{`1080p`}</MenuItem>
          <MenuItem value={`1440p`}>{`1440p`}</MenuItem>
          <MenuItem value={`2160p (4K)`}>{`2160p (4K)`}</MenuItem>
          <MenuItem value={`4320p (8K)`}>{`4320p (8K)`}</MenuItem>
        </Select>
      </FormControl>


      <FormControl fullWidth sx={{ m: 1 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleValidation()}

        >
          Add
        </Button>
      </FormControl>
      {isError === true ? <Alert severity='error'>{errMessage}</Alert> : <></>}



    </Typography >
  )
}

export default TV;