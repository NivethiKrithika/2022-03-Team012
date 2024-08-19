import { Typography, Container, Link } from '@mui/material';
import { useEffect } from 'react';

function _() {
  useEffect(() => {
    fetch('http://127.0.0.1:5000/setup')
      .then(response => {
       
      });
  }, []);

  return (
    <Typography>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h3">
          Welcome to Hemkraft!
        </Typography>
        <Typography component="subtitle">
          Please choose what you would like to do:
          <ul>
            <li><Link href="/insert/email">Enter my household info</Link></li>
            <li><Link href="/reports/">View reports/query data</Link></li>
          </ul>
        </Typography>
      </Container>
    </Typography>
  );
}

export default _;
