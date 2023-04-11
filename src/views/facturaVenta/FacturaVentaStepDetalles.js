import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
//componentes
import FacturaVentaStepCabezera from "./FacturaVentaStepCabezera";
import FacturaVentaStepAsignarItem from "./FacturaVentaStepAsignarItem";
import FacturaVentaStepListaItems from "./FacturaVentaStepListaItems";
import FacturaVentaStepImpuestos from "./FacturaVentaStepImpuestos";
export default function FacturaVentaStepDetalles() {
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
        <FacturaVentaStepCabezera />
      </Grid>
      <Grid item xs={12} md={12}>
        <FacturaVentaStepAsignarItem />
      </Grid>
      <Grid item xs={12} md={9}>
        <FacturaVentaStepListaItems />
      </Grid>
      <Grid item xs={12} md={3}>
        <FacturaVentaStepImpuestos />
      </Grid>
    </Grid>
  );
}
