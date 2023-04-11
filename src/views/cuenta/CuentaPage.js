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
import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import CuentaStepListar from "./CuentaStepListar";
import CuentaStepDetalle from "./CuentaStepDetalle";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
const steps = ["LISTADO CUENTAS", "DETALLE CUENTA"];

export default function CuentaPage(props) {
  const { accionesPantalla } = props;
  const {
    stepActivo,
    setStepActivo,
    listaCuentasPorOrganizacion,
    listaTiposPlanCuentas,
    registro,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoUsuario, codigoOrganizacion } = getUser();
  const guardar = () => {
    // validaciones
    if (registro.fechaDesde === "" || registro.fechaHasta === "") {
      mensajeError("Ingresa la Fecha Desde y la Fecha Hasta.");
      return;
    }

    if (registro.cuentaCod === "") {
      mensajeError("Ingrese campo codigo");
      return;
    }
    if (registro.cuentaNum === "") {
      mensajeError("Ingrese campo numero.");
      return;
    }
    if (registro.cuentaDes === "") {
      mensajeError("Ingrese campo descripcion.");
      return;
    }
    if (registro.cuentaTipoDes === "") {
      mensajeError("Seleccione el tipo de cuenta.");
      return;
    }
    if (registro.nivel === "") {
      mensajeError("Ingrese campo nivel.");
      return;
    }

    var difference =
      new Date(registro.fechaHasta.replaceAll("-", "/")).getTime() -
      new Date(registro.fechaDesde.replaceAll("-", "/")).getTime();

    if (difference < 0) {
      mensajeError("La Fecha Desde debe ser menor que la Fecha Hasta.");
      return;
    }

    if (stepActivo === 1) {
      setCargando(true);
      let desdeF = new Date(registro.fechaDesde).toISOString().split("T")[0];
      let hastaF = new Date(registro.fechaHasta).toISOString().split("T")[0];

      let datos = {
        cuentaCod: registro.cuentaCod,
        cuentaNum: registro.cuentaNum,
        cuentaDes: registro.cuentaDes,
        observaciones: registro.observaciones,
        movimiento: registro.movimiento,
        nivel: registro.nivel,
        fechaDesde: new Date(desdeF.replaceAll("-", "/")),
        fechaHasta: new Date(hastaF.replaceAll("-", "/")),
        operativa: registro.operativa,
        cuentaCodPad: registro.cuentaCodPad,
        cuentaTipoCod: registro.cuentaTipoCod,
        organizacionCod: registro.organizacionCod,
        usuario: codigoUsuario,
      };

      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/planCuenta",
          JSON.stringify(datos),
          "POST"
        );
        setCargando(false);
        if (!respuesta.error) {
          listaCuentasPorOrganizacion(codigoOrganizacion);
          mensajeInfo("Plan de cuenta registrado correctamente.");
        } else {
          mensajeError("Error al registrar el plan de cuenta.");
        }
      })();
    }
  };

  const eliminar = () => {
    if (stepActivo === 1) {
      setCargando(true);
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/planCuenta/" + registro.cuentaCod,
          null,
          "POST"
        );
        setCargando(false);
        if (!respuesta.error) {
          listaCuentasPorOrganizacion(codigoOrganizacion);
          stepAterior();
          mensajeInfo("Plan de cuenta eliminado correctamente.");
        } else {
          mensajeError("Error al eliminar el plan de cuenta.");
        }
      })();
    }
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  const stepAterior = () => {
    setStepActivo(stepActivo - 1);
  };

  useEffect(() => {
    listaCuentasPorOrganizacion(codigoOrganizacion);
    listaTiposPlanCuentas();
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
        eliminar
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
      {stepActivo === 0 && !cargando && <CuentaStepListar />}
      {stepActivo === 1 && !cargando && <CuentaStepDetalle />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardar,
  eliminar
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
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <SaveButtonSgm onClick={() => guardar()} />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminar()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
