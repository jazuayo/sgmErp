import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

export default function ImpuestoStepCategoria() {
  const { registro, setRegistro } = useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      ...registro,
      impuestoCategoriaId: selectedRow.impuestoCategoriaId,

      categoriaDes: selectedRow.categoriaDes,
      categoriaCod: selectedRow.categoriaCod,

      cuentaDes: selectedRow.cuentaDes,
      cuentaCod: selectedRow.cuentaCod,

      organizacionDes: selectedRow.organizacionDes,
      organizacionCod: selectedRow.organizacionCod,

      tableDataId: selectedRow.tableData.id,
    });
  };
  return (
    <Grid item xs={12} md={12}>
      <TableSgm
        title="LISTADO DE CATEGORIAS"
        columns={[
          {
            title: "Categoria",
            field: "categoriaDes",
            editable: "never",
          },
          {
            title: "Cuenta Código",
            field: "cuentaCod",
            editable: "never",
          },
          {
            title: "Cuenta Descripción",
            field: "cuentaDes",
            editable: "never",
          },
          {
            title: "Organización",
            field: "organizacionDes",
            editable: "never",
          },
        ]}
        data={registro.categorias}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </Grid>
  );
}
