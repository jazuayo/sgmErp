import { Grid, TextField } from "@mui/material";

export default function TextFieldSgm(props) {
  const { id, label, value, onChange, disabled, onPaste, type } = props;

  return (
    <Grid item xs={12}>
      <TextField
        InputProps={{ style: { fontSize: 16 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        disabled={disabled}
        type={type}
        variant="standard"
        fullWidth
        inputProps={{
          autoComplete: "off",
        }}
      />
    </Grid>
  );
}
