import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import AppProvider from "./context/AppContext";
import "./style/sigma.css";
import {
  setTokenUser,
  setUserSession
} from "./util/common/Common";
import { ONLINE } from "./util/common/const.js";

var datos = {
  usuario: {
    usuarioCod: "1",
    nombre: "TANIA LANDIVAR",
  },
  organizacion: { organizacionCod: "1", organizacionDes: "AustroCambio" },
};

let valor = sessionStorage.getItem("user");
if (valor !== null) {
  datos = JSON.parse(valor);
}

if (!ONLINE) {
  let token_key = "da2f8eee-9a11-4fd1-bb09-75923e2060c7";
  let user = 11;
  setTokenUser(token_key);
  sessionStorage.removeItem("sesionRec");
  (async () => {
    try {
      const parametros = {
        codigoUsuario: user,
        tokenKey: token_key,
      };
      const botonesAcciones = [
        {
          codigo: "DE",
          activo: "S",
          botonAsociado: "BT_DESCARGAR",
          nombre: "DESCARGAR",
        },
        {
          codigo: "F",
          activo: "S",
          botonAsociado: "BT_BUSCAR",
          nombre: "BUSCAR",
        },
        {
          codigo: "I",
          activo: "S",
          botonAsociado: "BT_GRABAR",
          nombre: "GRABAR",
        },
      ];
      sessionStorage.removeItem("sesionRec");
      let response = {
        estado: 1,
        mensaje: "",
        token: null,
        tokenRefresh: null,
        codigoUsuario: datos.usuario.usuarioCod,
        nombreUsuario: datos.usuario.nombre,
        fechaActual: new Date(),
        codigoOrganizacion: datos.organizacion.organizacionCod,
        organizacion: datos.organizacion.organizacionDes,
        codigoFormaSelect: null,
        formaSelect: null,
        tokenKey: null,
        pantallasModulo: [
          {
            codigoPantalla: 1086,
            path: "organizacion",
            name: "Organización",
            icon: "group",
            layout: "/admin",
            acciones: botonesAcciones,
            subMenu: [
              {
                codigoPantalla: 1086,
                path: "documento",
                name: "Documentos",
                icon: "article",
                component: "documento/Documento",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1, // Si muestra el el menu principal
              },
              {
                codigoPantalla: 1086,
                path: "impuesto",
                name: "Impuestos",
                icon: "balance",
                component: "impuesto/Impuesto",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
            ],
          },
          {
            codigoPantalla: 1086,
            path: "contabilidad",
            name: "Contabilidad",
            icon: "badge",
            layout: "/admin",
            acciones: botonesAcciones,
            subMenu: [
              {
                codigoPantalla: 1086,
                path: "cuenta",
                name: "Cuenta",
                icon: "tab",
                component: "cuenta/Cuenta",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "comprobante",
                name: "Comprobante",
                icon: "receipt",
                component: "comprobante/Comprobante",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "reporte",
                name: "Reportes",
                icon: "assessment",
                component: "reporte/Reporte",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
            ],
          },
          {
            codigoPantalla: 1086,
            path: "facturacion",
            name: "Facturacion",
            icon: "paid",
            layout: "/admin",
            acciones: botonesAcciones,
            subMenu: [
              {
                codigoPantalla: 1086,
                path: "item",
                name: "Item",
                icon: "label",
                component: "item/Item",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "persona",
                name: "Persona",
                icon: "person",
                component: "persona/Persona",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "grupoItems",
                name: "Grupo Items",
                icon: "hub",
                component: "grupoItems/GrupoItems",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "facturaVenta",
                name: "Factura Venta",
                icon: "sell",
                component: "facturaVenta/FacturaVenta",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "facturaCompra",
                name: "Factura Compra",
                icon: "inventory",
                component: "facturaCompra/FacturaCompra",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "reportes",
                name: "Reportes",
                icon: "assessment",
                component: "reportesFac/ReportesFac",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "ATS",
                name: "Generar ATS",
                icon: "notes",
                component: "generarATS/GenerarATS",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "retencion",
                name: "Retencion",
                icon: "remove",
                component: "retencion/Retencion",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 2,
              },
              {
                codigoPantalla: 1086,
                path: "notaCredito",
                name: "Nota de Credito",
                icon: "ReceiptIcon",
                component: "notaCredito/NotaCredito",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 2,
              },
            ],
          },
          {
            codigoPantalla: 1086,
            path: "configuracion",
            name: "Configuracion",
            icon: "build",
            layout: "/admin",
            acciones: botonesAcciones,
            subMenu: [
              {
                codigoPantalla: 1086,
                path: "cambiarContrasenia",
                name: "Contraseña",
                icon: "password",
                component: "usuario/CambiarClave",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
              {
                codigoPantalla: 1086,
                path: "claveFirma",
                name: "Clave Firma",
                icon: "pin",
                component: "claveFirma/ClaveFirma",
                layout: "/admin",
                acciones: botonesAcciones,
                orden: 1,
              },
            ],
          },
        ],
        otp: null,
      };
      setTokenUser(token_key);
      setUserSession(token_key, response);
      ReactDOM.render(
        <AppProvider>
          <App />
        </AppProvider>,
        document.getElementById("root")
      );
    } catch (error) {
      console.log(error);
      ReactDOM.render(document.getElementById("root"));
    }
  })();
  ReactDOM.render(
    <AppProvider>
      <App />
    </AppProvider>,
    document.getElementById("root")
  );
}
