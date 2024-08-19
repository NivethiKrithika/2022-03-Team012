import { Typography, Container, Link, FormControl, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function _() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }
  return (
    <Typography>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h3">
          View Reports
        </Typography>
        <Typography component="subtitle">
          Please choose what report you would like to view:
          <ul>
            <li><Link href="/reports/top25">Top 25 Popular Manufacturers</Link></li>
            <li><Link href="/reports/search">Manufacturer/Model Search</Link></li>
            <li><Link href="/reports/avgTV">Average TV Display Size by State</Link></li>
            <li><Link href="/reports/extraFridgeFreezer">Extra Fridge or Freezer</Link></li>
            <li><Link href="/reports/laundryCenter">Laundry Center Report</Link></li>
            <li><Link href="/reports/bathroomStats">Bathroom Statistics</Link></li>
            <li><Link href="/reports/householdAvg">Household Averages by Radius</Link></li>
          </ul>
        </Typography>
      </Container>
      <Container component="main" maxWidth="xs">
        
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
    </Typography>
  );
}

export default _;
