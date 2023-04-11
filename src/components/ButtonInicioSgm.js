import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment } from "react";

export default function ButtonInicioSgm(props) {
  return (
    <Fragment>
      <Button
        className="botonInicioSgm"
        variant="contained"
        onClick={() => {
          window.location.reload();
        }}
      >
        INICIO
      </Button>
      <Box sx={{ m: 2 }} />
    </Fragment>
  );
}
