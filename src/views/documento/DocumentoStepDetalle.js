import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CheckFieldSgm from "../../components/CheckFieldSgm";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function DocumentoStepDetalle() {
  const { registro, setRegistro, estados, categorias } =
    useContext(GenerarContext);

  const [compElec, setCompElec] = useState(registro.ce);

  const handleChange = (event) => {
    setCompElec(event.target.checked);
    if (event.target.checked === true) {
      setRegistro({
        ...registro,
        ce: 1,
      });
    } else {
      setRegistro({
        ...registro,
        ce: 0,
      });
    }
  };
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeEstado = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        estadoCod: value.estadoCod,
        estadoDes: value.estadoDes,
      });
    }
  };

  const handleOnChangeOrigen = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        categoriaCod: value.categoriaCod,
        categoriaDes: value.categoriaDes,
      });
    }
  };

  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="DETALLES DE DOCUMENTO"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="codigo"
                label="Código:"
                value={registro.codigo}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="descripcion"
                label="Descripción:"
                value={registro.descripcion}
                onChange={handleOnChange}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="secuencial"
                label="Secuencial:"
                value={registro.secuencial}
                onChange={handleOnChange}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="longitud"
                label="Longitud:"
                value={registro.longitud}
                onChange={handleOnChange}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="inicio"
                label="Inicio:"
                value={registro.inicio}
                onChange={handleOnChange}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="orden"
                label="Orden:"
                value={registro.orden}
                onChange={handleOnChange}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteSgm
                id="estado"
                label="Estado:"
                options={estados}
                value={registro}
                getOptionLabel={(option) => option.estadoDes}
                onChange={handleOnChangeEstado}
              />{" "}
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteSgm
                id="origen"
                label="Origen:"
                options={categorias}
                value={registro}
                getOptionLabel={(option) => option.categoriaDes}
                onChange={handleOnChangeOrigen}
              />{" "}
            </Grid>
            <Grid item xs={12} md={3}>
              <CheckFieldSgm
                id={"ce"}
                label={"Comprobante electronico"}
                value={compElec}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="organizacion"
                label="Organizacion:"
                value={registro.descripcionOrganizacion}
                onChange={handleOnChange}
                disabled={true}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
