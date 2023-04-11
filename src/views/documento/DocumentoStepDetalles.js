import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
//componentes
import DocumentoStepDetalle from "./DocumentoStepDetalle";
import DocumentoStepDocSerie from "./DocumentoStepDocSerie";
import DocumentoStepAsignarSerie from "./DocumentoStepAsignarSerie";
export default function FacturaCompraStepDetalles() {
  const { registro, setRegistro } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion, codigoUsuario } = getUser();

  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionDes: organizacion,
      organizacionCod: codigoOrganizacion,
      usuario: codigoUsuario,
    });
  }, []);

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      <Grid item xs={12} md={12}>
        <DocumentoStepDetalle />
      </Grid>
      <Grid item xs={12} md={12}>
        <DocumentoStepAsignarSerie />
      </Grid>
      <Grid item xs={12} md={12}>
        <DocumentoStepDocSerie />
      </Grid>
    </Grid>
  );
}
