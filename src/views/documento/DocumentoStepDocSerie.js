import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

export default function DocumentoStepDocSerie() {
  const { registro, setRegistro } = useContext(GenerarContext);

  const seleccionarRegistro = (selectedRow) => {
    console.log(selectedRow);
    setRegistro({
      ...registro,
      docSerieId: selectedRow.docSerieId,

      fechaEmision: new Date(selectedRow.fechaEmision)
        .toISOString()
        .split("T")[0],

      secuencialDesde: selectedRow.secuencialDesde,
      secuencialHasta: selectedRow.secuencialHasta,
      autorizacion: selectedRow.autorizacion,

      fechaCaduca: new Date(selectedRow.fechaCaduca)
        .toISOString()
        .split("T")[0],

      tableDataId: selectedRow.tableData.id,
    });
  };

  return (
    <div>
      <TableSgm
        title="LISTADO DE SERIES"
        columns={[
          {
            title: "Fecha Emision",
            field: "fechaEmision",
            editable: "never",
            render: (rowData) =>
              new Date(rowData.fechaEmision).toISOString().split("T")[0],
          },
          {
            title: "Secuencial Desde",
            field: "secuencialDesde",
            editable: "never",
          },
          {
            title: "Secuencial Hasta",
            field: "secuencialHasta",
            editable: "never",
          },
          {
            title: "Autorizacion",
            field: "autorizacion",
            editable: "never",
          },
          {
            title: "Fecha Caduca",
            field: "fechaCaduca",
            editable: "never",
            render: (rowData) =>
              new Date(rowData.fechaCaduca).toISOString().split("T")[0],
          },
        ]}
        data={registro.series}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
