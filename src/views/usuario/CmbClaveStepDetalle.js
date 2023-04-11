import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { cambiarContraseñaObj } from "../../util/types.js";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function CmbClaveStepDetalle() {
  const { registro, setRegistro } = useContext(GenerarContext);

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  React.useEffect(() => {
    setRegistro(cambiarContraseñaObj());
  }, []);
  
  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="NUEVA CONTRASEÑA"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <TextFieldSgm
              id="claveAnterior"
              label="Contraseña anterior:"
              value={registro.claveAnterior}
              onChange={handleOnChange}
              type="password"
            />
            <TextFieldSgm
              id="nuevaClave"
              label="Nueva Contraseña:"
              value={registro.nuevaClave}
              onChange={handleOnChange}
              type="password"
            />
            <TextFieldSgm
              id="confirmacionClave"
              label="Confirmación Contraseña:"
              value={registro.confirmacionClave}
              onChange={handleOnChange}
              type="password"
            />
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
