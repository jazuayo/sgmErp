import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import AutocompleteSgm from "../../components/AutocompleteSgm";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function RetencionStepAsignarDetalle() {
  const { registroDependiente, setRegistroDependiente, impuesto } =
    useContext(GenerarContext);

  const handleOnChangeImpuesto = (event, value) => {
    if (value !== null) {
      setRegistroDependiente({
        ...registroDependiente,
        impuestoCod: value.impuestoCod,
        impuestoDes: value.impuestoDes,
      });
    }
  };

  const handleOnChange = (event) => {
    setRegistroDependiente({
      ...registroDependiente,
      [event.target.id]: event.target.value,
    });
  };
  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="AGREGAR DETALLE"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12} md={4}>
              <TextFieldSgm
                id="documentoNumeroFact"
                label="Documento:"
                value={registroDependiente.documentoNumeroFact}
                onChange={handleOnChange}
                disabled="true"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextFieldSgm
                id="nombrePersona"
                label="Persona:"
                value={registroDependiente.nombrePersona}
                onChange={handleOnChange}
                disabled="true"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AutocompleteSgm
                id="impuesto"
                label="Impuesto:"
                options={impuesto}
                value={registroDependiente}
                getOptionLabel={(option) => option.impuestoDes}
                onChange={handleOnChangeImpuesto}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextFieldSgm
                id="baseImponible"
                label="Base:"
                value={registroDependiente.baseImponible}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextFieldSgm
                id="valorRetenido"
                label="Valor Retenido"
                value={registroDependiente.valorRetenido}
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
