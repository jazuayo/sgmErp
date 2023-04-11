import SpinnerSgm from "../../components/SpinnerSgm";
import Grid from "@mui/material/Grid";

import React, { Component, Suspense } from "react";
import endpoints from "../../util/Parametros";
import Cipher from "./Cipher.js";

export const redirigirLogin = () => {
  window.location.href = endpoints.loginKey;
};

export const redirigirPortal = () => {
  window.location.href = endpoints.portal;
};

// remove token
export const cerrarSession = () => {
  removeUserSession();
  console.log("redirigir fuera");
  console.log(endpoints.homeTransaccional);
  window.location.href = endpoints.homeTransaccional;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("tokenGrc");
  sessionStorage.removeItem("sesionGrc");
};

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  //sessionStorage.setItem("tokenGrc", token);
  let userStr = JSON.stringify(user);
  sessionStorage.setItem("sesionGrc", Cipher.encrypting(userStr));
};

// return the user data from the session storage
export const getUser = () => {
  let userStr = sessionStorage.getItem("sesionGrc");
  if (!userStr) {
    return null;
  }
  let plano = Cipher.decrypting(userStr);
  return JSON.parse(plano);
};

export const getOpcionesMenu = () => {
  let opcionesMenu = sessionStorage.getItem("opcionesMenu");
  if (!opcionesMenu) {
    return null;
  }
  return JSON.parse(opcionesMenu);
};

export const setTokenUser = (token) => {
  let valorEncriptado = Cipher.encrypting(token);
  sessionStorage.setItem("tokenGrc", valorEncriptado);
};

// return the token from the session storage
export const getToken = (iniciarDatos) => {
  let tokenUsuario = sessionStorage.getItem("tokenGrc");
  if (tokenUsuario) {
    if (tokenUsuario === "undefined") {
    } else {
      return Cipher.decrypting(tokenUsuario);
    }
  }
  return null;
};

/**
 * Funcion para obtener las paginas del sistema cargando sus componentes dinamicamente
 *
 */

export const getModuleWithComponent = () => {
  let module = [];
  let datosSesion = getUser();
  let opcionesMenu = getOpcionesMenu();
  if (!datosSesion) {
    return [];
  }
  let modulo = datosSesion.pantallasModulo;
  console.log("moduloooooooo");
  console.log(modulo);
  if (modulo && modulo.length > 0) {
    modulo.forEach(function (itemMenu) {
      let subMenu = [];
      itemMenu.subMenu.forEach(function (itemSubMenu) {
        if (opcionesMenu.includes(itemSubMenu.component)) {
          subMenu.push({
            codigo: itemSubMenu.codigoPantalla,
            path: "/" + itemSubMenu.path.toLowerCase(),
            name: itemSubMenu.name,
            icon: itemSubMenu.icon,
            image: itemSubMenu.image,
            orden: itemSubMenu.orden,
            subMenu: [],
            component: obtenerComponentePagina(itemSubMenu.component, {
              layout: itemSubMenu.layout,
              codigoPantalla: itemSubMenu.codigoPantalla,
              acciones: itemSubMenu.acciones,
            }),
            description: itemSubMenu.descripcion,
            layout: itemSubMenu.layout,
          });
        }
      });

      //Agrega el menu generado
      module.push({
        codigo: itemMenu.codigoPantalla,
        path: "/" + itemMenu.path.toLowerCase(),
        name: itemMenu.name,
        icon: itemMenu.icon,
        image: itemMenu.image,
        subMenu: subMenu,
        description: itemMenu.descripcion,
        layout: itemMenu.layout,
      });
    });
  }
  console.log("module");
  console.log(module);
  return module;
};

/**
 * Carga dinamicamente un componente en base a su ruta desde la carpeta views
 * coloca en el props un campo llamado parameters un diccionario con todos los
 * parametros que se requiera usar dentro del componente
 *
 * @param {*} pageName
 */
function obtenerComponentePagina(pageName, parameters) {
  return class GeneralComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      const OtherComponent = React.lazy(() =>
        import(`../../views/${pageName}.js`)
      );
      if (!parameters) {
        parameters = {};
      }
      return (
        <Suspense
          fallback={
            <div>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <br />
                  <br />
                  <br />
                  <SpinnerSgm size={35} loading={true} />
                </Grid>
              </Grid>
            </div>
          }
        >
          <OtherComponent parameters={parameters} />
        </Suspense>
      );
    }
  };
}

export const verificaAccion = (acciones, action) => {
  if (!acciones) {
    return false;
  }
  let datos = acciones.filter(function (item) {
    return item.codigo === action;
  });
  if (datos && datos.length > 0) {
    return true;
  }
  return false;
};

export const ACCIONES_PANTALLA = {
  PAGAR: "PG",
  BUSCAR: "F",
  GRABAR: "I",
  NUEVO: "N",
  IMPRIMIR: "P",
  DESCARGAR: "DE",
  PROCESAR: "PRC",
};
