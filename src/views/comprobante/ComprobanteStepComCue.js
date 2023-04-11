import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

export default function ComprobanteStepComCue() {
  const { registro, setRegistro } = useContext(GenerarContext);

  const seleccionarRegistro = (selectedRow) => {
    if (selectedRow.cuenta.cuentaDes !== "") {
      setRegistro({
        ...registro,
        idReg: selectedRow.idReg,
        cuentaCod: selectedRow.cuenta.cuentaCod,
        cuentaDes: selectedRow.cuenta.cuentaDes,
        debito: selectedRow.debito,
        credito: selectedRow.credito,
        concepto: selectedRow.concepto,
        tableDataId: selectedRow.tableData.id,
      });
    }
  };

  return (
    <Grid item xs={12} md={12}>
      <TableSgm
        title="LISTADO DE CUENTAS"
        columns={[
          {
            title: "Cuenta Codigo",
            field: "cuenta.cuentaCod",
            editable: "never",
            width: "1%",
          },
          {
            title: "Cuenta Descripcion",
            field: "cuenta.cuentaDes",
            editable: "never",
          },
          {
            title: "Debito",
            field: "debito",
            editable: "never",
          },
          {
            title: "Credito",
            field: "credito",
            editable: "never",
          },
          {
            title: "Concepto",
            field: "concepto",
            editable: "never",
          },
        ]}
        data={registro.detalles}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </Grid>
  );
}
