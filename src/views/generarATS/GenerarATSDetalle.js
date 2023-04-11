import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { GenerarContext } from "../../context/GenerarContext";
import TextFieldSgm from "../../components/TextFieldSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import { getUser } from "../../util/common/Common";

export default function GenerarATSDetalle() {
  const { registro, setRegistro } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion } = getUser();
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  useEffect(() => {
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
          title="GENERAR ANEXO TRANSCCIONAL SIMPLIFICADO (ATS)"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12} md={12}>
              <DateFieldSgm
                id="fechaGenera"
                label="Fecha Genera: "
                value={registro.fechaGenera}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextFieldSgm
                id="organizacionDes"
                label="Organizacion"
                value={registro.organizacionDes || organizacion}
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
