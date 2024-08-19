import {
  Typography,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { useState, useEffect, React } from 'react';
import { useParams } from "react-router-dom";
import Cooker from './cooker';
import TV from './tv';
import Washer from './washer';
import Dryer from './dryer';
import Fridge from './fridge';
import axios from 'axios';
import ProgressBar from "../../../resources/progressBar";



function _() {
  const [axiosResponse, setResponse] = useState({
    manufacturers: [],

  });
  const [values, setValues] = useState({
    type: '',
    manufacturer: '',
    manufacturer_other: '',
    model_name: '',
  });


  const { email, count } = useParams();
  const [isError, setError] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

  };


  useEffect(() => {
    axios.post('http://127.0.0.1:5000/get/manufacturers')
      .then(res => {
        if (res.data["Status"] === 200) {
          res.data["Result"].push("Other");
          setResponse({
            manufacturers: res.data["Result"],
          });
        }
        else {
          setError(true);

        }
      });
  }, []);

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={2} />
      <br></br>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Add Appliance
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Please provide the details for the appliance.
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel id="typle">Appliance Type</InputLabel>
            <Select
              value={values.type}
              label="type"
              onChange={handleChange('type')}
            >
              <MenuItem value={`Cooker`}>Cooker</MenuItem>
              <MenuItem value={`TV`}>TV</MenuItem>
              <MenuItem value={`Washer`}>Washer</MenuItem>
              <MenuItem value={`Dryer`}>Dryer</MenuItem>
              <MenuItem value={`Fridge`}>Refrigerator or freezer</MenuItem>
            </Select>
          </FormControl>
          {
            values.type === '' ?
              <>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel id="typle">Manufacturer:</InputLabel>
                  <Select disabled />

                </FormControl>


                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">{`Model Name`}</InputLabel>
                  <OutlinedInput disabled />
                </FormControl>
              </> :
              <></>
          }
          {values.type === 'Cooker' ?
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Manufacturer:</InputLabel>
                <Select
                  value={values.manufacturer}
                  label="type"
                  onChange={handleChange('manufacturer')}
                  id="manufacturer-select"
                >
                  {axiosResponse.manufacturers.map((manufacturer) =>
                    <MenuItem value={manufacturer} >{manufacturer}</MenuItem>
                  )}

                </Select>
              </FormControl>
              <br />
              {
                values.manufacturer === "Other" ?
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">{`Please enter the manufacturer:`}</InputLabel>
                    <OutlinedInput
                      required
                      id="outlined-adornment-amount"
                      value={values.manufacturer_other}
                      onChange={handleChange('manufacturer_other')}
                      label="manufacturer_input"

                    />
                  </FormControl> : <></>
              }





              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">{`Model Name:`}</InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-amount"
                  value={values.model_name}
                  onChange={handleChange('model_name')}
                  label="model_name"
                />
              </FormControl>
              <Cooker manufacturer={values.manufacturer === "Other" ? values.manufacturer_other : values.manufacturer} model_name={values.model_name} type={values.type} email={email} count={count} />
            </>
            : <></>
          }
          {values.type === 'TV' ?
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Manufacturer:</InputLabel>
                <Select
                  value={values.manufacturer}
                  label="type"
                  onChange={handleChange('manufacturer')}
                  id="manufacturer-select"
                >
                  {axiosResponse.manufacturers.map((manufacturer) =>
                    <MenuItem value={manufacturer} >{manufacturer}</MenuItem>
                  )}

                </Select>
              </FormControl>
              {
                values.manufacturer === "Other" ?
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">{`Please enter the manufacturer:`}</InputLabel>
                    <OutlinedInput
                      required
                      id="outlined-adornment-amount"
                      value={values.manufacturer_other}
                      onChange={handleChange('manufacturer_other')}
                      label="manufacturer_input"

                    />
                  </FormControl> : <></>
              }
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">{`Model Name:`}</InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-amount"
                  value={values.model_name}
                  onChange={handleChange('model_name')}
                  label="model_name"
                />
              </FormControl>
              <TV manufacturer={values.manufacturer === "Other" ? values.manufacturer_other : values.manufacturer} model_name={values.model_name} type={values.type} email={email} count={count} />
            </>
            : <></>
          }
          {values.type === 'Washer' ?
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Manufacturer:</InputLabel>
                <Select
                  value={values.manufacturer}
                  label="type"
                  onChange={handleChange('manufacturer')}
                  id="manufacturer-select"
                >
                  {axiosResponse.manufacturers.map((manufacturer) =>
                    <MenuItem value={manufacturer} >{manufacturer}</MenuItem>
                  )}

                </Select>
              </FormControl>
              {
                values.manufacturer === "Other" ?
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">{`Please enter the manufacturer:`}</InputLabel>
                    <OutlinedInput
                      required
                      id="outlined-adornment-amount"
                      value={values.manufacturer_other}
                      onChange={handleChange('manufacturer_other')}
                      label="manufacturer_input"

                    />
                  </FormControl> : <></>
              }
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">{`Model Name:`}</InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-amount"
                  value={values.model_name}
                  onChange={handleChange('model_name')}
                  label="model_name"
                />
              </FormControl>
              <Washer manufacturer={values.manufacturer === "Other" ? values.manufacturer_other : values.manufacturer} model_name={values.model_name} type={values.type} email={email} count={count} />
            </>
            : <></>
          }
          {values.type === 'Dryer' ?
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Manufacturer:</InputLabel>
                <Select
                  value={values.manufacturer}
                  label="type"
                  onChange={handleChange('manufacturer')}
                  id="manufacturer-select"
                >
                  {axiosResponse.manufacturers.map((manufacturer) =>
                    <MenuItem value={manufacturer} >{manufacturer}</MenuItem>
                  )}

                </Select>
              </FormControl>
              {
                values.manufacturer === "Other" ?
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">{`Please enter the manufacturer:`}</InputLabel>
                    <OutlinedInput
                      required
                      id="outlined-adornment-amount"
                      value={values.manufacturer_other}
                      onChange={handleChange('manufacturer_other')}
                      label="manufacturer_input"

                    />
                  </FormControl> : <></>
              }
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">{`Model Name:`}</InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-amount"
                  value={values.model_name}
                  onChange={handleChange('model_name')}
                  label="model_name"
                />
              </FormControl>
              <Dryer manufacturer={values.manufacturer === "Other" ? values.manufacturer_other : values.manufacturer} model_name={values.model_name} type={values.type} email={email} count={count} />
            </>
            : <></>
          }
          {values.type === 'Fridge' ?
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="typle">Manufacturer:</InputLabel>
                <Select
                  value={values.manufacturer}
                  label="type"
                  onChange={handleChange('manufacturer')}
                  id="manufacturer-select"
                >
                  {axiosResponse.manufacturers.map((manufacturer) =>
                    <MenuItem value={manufacturer} >{manufacturer}</MenuItem>
                  )}

                </Select>
              </FormControl>
              {
                values.manufacturer === "Other" ?
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">{`Please enter the manufacturer:`}</InputLabel>
                    <OutlinedInput
                      required
                      id="outlined-adornment-amount"
                      value={values.manufacturer_other}
                      onChange={handleChange('manufacturer_other')}
                      label="manufacturer-input"

                    />
                  </FormControl> : <></>
              }
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">{`Model Name:`}</InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-amount"
                  value={values.model_name}
                  onChange={handleChange('model_name')}
                  label="model_name"
                />
              </FormControl>
              <Fridge manufacturer={values.manufacturer === "Other" ? values.manufacturer_other : values.manufacturer} model_name={values.model_name} type={values.type} email={email} count={count} />
            </>
            : <></>
          }
          {
            isError ? < Alert severity="error" > There was a problem retrieving the manufacturers!</Alert> : <></>
          }
        </Typography>
      </Container>
    </Typography>
  );
}

export default _;
