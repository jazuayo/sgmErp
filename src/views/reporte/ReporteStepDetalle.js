import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import TextFieldSgm from "../../components/TextFieldSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import { getUser } from "../../util/common/Common";
import { reportes } from "../../util/types";

export default function ReporteStepDetalle() {
  const { registro, setRegistro, cuentas } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion } = getUser();

  // funciones para obtener datos
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  const [disabledCuentas, setDisabledCuentas] = useState(false);
  const [disabledDate, setDisabledDate] = useState(false);
  const [disabledNivel, setDisabledNivel] = useState(false);
  const handleOnChangeAutoTipoRep = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        tipoRepCod: value.tipoRepCod,
        tipoRepDes: value.tipoRepDes,
        dir: value.dir,
        nombre: value.nombre,
      });
      if (value.tipoRepCod === "diaGen" || value.tipoRepCod === "mayGen") {
        setDisabledNivel(true);
      } else {
        setDisabledNivel(false);
      }
      if (
        value.tipoRepCod === "balGen" ||
        value.tipoRepCod === "estRes" ||
        value.tipoRepCod === "diaGen"
      ) {
        setDisabledCuentas(true);
      } else {
        setDisabledCuentas(false);
      }
    }
  };
  const handleOnChangeAutoCuentaIni = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        cuentaIniCod: value.cuentaIniCod,
        cuentaIniDes: value.cuentaIniDes,
      });
    }
  };
  const handleOnChangeAutoCuentaFin = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        cuentaFinCod: value.cuentaFinCod,
        cuentaFinDes: value.cuentaFinDes,
      });
    }
  };
  const [cuentasIni, setCuentasIni] = useState([]);
  const [cuentasFin, setcuentasFin] = useState([]);
  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionCod: codigoOrganizacion,
      organizacionDes: organizacion,
    });
  }, []);
  useEffect(() => {
    var cuentasAux = cuentas.map((item) => {
      return {
        ...item,
        cuentaIniCod: item.cuentaCod,
        cuentaIniDes: item.cuentaDes,
        cuentaFinCod: item.cuentaCod,
        cuentaFinDes: item.cuentaDes,
      };
    });
    setCuentasIni(cuentasAux);
    setcuentasFin(cuentasAux);
  }, [cuentas]);

  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="GENERAR REPORTES"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item md={12} xs={12}>
              <AutocompleteSgm
                id="tipoRepDes"
                label="Tipo Reporte"
                options={reportes()}
                value={registro}
                getOptionLabel={(option) => option.tipoRepDes}
                onChange={handleOnChangeAutoTipoRep}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <AutocompleteSgm
                id="cuentaIniCod"
                label="Cuenta Inicial:"
                options={cuentasIni}
                value={registro}
                getOptionLabel={(option) =>
                  option.cuentaIniDes == ""
                    ? ""
                    : option.cuentaIniCod + " - " + option.cuentaIniDes
                }
                onChange={handleOnChangeAutoCuentaIni}
                disabled={disabledCuentas}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <AutocompleteSgm
                id="cuentaFinCod"
                label="Cuenta Final:"
                options={cuentasFin}
                value={registro}
                getOptionLabel={(option) =>
                  option.cuentaFinDes == ""
                    ? ""
                    : option.cuentaFinCod + " - " + option.cuentaFinDes
                }
                onChange={handleOnChangeAutoCuentaFin}
                disabled={disabledCuentas}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextFieldSgm
                id="nivel"
                label="Nivel"
                value={registro.nivel}
                onChange={handleOnChange}
                disabled={disabledNivel}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaDesde"
                label="Fecha desde: "
                value={registro.fechaDesde}
                onChange={handleOnChange}
                disabled={disabledDate}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaHasta"
                label="Fecha hasta: "
                value={registro.fechaHasta}
                onChange={handleOnChange}
                disabled={disabledDate}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="organizacionDes"
                label="Organizacion"
                value={registro.organizacionDes}
                disabled="true"
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
