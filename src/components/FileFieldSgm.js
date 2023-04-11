import { Grid, Input } from "@mui/material";

export default function FileFieldSgm(props) {
  const { id, label, value, onChange, disabled, onPaste } = props;

  return (
    <Grid item xs={12}>
      <h6
        style={{
          fontWeight: "normal",
          fontFamily: "arial",
          fontSize: 12,
          color: "#626567",
          margin: 0,
        }}
      >
        {label}
      </h6>
      <Input
        type="file"
        inputProps={{ style: { fontSize: 16 }, autoComplete: "off" }}
        id={id}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        disabled={disabled}
        fullWidth
        /*
        inputProps={{
          autoComplete: "off",
        }}*/
      />
    </Grid>
  );
}
