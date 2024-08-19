import { Typography, Container, Link } from '@mui/material';
import ProgressBar from "../../resources/progressBar";

function _() {
  return (
    <Typography>
      <br></br>
      <ProgressBar step_number={4} />
      <br></br>
      <Container component="main" maxWidth="sm">
        <Typography component="h1" variant="h4">
          Submission Complete
        </Typography>
        <Typography component="subtitle">
          <br />
          Thank you for providing your information to Hemkraft!
          <Typography>
            <br />
            <Link href="/">Return to main menu</Link>
          </Typography>
        </Typography>
      </Container>
    </Typography>
  );
}

export default _;
