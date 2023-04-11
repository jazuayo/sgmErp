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
import { documentoObj } from "../../util/types.js";
import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import DocumentoStepDetalles from "./DocumentoStepDetalles";
import DocumentoStepListar from "./DocumentoStepListar";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
const steps = ["LISTADO DOCUMENTOS", "DETALLES DEL DOCUMENTO"];

export default function DocumentoPage(props) {
  const { accionesPantalla } = props;
  const { codigoOrganizacion, codigoUsuario, organizacion } = getUser();
  const {
    stepActivo,
    setStepActivo,
    listaDocumentosPorOrg,
    registro,
    setRegistro,
    listaCategoriasOrg,
    listaEstados,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const guardarDocumento = () => {
    setCargando(true);
    // valor de fechas
    //const detalles = Array.from(registro.series);
    const detalles = [];
    registro.series.map((item) => {
      let emisionD = new Date(item.fechaEmision).toISOString().split("T")[0];
      let caducaD = new Date(item.fechaCaduca).toISOString().split("T")[0];
      const objSerie = {
        docSerieId: item.docSerieId,
        documentoCod: registro.codigo,
        fechaEmision: new Date(emisionD.replaceAll("-", "/")),
        secuencialDesde: item.secuencialDesde,
        secuencialHasta: item.secuencialHasta,
        autorizacion: item.autorizacion,
        fechaCaduca: new Date(caducaD.replaceAll("-", "/")),
      };
      detalles.push(objSerie);
    });
    console.log(detalles);
    let datos = {
      documentoCod: registro.codigo,
      documentoDes: registro.descripcion,
      secuencial: registro.secuencial,
      longitud: registro.longitud,
      inicio: registro.inicio,
      orden: registro.orden,
      estadoCod: registro.estadoCod, //registro.codigoEstado,
      origenCod: registro.categoriaCod, //registro.codigoOrigen,
      organizacionCod: registro.codigoOrganizacion,
      usuario: codigoUsuario,
      ce: registro.ce,
      series: detalles,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/documento",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaDocumentosPorOrg(codigoOrganizacion);
        setRegistro({
          ...registro,
          series: respuesta.datos.series,
        });
        mensajeInfo("Documento registrado correctamente.");
      } else {
        mensajeError("Error al registrar el documento.");
      }
    })();
  };
  const guardarSerie = () => {
    var difference =
      new Date(registro.fechaCaduca.replaceAll("-", "/")).getTime() -
      new Date(registro.fechaEmision.replaceAll("-", "/")).getTime();

    if (difference < 0) {
      mensajeError("La Fecha Emision debe ser menor que la Fecha Caduca.");
      return;
    }
    if (registro.codigo === "") {
      mensajeError("Ingrese un valor de codigo en detalles de documento.");
      return;
    }

    setCargando(true);
    let detalleSerie = {
      documentoCod: registro.codigo,
      docSerieId: registro.docSerieId,
      fechaEmision: registro.fechaEmision,
      secuencialDesde: registro.secuencialDesde,
      secuencialHasta: registro.secuencialHasta,
      autorizacion: registro.autorizacion,
      fechaCaduca: registro.fechaCaduca,
    };
    const series = Array.from(registro.series);
    if (registro.tableDataId !== "") {
      let indice = series.findIndex(
        (serie) => serie.tableData.id === registro.tableDataId
      );
      series.splice(indice, 1);
    }
    series.push(detalleSerie);
    setRegistro({
      ...registro,
      docSerieId: 0,
      fechaEmision: "",
      secuencialDesde: 0,
      secuencialHasta: 0,
      autorizacion: "",
      fechaCaduca: "",
      tableDataId: "",
      series: series,
    });
    setCargando(false);
    mensajeInfo("Serie agregada correctamente.");
  };

  const eliminarDocumento = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/documento/" + registro.codigo,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaDocumentosPorOrg(codigoOrganizacion);
        stepAterior();
        mensajeInfo("Documento eliminado correctamente.");
      } else {
        mensajeError("Error al eliminar el documento.");
      }
    })();
  };
  const eliminarSerie = () => {
    setCargando(true);
    if (registro.docSerieId !== 0) {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/documentoSerie/" + registro.docSerieId,
          null,
          "POST"
        );
        if (respuesta.error) {
          mensajeError("Error al eliminar la serie.");
        }
      })();
    }
    const series = registro.series.filter(
      (serie) => serie.tableData.id !== registro.tableDataId
    );
    setRegistro({
      ...registro,
      docSerieId: 0,
      fechaEmision: "",
      secuencialDesde: 0,
      secuencialHasta: 0,
      autorizacion: "",
      fechaCaduca: "",
      tableDataId: "",
      series: series,
    });

    mensajeInfo("Series eliminada correctamente.");
    setCargando(false);
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  const stepAterior = () => {
    setRegistro(documentoObj());
    setStepActivo(stepActivo - 1);
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(documentoObj());
    listaDocumentosPorOrg(codigoOrganizacion);
    listaCategoriasOrg(codigoOrganizacion);
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
        guardarDocumento,
        eliminarDocumento,
        guardarSerie,
        eliminarSerie
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
      {stepActivo === 0 && !cargando && <DocumentoStepListar />}
      {stepActivo === 1 && !cargando && <DocumentoStepDetalles />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardarDocumento,
  eliminarDocumento,
  guardarSerie,
  eliminarSerie
) {
  return (
    <HeaderTab>
      {stepActivo === 0 && (
        <HeaderButton
          label="Siguiente"
          onClick={() => stepSiguente()}
          tipo={"next"}
        />
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
            onClick={() => guardarSerie()}
            tipo={"agregarItem"}
          />
          <HeaderButton
            label="Eliminar detalle seleccionado."
            onClick={() => eliminarSerie()}
            tipo={"removerItem"}
          />
        </div>
      )}
      {stepActivo === 1 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <React.Fragment>
              <SaveButtonSgm onClick={() => guardarDocumento()} />
              <DeleteButtonSgm onClick={() => eliminarDocumento()} />
            </React.Fragment>
          )}
        </div>
      )}
    </HeaderTab>
  );
}
