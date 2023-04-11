import { Autocomplete, Grid, TextField } from "@mui/material";

export default function AutocompleteSgm(props) {
  const {
    id,
    label,
    options,
    getOptionLabel,
    value,
    onChange,
    disabled,
    hidden,
  } = props;

  return (
    <Grid item xs={12}>
      <Autocomplete
        openOnFocus
        id={id}
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        hidden={hidden}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="standard" />
        )}
      />
    </Grid>
  );
}
