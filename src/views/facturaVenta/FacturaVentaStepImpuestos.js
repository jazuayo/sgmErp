import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
export default function FacturaVentaStepImpuestos() {
  const { registro } = useContext(GenerarContext);
  return (
    <div>
      <TableSgm
        title="IMPUESTOS"
        columns={[
          {
            title: "Detalle",
            field: "impuesto.impuestoDes",
            editable: "never",
            width: "3%",
          },
          {
            title: "Base",
            field: "baseImponible",
            editable: "never",
          },
          {
            title: "Valor",
            field: "impuestoValor",
            editable: "never",
            render: (rowData) => rowData.impuestoValor.toFixed(2),
          },
        ]}
        search={false}
        data={registro.impuestos}
      />
    </div>
  );
}
