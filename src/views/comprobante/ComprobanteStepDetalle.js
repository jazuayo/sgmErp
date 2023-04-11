import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import LabelHeadSgm from "../../components/LabelHeadSgm";
import { getUser } from "../../util/common/Common";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import GenerarStepComCue from "./ComprobanteStepComCue";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function ComprobanteStepDetalle() {
  const { codigoOrganizacion, organizacion } = getUser();

  const { registro, setRegistro, estados, documentos, cuentas } =
    useContext(GenerarContext);
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeEstado = (event, value) => {
    setRegistro({
      ...registro,
      estadoCod: value.estadoCod,
      estadoDes: value.estadoDes,
    });
  };

  const handleOnChangeCuenta = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        cuentaCod: value.cuentaCod,
        cuentaDes: value.cuentaDes,
      });
    }
  };

  const handleOnChangeDocumento = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        documentoCod: value.documentoCod,
        documentoDes: value.documentoDes,
      });
    }
  };

  React.useEffect(() => {
    setRegistro({
      ...registro,
      organizacionCod: codigoOrganizacion,
      organizacionDes: organizacion,
    });
  }, []);
  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="COMPROBANTE"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="organizacion"
                    label="Organizacion:"
                    value={registro.organizacionDes}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="comprobanteCod"
                    label="Código:"
                    value={registro.comprobanteCod}
                    onChange={handleOnChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AutocompleteSgm
                    id="estado"
                    label="Estado:"
                    options={estados}
                    value={registro}
                    getOptionLabel={(option) => option.estadoDes}
                    onChange={handleOnChangeEstado}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DateFieldSgm
                    id="fecha"
                    label="Fecha Emision:"
                    value={registro.fecha}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AutocompleteSgm
                    id="documento"
                    label="Documento:"
                    options={documentos}
                    value={registro}
                    getOptionLabel={(option) => option.documentoDes}
                    onChange={handleOnChangeDocumento}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldSgm
                    id="conceptoComp"
                    label="Concepto:"
                    value={registro.conceptoComp}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="fuente"
                    label="Fuente:"
                    value={registro.fuente}
                    onChange={handleOnChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="AGREGAR CUENTA"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={5}>
                  <AutocompleteSgm
                    id="cuenta"
                    label="Cuenta:"
                    options={cuentas}
                    value={registro}
                    getOptionLabel={(option) =>
                      option.cuentaDes == ""
                        ? ""
                        : option.cuentaCod + " - " + option.cuentaDes
                    }
                    //getOptionLabel={(option) => option.cuentaDes}
                    onChange={handleOnChangeCuenta}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextFieldSgm
                    id="debito"
                    label="Debito:"
                    value={registro.debito}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextFieldSgm
                    id="credito"
                    label="Credito:"
                    value={registro.credito}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="concepto"
                    label="Concepto:"
                    value={registro.concepto}
                    onChange={handleOnChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <GenerarStepComCue></GenerarStepComCue>
      </Grid>
    </div>
  );
}
