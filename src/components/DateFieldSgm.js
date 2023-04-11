import { Grid, TextField } from "@mui/material";

export default function DateFieldSgm(props) {
  const { id, label, value, onChange, disabled, onPaste } = props;

  return (
    <Grid item xs={12}>
      <TextField
        type="date"
        InputLabelProps={{ shrink: true, required: true }}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        disabled={disabled}
        variant="standard"
        fullWidth
        inputProps={{
          autoComplete: "off",
        }}
      />
    </Grid>
  );
}
