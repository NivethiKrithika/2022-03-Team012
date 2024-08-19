import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../resources/Loading";

function TableTwo() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get/laundryCenterReport/2")
      .then((response) => {
        setRows(
          Array.from(
            new Set(response.data["Rows"].map(JSON.stringify)),
            JSON.parse
          )
        );
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h5">
        Household count, per state, where a household has a washing machine, but
        does not have a dryer
      </Typography>
      <br />
      <br />
      {rows.length === 0 ? (
        Loading()
      ) : (
        <TableContainer component={Paper} sx={{ height: "s" }}>
          <Table sx={{ minWidth: 650, height: 500 }} aria-label="simple table">
            <TableHead sx={{ background: "#d4d4d4" }}>
              <TableRow>
                <TableCell align="center">
                  <b>State</b>
                </TableCell>
                <TableCell align="center">
                  <b>Household Count</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r[0]}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {r[0]}
                  </TableCell>
                  <TableCell align="center">{r[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
    </Container>
  );
}

export default TableTwo;
