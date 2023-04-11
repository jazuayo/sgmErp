import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import RetencionStepAsgDetalle from "../retencion/RetencionStepAsgDetalle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import RetencionStepRetDet from "./RetencionStepRetDet";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { categorias } from "../../util/types";

export default function RetencionStepDetalle() {
  const {
    registro,
    registroDependiente,
    setRegistroDependiente,
    estados,
    documentos,
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
  const [tipoRet, setTipoRet] = useState("");
  React.useEffect(() => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        setTipoRet("EN VENTAS");
        break;
      case categorias.facturaCompras:
        setTipoRet("EN COMPRAS");
        break;
      default:
        break;
    }
  }, [registro]);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title={"RETENCION " + tipoRet}
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="organizacion"
                    label="Organizacion:"
                    value={registroDependiente.organizacionDes}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextFieldSgm
                    id="retencionId"
                    label="Id Retención:"
                    value={registroDependiente.retencionId}
                    onChange={handleOnChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  {/*<AutocompleteSgm
                    id="estado"
                    label="Estado:"
                    options={estados}
                    value={registroDependiente}
                    getOptionLabel={(option) => option.estadoDes}
                    disabled="true"
                  />*/}
                  <TextFieldSgm
                    id="estadoDes"
                    label="Estado:"
                    value={registroDependiente.estadoDes}
                    disabled={true}
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
                  <DateFieldSgm
                    id="autorizacionFecha"
                    label="Autorizacion Fecha:"
                    value={registroDependiente.autorizacionFecha}
                    onChange={handleOnChange}
                    //disabled={registro.categoriaCod === "ComFac" ? true : false}
                    disabled={registroDependiente.ce}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AutocompleteSgm
                    id="documento"
                    label="Documento:"
                    options={documentos}
                    value={registroDependiente}
                    getOptionLabel={(option) => option.documentoDes}
                    onChange={handleOnChangeDocumento}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextFieldSgm
                    id="documentoNumero"
                    label="Numero:"
                    value={registroDependiente.documentoNumero}
                    onChange={handleOnChange}
                    //disabled={registro.categoriaCod === "ComFac" ? true : false}
                    disabled={registroDependiente.ce}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldSgm
                    id="autorizacionNumero"
                    label="Autorización:"
                    value={registroDependiente.autorizacionNumero}
                    onChange={handleOnChange}
                    //disabled={registro.categoriaCod === "ComFac" ? true : false}
                    disabled={registroDependiente.ce}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <RetencionStepAsgDetalle />
        </Grid>
        <RetencionStepRetDet />
      </Grid>
    </div>
  );
}
