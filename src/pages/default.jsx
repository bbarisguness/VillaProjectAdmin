import Grid from '@mui/material/Grid';
import NewReservation from 'sections/dashboard/default/NewReservation';
import ProjectRelease from 'sections/dashboard/default/ProjectRelease';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function Default() {
  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">
      <Grid item xs={6} md={6}>
        <NewReservation />
      </Grid>
      <Grid item xs={6} sm={6} >
        <ProjectRelease />
      </Grid>
    </Grid>
  );
}
