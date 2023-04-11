import { Grid } from "@mui/material";
import { Fragment } from "react";
import Typography from '@mui/material/Typography';
export default function LabelValueSgm(props) {
  const { label, value } = props;

  return (
    <Fragment>
      <Grid item xs={4}>
        <h4>{label}</h4>
      </Grid>
      <Grid item xs={8}>
      <Typography>{value}</Typography>
      </Grid>
    </Fragment>
  );
}
