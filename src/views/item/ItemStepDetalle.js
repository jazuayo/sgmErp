import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextFieldSgm from "../../components/TextFieldSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { getUser } from "../../util/common/Common";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CheckFieldSgm from "../../components/CheckFieldSgm";
import ItemStepCategoria from "./ItemStepCategoria";
import ItemStepAsignarDetalle from "./ItemStepAsignarDetalle";
import DateFieldSgm from "../../components/DateFieldSgm";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function ItemStepDetalle() {
  const { registro, setRegistro, grupoItems } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion, codigoUsuario } = getUser();

  const [modificaPrecio, setModificaPrecio] = useState(registro.modificaPrecio);
  const [permiteDetalle, setPermiteDetalle] = useState(registro.permiteDetalle);

  const handleChange = (event) => {
    if (event.target.name === "modificaPrecio") {
      setModificaPrecio(event.target.checked);
      if (event.target.checked === true) {
        setRegistro({
          ...registro,
          modificaPrecio: 1,
        });
      } else {
        setRegistro({
          ...registro,
          modificaPrecio: 0,
        });
      }
    }
    if (event.target.name === "permiteDetalle") {
      setPermiteDetalle(event.target.checked);
      if (event.target.checked === true) {
        setRegistro({
          ...registro,
          permiteDetalle: 1,
        });
      } else {
        setRegistro({
          ...registro,
          permiteDetalle: 0,
        });
      }
    }
  };

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
        itemGrupoCod: value.itemGrupoCod,
        itemGrupoDes: value.itemGrupoDes,
      });
    }
  };

  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionDes: organizacion,
      organizacionCod: codigoOrganizacion,
      usuario: codigoUsuario,
    });
  }, []);

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      <Grid item xs={12} md={12}>
        <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
          <CardHeader
            titleTypographyProps={styleCardHeaderTitle}
            title="DETALLES DEL ITEM"
            style={styleCardHeader}
          />
          <CardContent>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              <Grid item xs={12} md={3}>
                <TextFieldSgm
                  id="itemId"
                  label="Id:"
                  value={registro.itemId}
                  onChange={handleOnChange}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldSgm
                  id="itemDes"
                  label="Descripción:"
                  value={registro.itemDes}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <AutocompleteSgm
                  id="grupo"
                  label="Grupo:"
                  options={grupoItems}
                  value={registro}
                  getOptionLabel={(option) => option.itemGrupoDes}
                  onChange={handleOnChangeAutocomplete}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldSgm
                  id="siglasItem"
                  label="Siglas item:"
                  value={registro.siglasItem}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CheckFieldSgm
                  id={"modificaPrecio"}
                  label={"Modifica precio"}
                  value={modificaPrecio}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CheckFieldSgm
                  id={"permiteDetalle"}
                  label={"Permite detalle"}
                  value={permiteDetalle}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldSgm
                  id="precioVenta"
                  label="Precio:"
                  value={registro.precioVenta}
                  disabled={true}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldSgm
                  id="organizacionDes"
                  label="Organización:"
                  value={registro.organizacionDes}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <ItemStepAsignarDetalle />
      </Grid>
      <Grid item xs={12} md={12}>
        <ItemStepCategoria />
      </Grid>
    </Grid>
  );
}
