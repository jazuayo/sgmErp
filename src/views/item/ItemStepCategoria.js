import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

export default function ItemStepCategoria() {
  const { registro, setRegistro } = useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      ...registro,
      itemCategoriaId: selectedRow.itemCategoriaId,
      categoriaCod: selectedRow.categoriaCod,
      categoriaDes: selectedRow.categoriaDes,
      cuentaCod: selectedRow.cuentaCod,
      cuentaNum: selectedRow.cuentaNum,
      cuentaDes: selectedRow.cuentaDes,
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
