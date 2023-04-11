import { Grid } from "@mui/material";
import { Fragment } from "react";

export default function LabelHeadSgm(props) {
  const { label } = props;

  return (
    <Fragment>
      <Grid item xs={12}>
        <h3>{label}</h3>
      </Grid>
    </Fragment>
  );
}
