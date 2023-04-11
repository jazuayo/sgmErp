import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import DateFieldSgm from "../../components/DateFieldSgm";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function FacturaCompraStepCabezera() {
  const {
    documentoTipos,
    documentos,
    personas,
    registro,
    setRegistro,
    formasPago,
  } = useContext(GenerarContext);
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  const handleOnChangePersona = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        personaId: value.personaId,
        nombre: value.nombre,
        siglasProveedor: value.siglasProveedor,
        llevaIva: value.personaTipo.ivaCompra,
      });
    }
  };
  const handleOnChangeDocumento = (event, value) => {
    if (value !== null) {
      var ceAux = 0;
      if (value.ce !== null) {
        ceAux = value.ce;
      }

      setRegistro({
        ...registro,
        documentoCod: value.documentoCod,
        documentoDes: value.documentoDes,
        ce: ceAux,
        documentoNumero: value.secuencia,
        autorizacionFecha: !ceAux ? "" : new Date().toISOString().split("T")[0],
      });
    }
  };
  const handleOnChangeDocumentoTipo = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        documentoTipoCod: value.documentoTipoCod,
        documentoTipoDes: value.documentoTipoDes,
      });
    }
  };
  const handleOnChangeFormaPago = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        formaPagoCod: value.formaPagoCod,
        formaPagoDes: value.formaPagoDes,
      });
    }
  };

  return (
    <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
      <CardHeader
        titleTypographyProps={styleCardHeaderTitle}
        title="DATOS DE FACTURA COMPRA"
        style={styleCardHeader}
      />
      <CardContent>
        <Grid container spacing={{ xs: 1, md: 2 }}>
          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="organizacionDes"
              label="Organización:"
              value={registro.organizacionDes}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextFieldSgm
              id="documentoId"
              label="id:"
              value={registro.documentoId}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="estadoDes"
              label="Estado:"
              value={registro.estadoDes}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextFieldSgm
              id="autorizacionNumero"
              label="Autorizacion:"
              value={registro.autorizacionNumero}
              onChange={handleOnChange}
              disabled={registro.ce}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="documentoNumero"
              label="Numero:"
              value={registro.documentoNumero}
              onChange={handleOnChange}
              disabled={registro.ce}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <AutocompleteSgm
              id="nombre"
              label="Persona:"
              options={personas}
              value={registro}
              getOptionLabel={(option) => option.nombre}
              onChange={handleOnChangePersona}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {" "}
            <AutocompleteSgm
              id="documentoDes"
              label="Documento:"
              options={documentos}
              value={registro}
              getOptionLabel={(option) => option.documentoDes}
              onChange={handleOnChangeDocumento}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <AutocompleteSgm
              id="documentoTipoDes"
              label="Documento Tipo:"
              options={documentoTipos}
              value={registro}
              getOptionLabel={(option) => option.documentoTipoDes}
              onChange={handleOnChangeDocumentoTipo}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DateFieldSgm
              id="autorizacionFecha"
              label="Fecha Aut:"
              value={registro.autorizacionFecha}
              onChange={handleOnChange}
              disabled={registro.ce}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DateFieldSgm
              id="fechaEmite"
              label="Fecha Emite:"
              value={registro.fechaEmite}
              onChange={handleOnChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="plazoDias"
              label="Dias de plazo:"
              value={registro.plazoDias}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {" "}
            <AutocompleteSgm
              id="formPago"
              label="Forma pago:"
              options={formasPago}
              value={registro}
              getOptionLabel={(option) => option.formaPagoDes}
              onChange={handleOnChangeFormaPago}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
