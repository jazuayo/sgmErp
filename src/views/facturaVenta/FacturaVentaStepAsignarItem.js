import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { itemGrupoTipo } from "../../util/types";

export default function FacturaVentaStepAsignarItem() {
  const {
    registro,
    setRegistro,
    items,
    listaInventarioPorItem,
    itemInventario,
    setItemInventario,
  } = useContext(GenerarContext);
  const { mensajeError } = useContext(AppContext);

  const handleOnChange = (event) => {
    if (registro.lote !== "Sin Lote") {
      if (event.target.id == "cantidadSeleccionada") {
        if (registro.cantidad < event.target.value) {
          mensajeError(
            registro.cantidad + " disponible del item: " + registro.itemDes
          );
          return;
        }

        if (registro.itemInvId == "") {
          mensajeError("Seleccione el lote");
          return;
        }
      }
    }
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  const handleOnChangeItem = (event, value) => {
    if (value !== null) {
      const itemGrupoTipoCod = value.itemGrupo.itemGrupoTipo.itemGrupoTipoCod;
      var lote = "";
      if (itemGrupoTipoCod === itemGrupoTipo.servicios) {
        lote = "Sin Lote";
      } else {
        listaInventarioPorItem(value.itemId);
      }
      var descrip = "";
      if (!value.permiteDetalle) {
        descrip = value.itemDes;
      }
      setRegistro({
        ...registro,
        itemDes: value.itemDes,
        itemId: value.itemId,
        descripcion: descrip,
        itemInvId: "",
        lote: lote,
        loteCod: "",
        cantidadSeleccionada: 0,
        // disponibleCant: 0,
        cantidad: 0.0,
        precioUnitario: value.precioVenta,
        descuentoValor: 0.0,
        totalSinImp: 0.0,
        fechaVenceItemInv: "",
        // permite modificaciones
        modificaPrecio: value.modificaPrecio,
        permiteDetalle: value.permiteDetalle,
      });
    }
  };

  const handleOnChangeItemInv = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        itemInvId: value.itemInvId,
        lote: value.lote,
        loteCod: value.lote,
        //disponibleCant: value.cantidad,
        cantidad: value.cantidad,
        fechaVenceItemInv: value.fechaVence,
      });
    }
  };
  React.useEffect(() => {
    setItemInventario([]);
  }, []);
  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="ASIGNAR DETALLE A LA FACTURA"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={3}>
                  <AutocompleteSgm
                    id="itemDes"
                    label="Items:"
                    options={items}
                    value={registro}
                    getOptionLabel={(option) => option.itemDes}
                    onChange={handleOnChangeItem}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="descripcion"
                    label="Descripcion:"
                    value={registro.descripcion}
                    disabled={!registro.permiteDetalle}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AutocompleteSgm
                    id="itemInv"
                    label="Lote :"
                    options={itemInventario}
                    value={registro}
                    /*value={{
                      itemInvId: registro.itemInvId,
                      lote: registro.lote,
                      cantidad: registro.disponibleCant,
                    }}*/
                    getOptionLabel={(option) =>
                      option.lote == ""
                        ? ""
                        : option.lote + " : " + option.cantidad
                    }
                    onChange={handleOnChangeItemInv}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="cantidadSeleccionada"
                    label="Cantidad:"
                    value={registro.cantidadSeleccionada}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="precioUnitario"
                    label="Precio unitario:"
                    value={registro.precioUnitario}
                    disabled={!registro.modificaPrecio}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="descuentoValor"
                    label="Descuento valor:"
                    value={registro.descuentoValor}
                    onChange={handleOnChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
