import Grid from "@mui/material/Grid";
import React, { useContext } from "react";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import {
  styleCard,
  styleCardHeader,
  styleCardHeaderTitle,
} from "../../style/style";

export default function CategoriaStepDetalle() {
  const { codigoOrganizacion, organizacion } = getUser();

  const { registro, setRegistro, categoriasTipo } = useContext(GenerarContext);

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeAutocomplete = (event, value) => {
    if (value != null) {
      setRegistro({
        ...registro,
        categoriaTipoCod: value.categoriaTipoCod,
        categoriaTipoDes: value.categoriaTipoDes,
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
          title="CATEGORÍA"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <TextFieldSgm
              id="categoriaCod"
              label="Código:"
              value={registro.categoriaCod}
              onChange={handleOnChange}
            />
            <TextFieldSgm
              id="categoriaDes"
              label="Descripción:"
              value={registro.categoriaDes}
              onChange={handleOnChange}
            />
            <AutocompleteSgm
              id="tipo"
              label="Tipo:"
              options={categoriasTipo}
              value={registro}
              getOptionLabel={(option) => option.categoriaTipoDes}
              onChange={handleOnChangeAutocomplete}
            />
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
