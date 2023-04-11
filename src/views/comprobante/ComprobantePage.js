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
import { categorias, estado } from "../../util/types.js";
import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import ComprobanteStepListar from "./ComprobanteStepListar";
import ComprobanteStepDetalle from "./ComprobanteStepDetalle";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
import { comprobanteObj } from "../../util/types.js";
import { descargarArchivo } from "../../util/descargarArchivos.js";

const steps = ["LISTADO COMPROBANTES", "DETALLE DEL COMPROBANTE"];

export default function ComprobantePage(props) {
  const { accionesPantalla } = props;
  const { codigoOrganizacion, codigoUsuario } = getUser();
  const {
    stepActivo,
    setStepActivo,
    setComprobantes,
    registro,
    setRegistro,
    listaDocPorOrgOrigen,
    listarPlanDeCuentas,
    listaEstados,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  const sumaValoresDebitoCredito = (detalles) => {
    let datos = {
      detalles: detalles,
    };
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/comprobante/totales",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistro({
          ...registro,
          idReg: null,
          cuentaCod: "",
          cuentaDes: "",
          debito: "0",
          credito: "0",
          concepto: "",
          tableDataId: "",
          detalles: respuesta.datos,
        });
      } else {
        mensajeError("Error al operar con los datos de debito y credito.");
      }
    })();
  };
  const agregarCuenta = () => {
    if (registro.cuentaCod === "") {
      mensajeError("Seleccione la cuenta.");
      return;
    }
    if (registro.concepto === "") {
      mensajeError("Ingrese el concepto.");
      return;
    }
    if (String(registro.debito) === "0" && String(registro.credito) === "0") {
      mensajeError(
        "Si existe valor de débito, el valor de crédito debe ser cero y viceversa."
      );
      return;
    }
    setCargando(true);
    let detalleCuenta = {
      idReg: registro.idReg,
      tableDataId: registro.tableDataId,
      cuenta: {
        cuentaCod: registro.cuentaCod,
        cuentaDes: registro.cuentaDes,
      },
      debito: registro.debito,
      credito: registro.credito,
      concepto: registro.concepto,
    };
    const detalles = Array.from(registro.detalles);

    if (registro.tableDataId !== "") {
      let indice = detalles.findIndex(
        (detalle) => detalle.tableData.id === registro.tableDataId
      );
      detalles.splice(indice, 1);
    }
    detalles.push(detalleCuenta);
    sumaValoresDebitoCredito(detalles);
    setCargando(false);
  };

  const guardarComprobante = () => {
    //validaciones
    if (registro.fecha === "") {
      mensajeError.error("Ingrese valor de fecha");
      return;
    }
    if (registro.documentoDes === "") {
      mensajeError("Selecione el documento");
      return;
    }
    if (registro.conceptoComp === "") {
      mensajeError("Ingrese concepto");
      return;
    }
    if (registro.fuente === "") {
      mensajeError("Ingrese fuente");
      return;
    }
    setCargando(true);
    var comprobanteCodAux = null;
    if (registro.comprobanteCod !== "") {
      comprobanteCodAux = registro.comprobanteCod;
    }
    //let fecha = new Date(registro.fecha).toISOString().split("T")[0];
    let datos = {
      comprobanteCod: comprobanteCodAux,
      fecha: new Date(registro.fecha.replaceAll("-", "/")),
      concepto: registro.conceptoComp,
      fuente: registro.fuente,
      deudorBeneficiario: registro.deudorBeneficiario,
      esAutomatico: registro.esAutomatico,
      usuario: codigoUsuario,
      chequeNumero: registro.chequeNumero,
      detalles: registro.detalles,
      documentoCod: registro.documentoCod,
      organizacionCod: registro.organizacionCod,
      compAutCabcod: registro.compAutCabcod,
      estadoCod: registro.estadoCod,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/comprobante",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistro({
          ...registro,
          comprobanteCod: respuesta.datos.comprobanteCod,
          estadoDes: respuesta.datos.estado.estadoDes,
        });
        if (registro.fechaDesde !== "") {
          buscarComprobantePorFechas();
        }
        mensajeInfo("Comprobante Guardado.");
      } else {
        mensajeError("Error al registrar el comprobante.");
      }
    })();
  };

  const eliminarCuenta = () => {
    setCargando(true);
    const detalles = registro.detalles.filter(
      (detalle) => detalle.tableData.id !== registro.tableDataId
    );
    sumaValoresDebitoCredito(detalles);
    if (registro.idReg !== null) {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/comprobanteCuenta/" + registro.idReg,
          null,
          "POST"
        );
        if (respuesta.error) {
          mensajeError("Error al eliminar el comprobante cuenta.");
        }
      })();
    }
    setCargando(false);
  };
  const eliminarComprobante = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/comprobante/" + registro.comprobanteCod,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        buscarComprobantePorFechas();
        mensajeInfo("Comprobante eliminado correctamente.");
        stepAterior();
      } else {
        mensajeError("Error al eliminar el comprobante.");
      }
    })();
  };

  const buscarComprobantePorFechas = () => {
    // validar campos de busqueda

    if (registro.fechaDesde === "" || registro.fechaHasta === "") {
      mensajeError("Ingresa los valores de 'Fecha Desde' y 'Fecha Hasta'.");
      return;
    }
    var difference =
      new Date(registro.fechaHasta).getTime() -
      new Date(registro.fechaDesde).getTime();
    if (difference < 0) {
      mensajeError("La 'Fecha Desde' debe ser menor que la 'Fecha Hasta'.");
      return;
    }
    if (
      registro.comprobanteBusqueda === "" &&
      registro.conceptoBusqueda === ""
    ) {
      mensajeError("Ingrese el valor de 'Comprobante' o 'Concepto'.");
      return;
    }
    setComprobantes([]);
    setCargando(true);
    let datos = {
      organizacionCod: codigoOrganizacion,
      fechaDesde: new Date(registro.fechaDesde.replaceAll("-", "/")),
      fechaHasta: new Date(registro.fechaHasta.replaceAll("-", "/")),
      comprobanteCod: registro.comprobanteBusqueda.toUpperCase(),
      concepto: registro.conceptoBusqueda,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/comprobante/busqueda",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        setComprobantes(respuesta.datos);
      } else {
        mensajeError("Error al listar los comprobantes.");
      }
    })();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  const stepAterior = () => {
    setRegistro({
      ...registro,
      comprobanteCod: "",
      fecha: new Date(),
      conceptoComp: "",
      fuente: "",
      deudorBeneficiario: "",
      esAutomatico: false,
      usuario: ".",
      chequeNumero: 0,
      detalles: [],
      compAutCabcod: 0,

      // Documento
      documentoCod: null,
      documentoDes: "",

      // Organización
      organizacionCod: "",
      organizacionDes: "",

      // Estado
      estadoCod: estado.mayorizado,
      estadoDes: "Mayorizado",

      // Detalles Comprobante Cuenta
      idReg: null,
      cuentaCod: "",
      cuentaDes: "",
      debito: "0",
      credito: "0",
      concepto: "",
    });
    setStepActivo(stepActivo - 1);
  };

  const generarPdfFactura = () => {
    mensajeInfo("Generando comprobante pdf...");
    descargarArchivo(
      "/comprobante/imprimir/" + registro.comprobanteCod,
      "Comprobante-" + registro.comprobanteCod + ".pdf",
      setCargando
    );
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(comprobanteObj());
    listaDocPorOrgOrigen(codigoOrganizacion, categorias.comprobantesContables);
    //listaCuentasPorOrganizacion(codigoOrganizacion);
    listarPlanDeCuentas(codigoOrganizacion, "movimiento");
    listaEstados();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(
        stepActivo,
        accionesPantalla,
        stepSiguente,
        stepAterior,
        guardarComprobante,
        agregarCuenta,
        eliminarComprobante,
        eliminarCuenta,
        buscarComprobantePorFechas,
        registro,
        generarPdfFactura
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
      <SpinnerSgm size={35} loading={cargando} />
      {stepActivo === 0 && !cargando && <ComprobanteStepListar />}
      {stepActivo === 1 && !cargando && <ComprobanteStepDetalle />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardarComprobante,
  agregarCuenta,
  eliminarComprobante,
  eliminarCuenta,
  buscarComprobantePorFechas,
  registro,
  generarPdfFactura
) {
  return (
    <HeaderTab>
      {stepActivo === 0 && (
        <div>
          <HeaderButton
            label="Buscar"
            onClick={() => buscarComprobantePorFechas()}
            tipo={"buscar"}
          />
          <HeaderButton
            label="Siguiente"
            onClick={() => stepSiguente()}
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
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <SaveButtonSgm onClick={() => guardarComprobante()} />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <HeaderButton
              label="Agregar Cuenta"
              onClick={() => agregarCuenta()}
              tipo={"agregarItem"}
            />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <HeaderButton
              label="Eliminar Cuenta"
              onClick={() => eliminarCuenta()}
              tipo={"removerItem"}
            />
          )}
        </div>
      )}
      {stepActivo === 1 && registro.comprobanteCod !== "" && (
        <div>
          <HeaderButton
            label="Generar comprobante"
            onClick={() => {
              generarPdfFactura();
            }}
            tipo={"pdf"}
          />
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminarComprobante()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
