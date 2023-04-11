import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import DateFieldSgm from "../../components/DateFieldSgm";
import NotaCreditoStepListarDetalles from "./NotaCreditoStepListarDetalles";
import NotaCreditoStepImpuestoNota from "./NotaCreditoStepImpuestoNota";
import NotaCreditoStepAsignarDetalle from "./NotaCreditoStepAsignarDetalle";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { categorias } from "../../util/types";
import { useState } from "react";

export default function NotaCreditoStepDetalleNCredito() {
  const {
    documentos,
    registro,
    formasPago,
    registroDependiente,
    setRegistroDependiente,
  } = useContext(GenerarContext);

  const handleOnChange = (event) => {
    setRegistroDependiente({
      ...registroDependiente,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeDocumento = (event, value) => {
    if (value !== null) {
      var ceAux = 1;
      if (value.ce !== null) {
        ceAux = value.ce;
      }
      setRegistroDependiente({
        ...registroDependiente,
        documentoCod: value.documentoCod,
        documentoDes: value.documentoDes,
        documentoNumero: value.secuencia,
        ce: ceAux,
      });
    }
  };
  const handleOnChangeFormaPago = (event, value) => {
    if (value !== null) {
      setRegistroDependiente({
        ...registroDependiente,
        formaPagoCod: value.formaPagoCod,
        formaPagoDes: value.formaPagoDes,
      });
    }
  };
  const [tipoNota, setTipoNota] = useState("");
  React.useEffect(() => {
    var categoria = "";
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        categoria = categorias.notaCreditoVentas;
        setTipoNota("EN VENTAS");
        break;
      case categorias.facturaCompras:
        setTipoNota("EN COMPRAS");
        categoria = categorias.notaCreditoCompras;
        break;
      default:
        break;
    } /*
    setRegistroDependiente({
      ...registroDependiente,
      facturaModifica: registro.documentoId,
      organizacionCod: codigoOrganizacion,
      organizacionDes: organizacion,
      personaId: registro.personaId,
      nombre: registro.nombre,
      documentoTipoCod: registro.documentoTipoCod,
      documentoTipoDes: registro.documentoTipoDes,
      usuario: registro.usuario,
      //categoria
      categoriaCod: categoria,

      siglasProveedor: registro.siglasProveedor,
      llevaIva: registro.llevaIva,
    });*/
  }, [registro]);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title={"DETALLES DE NOTA DE CREDITO " + tipoNota}
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="organizacionDes"
                    label="Organización:"
                    value={registroDependiente.organizacionDes}
                    disabled={true}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="documentoId"
                    label="id:"
                    value={registroDependiente.documentoId}
                    disabled={true}
                    onChange={handleOnChange}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="estadoDes"
                    label="Estado:"
                    value={registroDependiente.estadoDes}
                    disabled={true}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextFieldSgm
                    id="autorizacionNumero"
                    label="Autorizacion:"
                    value={registroDependiente.autorizacionNumero}
                    onChange={handleOnChange}
                    disabled={registroDependiente.ce}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="documentoNumero"
                    label="Numero:"
                    value={registroDependiente.documentoNumero}
                    onChange={handleOnChange}
                    disabled={registroDependiente.ce}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="nombre"
                    label="Persona:"
                    value={registroDependiente.nombre}
                    disabled={true}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  {" "}
                  <AutocompleteSgm
                    id="documentoDes"
                    label="Documento:"
                    options={documentos}
                    value={registroDependiente}
                    getOptionLabel={(option) => option.documentoDes}
                    onChange={handleOnChangeDocumento}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="documentoTipoDes"
                    label="Documento Tipo:"
                    value={registroDependiente.documentoTipoDes}
                    disabled={true}
                    onChange={handleOnChange}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <DateFieldSgm
                    id="autorizacionFecha"
                    label="Fecha Aut:"
                    value={registroDependiente.autorizacionFecha}
                    onChange={handleOnChange}
                    disabled={registroDependiente.ce}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DateFieldSgm
                    id="fechaEmite"
                    label="Fecha Emite:"
                    value={registroDependiente.fechaEmite}
                    onChange={handleOnChange}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="plazoDias"
                    label="Dias de plazo:"
                    value={registroDependiente.plazoDias}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  {" "}
                  <AutocompleteSgm
                    id="formPago"
                    label="Forma pago:"
                    options={formasPago}
                    value={registroDependiente}
                    getOptionLabel={(option) => option.formaPagoDes}
                    onChange={handleOnChangeFormaPago}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <NotaCreditoStepAsignarDetalle />
        </Grid>
        <Grid item xs={12} md={8}>
          <NotaCreditoStepListarDetalles />
        </Grid>
        <Grid item xs={12} md={4}>
          <NotaCreditoStepImpuestoNota />
        </Grid>
      </Grid>
    </div>
  );
}
