import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import HeaderTab from "../header/HeaderTab.js";
import HeaderButton from "../header/HeaderButton.js";
import IconSgm from "../../util/IconSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import SpinnerSgm from "../../components/SpinnerSgm";

import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import RetencionStepDetalle from "./RetencionStepDetalle";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import { retencionObj, categorias } from "../../util/types.js";
import SaveButtonSgm from "../../components/SaveButtonSgm.js";
import DeleteButtonSgm from "../../components/DeleteButtonSgm.js";
import { descargarArchivo } from "../../util/descargarArchivos.js";

const steps = ["DETALLE RETENCIÓN"];

export default function RetencionPage(props) {
  const { accionesPantalla } = props;
  const { codigoOrganizacion, codigoUsuario, organizacion } = getUser();
  const {
    stepActivo,
    setStepActivo,
    registro,
    registroDependiente,
    setRegistroDependiente,
    listaDocPorOrgOrigen,
    listaImpuestos,
    listaEstados,
    listaRetencionesDetPorRetencion,
    setFacturas,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  const agregarDetalleRetencion = () => {
    const detalles = Array.from(registroDependiente.detalles);

    if (registroDependiente.impuestoCod === "") {
      mensajeError("Seleccione la impuesto.");
      return;
    }

    if (registroDependiente.baseImponible.toString() === "") {
      mensajeError("Ingrese la base.");
      return;
    }

    if (registroDependiente.valorRetenido.toString() === "") {
      mensajeError("Ingrese el valor retenido.");
      return;
    }

    setCargando(true);
    let detalleRetencion = {
      retencionDetalleId: registroDependiente.retencionDetalleId,
      factura: {
        documentoId: registroDependiente.facturaId,
        persona: {
          personaId: registroDependiente.personaId,
          nombre: registroDependiente.nombrePersona,
        },
        documentoNumero: registroDependiente.documentoNumeroFact,
      },
      impuesto: {
        impuestoCod: registroDependiente.impuestoCod,
        impuestoDes: registroDependiente.impuestoDes,
      },
      baseImponible: registroDependiente.baseImponible,
      valorRetenido: registroDependiente.valorRetenido,
      documentoNumero: registroDependiente.documentoNumeroFact,
      nombrePersona: registroDependiente.nombrePersona,
    };
    if (registroDependiente.retencionDetalleId == null) {
      const contieneRegistro = detalles.some(
        (detalle) =>
          detalle.retencionId === registroDependiente.retencionId &&
          detalle.factura.documentoId === registroDependiente.facturaId &&
          detalle.impuesto.impuestoCod === registroDependiente.impuestoCod &&
          detalle.impuesto.impuestoDes === registroDependiente.impuestoDes &&
          detalle.baseImponible === registroDependiente.baseImponible &&
          detalle.valorRetenido === registroDependiente.valorRetenido
      );
      if (contieneRegistro == false) {
        detalles.push(detalleRetencion);
      }
    } else {
      let indice = detalles.findIndex(
        (detalle) =>
          detalle.retencionDetalleId === registroDependiente.retencionDetalleId
      );
      detalles.splice(indice, 1);
      detalles.push(detalleRetencion);
    }
    setRegistroDependiente({
      ...registroDependiente,
      retencionDetalleId: null,
      facturaId: "",
      facturaDes: "",
      impuestoCod: "",
      impuestoDes: "",
      baseImponible: 0,
      valorRetenido: 0,
      detalles: detalles,
    });
    setCargando(false);
    mensajeInfo("Detalle agregado.");
  };
  const guardarRetencion = () => {
    if (registroDependiente.documentoCod === "") {
      mensajeError("Seleccione el documento.");
      return;
    }

    if (registroDependiente.detalles.length === 0) {
      mensajeError("Ingrese al menos un detalle a la retención.");
      return;
    }
    if (registroDependiente.fechaEmite === "") {
      mensajeError("Ingresar valor para fecha de emision.");
      return;
    }
    if (registroDependiente.autorizacionFecha === "") {
      mensajeError("Ingresar valor para fecha de autorizacion.");
      return;
    }
    if (registroDependiente.documentoNumero === "") {
      mensajeError("Ingresar valor para el campo numero.");
      return;
    }
    if (registroDependiente.autorizacionNumero === "") {
      mensajeError("Ingresar valor para el campo autorizacion.");
      return;
    }

    let retencionId = 0;
    if (registroDependiente.retencionId === 0) {
      retencionId = null;
    } else {
      retencionId = registroDependiente.retencionId;
    }
    setCargando(true);
    let datos = {
      retencionId: retencionId,
      organizacionCod: registroDependiente.organizacionCod,
      fechaEmite: new Date(registroDependiente.fechaEmite.replaceAll("-", "/")),
      documentoCod: registroDependiente.documentoCod,
      documentoNumero: registroDependiente.documentoNumero,
      autorizacionNumero: registroDependiente.autorizacionNumero,
      autorizacionFecha: new Date(
        registroDependiente.autorizacionFecha.replaceAll("-", "/")
      ),
      estadoCod: registroDependiente.estadoCod,
      detalles: registroDependiente.detalles,
      usuario: codigoUsuario,
    };
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/retencion",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (respuesta.error) {
        setRegistroDependiente({
          ...registroDependiente,
          retencionId: 0,
        });
        switch (registro.categoriaCod) {
          case categorias.facturaVenta:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.retencionesVentas
            );
            break;
          case categorias.facturaCompras:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.retencionesCompras
            );
            break;
          default:
            break;
        }
        mensajeError("Error al registrar la retencion.");
      } else {
        setRegistroDependiente({
          ...registroDependiente,
          retencionId: respuesta.datos.retencionId,
          detalles: respuesta.datos.detalles,
        });
        mensajeInfo("Retención registrada.");
      }
    })();
  };

  const eliminarDetalleRet = () => {
    const detalles = Array.from(registroDependiente.detalles);
    setCargando(true);
    if (registroDependiente.retencionDetalleId === null) {
      let indice = detalles.findIndex(
        (detalle) =>
          detalle.factura.documentoId === registroDependiente.facturaId &&
          detalle.impuesto.impuestoCod === registroDependiente.impuestoCod &&
          detalle.baseImponible === registroDependiente.baseImponible &&
          detalle.valorRetenido === registroDependiente.valorRetenido
      );
      detalles.splice(indice, 1);
      setRegistroDependiente({
        ...registroDependiente,
        retencionDetalleId: null,
        facturaId: "",
        facturaDes: "",
        impuestoCod: "",
        impuestoDes: "",
        baseImponible: 0,
        valorRetenido: 0,
        detalles: detalles,
      });
      setCargando(false);
    } else {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS +
            "/retencionDetalle/" +
            registroDependiente.retencionDetalleId,
          null,
          "POST"
        );
        setCargando(false);
        if (!respuesta.error) {
          if (registroDependiente.detalles.length === 1) {
            eliminarRetencion();
          } else {
            await listaRetencionesDetPorRetencion(
              registroDependiente.retencionId
            );
          }
        } else {
          mensajeError("Error al eliminar el detalle de la retencion.");
        }
      })();
    }
    mensajeInfo("Detalle de retencion eliminado.");
  };
  const eliminarRetencion = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/retencion/" + registroDependiente.retencionId,
        null,
        "POST"
      );
      setCargando(false);
      var fechaAuto = "";
      if (registro.categoriaCod === categorias.facturaCompras) {
        fechaAuto = new Date().toISOString().split("T")[0];
      }
      if (!respuesta.error) {
        setRegistroDependiente({
          retencionId: 0,
          fechaEmite: "",
          documentoNumero: 0,
          autorizacionNumero: 0,
          autorizacionFecha: fechaAuto,
          usuario: ".",
          detalles: [],

          // Documento
          documentoCod: registro.documentoCod,
          documentoDes: "",

          // Organización
          organizacionCod: codigoOrganizacion,
          organizacionDes: organizacion,

          // Estado
          estadoCod: "ING",
          estadoDes: "Ingresado",

          //Detalle Retencion
          retencionDetalleId: null,
          facturaId: registro.documentoId,
          facturaDes: "",
          impuestoCod: "",
          impuestoDes: "",
          baseImponible: 0,
          valorRetenido: 0,
          documentoNumeroFact: registro.documentoNumero,
          nombrePersona: registro.nombre,
          personaId: registro.personaId,
        });
        switch (registro.categoriaCod) {
          case categorias.facturaVenta:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.retencionesVentas
            );
            break;
          case categorias.facturaCompras:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.retencionesCompras
            );
            break;
          default:
            break;
        }
        mensajeInfo("Eliminada la retención.");
      } else {
        mensajeError("Error al eliminar la retencion.");
      }
    })();
  };

  const handleCargaRetencion = async (documentoId) => {
    mensajeInfo("Buscando registro...");
    setCargando(true);
    await (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/retencionDetalle/recuperaPorFactura/" +
          documentoId,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        let retencion = respuesta.datos;
        if (retencion.retencionId !== null) {
          mensajeInfo("Registro encontrado.");
          setRegistroDependiente({
            ...registroDependiente,
            retencionId: retencion.retencionId,
            fechaEmite: retencion.fechaEmite.split("T")[0],
            documentoNumero: retencion.documentoNumero,
            autorizacionNumero: retencion.autorizacionNumero,
            autorizacionFecha: retencion.autorizacionFecha.split("T")[0],
            usuario: retencion.usuario,
            detalles: retencion.detalles,

            // Documento
            documentoCod: retencion.documento.documentoCod,
            documentoDes: retencion.documento.documentoDes,
            ce: retencion.documento.ce,

            // Organización
            organizacionCod: retencion.organizacion.organizacionCod,
            organizacionDes: retencion.organizacion.organizacionDes,

            // Estado
            estadoCod: retencion.estado.estadoCod,
            estadoDes: retencion.estado.estadoDes,

            //Detalle Retencion
            retencionDetalleId: null,
            facturaId: registro.documentoId,
            facturaDes: "",
            impuestoCod: "",
            impuestoDes: "",
            baseImponible: 0,
            valorRetenido: 0,
            documentoNumeroFact: registro.documentoNumero,
            nombrePersona: registro.nombre,
            personaId: registro.personaId,
          });
        } else {
          /*var fechaAuto = "";
          if (registro.categoriaCod === "ComFac") {
            fechaAuto = new Date().toISOString().split("T")[0];
          }*/
          mensajeInfo("No se ha encontrado registro.");
          setRegistroDependiente({
            ...registroDependiente,
            organizacionCod: codigoOrganizacion,
            organizacionDes: organizacion,
            documentoNumeroFact: registro.documentoNumero,
            nombrePersona: registro.nombre,
            documentoCod: "",
            facturaId: registro.documentoId,
            personaId: registro.personaId,
            //autorizacionFecha: fechaAuto,
            autorizacionFecha: new Date().toISOString().split("T")[0],
          });
        }
      }
    })();
    setStepActivo(stepActivo + 1);
  };

  const generarPdfRetencion = () => {
    mensajeInfo("Generando archivo...");
    descargarArchivo(
      "/retencion/procesar/pdf/" + registroDependiente.retencionId,
      "retencion_" + registroDependiente.retencionId + ".pdf",
      setCargando
    );
  };
  const procesar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/retencion/procesar/xml/" +
          registroDependiente.retencionId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        recuperarRegistroPorId();
        mensajeInfo("Retencion procesada correctamente.");
      } else {
        mensajeError("Error al procesar retencion.");
      }
    })();
  };
  const recuperarRegistroPorId = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/retencion/recuperar/registro/" +
          registroDependiente.retencionId,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistroDependiente({
          ...registroDependiente,
          estadoDes: respuesta.datos.estado.estadoDes,
          estadoCod: respuesta.datos.estado.estadoCod,
          documentoNumero: respuesta.datos.documentoNumero,
          autorizacionNumero: respuesta.datos.autorizacionNumero,
        });
      } else {
        mensajeError("Error al recuperar registro actualizado.");
      }
    })();
  };

  React.useEffect(() => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.retencionesVentas);
        break;
      case categorias.facturaCompras:
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.retencionesCompras);
        break;
      default:
        break;
    }
    listaImpuestos();
    listaEstados();
    setRegistroDependiente(retencionObj());
    handleCargaRetencion(registro.documentoId);
  }, [registro]);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(
        stepActivo,
        accionesPantalla,
        guardarRetencion,
        agregarDetalleRetencion,
        eliminarRetencion,
        eliminarDetalleRet,
        registroDependiente,
        generarPdfRetencion,
        procesar,
        registro,
        setFacturas
      )}
      <Stepper
        activeStep={stepActivo}
        alternativeLabel
        style={{ marginTop: 15 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={IconSgm}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {stepActivo === 1 && !cargando && <RetencionStepDetalle />}
      <SpinnerSgm size={35} loading={cargando} />
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  guardarRetencion,
  agregarDetalleRetencion,
  eliminarRetencion,
  eliminarDetalleRet,
  registroDependiente,
  generarPdfRetencion,
  procesar,
  registro,
  setFacturas
) {
  return (
    <HeaderTab>
      {stepActivo === 1 && registroDependiente.retencionId !== 0 && (
        <div>
          <HeaderButton
            label="Generar comprobante"
            onClick={() => {
              generarPdfRetencion();
            }}
            tipo={"pdf"}
          />
          <HeaderButton
            label="Procesar retencion"
            onClick={() => {
              procesar();
            }}
            tipo={"procesar"}
          />
        </div>
      )}
      {stepActivo === 1 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <HeaderButton
              label="Regresar"
              onClick={() => {
                switch (registro.categoriaCod) {
                  case categorias.facturaVenta:
                    window.location.replace("facturaventa");
                    break;
                  case categorias.facturaCompras:
                    window.location.replace("facturacompra");
                    break;
                  default:
                    console.log("No obtiene categoriaCod previo");
                    break;
                }
              }}
              tipo={"back"}
            />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <SaveButtonSgm onClick={() => guardarRetencion()} />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <HeaderButton
              label="Agregar Detalle"
              onClick={() => agregarDetalleRetencion()}
              tipo={"agregarItem"}
            />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <HeaderButton
              label="Eliminar Detalle"
              onClick={() => eliminarDetalleRet()}
              tipo={"removerItem"}
            />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminarRetencion()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
