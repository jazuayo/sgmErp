import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import DateFieldSgm from "../../components/DateFieldSgm";
import { categorias, itemGrupoTipo } from "../../util/types";

export default function NotaCreditoStepAsignarDetalle() {
  const {
    setRegistroDependiente,
    registroDependiente,
    items,
    registro,
    itemInventario,
    setItemInventario,
    parametroPrecioCalcula,
    listaInventarioPorItem,
  } = useContext(GenerarContext);

  const handleOnChangeCostoArtesano = (event, value) => {
    const obj = costos(event.target.value, registroDependiente.impuestosItem);
    setRegistroDependiente({
      ...registroDependiente,
      costoArtesano: obj.costoArtesano,
      pvp: obj.pvp,
      total: obj.total,
    });
  };
  const handleOnChangePVP = (event) => {
    // Si la persona registra o no el valor de iva
    var total = event.target.value;
    if (registroDependiente.llevaIva === true) {
      total = calculoIvaTotal(
        event.target.value,
        registroDependiente.impuestosItem
      );
    }

    setRegistroDependiente({
      ...registroDependiente,
      pvp: event.target.value,
      total: total,
    });
  };

  const costos = (costoArtesano, impuestosItem) => {
    var auxPvp = costoArtesano;
    parametroPrecioCalcula.forEach((item) => {
      auxPvp = (auxPvp / item.valorNum).toFixed(2);
    });
    var total = 0.0;
    // Si la persona registra o no el valor de iva
    if (registroDependiente.llevaIva === true) {
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

  const handleOnChange = (event) => {
    setRegistroDependiente({
      ...registroDependiente,
      [event.target.id]: event.target.value,
    });
  };
  const handleOnChangeItem = (event, value) => {
    if (value !== null) {
      var valorPrecioUnitario = 0.0;
      const itemGrupoTipoCod = value.itemGrupo.itemGrupoTipo.itemGrupoTipoCod;
      var lote = "";
      switch (registro.categoriaCod) {
        case categorias.facturaVenta:
          valorPrecioUnitario = value.precioVenta;
          if (itemGrupoTipoCod === itemGrupoTipo.servicios) {
            lote = "Sin Lote";
          } else {
            listaInventarioPorItem(value.itemId);
          }
          break;
        case categorias.facturaCompras:
          valorPrecioUnitario = value.costoCompra;
          if (itemGrupoTipoCod === itemGrupoTipo.servicios) {
            lote = "Sin Lote";
          } else {
            const siglasItem = value.siglasItem;
            const itemGrupoCod = value.itemGrupo.itemGrupoCod;
            const siglasProveedor = registroDependiente.siglasProveedor;
            lote = itemGrupoCod + siglasProveedor + siglasItem;
          }
          break;
        default:
          break;
      }
      const obl = costos(value.costoCompra, value.itemGrupo.impuestos);
      var descrip = "";
      if (!value.permiteDetalle) {
        descrip = value.itemDes;
      }
      setRegistroDependiente({
        ...registroDependiente,
        itemDes: value.itemDes,
        itemId: value.itemId,
        descripcion: descrip,
        precioUnitario: valorPrecioUnitario,
        //venta
        itemInvId: "",
        lote: lote,
        loteCod: "",
        cantidadSeleccionada: 0,
        cantidad: 0.0,
        descuentoValor: 0.0,
        totalSinImp: 0.0,
        fechaVenceItemInv: "",
        //compra
        costoArtesano: obl.costoArtesano,
        pvp: obl.pvp,
        total: obl.total,
        impuestosItem: value.itemGrupo.impuestos,
        // permite modificaciones
        modificaPrecio: value.modificaPrecio,
        permiteDetalle: value.permiteDetalle,
      });
    }
  };
  const handleOnChangeItemInv = (event, value) => {
    if (value !== null) {
      setRegistroDependiente({
        ...registroDependiente,
        itemInvId: value.itemInvId,
        lote: value.lote,
        loteCod: value.lote,
        cantidad: value.cantidad,
        fechaVenceItemInv: value.fechaVence,
      });
    }
  };
  const loteTipoComponente = () => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        return (
          <AutocompleteSgm
            id="itemInv"
            label="Lote :"
            options={itemInventario}
            value={registroDependiente}
            getOptionLabel={(option) =>
              option.lote == "" ? "" : option.lote + " : " + option.cantidad
            }
            onChange={handleOnChangeItemInv}
          />
        );
      case categorias.facturaCompras:
        return (
          <TextFieldSgm
            id="lote"
            label="Lote:"
            value={registroDependiente.lote}
            onChange={handleOnChange}
            disabled={true}
          />
        );
      default:
        break;
    }
  };
  const componenteValoresPrecios = () => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        return (
          <CardContent>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              <Grid item md={6} xs={12}>
                <TextFieldSgm
                  id="precioUnitario"
                  label="Precio unitario:"
                  value={registroDependiente.precioUnitario}
                  disabled={!registroDependiente.modificaPrecio}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextFieldSgm
                  id="descuentoValor"
                  label="Descuento valor:"
                  value={registroDependiente.descuentoValor}
                  onChange={handleOnChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        );
      case categorias.facturaCompras:
        return (
          <CardContent>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              <Grid item md={3} xs={12}>
                <DateFieldSgm
                  id="fechaVence"
                  label="Fecha Vence:"
                  value={registroDependiente.fechaVence}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextFieldSgm
                  id="costoArtesano"
                  label="Costo :"
                  value={registroDependiente.costoArtesano}
                  onChange={handleOnChangeCostoArtesano}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextFieldSgm
                  id="pvp"
                  label="PVP:"
                  value={registroDependiente.pvp}
                  onChange={handleOnChangePVP}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextFieldSgm
                  id="totalAyni"
                  label="PVP + IVA:"
                  value={registroDependiente.total}
                  onChange={handleOnChange}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </CardContent>
        );
      default:
        break;
    }
  };
  React.useEffect(() => {
    setItemInventario([]);
  }, []);

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      <Grid item xs={12} md={12}>
        <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
          <CardHeader
            titleTypographyProps={styleCardHeaderTitle}
            title="ASIGNAR DETALLE A NOTA DE CREDITO"
            style={styleCardHeader}
          />
          <CardContent>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              <Grid item md={3} xs={12}>
                <AutocompleteSgm
                  id="itemDes"
                  label="Items:"
                  options={items}
                  value={registroDependiente}
                  getOptionLabel={(option) => option.itemDes}
                  onChange={handleOnChangeItem}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextFieldSgm
                  id="descripcion"
                  label="Descripcion:"
                  value={registroDependiente.descripcion}
                  disabled={!registroDependiente.permiteDetalle}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                {loteTipoComponente()}
              </Grid>
              <Grid item md={3} xs={12}>
                <TextFieldSgm
                  id="cantidadSeleccionada"
                  label="Cantidad:"
                  value={registroDependiente.cantidadSeleccionada}
                  onChange={handleOnChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          {componenteValoresPrecios()}
        </Card>
      </Grid>
    </Grid>
  );
}
