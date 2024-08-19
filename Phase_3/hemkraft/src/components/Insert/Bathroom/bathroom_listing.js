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
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, React } from 'react';
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
    bathrooms: [],

  })

  /*const [values] = useState({
    email: email
  });*/


  useEffect(() => {
    var values = {
      email: email
    }

    axios.post('http://127.0.0.1:5000/get/bathroom_listing', values)
      .then(res => {
        if (res.data["Status"] === 200)
          setResponse({
            bathrooms: res.data["Result"],
          });
        else {
          setError(true);
          setErrorMessage("There was a problem retrieving the bathroom info!");
        }
      });
  }, [email]);

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={1} />
      <br></br>
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h2">
          Bathrooms
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          You have added the following bathrooms to your household:
        </Typography>
        <Typography>
          <br />
          <br />
          <TableContainer component={Paper} sx={{ height: 500 }} >
            <Table aria-label="simple table" sx={{ minWidth: 650, height: "max-content" }}>
              <TableHead sx={{ "background": "#d4d4d4" }}>
                <TableRow>
                  <TableCell><b>Bathroom #</b></TableCell>
                  <TableCell align="left"><b>Type</b></TableCell>
                  <TableCell align="left"><b>Primary</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {axiosResponse.bathrooms.map((bathroom) => (
                  <TableRow
                    key={bathroom[0]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {bathroom[0]}
                    </TableCell>
                    <TableCell align="left">{bathroom[1]}</TableCell>
                    <TableCell align="left">{bathroom[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
        {
          isError ? <Alert severity="error">{errMessage}</Alert> : <></>
        }
        <Link href={`/insert/bathroom/${email}/${count}`}>+ Add another bathroom</Link>
        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => { routeChange(`/insert/appliances/${email}/1`); }}
          >
            Next
          </Button>
        </FormControl>
      </Container>
    </Typography>
  )
}

export default _;