import {
  Typography,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cooker({ manufacturer, model_name, type, email, count }) {

  const [is_oven, setIsOven] = useState("No");
  const [is_cooktop, setIsCooktop] = useState("No");
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');



  const [ovenvalues, setOvenValues] = useState({
    type: '',
    heat_source: []

  });

  const [cooktopvalues, setCooktopValues] = useState({
    heat_source: ''
  });


  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const handleCookers = (prop) => (event) => {
    if (prop === 'is_oven')
      if (is_oven === "Yes")
        setIsOven("No")

      else
        setIsOven("Yes")

    if (prop === 'is_cooktop')
      if (is_cooktop === "Yes")
        setIsCooktop("No")
      else
        setIsCooktop("Yes")
  };

  const handleOven = (prop) => (event) => {
    setOvenValues({ ...ovenvalues, [prop]: event.target.value });
  };

  const addHeatSource = (prop) => (event) => {
    if (event.target.checked) {
      ovenvalues['heat_source'].push(event.target.value);

    }
    else {
      var index = ovenvalues['heat_source'].indexOf(event.target.value);
      delete ovenvalues['heat_source'][index];
    }

  };

  const handleCooktop = (prop) => (event) => {
    setCooktopValues({ ...cooktopvalues, [prop]: event.target.value });
  };

  const handleValidation = (prop) => (event) => {
    setError(false);
    let form_data = {
      "appliance_count": count,
      "type": type,
      "is_oven": is_oven,
      "is_cooktop": is_cooktop,
      "oven_data": ovenvalues,
      "cooktop_data": cooktopvalues,
      "email": email,
      "manufacturer": manufacturer,
      "model_name": model_name
    }
    if (manufacturer === '') {
      setError(true);
      setErrorMessage("You must select a manufacturer");
      return false;
    }
    if (is_oven === "No" && is_cooktop === "No") {
      setError(true);
      setErrorMessage("You must select one type of Cooker!");
      return false;
    }
    if (is_oven === "Yes") {
      if (ovenvalues['heat_source'].filter(src => src !== undefined).length === 0) {
        setError(true);
        setErrorMessage("You must select a heat source for the Oven.");
        return false;
      }
      else if (ovenvalues['type'] === '') {
        setError(true);
        setErrorMessage("You must select the Oven type!");
        return false;
      }
    }
    if (is_cooktop === "Yes") {
      if (cooktopvalues['heat_source'] === '') {
        setError(true);
        setErrorMessage("You must select a heat source for the Cooktop!");
        return false;
      }
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
      <Grid container spacing={5}>
        <Grid item>
          <Box>
            <FormControlLabel onChange={handleCookers('is_oven')} control={<Checkbox />} label="Oven" />
            {
              is_oven === "Yes" ?
                <Typography>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Heat Source</FormLabel>

                    <FormControlLabel onChange={addHeatSource('heat_source')} value={"gas"} control={<Checkbox />} label="Gas" />
                    <FormControlLabel onChange={addHeatSource('heat_source')} value={"electric"} control={<Checkbox />} label="Electric" />
                    <FormControlLabel onChange={addHeatSource('heat_source')} value={"microwave"} control={<Checkbox />} label="Microwave" />

                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="typle">Type:</InputLabel>
                    <Select
                      value={ovenvalues.type}
                      label="type"
                      onChange={handleOven('type')}
                    >
                      <MenuItem value={`Convection`}>Convection</MenuItem>
                      <MenuItem value={`Conventional`}>Conventional</MenuItem>

                    </Select>
                  </FormControl>
                </Typography>
                :
                <></>
            }
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <FormControlLabel onChange={handleCookers('is_cooktop')} control={<Checkbox />} label="Cooktop" />
            {
              is_cooktop === "Yes" ?
                <Typography>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="typle">Heat Source:</InputLabel>
                    <Select
                      value={cooktopvalues.heat_source}
                      label="heat_source"
                      onChange={handleCooktop('heat_source')}
                    >
                      <MenuItem value={`gas`}>Gas</MenuItem>
                      <MenuItem value={`electric`}>Electric</MenuItem>
                      <MenuItem value={`radiant electric`}>Radiant Electric</MenuItem>
                      <MenuItem value={`induction`}>Induction</MenuItem>
                    </Select>
                  </FormControl>
                </Typography>
                :
                <></>
            }

          </Box>
        </Grid>
      </Grid>
      {
        isError ? <Alert severity="error">{errMessage}</Alert> : <></>
      }
      <FormControl fullWidth sx={{ m: 1 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleValidation()}// axios.post(`http://127.0.0.1:5000/insert/appliances`, form_data)}
        >
          Add
        </Button>
      </FormControl>
    </Typography >
  )
}

export default Cooker;