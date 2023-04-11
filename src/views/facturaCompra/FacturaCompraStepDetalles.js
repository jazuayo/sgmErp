import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
//componentes
import FacturaCompraStepCabezera from "./FacturaCompraStepCabezera";
import FacturaCompraStepAsignarItem from "./FacturaCompraStepAsignarItem";
import FacturaCompraStepListarItems from "./FacturaCompraStepListarItems";
import FacturaCompraStepImpuestos from "./FacturaCompraStepImpuestos";

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
        <FacturaCompraStepCabezera />
      </Grid>
      <Grid item xs={12} md={12}>
        <FacturaCompraStepAsignarItem />
      </Grid>
      <Grid item xs={12} md={9}>
        <FacturaCompraStepListarItems />
      </Grid>
      <Grid item xs={12} md={3}>
        <FacturaCompraStepImpuestos />
      </Grid>
    </Grid>
  );
}
