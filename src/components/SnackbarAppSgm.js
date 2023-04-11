import * as React from "react";
import { Snackbar } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarAppSgm() {
  const { mensaje } = useContext(AppContext);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const estado = mensaje.texto !== "" ? true : false;
    setOpen(estado);
    setTimeout(() => {
      setOpen(false);
    }, "2500");
  }, [mensaje]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert severity={mensaje.tipo} sx={{ width: "100%" }}>
        {mensaje.texto}
      </Alert>
    </Snackbar>
  );
}
