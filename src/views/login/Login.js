import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { GenerarContext } from "../../context/GenerarContext";
import TextFieldSgm from "../../components/TextFieldSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import AutocompleteSgm from "../../components/AutocompleteSgm";

import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import { Button, CardActions } from "@mui/material";
import { Box } from "@mui/system";
import ClientJSON from "../../util/ClientJSON";
import endpoints from "../../util/Parametros";
import { AppContext } from "../../context/AppContext";

export default function Login() {
  const { mensajeError } = useContext(AppContext);
  const [organizacion, setOrganizacion] = useState({
    organizacionCod: "",
    organizacionDes: "",
  });
  const [ocultar, setOcultar] = useState(true);
  const [usuario, setUsuario] = useState({
    email: "",
    clave: "",
  });

  const [organizaciones, setOrganizaciones] = useState([]);

  const obtenerDatosUsuario = async () => {
    let datos = {
      email: usuario.email,
      clave: usuario.clave,
      organizacion: organizacion,
    };

    if (organizaciones.length == 0) {
      mensajeError("Revise las credenciales.");
      return;
    }
    
    if (usuario.email == "" || usuario.clave == "") {
      mensajeError("Ingrese el email y la clave");
      return;
    }

    if (organizacion.organizacionCod == "") {
      mensajeError("Seleccione la organización");
      return;
    }

    await (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/usuario/login",
        JSON.stringify(datos),
        "POST"
      );
      if (!respuesta.error) {
        let datosUsuario = {
          usuario: respuesta.datos,
          organizacion: organizacion,
        };

        await sessionStorage.setItem("user", JSON.stringify(datosUsuario));
        await sessionStorage.setItem(
          "opcionesMenu",
          JSON.stringify(respuesta.datos.pantallas)
        );
        await window.location.replace("admin");
      } else {
        await sessionStorage.setItem("opcionesMenu", JSON.stringify([]));
        mensajeError("Revise las credenciales.");
        return;
      }
    })();
  };

  const obtenerOrganizaciones = async (datos) => {
    await (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/usuario/organizacion",
        JSON.stringify(datos),
        "POST"
      );
      if (!respuesta.error) {
        if (respuesta.datos.length == 1) {
          setOrganizacion({
            organizacionCod: respuesta.datos[0].organizacionCod,
            organizacionDes: respuesta.datos[0].organizacionDes,
          });
          setOrganizaciones(respuesta.datos);
        } else {
          setOcultar(false);
          setOrganizaciones(respuesta.datos);
        }
      } else {
        setOrganizaciones([]);
      }
    })();
  };

  const handleOnChangeAutocomplete = (event, value) => {
    if (value != null) {
      setOrganizacion({
        organizacionCod: value.organizacionCod,
        organizacionDes: value.organizacionDes,
      });
    }
  };

  const handleOnChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.id]: event.target.value,
    });
  };

  React.useEffect(() => {
    setOcultar(true);
    setOrganizacion({
      organizacionCod: "",
      organizacionDes: "",
    });

    if (usuario.email != "" && usuario.clave != "") {
      let datos = {
        email: usuario.email,
        clave: usuario.clave,
      };
      obtenerOrganizaciones(datos);
    }
  }, [usuario]);

  React.useEffect(() => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("opcionesMenu");
  }, []);
  return (
    <div>
      <SnackbarAppSgm />
      <Grid
        container
        spacing={0}
        paddingTop={10}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="INGRESO AL SISTEMA"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <TextFieldSgm
                  id="email"
                  label="Usuario:"
                  value={usuario.email}
                  onChange={handleOnChange}
                />
                <TextFieldSgm
                  id="clave"
                  label="Clave:"
                  type="password"
                  value={usuario.clave}
                  onChange={handleOnChange}
                />
                <AutocompleteSgm
                  id="organizacion"
                  label="Organización:"
                  options={organizaciones}
                  value={organizacion}
                  getOptionLabel={(option) => option.organizacionDes}
                  onChange={handleOnChangeAutocomplete}
                  hidden={ocultar}
                />
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              <Button
                className="botonSgm"
                onClick={() => obtenerDatosUsuario()}
              >
                Ingresar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
