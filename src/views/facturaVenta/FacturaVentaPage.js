import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import HeaderTab from "../header/HeaderTab.js";
import HeaderButton from "../header/HeaderButton.js";
import IconSgm from "../../util/IconSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import SpinnerSgm from "../../components/SpinnerSgm";
import { facturaVentaObj, estado, categorias } from "../../util/types.js";
import { GenerarContext } from "../../context/GenerarContext";
import {
  verificaAccion,
  ACCIONES_PANTALLA,
  getUser,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm.js";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
import { descargarArchivo } from "../../util/descargarArchivos.js";
//Steps
import FacturaVentaStepListar from "./FacturaVentaStepListar";
import FacturaVentaStepDetalles from "./FacturaVentaStepDetalles.js";
const steps = ["LISTAR FACTURA DE VENTAS", "DETALLE DE LA FACTURA DE VENTA"];

export default function FacturaVentaPage(props) {
  const { codigoOrganizacion, organizacion } = getUser();
  const { accionesPantalla } = props;
  const {
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    setFacturas,
    listaPersonas,
    listaDocPorOrgOrigen,
    listaDocumentosTipos,
    listarFormasPagoPorOrganizacionYCategoria,
    listaItems,
    setItemInventario,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  // Funciones
  const agruparImpuestosPorCod = (impuestos) => {
    //Codigo para sumar impuestos y agrupar
    const resultado = [];
    impuestos.forEach(function (item) {
      var impuestoCod = item.impuesto.impuestoCod;
      var impuestoDes = item.impuesto.impuestoDes;
      if (!this[impuestoCod]) {
        this[impuestoCod] = {
          baseImponible: 0,
          impuestoValor: 0,
          impuesto: { impuestoCod: impuestoCod, impuestoDes: impuestoDes },
        };
        resultado.push(this[impuestoCod]);
      }
      this[impuestoCod].baseImponible += item.baseImponible;
      this[impuestoCod].impuestoValor += item.impuestoValor;
    }, Object.create(null));
    return resultado;
  };
  const calcularTotalSinImpuesto = () => {
    return Number(
      registro.cantidadSeleccionada * registro.precioUnitario -
        registro.descuentoValor
    ).toFixed(2);
  };
  const calcularImpuestoFactura = (detalles) => {
    let datos = {
      detalles: detalles,
      categoriaCod: categorias.facturaVenta,
      personaId: registro.personaId,
    };
    var resultado = [];
    if (registro.llevaIva === false) {
      resultado = agruparImpuestosPorCod([]);
      setRegistro({
        ...registro,
        facturaDetalleId: null,
        itemDes: "",
        itemId: 0,
        descripcion: "",
        //cantidad: 0.0,
        cantidadSeleccionada: 0,
        precioUnitario: 0.0,
        descuentoValor: 0.0,
        totalSinImp: 0.0,
        itemInvId: "",
        lote: "",
        disponibleCant: 0,
        fechaVenceItemInv: "",
        // detalles
        detalles: detalles,
        impuestos: resultado,
      });
    } else {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/factura/impuesto",
          JSON.stringify(datos),
          "POST"
        );
        if (!respuesta.error) {
          const resultado = agruparImpuestosPorCod(respuesta.datos);
          setRegistro({
            ...registro,
            facturaDetalleId: null,
            itemDes: "",
            itemId: 0,
            descripcion: "",
            //cantidad: 0.0,
            cantidadSeleccionada: 0,
            precioUnitario: 0.0,
            descuentoValor: 0.0,
            totalSinImp: 0.0,
            itemInvId: "",
            lote: "",
            disponibleCant: 0,
            fechaVenceItemInv: "",

            // detalles
            detalles: detalles,
            impuestos: resultado,
          });
        } else {
          mensajeError("Error al calcular impuesto de la factura.");
        }
      })();
    }
  };
  const agregarDetalleEnFactura = () => {
    // validaciones
    if (registro.itemDes === "") {
      mensajeError("Seleccione item.");
      return;
    }
    // Agregad un item o detalle a la factura
    let detalleFactura = {
      facturaDetalleId: registro.facturaDetalleId,
      item: {
        itemId: registro.itemId,
        itemDes: registro.itemDes,
      },
      documentoId: registro.documentoId,
      descripcion: registro.descripcion,
      cantidad: registro.cantidadSeleccionada,
      precioUnitario: Number(registro.precioUnitario).toFixed(2),
      descuentoValor: Number(registro.descuentoValor).toFixed(2),
      totalSinImp: Number(calcularTotalSinImpuesto()).toFixed(2),
      lote: registro.itemInvId, //ID DEL LOTE
      loteCod: registro.lote, // CODIGO DE LOTE
      fechaVence:
        registro.fechaVenceItemInv == ""
          ? null
          : new Date(registro.fechaVenceItemInv),
    };

    setCargando(true);

    const detalles = Array.from(registro.detalles);

    if (registro.tableDataId !== "") {
      let indice = detalles.findIndex(
        (detalle) => detalle.tableData.id === registro.tableDataId
      );
      detalles.splice(indice, 1);
    }
    detalles.push(detalleFactura);
    // ********Servicio para calcular los impuestos********
    calcularImpuestoFactura(detalles);
    setCargando(false);
    mensajeInfo("Detalle agregado correctamente.");
    setItemInventario([]);
  };

  const eliminarDetalleDeFactura = () => {
    setCargando(true);
    const detalles = registro.detalles.filter(
      (detalle) => detalle.tableData.id !== registro.tableDataId
    );
    // ********Servicio para calcular los impuestos********
    calcularImpuestoFactura(detalles);
    mensajeInfo("Detalle eliminado correctamente.");
    setItemInventario([]);
    setCargando(false);
  };
  const guardar = () => {
    // validar campos para agregar factura
    if (registro.fechaEmite === "") {
      mensajeError("Ingrese fecha emite.");
      return;
    }
    if (registro.documentoDes === "") {
      mensajeError("Selecciones documento.");
      return;
    }
    if (registro.documentoTipoDes === "") {
      mensajeError("Selecciones documento tipo.");
      return;
    }
    if (registro.formaPagoDes === "") {
      mensajeError("Selecciones la forma de pago.");
      return;
    }
    if (registro.plazoDias === "") {
      mensajeError("Ingrese el numero de dias de plazo.");
      return;
    }

    // agregar detalles de la factura
    setCargando(true);
    var AuxEstadoCod = "";
    if (registro.documentoId === 0) {
      AuxEstadoCod = estado.ingresado; //Ingresado ING
    } else {
      AuxEstadoCod = registro.estadoCod;
    }

    let datos = {
      documentoId: registro.documentoId,
      categoriaCod: categorias.facturaVenta,
      organizacionCod: registro.organizacionCod,
      personaId: registro.personaId,
      fechaEmite: new Date(registro.fechaEmite.replaceAll("-", "/")), //date
      documentoCod: registro.documentoCod,
      documentoTipoCod: registro.documentoTipoCod,
      documentoNumero: registro.documentoNumero,
      documentoValor: registro.documentoValor,
      autorizacionNumero: registro.autorizacionNumero,
      autorizacionFecha: new Date(
        registro.autorizacionFecha.replaceAll("-", "/")
      ), //date
      estadoCod: AuxEstadoCod,
      observaciones: registro.observaciones,
      saldoPendiente: registro.saldoPendiente,
      formaPagoCod: registro.formaPagoCod,
      plazoDias: registro.plazoDias,
      detalles: registro.detalles,
      impuestos: registro.impuestos,
      usuario: registro.usuario,
    };
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        // calcular el total sin impuesto-- por los ids
        //cantidad * precioUnitario) - descuentoValor
        const detalleActualizado = [];
        respuesta.datos.detalles.map((item) => {
          const totalSinImp =
            item.cantidad * item.precioUnitario - item.descuentoValor;
          item.totalSinImp = totalSinImp;
          detalleActualizado.push(item);
        });
        /*const impuestosAgrupados = agruparImpuestosPorCod(
          respuesta.datos.impuestos
        );*/
        setRegistro({
          ...registro,
          documentoId: respuesta.datos.documentoId,
          detalles: detalleActualizado,
          //impuestos: impuestosAgrupados,
          estadoDes: respuesta.datos.estado.estadoDes,
          estadoCod: respuesta.datos.estado.estadoCod,
          documentoNumero: respuesta.datos.documentoNumero,
        });
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaVenta);

        if (registro.fechaDesde !== "") {
          buscarFacturasPorFiltros();
        }
        mensajeInfo("Factura registrada correctamente.");
      } else {
        mensajeError("Error al registrar factura.");
      }
    })();
  };

  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/" + registro.documentoId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        buscarFacturasPorFiltros();
        stepAterior();
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaVenta);
        mensajeInfo("Factura eliminada correctamente.");
      } else {
        mensajeError("Error al eliminar factura.");
      }
    })();
  };

  const procesar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/procesar/" + registro.documentoId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        recuperarRegistroPorId();
        buscarFacturasPorFiltros();
        mensajeInfo("Factura procesada correctamente.");
      } else {
        mensajeError("Error al procesar factura.");
      }
    })();
  };
  const recuperarRegistroPorId = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/factura/recuperar/registro/" +
          registro.documentoId,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistro({
          ...registro,
          estadoDes: respuesta.datos.estado.estadoDes,
          estadoCod: respuesta.datos.estado.estadoCod,
          documentoNumero: respuesta.datos.documentoNumero,
          autorizacionNumero: respuesta.datos.autorizacionNumero,
        });
      } else {
        mensajeError("Error al recuperar registro factura.");
      }
    })();
  };

  const buscarFacturasPorFiltros = () => {
    // Validar campos de filtro
    if (registro.fechaHasta === "" || registro.fechaDesde === "") {
      mensajeError("Ingrese el valor de fechas para la busqueda");
      return;
    }
    var difference =
      new Date(registro.fechaHasta).getTime() -
      new Date(registro.fechaDesde).getTime();
    if (difference < 0) {
      mensajeError(
        "El valor de 'Fecha Desde' debe ser menor a la 'Fecha Hasta'."
      );
      return;
    }
    setFacturas([]);
    setCargando(true);
    let datos = {
      organizacionCod: codigoOrganizacion,
      fechaDesde: new Date(registro.fechaDesde.replaceAll("-", "/")),
      fechaHasta: new Date(registro.fechaHasta.replaceAll("-", "/")),
      personaNombre: registro.personaNombre,
      categoriaCod: categorias.facturaVenta,
    };
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/busqueda",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        setFacturas(respuesta.datos);
        sessionStorage.setItem("busqueda", JSON.stringify(datos));
        sessionStorage.setItem("facturas", JSON.stringify(respuesta.datos));
      } else {
        mensajeError("Error al listar facturas.");
      }
    })();
  };
  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };
  const stepAterior = () => {
    setRegistro({
      ...registro,
      documentoId: 0,
      //Categoria
      categoriaCod: categorias.facturaVenta,
      //Organizacion
      organizacionCod: "",
      organizacionDes: "",
      //Persona
      personaId: 0,
      nombre: "",

      fechaEmite: new Date().toISOString().split("T")[0], //date

      // Documento
      documentoCod: "",
      documentoDes: "",
      ce: 1,
      // Documento Tipo
      documentoTipoCod: "",
      documentoTipoDes: "",

      documentoNumero: "",
      documentoValor: 0.0,
      autorizacionNumero: "0000000000",

      autorizacionFecha: new Date().toISOString().split("T")[0], //fecha actual

      // Estado
      estadoDes: "Nuevo",
      estadoCod: "",

      observaciones: ".",
      saldoPendiente: 0.0,

      // Forma de Pago
      formaPagoCod: "",
      formaPagoDes: "",

      plazoDias: 0,

      // listas

      detalles: [],
      impuestos: [],

      //usuario
      usuario: ".",

      // detalles factura - items
      facturaDetalleId: null,
      itemDes: "",
      itemId: 0,
      descripcion: "",
      //cantidad: 0.0,
      cantidadSeleccionada: 0,
      precioUnitario: 0.0,
      descuentoValor: 0.0,
      totalSinImp: 0.0,

      itemInvId: "",
      lote: "",
      disponibleCant: 0,
      fechaVenceItemInv: "",
    });
    setStepActivo(stepActivo - 1);
  };
  const generarPdfFactura = () => {
    mensajeInfo("Generando archivo...");
    descargarArchivo(
      "/factura/procesar/pdf/" + registro.documentoId,
      "factura_" + registro.documentoNumero + ".pdf",
      setCargando
    );
  };
  const enviarComprobantes = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/notifica/factura/" + registro.documentoId,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        mensajeInfo("Comprobantes enviados");
      } else {
        mensajeError("Error al enviar comprobantes.");
      }
    })();
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(facturaVentaObj());
    listaPersonas(codigoOrganizacion, "cliente");
    listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaVenta);
    listaDocumentosTipos();
    listarFormasPagoPorOrganizacionYCategoria(
      codigoOrganizacion,
      categorias.facturaVenta
    );
    listaItems(codigoOrganizacion);
    const recuperarListadoFac = () => {
      if (sessionStorage.getItem("facturas")) {
        let datoBusqueda = JSON.parse(sessionStorage.getItem("busqueda"));
        if (datoBusqueda.categoriaCod === categorias.facturaVenta) {
          setFacturas(JSON.parse(sessionStorage.getItem("facturas")));
        } else {
          setFacturas([]);
        }
      }
    };
    recuperarListadoFac();
  }, []);
  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(
        stepActivo,
        accionesPantalla,
        stepSiguente,
        stepAterior,
        guardar,
        buscarFacturasPorFiltros,
        registro,
        agregarDetalleEnFactura,
        eliminarDetalleDeFactura,
        setRegistro,
        eliminar,
        procesar,
        generarPdfFactura,
        enviarComprobantes
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
      {stepActivo === 0 && !cargando && <FacturaVentaStepListar />}
      {stepActivo === 1 && !cargando && <FacturaVentaStepDetalles />}
      <SpinnerSgm size={35} loading={cargando} />
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardar,
  buscarFacturasPorFiltros,
  registro,
  agregarDetalleEnFactura,
  eliminarDetalleDeFactura,
  setRegistro,
  eliminar,
  procesar,
  generarPdfFactura,
  enviarComprobantes
) {
  return (
    <HeaderTab>
      {stepActivo === 0 && (
        <div>
          <HeaderButton
            label="Buscar facturas"
            onClick={() => buscarFacturasPorFiltros()}
            tipo={"buscar"}
          />
          <HeaderButton
            label="Siguiente"
            onClick={() => {
              stepSiguente();
            }}
            tipo={"next"}
          />
        </div>
      )}
      {stepActivo === 1 && (
        <div>
          <HeaderButton
            label="Regresar"
            onClick={() => stepAterior()}
            tipo={"back"}
          />
          <HeaderButton
            label="Agregar detalle."
            onClick={() => agregarDetalleEnFactura()}
            tipo={"agregarItem"}
          />
          <HeaderButton
            label="Eliminar detalle seleccionado."
            onClick={() => eliminarDetalleDeFactura()}
            tipo={"removerItem"}
          />
        </div>
      )}

      {stepActivo === 1 && registro.documentoId !== 0 && (
        <div>
          <HeaderButton
            label="Enviar comprobantes"
            onClick={() => enviarComprobantes()}
            tipo={"email"}
          />
          <HeaderButton
            label="Retener factura"
            onClick={() => window.location.replace("retencion")}
            tipo={"retencion"}
          />
          <HeaderButton
            label="Nota de credito"
            onClick={() => {
              window.location.replace("notaCredito");
            }}
            tipo={"nota"}
          />
          <HeaderButton
            label="Procesar factura"
            onClick={() => {
              procesar();
            }}
            tipo={"procesar"}
          />
          <HeaderButton
            label="Generar comprobante"
            onClick={() => {
              generarPdfFactura();
            }}
            tipo={"pdf"}
          />
        </div>
      )}
      {stepActivo === 1 && (
        <div>
          <SaveButtonSgm onClick={() => guardar()} />
        </div>
      )}
      {stepActivo === 1 && registro.documentoId !== 0 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminar()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
