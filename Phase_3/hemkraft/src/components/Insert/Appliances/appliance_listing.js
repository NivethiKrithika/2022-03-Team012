import {
  Typography,
  Container,
  Button,
  FormControl,
  Link,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useState, useEffect, React } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from "../../../resources/progressBar";

function _() {

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  const { email, count } = useParams();
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState('');

  const [axiosResponse, setResponse] = useState({
    appliances: [],

  })

  useEffect(() => {
    axios.post('http://127.0.0.1:5000/get/appliance_listing', { "email": email })
      .then(res => {
        if (res.data["Status"] === 200)
          setResponse({
            appliances: res.data["Result"],
          });
        else {
          setError(true);
          setErrorMessage("There was a problem retrieving the appliances!");
        }
      });
  }, [email]);

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={2} />
      <br></br>
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h2">
          Appliances
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          You have added the following appliances to your household:
        </Typography>
        <Typography>
          <br />
          <br />
          <TableContainer component={Paper} sx={{ height: 500 }} >
            <Table aria-label="simple table" sx={{ minWidth: 650, height: "max-content" }}>
              <TableHead sx={{ "background": "#d4d4d4" }}>
                <TableRow>
                  <TableCell><b>Appliance #</b></TableCell>
                  <TableCell align="left"><b>Type</b></TableCell>
                  <TableCell align="left"><b>Manufacturer</b></TableCell>
                  <TableCell align="left"><b>Model</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {axiosResponse.appliances.map((appliance) => (
                  <TableRow
                    key={appliance[0]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {appliance[0]}
                    </TableCell>
                    <TableCell align="left">{appliance[1]}</TableCell>
                    <TableCell align="left">{appliance[2]}</TableCell>
                    <TableCell align="left">{appliance[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
        {
          isError ? <Alert severity="error">{errMessage}</Alert> : <></>
        }
        <br />
        <Link href={`/insert/appliances/${email}/${count}`}>+ Add another appliance</Link>
        <br />
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => { routeChange(`/insert/done/`); }}
          >
            Next
          </Button>
        </FormControl>
      </Container>
    </Typography>
  )
}

export default _;