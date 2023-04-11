import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import DateFieldSgm from "../../components/DateFieldSgm";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function DocumentoStepAsignarSerie() {
  const { registro, setRegistro } = useContext(GenerarContext);
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="ASIGNAR SERIE"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12} md={2.4}>
              <DateFieldSgm
                id="fechaEmision"
                label="Fecha Emision:"
                value={registro.fechaEmision}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <DateFieldSgm
                id="fechaCaduca"
                label="Fecha Caduca:"
                value={registro.fechaCaduca}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextFieldSgm
                id="secuencialDesde"
                label="Secuencial Desde:"
                value={registro.secuencialDesde}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextFieldSgm
                id="secuencialHasta"
                label="Secuencial Hasta:"
                value={registro.secuencialHasta}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextFieldSgm
                id="autorizacion"
                label="Autorizacion:"
                value={registro.autorizacion}
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
