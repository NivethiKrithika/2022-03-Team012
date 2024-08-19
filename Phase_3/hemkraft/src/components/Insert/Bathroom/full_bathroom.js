import {
  Typography,
  Container,
  Button,
  FormControl,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, React } from "react";
import axios from "axios";

function FullBathroom({ is_primary }) {
  const { email, count } = useParams();
  const [isError, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  const [values, setValues] = useState({
    bath_id: count,
    email: email,
    sinks: 0,
    commodes: 0,
    bidets: 0,
    bathtubs: 0,
    showers: 0,
    tub_showers: 0,
    is_primary: "off",
  });

  const [axiosResponse, setResponse] = useState({
    is_primary_bathroom_present: false,
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleIncrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] + 1 });
  };

  const handleDecrement = (prop) => {
    setValues({ ...values, [prop]: values[prop] - 1 });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validateInput = () => {
    if (
      values.bathtubs === 0 &&
      values.showers === 0 &&
      values.tub_showers === 0
    ) {
      setError(true);
      setErrorMessage(
        "You must have at least one bathtub, shower and/or tub shower"
      );
      return false;
    } else return true;
  };

  useEffect(() => {
    var input_values = {
      email: email,
    };
    axios
      .post("http://127.0.0.1:5000/get/primaryBathroomPresent", input_values)
      .then((res) => {
        if (res.data["Status"] === 200) {
          setResponse({
            is_primary_bathroom_present: res.data["Result"],
          });
        } else {
          setError(true);
          setErrorMessage(
            "There was a problem retrieving primary bathroom details"
          );
        }
      });
  }, [email]);

  const insertFull = () => {
    axios.post("http://127.0.0.1:5000/insert/full", values).then((response) => {
      if (response.data["Status"] === 200) {
        routeChange(
          `/insert/bathroomListing/${email}/${Number(values.bath_id) + 1}`
        );
        return true;
      } else {
        return false;
      }
    });
  };

  return (
    <Typography>
      <Container component="main" maxWidth="xs">
        <Typography>
          Sinks:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.sinks === 0) {
                    setError(true);
                    setErrorMessage("You cannot have sink count less than 0");
                  } else {
                    setError(false);
                    handleDecrement("sinks") && handleChange("sinks");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.sinks}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("sinks") && handleChange("sinks");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Commodes:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.commodes === 0) {
                    setError(true);
                    setErrorMessage(
                      "You cannot have commode count less than 0"
                    );
                  } else {
                    setError(false);
                    handleDecrement("commodes") && handleChange("commodes");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.commodes}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("commodes") && handleChange("commodes");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Bidets:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.bidets === 0) {
                    setError(true);
                    setErrorMessage("You cannot have bidet count less than 0");
                  } else {
                    setError(false);
                    handleDecrement("bidets") && handleChange("bidets");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.bidets}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("bidets") && handleChange("bidets");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Bathtubs:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.bathtubs === 0) {
                    setError(true);
                    setErrorMessage(
                      "You cannot have bathtub count less than 0"
                    );
                  } else {
                    setError(false);
                    handleDecrement("bathtubs") && handleChange("bathtubs");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.bathtubs}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("bathtubs") && handleChange("bathtubs");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Showers:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.showers === 0) {
                    setError(true);
                    setErrorMessage("You cannot have shower count less than 0");
                  } else {
                    setError(false);
                    handleDecrement("showers") && handleChange("showers");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.showers}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("showers") && handleChange("showers");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        <Typography>
          Tub/Showers:
          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  if (values.tub_showers === 0) {
                    setError(true);
                    setErrorMessage(
                      "You cannot have tub shower count less than 0"
                    );
                  } else {
                    setError(false);
                    handleDecrement("tub_showers") &&
                      handleChange("tub_showers");
                  }
                }}
              >
                -
              </Button>
              <Button disabled>{values.tub_showers}</Button>
              <Button
                onClick={() => {
                  setError(false);
                  handleIncrement("tub_showers") && handleChange("tub_showers");
                }}
              >
                +
              </Button>
            </ButtonGroup>
          </FormControl>
        </Typography>

        {axiosResponse.is_primary_bathroom_present ? (
          <>
            <FormControlLabel
              disabled
              control={<Checkbox />}
              label="This bathroom is a primary bathroom"
            />
          </>
        ) : (
          <>
            <FormControlLabel
              onChange={handleChange("is_primary")}
              control={<Checkbox />}
              label="This bathroom is a primary bathroom"
            />
          </>
        )}

        {isError ? <Alert severity="error">{errMessage}</Alert> : <></>}

        <FormControl fullWidth sx={{ m: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              if (validateInput() === true) {
                if (insertFull() === false) {
                  setError(true);
                  setErrorMessage(
                    "There was a problem in adding full bathroom!"
                  );
                }
              }
            }}
          >
            Add
          </Button>
        </FormControl>
      </Container>
    </Typography>
  );
}

export default FullBathroom;
