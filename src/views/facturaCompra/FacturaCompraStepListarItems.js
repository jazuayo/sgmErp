import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
export default function FacturaCompraStepListarItems() {
  const { registro, setRegistro, parametroPrecioCalcula } =
    useContext(GenerarContext);
  const calculoIvaTotal = (auxPvp, impuestosItem) => {
    var iva = 0.0;
    impuestosItem.forEach((imp) => {
      //obtener el IVA
      var valorImp = auxPvp * (imp.porcentaje / 100);
      iva = iva + valorImp;
    });
    var total = Number(auxPvp) + Number(iva);
    return Number(total).toFixed(2);
  };

  const costos = (costoArtesano, impuestosItem) => {
    var auxPvp = costoArtesano;
    parametroPrecioCalcula.forEach((item) => {
      auxPvp = (auxPvp / item.valorNum).toFixed(2);
    });
    var total = 0.0;
    // Si la persona registra o no el valor de iva
    if (registro.llevaIva === true) {
      total = calculoIvaTotal(auxPvp, impuestosItem);
    } else {
      total = auxPvp;
    }

    const obj = {
      costoArtesano: costoArtesano,
      pvp: auxPvp,
      total: total,
    };

    return obj;
  };
  const seleccionarRegistro = (selectedRow) => {
    const obj = costos(
      selectedRow.precioUnitario,
      selectedRow.item.itemGrupo.impuestos
    );
    setRegistro({
      ...registro,
      facturaDetalleId: selectedRow.facturaDetalleId,
      itemDes: selectedRow.item.itemDes,
      itemId: selectedRow.item.itemId,
      descripcion: selectedRow.descripcion,
      cantidad: selectedRow.cantidad,
      //costos
      pvp: obj.pvp,
      total: obj.total,
      costoArtesano: obj.costoArtesano,
      //precioVenta: selectedRow.precioUnitario,
      totalSinImp: selectedRow.totalSinImp,
      fechaVence: new Date(selectedRow.fechaVence).toISOString().split("T")[0],
      lote: selectedRow.lote,
      modificaPrecio: selectedRow.item.modificaPrecio,
      permiteDetalle: selectedRow.item.permiteDetalle,
      tableDataId: selectedRow.tableData.id,
      //impuestos del item
      impuestosItem: selectedRow.item.itemGrupo.impuestos,
    });
  };
  return (
    <div>
      <TableSgm
        title="DETALLES"
        columns={[
          {
            title: "Item",
            field: "item.itemDes",
            editable: "never",
            width: "1%",
          },
          {
            title: "Descripcion",
            field: "descripcion",
            editable: "never",
          },
          {
            title: "Cantidad",
            field: "cantidad",
            editable: "never",
          },
          {
            title: "Precio",
            field: "precioUnitario",
            editable: "never",
          },
          {
            title: "Lote",
            field: "lote",
            editable: "never",
          },
          {
            title: "Total sin impuesto",
            field: "totalSinImp",
            editable: "never",
          },
        ]}
        data={registro.detalles}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
