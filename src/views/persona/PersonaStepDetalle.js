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

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";

export default function PersonaStepDetalle() {
  const {
    registro,
    setRegistro,
    tipoPersonas,
    lugares,
    setCantones,
    cantones,
  } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion, codigoUsuario } = getUser();

  const [esProveedor, setEsProveedor] = useState(registro.esProveedor);
  const [esCliente, setEsCliente] = useState(registro.esCliente);
  const [siglas, setSiglas] = useState(true);
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeAutocompleteTipoPersona = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        perTipoCod: value.perTipoCod,
        perTipoDes: value.perTipoDes,
      });
    }
  };
  const handleChange = (event) => {
    if (event.target.name === "esCliente") {
      setEsCliente(event.target.checked);
      if (event.target.checked === true) {
        setRegistro({
          ...registro,
          esCliente: 1,
        });
      } else {
        setRegistro({
          ...registro,
          esCliente: 0,
        });
      }
    }
    if (event.target.name === "esProveedor") {
      setEsProveedor(event.target.checked);
      if (event.target.checked === true) {
        setRegistro({
          ...registro,
          esProveedor: 1,
        });
        setSiglas(false);
      } else {
        setRegistro({
          ...registro,
          esProveedor: 0,
          siglasProveedor: "",
        });
        setSiglas(true);
      }
    }
  };
  const handleOnChangeAutocompleteProvincia = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        provincia: value,
      });
      setCantones(lugares[value].cantones);
    } else {
      setRegistro({
        ...registro,
        provincia: "",
      });
      setCantones([]);
    }
  };
  const handleOnChangeAutocompleteCanton = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        lugarId: value.lugarId,
        nombre: value.nombre,
        /*canton: value.nombre,*/
      });
    }
  };

  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionCod: codigoOrganizacion,
      organizacionDes: organizacion,
      usuario: codigoUsuario,
    });
    if (registro.esProveedor === true) {
      setSiglas(false);
    }
  }, []);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="DETALLES DE PERSONA"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="personaId"
                    label="Id:"
                    value={registro.personaId}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </Grid>
                <Grid item md={3} xs={6}>
                  <CheckFieldSgm
                    id={"esCliente"}
                    label={"Cliente"}
                    value={esCliente}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={6}>
                  <CheckFieldSgm
                    id={"esProveedor"}
                    label={"Proveedor"}
                    value={esProveedor}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="siglasProveedor"
                    label="Siglas proveedor:"
                    value={registro.siglasProveedor}
                    onChange={handleOnChange}
                    disabled={siglas}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <AutocompleteSgm
                    id="perTipoDes"
                    label="Persona Tipo:"
                    options={tipoPersonas}
                    value={registro}
                    getOptionLabel={(option) => option.perTipoDes}
                    onChange={handleOnChangeAutocompleteTipoPersona}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="numeroId"
                    label="Numero Id:"
                    value={registro.numeroId}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="nombrePersona"
                    label="Nombre:"
                    value={registro.nombrePersona}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="telefono"
                    label="Telefono:"
                    value={registro.telefono}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <AutocompleteSgm
                    id="provincia"
                    label={"Provincia"}
                    options={Object.keys(lugares)}
                    value={registro.provincia}
                    getOptionLabel={(provincia) => provincia}
                    onChange={handleOnChangeAutocompleteProvincia}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <AutocompleteSgm
                    id="canton"
                    label={"Canton"}
                    options={cantones}
                    value={registro}
                    /*value={{
                      nombre: registro.canton,
                      lugarId: registro.lugarId,
                    }}*/
                    getOptionLabel={(option) => option.nombre}
                    onChange={handleOnChangeAutocompleteCanton}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="direccion"
                    label="Direccion:"
                    value={registro.direccion}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextFieldSgm
                    id="email"
                    label="Email:"
                    value={registro.email}
                    onChange={handleOnChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
