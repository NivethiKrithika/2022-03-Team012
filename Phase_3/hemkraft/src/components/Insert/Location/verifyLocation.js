import { Typography, Container, Button, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../../resources/Loading";
import ProgressBar from "../../../resources/progressBar";

function _() {
  // eslint-disable-next-line
  const [axiosResponse, setResponse] = useState({
    city: "",
    state: "",
  });
  const { email, postal_code } = useParams();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    var myParams = {
      postal_code: postal_code,
    };

    axios
      .post("http://127.0.0.1:5000/get/location", myParams)
      .then((response) => {
        setLoading(false);
        if (response.data["Status"] === 400)
          routeChange(`/insert/location/${email}/`);
        setResponse({
          city: response.data["city"],
          state: response.data["state"],
        });
      });
    // eslint-disable-next-line
  }, []);

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={0} />
      <br></br>
      <Container component="main" maxWidth="sm">
        {isLoading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            <Typography component="h1" variant="h4">
              Enter Household Information
            </Typography>
            <br />
            <Container align="center">
              <Typography
                component="subtitle"
                variant="subtitle"
                sx={{ alignItems: "center " }}
              >
                You entered the following Postal Code:
              </Typography>
              <Typography sx={{ fontWeight: "bold", align: "center" }}>
                {postal_code}
              </Typography>
              {axiosResponse !== undefined ? (
                <Typography sx={{ align: "center " }}>
                  {axiosResponse["city"]}, {axiosResponse["state"]}
                </Typography>
              ) : (
                <></>
              )}
              <Typography sx={{ align: "center " }}>
                Is this Correct?
              </Typography>
              <br />
              <FormControl fullWidth sx={{ m: 0.25 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => {
                    routeChange(`/insert/phoneNumber/${email}/${postal_code}`);
                  }}
                >
                  Yes
                </Button>
              </FormControl>
              <FormControl fullWidth sx={{ m: 0.25 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => {
                    routeChange(`/insert/location/${email}/`);
                  }}
                >
                  No
                </Button>
              </FormControl>
            </Container>
          </>
        )}
      </Container>
    </Typography>
  );
}

export default _;
