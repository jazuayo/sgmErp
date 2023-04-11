import React, { useContext } from "react";
import { useState } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";
import { categorias } from "../../util/types";
import ClientJSON from "../../util/ClientJSON";
import endpoints from "../../util/Parametros";

export default function NotaCreditoStepListarDetalles() {
  const {
    registroDependiente,
    setRegistroDependiente,
    registro,
    parametroPrecioCalcula,
    setItemInventario,
  } = useContext(GenerarContext);
  const { setCargando, mensajeError, mensajeInfo } = useContext(AppContext);
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
    if (
      selectedRow.loteCod === "Sin Lote" &&
      registro.categoriaCod == categorias.facturaVenta
    ) {
      const arrayAux = [];
      setItemInventario(arrayAux);
      setRegistroDependiente({
        ...registroDependiente,
        facturaDetalleId: selectedRow.facturaDetalleId,
        itemDes: selectedRow.item.itemDes,
        itemId: selectedRow.item.itemId,
        descripcion: selectedRow.descripcion,
        cantidad: selectedRow.cantidad,
        precioUnitario: selectedRow.precioUnitario,
        descuentoValor: selectedRow.descuentoValor,

        totalSinImp: selectedRow.totalSinImp,

        itemInvId: selectedRow.lote,
        lote: "Sin Lote",
        tableDataId: selectedRow.tableData.id,
        //impuestos del item
        impuestosItem: selectedRow.item.itemGrupo.impuestos,
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
          const obj = costos(
            selectedRow.precioUnitario,
            selectedRow.item.itemGrupo.impuestos
          );
          setRegistroDependiente({
            ...registroDependiente,
            facturaDetalleId: selectedRow.facturaDetalleId,
            itemDes: selectedRow.item.itemDes,
            itemId: selectedRow.item.itemId,
            descripcion: selectedRow.descripcion,
            cantidadSeleccionada: selectedRow.cantidad,
            precioUnitario: selectedRow.precioUnitario,
            descuentoValor: selectedRow.descuentoValor,
            //compra
            pvp: obj.pvp,
            total: obj.total,
            costoArtesano: obj.costoArtesano,
            //
            totalSinImp: selectedRow.totalSinImp,
            fechaVence: new Date(selectedRow.fechaVence)
              .toISOString()
              .split("T")[0],
            itemInvId: selectedRow.lote,
            lote:
              registro.categoriaCod == categorias.facturaVenta
                ? respuesta.datos.lote
                : selectedRow.lote,
            modificaPrecio: selectedRow.item.modificaPrecio,
            permiteDetalle: selectedRow.item.permiteDetalle,
            tableDataId: selectedRow.tableData.id,
            //impuestos del item
            impuestosItem: selectedRow.item.itemGrupo.impuestos,
          });
        } else {
          mensajeError("Error al obtener datos del inventario.");
        }
      })();
    }
  };
  const [columnas, setColumnas] = useState([]);
  React.useEffect(() => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        setColumnas([
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
        ]);

        break;
      case categorias.facturaCompras:
        setColumnas([
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
        ]);

        break;
      default:
        break;
    }
  }, [registro]);

  return (
    <div>
      <TableSgm
        title="DETALLES"
        columns={columnas}
        data={registroDependiente.detalles}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
