import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

export default function RetencionStepRetDet() {
  const { registroDependiente, setRegistroDependiente } =
    useContext(GenerarContext);

  const seleccionarRegistro = (selectedRow) => {
    setRegistroDependiente({
      ...registroDependiente,
      retencionDetalleId: selectedRow.retencionDetalleId,
      //retencionId: selectedRow.retencionId,
      facturaId: selectedRow.factura.documentoId,
      facturaDes: selectedRow.factura.documentoNumero,
      impuestoCod: selectedRow.impuesto.impuestoCod,
      impuestoDes: selectedRow.impuesto.impuestoDes,
      baseImponible: selectedRow.baseImponible,
      valorRetenido: selectedRow.valorRetenido,
      documentoNumeroFact: selectedRow.factura.documentoNumero,
      nombrePersona: selectedRow.factura.persona.nombre,
    });
  };

  return (
    <Grid item xs={12} md={12}>
      <TableSgm
        title="RETENCION DETALLE"
        columns={[
          {
            title: "Documento",
            field: "factura.documentoNumero",
            editable: "never",
          },
          {
            title: "Persona",
            field: "factura.persona.nombre",
            editable: "never",
          },
          {
            title: "Retencion",
            field: "impuesto.impuestoDes",
            editable: "never",
          },
          {
            title: "Base",
            field: "baseImponible",
            editable: "never",
          },
          {
            title: "Valor Retenido",
            field: "valorRetenido",
            editable: "never",
          },
        ]}
        data={registroDependiente.detalles}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </Grid>
  );
}
