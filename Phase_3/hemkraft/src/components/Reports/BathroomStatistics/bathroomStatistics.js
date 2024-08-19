import {
  Typography,
  Container,
  Alert,
  FormControl,
  Button,
} from '@mui/material';

import { useState, useEffect, React } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from "../../../resources/Loading";

function _() {

  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState('');

  const [axiosResponse, setResponse] = useState({
    bathroom_stats: [],
    bidet_per_postal_code: [],
    bidet_per_state: [],
    primary_bathroom_count: []
  })
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }


  useEffect(() => {
    setLoading('y');
    axios.get('http://127.0.0.1:5000/get/bathroomStatistics')
      .then(res => {
        if (res.data["Status"] === 200) {

          setResponse({
            bathroom_stats: res.data["stats_row"],
            bidet_per_postal_code: res.data["bidet_postal_code_row"],
            bidet_per_state: res.data["bidet_state_row"],
            primary_bathroom_count: res.data["primary_count_row"],
          });
          setLoading('n');
        }
        else {
          setError(true);
          setErrorMessage("There was a problem retrieving statistics!");
          setLoading('n');
        }
      });
  }, []);



  return (

    <Typography>

      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h3">
          Bathroom Statistics <br></br>
          { isLoading === 'y' ? Loading() : <></> }
          {(axiosResponse.bathroom_stats.length === 0 || axiosResponse.bidet_per_postal_code.length === 0 ||
           axiosResponse.bidet_per_postal_code.length === 0 || axiosResponse.primary_bathroom_count.length === 0) && isLoading === 'n' ?
          <>
          <Alert severity = "info">
           Note :  *No Data - The users have not entered sufficient information in DB to collect data  for that field </Alert>
          </>:null}
          
        </Typography>


        <Typography>
          <br />
          <br />

          {(!isError && isLoading === 'n') ?
            <>
              {axiosResponse.bathroom_stats.length > 0 ?
                <>
                  {axiosResponse.bathroom_stats.map((stats) => (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      Max number of bathrooms per household:                                                        {stats[0] ? stats[0] : "No data"} <br />
                      Min number of bathrooms per household:                                                         {stats[1] ? stats[1] : "No data"}   <br />
                      Avg number of bathrooms per household:                                                         {stats[2] ? stats[2] : "No data"} <br /> <br />
                      Max number of full bathrooms per household:                                                   {stats[3] ? stats[3] : "No data"} <br />
                      Min number of full bathrooms per household:                                                    {stats[4] ? stats[4] : "No data"} <br />
                      Avg number of full bathrooms per household:                                                    {stats[5] ? stats[5] : "No data"} <br /><br />
                      Max number of half bathrooms per household:                                                  {stats[6] ? stats[6] : "No data"} <br />
                      Min number of half bathrooms per household:                                                   {stats[7] ? stats[7] : "No data"} <br />
                      Avg number of half bathrooms per household:                                                   {stats[8] ? stats[8] : "No data"} <br /><br />
                      Max number of commodes per household:                                                         {stats[9] ? stats[9] : "No data"} <br />
                      Min number of commodes per household:                                                          {stats[10] ? stats[10] : "No data"} <br />
                      Avg number of commodes per household:                                                          {stats[11] ? stats[11] : "No data"} <br /><br />
                      Max number of sinks per household:                                                                  {stats[12] ? stats[12] : "No data"} <br />
                      Min number of sinks per household:                                                                   {stats[13] ? stats[13] : "No data"} <br />
                      Avg number of sinks per household:                                                                   {stats[14] ? stats[14] : "No data"} <br /><br />
                      Max number of bidets per household:                                                                 {stats[15] ? stats[15] : "No data"} <br />
                      Min number of bidets per household:                                                                  {stats[16] ? stats[16] : "No data"} <br />
                      Avg number of bidets per household:                                                                  {stats[17] ? stats[17] : "No data"} <br /><br />
                      Max number of bathtubs per household:                                                             {stats[18] ? stats[18] : "No data"} <br />
                      Min number of bathtubs per household:                                                              {stats[19] ? stats[19] : "No data"} <br />
                      Avg number of bathtubs per household:                                                              {stats[20] ? stats[20] : "No data"} <br /><br />
                      Max number of showers per household:                                                              {stats[21] ? stats[21] : "No data"} <br />
                      Min number of showers per household:                                                               {stats[22] ? stats[22] : "No data"} <br />
                      Avg number of showers per household:                                                               {stats[23] ? stats[23] : "No data"} <br /><br />
                      Max number of tub showers per household:                                                        {stats[24] ? stats[24] : "No data"} <br />
                      Min number of tub showers per household:                                                         {stats[25] ? stats[25] : "No data"} <br />
                      Avg number of tub showers per household:                                                         {stats[26] ? stats[26] : "No data"} <br /><br />

                    </Typography>
                  ))}
                </>
                :

                <>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>

                    Max number of bathrooms per household:                                                        No data <br />
                    Min number of bathrooms per household:                                                         No data   <br />
                    Avg number of bathrooms per household:                                                         No data <br />
                    Max number of full bathrooms per household:                                                   No data <br />
                    Min number of full bathrooms per household:                                                    No data <br />
                    Avg number of full bathrooms per household:                                                    No data <br />
                    Max number of half bathrooms per household:                                                  No data <br />
                    Min number of half bathrooms per household:                                                   No data <br />
                    Avg number of half bathrooms per household:                                                   No data <br />
                    Max number of commodes per household:                                                         No data <br />
                    Min number of commodes per household:                                                          No data <br />
                    Avg number of commodes per household:                                                          No data <br />
                    Max number of sinks per household:                                                                  No data <br />
                    Min number of sinks per household:                                                                   No data <br />
                    Avg number of sinks per household:                                                                   No data <br />
                    Max number of bidets per household:                                                                  No data<br />
                    Min number of bidets per household:                                                                  No data <br />
                    Avg number of bidets per household:                                                                  No data <br />
                    Max number of bathtubs per household:                                                             No data <br />
                    Min number of bathtubs per household:                                                              No data <br />
                    Avg number of bathtubs per household:                                                              No data <br />
                    Max number of showers per household:                                                              No data <br />
                    Min number of showers per household:                                                               No data <br />
                    Avg number of showers per household:                                                               No data <br />
                    Max number of tub showers per household:                                                        No data <br />
                    Min number of tub showers per household:                                                         No data <br />
                    Avg number of tub showers per household:                                                         No data <br />

                  </Typography>
                </>
              }



              {axiosResponse.bidet_per_postal_code.length > 0 ?
                <>
                  {axiosResponse.bidet_per_postal_code.map((stats) => (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      Postal code that has most number of bidets:                                                       {stats[0] ? stats[0] : "No data"}<br />
                      Count of bidets in postal code having max no of bidets:                                      {stats[1] ? stats[1] : "No data"}<br />
                    </Typography>
                  ))}
                </>
                :

                <>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>
                    State that has most number of bidets:                                                                  No data<br />
                    Count of bidets in state having max no of bidets:                                                 No data<br />
                  </Typography>
                </>
              }



              {axiosResponse.bidet_per_state.length > 0 ?
                <>
                  {axiosResponse.bidet_per_state.map((stats) => (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      State that has most number of bidets:                                                                  {stats[0] ? stats[0] : "No data"}<br />
                      Count of bidets in state having max no of bidets:                                                 {stats[1] ? stats[1] : "No data"}<br />
                    </Typography>
                  ))}
                </>
                :

                <>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>
                    State that has most number of bidets:                                                                  No data<br />
                    Count of bidets in state having max no of bidets:                                                 No data<br />
                  </Typography>
                </>
              }


              {axiosResponse.primary_bathroom_count.length > 0 ?
                <>
                  {axiosResponse.primary_bathroom_count.map((stats) => (
                    <Typography style={{ whiteSpace: 'pre-wrap' }}>
                      Count of households with single primary bathroom and no other bathroom:        {stats[0]}  <br />
                    </Typography>
                  ))}
                </>
                :
                <>
                  <Typography style={{ whiteSpace: 'pre-wrap' }}>
                    Count of households with single primary bathroom and no other bathroom:        No Data
                  </Typography>
                </>
              }
            </>
            :
            <>

            </>
          }
          {
            isError ? <Alert severity="error">{errMessage}</Alert> : <></>
          }

        </Typography>
      </Container>
      <br />
      <br />
      <Container component="main" maxWidth="xs">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              routeChange(`/reports`);
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
              routeChange(`/`);
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
