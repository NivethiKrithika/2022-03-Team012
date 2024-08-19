import { Typography, Container, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import FullBathroom from './full_bathroom';
import HalfBathroom from './half_bathroom';
import ProgressBar from "../../../resources/progressBar";

function _() {

  const [values, setValues] = useState("Full");
  const is_primary = false;
  // const { email } = useParams();

  const handleChange = (event, value) => {
    setValues(value);
  };

  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={1} />
      <br></br>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Add Bathroom
        </Typography>
        <Typography component="subtitle" variant="subtitle">
          Plaese provide the details regarding the bathroom.
          <br />
          <br />
          Bathroom type:
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={values}>
              <Box sx={{
                borderBottom: 1,
                borderColor: "divider"
              }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Half" value="Half" />
                  <Tab label="Full" value="Full" />
                </TabList>
              </Box>
              <TabPanel value="Half">{HalfBathroom(is_primary)}</TabPanel>
              <TabPanel value="Full">{FullBathroom(is_primary)}</TabPanel>
            </TabContext>
          </Box>
        </Typography>
      </Container>
    </Typography>
  );
}

export default _;
