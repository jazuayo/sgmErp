import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { parametroObj } from "../../util/types";

export default function ClaveFirmaDetalle(props) {
  const { registro, setRegistro } = useContext(GenerarContext);
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };
  useEffect(() => {
    //setRegistro(parametroObj());
  }, []);
  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="CLAVE DE FIRMA ELECTRONICA"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <TextFieldSgm
              id="valor"
              label="Clave:"
              value={registro.valor}
              onChange={handleOnChange}
            />
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
