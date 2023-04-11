import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import LabelHeadSgm from "../../components/LabelHeadSgm";
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

export default function ItemStepAsignarDetalle() {
  const { registro, setRegistro, categorias, cuentas } =
    useContext(GenerarContext);
  const handleOnChangeAutocompleteCategoria = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        categoriaDes: value.categoriaDes,
        categoriaCod: value.categoriaCod,
      });
    }
  };
  const handleOnChangeAutocompleteCuenta = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        cuentaDes: value.cuentaDes,
        cuentaCod: value.cuentaCod,
      });
    }
  };
  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="ASIGNAR CATEGORIA AL ITEM"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={4}>
              <AutocompleteSgm
                id="categoriaCod"
                label="Categoria:"
                options={categorias}
                value={registro}
                getOptionLabel={(option) => option.categoriaDes}
                onChange={handleOnChangeAutocompleteCategoria}
              />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteSgm
                id="cuentaCod"
                label="Cuenta:"
                options={cuentas}
                value={registro}
                getOptionLabel={(option) =>
                  option.cuentaDes == ""
                    ? ""
                    : option.cuentaCod + " - " + option.cuentaDes
                }
                onChange={handleOnChangeAutocompleteCuenta}
              />
            </Grid>
            <Grid item xs={2}>
              <TextFieldSgm
                id="organizacionDes"
                label="Organizacion:"
                value={registro.organizacionDes}
                disabled={true}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
