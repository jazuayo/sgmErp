import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import HeaderTab from "../header/HeaderTab.js";
import HeaderButton from "../header/HeaderButton.js";
import IconSgm from "../../util/IconSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import SpinnerSgm from "../../components/SpinnerSgm";
import { estado, notaCreditoObj, categorias } from "../../util/types.js";
import { descargarArchivo } from "../../util/descargarArchivos.js";
import { GenerarContext } from "../../context/GenerarContext";
import {
  verificaAccion,
  ACCIONES_PANTALLA,
  getUser,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm.js";
// Steps
import NotaCreditoStepDetalleNCredito from "./NotaCreditoStepDetalleNCredito";

const steps = ["DETALLE DE NOTA DE CREDITO"];

export default function NotaCreditoPage(props) {
  const { codigoOrganizacion, organizacion } = getUser();
  const { accionesPantalla } = props;

  const {
    stepActivo,
    setRegistroDependiente,
    registroDependiente,
    listaDocPorOrgOrigen,
    listaFormasPagoPorOrganizacion,
    listaDocumentosTipos,
    listaItems,
    registro,
    listarPrecioCalculaPorOrganizacion,
  } = useContext(GenerarContext);

  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  const agregarDetalle = () => {
    // Agregad un item o detalle a la nota
    //validar data
    if (registroDependiente.itemDes === "") {
      mensajeError("Selecciones valor de item.");
      return;
    }
    setCargando(true);
    // Valores para total sin impuesto general a compra y venta
    let cantidadSeleccionada = registroDependiente.cantidadSeleccionada;
    let precioUnitario =
      registro.categoriaCod == categorias.facturaVenta
        ? Number(registroDependiente.precioUnitario).toFixed(2)
        : Number(registroDependiente.costoArtesano).toFixed(2);
    let descuentoValor = registroDependiente.descuentoValor;
    let totalSinImpCal = Number(
      calcularTotalSinImpuesto(
        cantidadSeleccionada,
        precioUnitario,
        descuentoValor
      )
    ).toFixed(2);
    // fin valores
    let detalleNotaCredito = {
      facturaDetalleId: registroDependiente.facturaDetalleId,
      item: {
        itemId: registroDependiente.itemId,
        itemDes: registroDependiente.itemDes,
        modificaPrecio: registroDependiente.modificaPrecio,
        permiteDetalle: registroDependiente.permiteDetalle,
        itemGrupo: {
          impuestos: registroDependiente.impuestosItem,
        },
      },
      documentoId: registroDependiente.documentoId,
      descripcion: registroDependiente.descripcion,
      cantidad: registroDependiente.cantidadSeleccionada,
      precioUnitario:
        registro.categoriaCod == categorias.facturaVenta
          ? Number(registroDependiente.precioUnitario).toFixed(2)
          : Number(registroDependiente.costoArtesano).toFixed(2),

      descuentoValor: registroDependiente.descuentoValor,
      totalSinImp: totalSinImpCal, //Number(calcularTotalSinImpuesto()).toFixed(2),
      // compra
      pvp: Number(registroDependiente.pvp).toFixed(2),
      lote:
        registro.categoriaCod == categorias.facturaVenta
          ? registroDependiente.itemInvId
          : registroDependiente.lote,
      fechaVence: new Date(registroDependiente.fechaVence.replaceAll("-", "/")),
      //venta
      loteCod: registroDependiente.lote,
    };
    const detalles = Array.from(registroDependiente.detalles);
    if (registroDependiente.facturaDetalleId == null) {
      const contieneRegistro = detalles.some(
        (detalle) =>
          detalle.item.itemId === registroDependiente.itemId &&
          detalle.descripcion === registroDependiente.descripcion &&
          detalle.cantidadSeleccionada ===
            registroDependiente.cantidadSeleccionada &&
          detalle.precioUnitario === registroDependiente.precioUnitario &&
          detalle.descuentoValor === registroDependiente.descuentoValor
      );
      if (contieneRegistro == false) {
        detalles.push(detalleNotaCredito);
      }
    } else {
      let indice = detalles.findIndex(
        (detalle) =>
          detalle.facturaDetalleId === registroDependiente.facturaDetalleId
      );
      detalles.splice(indice, 1);
      detalles.push(detalleNotaCredito);
    }
    // ********Servicio para calcular los impuestos********
    calcularImpuesto(detalles);
    setCargando(false);
    mensajeInfo("Item agregado correctamente.");
  };
  const calcularTotalSinImpuesto = (
    cantidadSeleccionada,
    precioUnitario,
    descuentoValor
  ) => {
    return cantidadSeleccionada * precioUnitario - descuentoValor;
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
  const calcularImpuesto = (detalles) => {
    var categoriaCod = "";
    if (registro.categoriaCod === categorias.facturaVenta) {
      categoriaCod = categorias.notaCreditoVentas;
    } else {
      categoriaCod = categorias.notaCreditoCompras;
    }
    let datos = {
      detalles: detalles,
      categoriaCod: categoriaCod,
      personaId: registro.personaId,
    };
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/impuesto",
        JSON.stringify(datos),
        "POST"
      );
      if (!respuesta.error) {
        const resultado = agruparImpuestosPorCod(respuesta.datos);
        setRegistroDependiente({
          ...registroDependiente,
          facturaDetalleId: null,
          itemDes: "",
          itemId: 0,
          descripcion: "",
          cantidadSeleccionada: 0.0,
          precioUnitario: 0.0,
          descuentoValor: 0.0,
          detalles: detalles,
          impuestos: resultado,
          // venta
          lote: "",
          // compra
          precioVenta: 0.0,
          totalSinImp: 0.0,
          fechaVence: new Date().toISOString().split("T")[0],
          siglasProveedor: "",
          costoArtesano: 0.0, // precio unitario
          pvp: 0.0,
          total: 0.0,
        });
      } else {
        mensajeError("Error al calcular impuestos.");
      }
    })();
  };

  const guardar = () => {
    if (registroDependiente.fechaEmite === "") {
      mensajeError("Ingrese fecha emite.");
      return;
    }
    if (registroDependiente.autorizacionFecha === "") {
      mensajeError("Ingrese fecha de autorizacion.");
      return;
    }
    if (registroDependiente.documentoDes === "") {
      mensajeError("Seleccione documento.");
      return;
    }
    if (registroDependiente.formaPagoDes === "") {
      mensajeError("Selecciones la forma de pago.");
      return;
    }
    if (registroDependiente.plazoDias === "") {
      mensajeError("Ingrese el numero de dias de plazo.");
      return;
    }
    let categoria = "";
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        categoria = categorias.notaCreditoVentas;
        break;
      case categorias.facturaCompras:
        categoria = categorias.notaCreditoCompras;
        break;
    }

    setCargando(true);
    let datos = {
      documentoId: registroDependiente.documentoId,
      categoriaCod: categoria,
      organizacionCod: registroDependiente.organizacionCod,
      personaId: registroDependiente.personaId,
      fechaEmite: new Date(registroDependiente.fechaEmite.replaceAll("-", "/")), //date
      documentoCod: registroDependiente.documentoCod,
      documentoTipoCod: registroDependiente.documentoTipoCod,
      documentoNumero: registroDependiente.documentoNumero,
      documentoValor: registroDependiente.documentoValor,
      autorizacionNumero: registroDependiente.autorizacionNumero,
      autorizacionFecha: new Date(
        registroDependiente.autorizacionFecha.replaceAll("-", "/")
      ), //date
      estadoCod: estado.ingresado,
      observaciones: registroDependiente.observaciones,
      saldoPendiente: registroDependiente.saldoPendiente,
      formaPagoCod: registroDependiente.formaPagoCod,
      plazoDias: registroDependiente.plazoDias,
      detalles: registroDependiente.detalles,
      impuestos: registroDependiente.impuestos,
      facturaModifica: registroDependiente.facturaModifica,
      usuario: registroDependiente.usuario,
    };
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura",
        JSON.stringify(datos),
        "POST"
      );

      if (!respuesta.error) {
        // calcular el total sin impuesto-- por los ids
        //cantidad * precioUnitario) - descuentoValor
        const detalleActualizado = [];
        respuesta.datos.detalles.map((item) => {
          const totalSinImp =
            item.cantidad * item.precioUnitario - item.descuentoValor;
          item.totalSinImp = Number(totalSinImp).toFixed(2);
          detalleActualizado.push(item);
        });
        const impuestosAgrupados = agruparImpuestosPorCod(
          respuesta.datos.impuestos
        );
        setRegistroDependiente({
          ...registroDependiente,
          documentoId: respuesta.datos.documentoId,
          detalles: detalleActualizado,
          impuestos: impuestosAgrupados,
          estadoDes: respuesta.datos.estado.estadoDes,
          estadoCod: respuesta.datos.estado.estadoCod,
        });
        switch (registro.categoriaCod) {
          case categorias.facturaVenta:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.notaCreditoVentas
            );
            break;
          case categorias.facturaCompras:
            listaDocPorOrgOrigen(
              codigoOrganizacion,
              categorias.notaCreditoCompras
            );
            break;
          default:
            break;
        }
        mensajeInfo("Nota de credito creada.");
      } else {
        mensajeError("Error al registrar nota de credito.");
      }
      setCargando(false);
    })();
  };

  const eliminarDetalle = () => {
    setCargando(true);
    const detalles = Array.from(registroDependiente.detalles);
    let indice = detalles.findIndex(
      (detalle) =>
        detalle.facturaDetalleId === registroDependiente.facturaDetalleId &&
        detalle.item.itemId === registroDependiente.itemId &&
        detalle.descripcion === registroDependiente.descripcion &&
        detalle.cantidad === registroDependiente.cantidad &&
        detalle.precioUnitario === registroDependiente.precioUnitario &&
        detalle.descuentoValor === registroDependiente.descuentoValor
    );
    detalles.splice(indice, 1); // elimina el indice
    // ********Servicio para calcular los impuestos********
    calcularImpuesto(detalles);
    setCargando(false);
    mensajeInfo("Item eliminado de forma correcta.");
  };
  const handleCargaNota = (documentoId) => {
    mensajeInfo("Buscando registro...");
    var categoria = "";
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        categoria = categorias.notaCreditoVentas;
        break;
      case categorias.facturaCompras:
        categoria = categorias.notaCreditoCompras;
        break;
      default:
        break;
    }
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/recuperar/nota/" + documentoId,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        let nota = respuesta.datos;
        if (nota.documentoId !== null) {
          // si existe nota
          mensajeInfo("Registro encontrado.");
          const detalleActualizado = [];
          nota.detalles.map((item) => {
            const totalSinImp =
              item.cantidad * item.precioUnitario - item.descuentoValor;
            item.totalSinImp = totalSinImp;

            detalleActualizado.push(item);
          });
          const impuestoAgrupado = agruparImpuestosPorCod(nota.impuestos);

          setRegistroDependiente({
            ...registroDependiente,
            documentoId: nota.documentoId,
            //Categoria
            categoriaCod: "",
            //Organizacion
            organizacionCod: nota.organizacion.organizacionCod,
            organizacionDes: nota.organizacion.organizacionDes,

            //Persona
            personaId: nota.persona.personaId,
            nombre: nota.persona.nombre,

            fechaEmite: nota.fechaEmite.substr(0, nota.fechaEmite.indexOf("T")),

            // Documento
            documentoCod: nota.documento.documentoCod,
            documentoDes: nota.documento.documentoDes,
            ce: nota.documento.ce,

            // Documento Tipo
            documentoTipoCod: nota.documentoTipo.documentoTipoCod,
            documentoTipoDes: nota.documentoTipo.documentoTipoDes,

            documentoNumero: nota.documentoNumero,
            documentoValor: nota.documentoValor,
            autorizacionNumero: nota.autorizacionNumero,

            autorizacionFecha: new Date().toISOString().split("T")[0],

            // Estado
            estadoDes: nota.estado.estadoDes,
            estadoCod: nota.estado.estadoCod,

            // Forma de Pago
            formaPagoCod: nota.formaPago.formaPagoCod,
            formaPagoDes: nota.formaPago.formaPagoDes,

            plazoDias: nota.plazoDias,

            // listas
            detalles: detalleActualizado,
            impuestos: impuestoAgrupado,

            //Fatura Modifica
            facturaModifica: registro.documentoId,
            usuario: nota.usuario,
          });
        } else {
          mensajeInfo("No se ha encontrado registro.");
          setRegistroDependiente({
            ...registroDependiente,
            facturaModifica: registro.documentoId,
            organizacionCod: codigoOrganizacion,
            organizacionDes: organizacion,
            personaId: registro.personaId,
            nombre: registro.nombre,
            documentoTipoCod: registro.documentoTipoCod,
            documentoTipoDes: registro.documentoTipoDes,
            usuario: registro.usuario,
            //categoria
            categoriaCod: categoria,

            siglasProveedor: registro.siglasProveedor,
            llevaIva: registro.llevaIva,
          });
        }
      }
    })();
  };
  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/factura/" + registroDependiente.documentoId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        var categoria = "";
        switch (registro.categoriaCod) {
          case categorias.facturaVenta:
            categoria = categorias.notaCreditoVentas;
            break;
          case categorias.facturaCompras:
            categoria = categorias.notaCreditoCompras;
            break;
          default:
            break;
        }

        setRegistroDependiente({
          ...registroDependiente,
          documentoId: 0,
          //Categoria
          categoriaCod: categoria,
          //Organizacion
          rganizacionCod: codigoOrganizacion,
          organizacionDes: organizacion,
          //Persona
          personaId: registro.personaId,
          nombre: registro.nombre,

          fechaEmite: "", //date

          // Documento
          documentoCod: "",
          documentoDes: "",
          ce: 1, //Compribante electronico

          // Documento Tipo
          documentoTipoCod: registro.documentoTipoCod,
          documentoTipoDes: registro.documentoTipoDes,

          documentoNumero: "111111111111111",
          documentoValor: 0.0,
          autorizacionNumero: "0000000000",

          autorizacionFecha: new Date().toISOString().split("T")[0],

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

          //Fatura Modifica
          facturaModifica: registro.documentoId,
          usuario: registro.usuario,

          siglasProveedor: registro.siglasProveedor,
          llevaIva: registro.llevaIva,
        });
        listaDocPorOrgOrigen(codigoOrganizacion, categoria);
        mensajeInfo("Registro eliminado correctamente.");
      } else {
        mensajeError("Error al eliminar registro.");
      }
    })();
  };
  const generarPdf = () => {
    mensajeInfo("Generando archivo...");
    descargarArchivo(
      "/factura/procesar/nota/pdf/" + registroDependiente.documentoId,
      "nota_" + registroDependiente.documentoId + ".pdf",
      setCargando
    );
  };
  const procesar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/factura/procesar/nota/xml/" +
          registroDependiente.documentoId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        recuperarRegistroPorId();
        mensajeInfo("Nota de credito procesada correctamente.");
      } else {
        mensajeError("Error al procesar nota.");
      }
    })();
  };
  const recuperarRegistroPorId = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS +
          "/factura/recuperar/registro/" +
          registroDependiente.documentoId,
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

  useEffect(() => {
    switch (registro.categoriaCod) {
      case categorias.facturaVenta:
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.notaCreditoVentas);
        break;
      case categorias.facturaCompras:
        listaDocPorOrgOrigen(codigoOrganizacion, categorias.notaCreditoCompras);
        break;
      default:
        break;
    }
    handleCargaNota(registro.documentoId);
  }, [registro]);
  useEffect(() => {
    listaFormasPagoPorOrganizacion(codigoOrganizacion);
    listaDocumentosTipos();
    listaItems(codigoOrganizacion);
    setRegistroDependiente(notaCreditoObj());
    listarPrecioCalculaPorOrganizacion(codigoOrganizacion);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(
        accionesPantalla,
        guardar,
        agregarDetalle,
        eliminarDetalle,
        registroDependiente,
        eliminar,
        generarPdf,
        procesar,
        registro
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
      {stepActivo === 0 && !cargando && <NotaCreditoStepDetalleNCredito />}
      <SpinnerSgm size={35} loading={cargando} />
    </Box>
  );
}

function header(
  accionesPantalla,
  guardar,
  agregarDetalle,
  eliminarDetalle,
  registroDependiente,
  eliminar,
  generarPdf,
  procesar,
  registro
) {
  return (
    <HeaderTab>
      <div>
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
        <HeaderButton
          label="Agregar Detalle"
          onClick={() => agregarDetalle()}
          tipo={"agregarItem"}
        />

        <HeaderButton
          label="Eliminar Detalle"
          onClick={() => eliminarDetalle()}
          tipo={"removerItem"}
        />
        {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
          <SaveButtonSgm onClick={() => guardar()} />
        )}
      </div>
      {registroDependiente.documentoId !== 0 && (
        <div>
          <HeaderButton
            label="Generar comprobante"
            onClick={() => {
              generarPdf();
            }}
            tipo={"pdf"}
          />
          <HeaderButton
            label="Procesar Nota"
            onClick={() => {
              procesar();
            }}
            tipo={"procesar"}
          />
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminar()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
