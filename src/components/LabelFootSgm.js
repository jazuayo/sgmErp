import { Grid } from "@mui/material";
import { Fragment } from "react";

export default function LabelFootSgm(props) {
  const { label } = props;

  return (
    <Fragment>
      <Grid item xs={12}>
        <h5>{label}</h5>
      </Grid>
    </Fragment>
  );
}
