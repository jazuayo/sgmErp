import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { getUser } from "../../util/common/Common";
import { fechaCompleta } from "../../util/utils.js";

const applyStyles = makeStyles(() => ({
  contenedor: {
    flexGrow: 0,
    width: "170%",
    backgroundColor: "#FDFEFE !important",
  },
  texto: {
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#FDFEFE !important",
    border: "0px !important",
    boxShadow: "none !important",
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "bold !important",
    textAlign: "center",
    backgroundColor: "#FDFEFE !important",
    border: "0px !important",
    boxShadow: "none !important",
  },
}));

export default function ContainerUserInformation(props) {
  const { nombrePantalla } = props;
  var datosUsuario = {
    codigoUsuario: "",
    nombreUsuario: "",
    fechaActual: new Date(),
    codigoOrganizacion: "",
    organizacion: "",
  };
  if (getUser()) {
    datosUsuario = getUser();
  }

  const { nombreUsuario, fechaActual, organizacion } = datosUsuario;

  const classes = applyStyles();

  return (
    <div className={classes.contenedor}>
      <Grid container spacing={0}>
        <Grid item md={1}>
          <Paper className={classes.etiqueta}> Usuario:&nbsp;&nbsp; </Paper>
        </Grid>
        <Grid item md={2}>
          <Paper className={classes.texto}>{nombreUsuario}</Paper>
        </Grid>
        <Grid item md={1}>
          <Paper className={classes.etiqueta}>
            {" "}
            Organización:&nbsp;&nbsp;{" "}
          </Paper>
        </Grid>
        <Grid item md={2}>
          <Paper className={classes.texto}>{organizacion}</Paper>
        </Grid>
        <Grid item md={1}>
          <Paper className={classes.etiqueta}> Pantalla:&nbsp;&nbsp; </Paper>
        </Grid>
        <Grid item md={2}>
          <Paper className={classes.texto}>{nombrePantalla}</Paper>
        </Grid>
        <Grid item md={1}>
          <Paper className={classes.etiqueta}> Fecha:&nbsp;&nbsp; </Paper>
        </Grid>
        <Grid item md={2}>
          <Paper className={classes.texto}>{fechaCompleta(fechaActual)}</Paper>
        </Grid>
      </Grid>
    </div>
  );
}