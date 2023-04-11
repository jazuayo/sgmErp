import React, { useContext, useEffect, useState } from "react";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box } from "@mui/material";
import HeaderTab from "../header/HeaderTab";
import IconSgm from "../../util/IconSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import SpinnerSgm from "../../components/SpinnerSgm";
import HeaderButton from "../header/HeaderButton";
import { getUser } from "../../util/common/Common";
import { reporteObj } from "../../util/types";
import { descargarArchivoRegistro } from "../../util/descargarArchivos";
import { fechaHoraFormatJunto } from "../../util/utils";
// Steps
import ReporteStepDetalle from "./ReporteStepDetalle";

const steps = ["Generar reportes"];

export default function ReportePage(props) {
  const { codigoOrganizacion, codigoUsuario } = getUser();
  const { stepActivo, setRegistro, listarPlanDeCuentas, registro } =
    useContext(GenerarContext);
  const { cargando, mensajeError, mensajeInfo, setCargando } =
    useContext(AppContext);

  const generarReporte = () => {
    // Validar datos generales
    /*
    if (registro.tipoRepCod !== "balGen") {
      if (registro.fechaDesde === "" || registro.fechaHasta === "") {
        mensajeError("Ingrese fechas de reporte.");
        return;
      }
    }
*/
    if (registro.tipoRepCod === "") {
      mensajeError("Seleccione el tipo de reporte.");
      return;
    }

    if (
      registro.cuentaIniCod === "" &&
      registro.tipoRepCod !== "diaGen" &&
      registro.tipoRepCod !== "balGen" &&
      registro.tipoRepCod !== "estRes"
    ) {
      mensajeError("Seleccione la cuenta inicial.");
      return;
    }
    if (
      registro.cuentaFinCod === "" &&
      registro.tipoRepCod !== "diaGen" &&
      registro.tipoRepCod !== "balGen" &&
      registro.tipoRepCod !== "estRes"
    ) {
      mensajeError("Seleccione la cuenta final.");
      return;
    }
    if (
      registro.nivel === "" &&
      registro.tipoRepCod !== "diaGen" &&
      registro.tipoRepCod !== "mayGen"
    ) {
      mensajeError("Ingrese el valor de nivel.");
      return;
    }

    let datos = {
      //tipo reporte
      tipoRepCod: registro.tipoRepCod,
      //cuenta inicial
      cuentaIniCod: registro.cuentaIniCod,
      //cuenta final
      cuentaFinCod: registro.cuentaFinCod,
      //nivel
      nivel: registro.nivel,
      //fechas
      fechaDesde: new Date(registro.fechaDesde.replaceAll("-", "/")),
      fechaHasta: new Date(registro.fechaHasta.replaceAll("-", "/")),
      //organizacion
      organizacionCod: registro.organizacionCod,
      //usuario
      usuarioCod: codigoUsuario,
    };
    mensajeInfo("Generando reporte...");
    let fechaAct = fechaHoraFormatJunto(new Date());
    let rep = registro.nombre + "_" + fechaAct + ".pdf";
    descargarArchivoRegistro(registro.dir, rep, datos, setCargando);

    setRegistro({
      ...registro,
      //tipo reporte
      tipoRepCod: "",
      tipoRepDes: "",
      //cuenta inicial
      cuentaIniCod: "",
      cuentaIniDes: "",
      //cuenta final
      cuentaFinCod: "",
      cuentaFinDes: "",
      //nivel
      nivel: "",
      //fechas
      fechaDesde: new Date().toISOString().split("T")[0],
      fechaHasta: new Date().toISOString().split("T")[0],
      //dir URL de resp
      dir: "",
    });
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(reporteObj());
    listarPlanDeCuentas(codigoOrganizacion, "movimiento");
  }, []);
  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(stepActivo, generarReporte)}
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
      {stepActivo === 0 && !cargando && <ReporteStepDetalle />}
    </Box>
  );
}

function header(stepActivo, generarReporte) {
  return (
    <HeaderTab>
      {stepActivo === 0 && (
        <div>
          <HeaderButton
            label="Imprimir"
            onClick={() => generarReporte()}
            tipo={"imprimir"}
          />
          <HeaderButton
            label="Actualizar"
            onClick={() => window.location.reload()}
            tipo={"actualizar"}
          />
        </div>
      )}
    </HeaderTab>
  );
}
