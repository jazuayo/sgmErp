import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
export default function FacturaVentaStepListaItems() {
  const { registro, setRegistro, setItemInventario } =
    useContext(GenerarContext);
  const { mensajeError, setCargando } = useContext(AppContext);

  const seleccionarRegistro = (selectedRow) => {
    if (selectedRow.loteCod === "Sin Lote") {
      const arrayAux = [];
      setItemInventario(arrayAux);
      setRegistro({
        ...registro,
        facturaDetalleId: selectedRow.facturaDetalleId,
        itemDes: selectedRow.item.itemDes,
        itemId: selectedRow.item.itemId,
        descripcion: selectedRow.descripcion,
        //cantidad: selectedRow.cantidad,
        cantidadSeleccionada: selectedRow.cantidad,
        precioUnitario: Number(selectedRow.precioUnitario).toFixed(2),
        descuentoValor: Number(selectedRow.descuentoValor).toFixed(2),
        totalSinImp: Number(selectedRow.totalSinImp).toFixed(2),
        //
        lote: "Sin Lote",
        itemInvId: selectedRow.lote,
        tableDataId: selectedRow.tableData.id,
      });
    } else {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/itemInventario/inventario/" + selectedRow.lote,
          null,
          "GET"
        );
        setCargando(false);
        if (!respuesta.error) {
          const arrayAux = [];
          arrayAux.push(respuesta.datos);
          setItemInventario(arrayAux);
          setRegistro({
            ...registro,
            facturaDetalleId: selectedRow.facturaDetalleId,
            itemDes: selectedRow.item.itemDes,
            itemId: selectedRow.item.itemId,
            descripcion: selectedRow.descripcion,
            //cantidad: selectedRow.cantidad,
            cantidadSeleccionada: selectedRow.cantidad,
            precioUnitario: Number(selectedRow.precioUnitario).toFixed(2),
            descuentoValor: Number(selectedRow.descuentoValor).toFixed(2),
            totalSinImp: Number(selectedRow.totalSinImp).toFixed(2),
            //
            lote: respuesta.datos.lote,
            itemInvId: selectedRow.lote,
            tableDataId: selectedRow.tableData.id,
          });
        } else {
          mensajeError("Error al obtener datos del inventario.");
        }
      })();
    }
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
            title: "Lote",
            field: "loteCod",
            editable: "never",
          },
          {
            title: "Precio Unitario",
            field: "precioUnitario",
            editable: "never",
          },
          {
            title: "Descuento Valor",
            field: "descuentoValor",
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
