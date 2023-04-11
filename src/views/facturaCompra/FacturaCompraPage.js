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
import { facturaCompraObj, estado, categorias } from "../../util/types.js";
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
import FacturaCompraStepListar from "./FacturaCompraStepListar";
import FacturaCompraStepDetalles from "./FacturaCompraStepDetalles.js";
const steps = ["LISTAR FACTURAS DE COMPRA", "DETALLE DE LA FACTURA DE COMPRA"];

export default function FacturaCompraPage(props) {
  const { codigoOrganizacion } = getUser();
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
    listarImpuestosPorTipo,
    listarPrecioCalculaPorOrganizacion,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  // Funciones

  const calcularTotalSinImpuesto = () => {
    return registro.cantidad * registro.costoArtesano - registro.descuentoValor;
  };
  const calcularImpuestoFactura = (detalles) => {
    let datos = {
      detalles: detalles,
      categoriaCod: categorias.facturaCompras,
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
        cantidad: 0.0,
        precioVenta: 0.0,
        descuentoValor: 0.0,
        totalSinImp: 0.0,
        fechaVence: new Date().toISOString().split("T")[0],
        lote: "",
        // detalles
        detalles: detalles,
        impuestos: resultado,
        // valores de galeria
        impuestosItem: [],
        pvp: 0.0,
        total: 0.0,
        costoArtesano: 0.0,
      });
    } else {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/factura/impuesto",
          JSON.stringify(datos),
          "POST"
        );
        if (!respuesta.error) {
          resultado = agruparImpuestosPorCod(respuesta.datos);
          setRegistro({
            ...registro,
            facturaDetalleId: null,
            itemDes: "",
            itemId: 0,
            descripcion: "",
            cantidad: 0.0,
            precioVenta: 0.0,
            descuentoValor: 0.0,
            totalSinImp: 0.0,
            fechaVence: new Date().toISOString().split("T")[0],
            lote: "",
            // detalles
            detalles: detalles,
            impuestos: resultado,
            // valores de galeria
            impuestosItem: [],
            pvp: 0.0,
            total: 0.0,
            costoArtesano: 0.0,
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
      mensajeError("Seleccione un item.");
      return;
    }
    // Agregad un item o detalle a la factura
    setCargando(true);
    let detalleFactura = {
      facturaDetalleId: registro.facturaDetalleId,
      documentoId: registro.documentoId,
      item: {
        itemId: registro.itemId,
        itemDes: registro.itemDes,
        modificaPrecio: registro.modificaPrecio,
        permiteDetalle: registro.permiteDetalle,
        itemGrupo: {
          impuestos: registro.impuestosItem,
        },
      },
      descripcion: registro.descripcion,
      cantidad: registro.cantidad,
      //precioUnitario: registro.precioUnitario,
      //precioUnitario: registro.precioVenta,
      precioUnitario: Number(registro.costoArtesano).toFixed(2),
      descuentoValor: Number(registro.descuentoValor).toFixed(2),
      pvp: Number(registro.pvp).toFixed(2),
      lote: registro.lote,
      //fechaVence: registro.fechaVence,
      //lote: registro.lote,
      fechaVence: new Date(registro.fechaVence.replaceAll("-", "/")),
      //Fin detalle entidad
      totalSinImp: Number(calcularTotalSinImpuesto()).toFixed(2),
    };
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
  };
  const eliminarDetalleDeFactura = () => {
    setCargando(true);
    const detalles = registro.detalles.filter(
      (detalle) => detalle.tableData.id !== registro.tableDataId
    );
    // ********Servicio para calcular los impuestos********
    calcularImpuestoFactura(detalles);
    mensajeInfo("Detalle eliminado correctamente.");
    setCargando(false);
  };
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
  const guardarFacturaCompra = () => {
    // validar campos para agregar factura
    if (registro.fechaEmite === "") {
      mensajeError("Ingrese fecha emite.");
      return;
    }
    if (registro.autorizacionFecha === "") {
      mensajeError("Ingrese fecha de autorizacion.");
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
    if (registro.documentoNumero === "") {
      mensajeError("Ingrese el numero de documento.");
      return;
    }
    if (registro.autorizacionNumero === "") {
      mensajeError("Ingrese el numero de autorizacion.");
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
      categoriaCod: categorias.facturaCompras,
      organizacionCod: registro.organizacionCod,
      personaId: registro.personaId,
      //fechaEmite: new Date(registro.fechaEmite), //date
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
        //cantidad * precioVenta) - descuentoValor

        const detalleActualizado = [];
        respuesta.datos.detalles.map((item) => {
          const totalSinImp =
            item.cantidad * item.precioUnitario - item.descuentoValor;
          item.totalSinImp = totalSinImp;
          detalleActualizado.push(item);
        }); /*
        const impuestosAgrupados = agruparImpuestosPorCod(
          respuesta.datos.impuestos
        );
*/
        setRegistro({
          ...registro,
          documentoId: respuesta.datos.documentoId,
          detalles: detalleActualizado,
          //impuestos: impuestosAgrupados,
          estadoDes: respuesta.datos.estado.estadoDes,
          estadoCod: respuesta.datos.estado.estadoCod,
        });
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaCompras);
        if (registro.fechaDesde !== "") {
          buscarFacturasPorFiltros();
        }
        mensajeInfo("Factura de compra registrada correctamente.");
      } else {
        mensajeError("Error al registrar factura.");
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
      categoriaCod: categorias.facturaCompras,
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
  const eliminarFacturaCompra = () => {
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
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaCompras);
        mensajeInfo("Factura de compra eliminada correctamente.");
      } else {
        mensajeError("Error al eliminar factura de compra.");
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
      categoriaCod: "",
      //Organizacion
      organizacionCod: "",
      organizacionDes: "",
      //Persona
      personaId: 0,
      nombre: "",

      fechaEmite: "", //date
      // Documento
      documentoCod: "",
      documentoDes: "",
      ce: 0, // comprobante electronico
      // Documento Tipo
      documentoTipoCod: "",
      documentoTipoDes: "",

      documentoNumero: "999999999999999",
      documentoValor: 0.0,
      autorizacionNumero: "0000000000",

      autorizacionFecha: "",

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
      facturaModifica: null,
      facturaDetalleId: null,
      itemDes: "",
      itemId: 0,
      descripcion: "",
      cantidad: 0.0,
      precioVenta: 0.0,
      descuentoValor: 0.0,
      totalSinImp: 0.0,
      fechaVence: new Date().toISOString().split("T")[0],
      lote: "",
      siglasProveedor: "",
      //Ayni vista al registrar
      costoArtesano: 0.0, // precio unitario
      pvp: 0.0,
      total: 0.0,
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

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(facturaCompraObj());
    listaPersonas(codigoOrganizacion, "proveedor");
    listaDocPorOrgOrigen(codigoOrganizacion, categorias.facturaCompras);
    listaDocumentosTipos();
    listarFormasPagoPorOrganizacionYCategoria(
      codigoOrganizacion,
      categorias.facturaCompras
    );
    listaItems(codigoOrganizacion);
    //listarImpuestosPorTipo("ComFacPre");
    listarPrecioCalculaPorOrganizacion(codigoOrganizacion);

    const recuperarListadoFac = () => {
      if (sessionStorage.getItem("facturas")) {
        let datoBusqueda = JSON.parse(sessionStorage.getItem("busqueda"));
        if (datoBusqueda.categoriaCod === categorias.facturaCompras) {
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
        stepSiguente,
        buscarFacturasPorFiltros,
        stepAterior,
        guardarFacturaCompra,
        accionesPantalla,
        agregarDetalleEnFactura,
        eliminarDetalleDeFactura,
        registro,
        setRegistro,
        eliminarFacturaCompra,
        generarPdfFactura,
        procesar
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
      {stepActivo === 0 && !cargando && <FacturaCompraStepListar />}
      {stepActivo === 1 && !cargando && <FacturaCompraStepDetalles />}
      <SpinnerSgm size={35} loading={cargando} />
    </Box>
  );
}

function header(
  stepActivo,
  stepSiguente,
  buscarFacturasPorFiltros,
  stepAterior,
  guardarFacturaCompra,
  accionesPantalla,
  agregarDetalleEnFactura,
  eliminarDetalleDeFactura,
  registro,
  setRegistro,
  eliminarFacturaCompra,
  generarPdfFactura,
  procesar
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
            label="Retener factura"
            onClick={() => window.location.replace("retencion")}
            tipo={"retencion"}
          />
          <HeaderButton
            label="Nota de credito"
            onClick={() => {
              /*setRegistro({
                ...registro,
                categoriaCod: categorias.notaCreditoCompras,
              });*/
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
          <SaveButtonSgm onClick={() => guardarFacturaCompra()} />
        </div>
      )}
      {stepActivo === 1 && registro.documentoId !== 0 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminarFacturaCompra()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
