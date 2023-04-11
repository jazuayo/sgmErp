import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import ImpuestoStepCategoria from "./ImpuestoStepCategoria";
import ImpuestoStepAsignarCategoria from "./ImpuestoStepAsignarCategoria";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function ImpuestoStepDetalle() {
  const { registro, setRegistro, impuestoTipo } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion } = getUser();

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeAutocomplete = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        impuestoTipoCod: value.impuestoTipoCod,
        impuestoTipoDes: value.impuestoTipoDes,
      });
    }
  };

  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionDes: organizacion,
      organizacionCod: codigoOrganizacion,
    });
  }, []);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="DETALLES DEL IMPUESTO"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={4}>
                  <TextFieldSgm
                    id="impuestoCod"
                    label="Código:"
                    value={registro.impuestoCod}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextFieldSgm
                    id="impuestoDes"
                    label="Descripción:"
                    value={registro.impuestoDes}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <AutocompleteSgm
                    id="tipo"
                    label="Tipo:"
                    options={impuestoTipo}
                    value={registro}
                    getOptionLabel={(option) => option.impuestoTipoDes}
                    onChange={handleOnChangeAutocomplete}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <ImpuestoStepAsignarCategoria />
        </Grid>
        <Grid item xs={12} md={12}>
          <ImpuestoStepCategoria />
        </Grid>
      </Grid>
    </div>
  );
}
