import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";
import DateFieldSgm from "../../components/DateFieldSgm";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { itemGrupoTipo } from "../../util/types";

export default function FacturaCompraStepAsignarItem() {
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  const { registro, setRegistro, items, impuesto, parametroPrecioCalcula } =
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
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  const handleOnChangePVP = (event) => {
    // Si la persona registra o no el valor de iva
    var total = event.target.value;
    if (registro.llevaIva === true) {
      total = calculoIvaTotal(event.target.value, registro.impuestosItem);
    }

    setRegistro({
      ...registro,
      pvp: event.target.value,
      total: total,
    });
  };
  const handleOnChangeItem = (event, value) => {
    if (value !== null) {
      const itemGrupoTipoCod = value.itemGrupo.itemGrupoTipo.itemGrupoTipoCod;
      //const impuestos = value.itemGrupo.impuestos;
      var lote = "";
      if (itemGrupoTipoCod === itemGrupoTipo.servicios) {
        lote = "Sin Lote";
      } else {
        const siglasItem = value.siglasItem;
        const itemGrupoCod = value.itemGrupo.itemGrupoCod;
        const siglasProveedor = registro.siglasProveedor;
        lote = itemGrupoCod + siglasProveedor + siglasItem;
        if (siglasProveedor === "") {
          setRegistro({
            ...registro,
            itemDes: "",
            lote: "",
          });
          mensajeError("Seleccione proveedor valido.");
          return;
        }
      }
      const obl = costos(value.costoCompra, value.itemGrupo.impuestos);
      var descrip = "";
      if (!value.permiteDetalle) {
        descrip = value.itemDes;
      }
      setRegistro({
        ...registro,
        itemDes: value.itemDes,
        itemId: value.itemId,
        descripcion: descrip,
        lote: lote,
        modificaPrecio: value.modificaPrecio,
        permiteDetalle: value.permiteDetalle,
        impuestosItem: value.itemGrupo.impuestos,
        //valores
        costoArtesano: obl.costoArtesano,
        pvp: obl.pvp,
        total: obl.total,
      });
    }
  };

  const handleOnChangeCostoArtesano = (event, value) => {
    const obj = costos(event.target.value, registro.impuestosItem);
    setRegistro({
      ...registro,
      costoArtesano: obj.costoArtesano,
      pvp: obj.pvp,
      total: obj.total,
    });
  };

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
                    onChange={handleOnChange}
                    disabled={!registro.permiteDetalle}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="cantidad"
                    label="Cantidad:"
                    value={registro.cantidad}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextFieldSgm
                    id="lote"
                    label="Lote:"
                    value={registro.lote}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <DateFieldSgm
                    id="fechaVence"
                    label="Fecha Vence:"
                    value={registro.fechaVence}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="costoArtesano"
                    label="Costo :"
                    value={registro.costoArtesano}
                    onChange={handleOnChangeCostoArtesano}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="pvp"
                    label="PVP:"
                    value={registro.pvp}
                    onChange={handleOnChangePVP}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="totalAyni"
                    label="PVP + IVA:"
                    value={registro.total}
                    onChange={handleOnChange}
                    disabled={true}
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
