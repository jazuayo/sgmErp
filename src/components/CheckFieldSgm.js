import { Grid, TextField, Checkbox, FormControlLabel } from "@mui/material";

export default function CheckFieldSgm(props) {
  const { id, label, value, onChange, disabled, onPaste } = props;

  return (
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name={id}
            onChange={onChange}
            onPaste={onPaste}
            checked={value}
            color="success"
          />
        }
        label={label}
        disabled={disabled}
      />
    </Grid>
  );
}
