import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import CheckFieldSgm from "../../components/CheckFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function CuentaStepDetalle() {
  const { registro, setRegistro, tiposPlanCuentas } =
    useContext(GenerarContext);
  const { codigoOrganizacion, organizacion } = getUser();

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeCheck = (event) => {
    setRegistro({
      ...registro,
      [event.target.name]: event.target.checked,
    });
  };

  const handleOnChangeAutocomplete = (event, value) => {
    if (value != null) {
      setRegistro({
        ...registro,
        cuentaTipoCod: value.cuentaTipoCod,
        cuentaTipoDes: value.cuentaTipoDes,
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
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="CUENTA"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="cuentaCod"
                label="Código:"
                value={registro.cuentaCod}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="cuentaNum"
                label="Número:"
                value={registro.cuentaNum}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="cuentaDes"
                label="Descripción:"
                value={registro.cuentaDes}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteSgm
                id="cuentaTipo"
                label="Cuenta Tipo:"
                options={tiposPlanCuentas}
                value={registro}
                getOptionLabel={(option) => option.cuentaTipoDes}
                onChange={handleOnChangeAutocomplete}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <CheckFieldSgm
                id="operativa"
                label="Es Operativa"
                value={registro.operativa}
                onChange={handleOnChangeCheck}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CheckFieldSgm
                id="movimiento"
                label="Es Movimiento"
                value={registro.movimiento}
                onChange={handleOnChangeCheck}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="nivel"
                label="Nivel:"
                value={registro.nivel}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaDesde"
                label="Fecha Desde:"
                value={registro.fechaDesde}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaHasta"
                label="Fecha Hasta:"
                value={registro.fechaHasta}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="organizacion"
                label="Organizacion:"
                value={registro.organizacionDes}
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
