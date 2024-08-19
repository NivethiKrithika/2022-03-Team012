import {
  Typography,
  Container,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl
} from '@mui/material';
import { useState, useEffect, React } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from "../../../resources/Loading";

function _() {

  const { state } = useParams();
  const [axiosResponse, setResponse] = useState({
    drilldown: []
  });

  const [isLoading, setLoading] = useState('');

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }

  useEffect(() => {
    setLoading('y');
    axios.post('http://127.0.0.1:5000/get/avgTVSizeDrilldown', { 'state': state })
      .then(res => {
        if (res.data["Status"] === 200) {
          setResponse({
            drilldown: res.data["Result2"]
          });
          setLoading('n');
        }
        else {
          < Alert severity="error" > There was a problem retrieving data!</Alert>
        };
      })
  }, [state]);


  return (
    <Typography>
      <Container component="main" maxWidth="md">
        <br />
        <br />
        <Typography component="h1" variant="h5">
          Average TV Display Size by State
        </Typography>
        <Typography component="h1" variant="h5">
          Drilldown Report for State: <b>{state}</b>
        </Typography>
        <br />
        <br />
        {(() => {
          if (isLoading === 'y') {
            return Loading();
          }
          else if (isLoading === 'n' && axiosResponse.drilldown.length === 0) {
            return <Container component="main" maxWidth="xs"><br /><br />
              <Typography maxWidth="xs">
                <Alert severity="warning">This state has no TV information to perform drilldown report</Alert>
              </Typography>
            </Container>
          }
          else {
            return (
              <Typography>
                <TableContainer component={Paper} sx={{ height: 500 }} >
                  <Table aria-label="simple table" sx={{ height: "max-content" }}>
                    <TableHead sx={{ "background": "#d4d4d4" }}>
                      <TableRow>
                        <TableCell ><b>Display Type</b></TableCell>
                        <TableCell ><b>Maximum Resolution</b></TableCell>
                        <TableCell ><b>Average Display Size</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {axiosResponse.drilldown.map((drilldown) => (
                        <TableRow
                          key={drilldown[1]}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{drilldown[1]}</TableCell>
                          <TableCell>{drilldown[2]}</TableCell>
                          <TableCell>{(Math.round(drilldown[3] * 10) / 10).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            )
          }
        })()}
        <br />
        <br />
        <Container component="main" maxWidth="xs">
          <FormControl fullWidth sx={{ m: 1 }}>
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                routeChange(`/reports/avgTV`)
              }}
            >
              Back
            </Button>
          </FormControl>
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
      </Container>
    </Typography>
  );
}

export default _;
