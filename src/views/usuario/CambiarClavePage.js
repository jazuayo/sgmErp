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
import SaveButtonSgm from "../../components/SaveButtonSgm.js";
import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import CmbClaveStepDetalle from "./CmbClaveStepDetalle";
const steps = ["CAMBIAR CONTRASEÑA"];

export default function CambiarClavePage(props) {
  const { accionesPantalla } = props;
  const { stepActivo, registro } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoUsuario } = getUser();
  const guardar = async () => {
    if (registro.claveAnterior == "") {
      mensajeError("Ingrese la contraseña anterior");
      return;
    }

    if (registro.nuevaClave == "") {
      mensajeError("Ingrese la contraseña nueva");
      return;
    }

    if (registro.confirmacionClave == "") {
      mensajeError("Ingrese la confirmación de la contraseña");
      return;
    }

    if (registro.nuevaClave != registro.confirmacionClave) {
      mensajeError(
        "No coincide la nueva contraseña y la confirmación de la contraseña"
      );
      return;
    }

    let datos = {
      codUsuario: codigoUsuario,
      claveNueva: registro.nuevaClave,
      claveAnterior: registro.claveAnterior,
    };

    await (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/usuario/cambiarClave",
        JSON.stringify(datos),
        "POST"
      );
      if (!respuesta.error) {
        mensajeInfo(respuesta.datos.mensaje);
        window.location.href = "/login";
      } else {
        mensajeError("La contraseña anterior no coincide");
        return;
      }
    })();
  };

  React.useEffect(() => {
    localStorage.removeItem("registro");
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(stepActivo, accionesPantalla, guardar)}
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
      {stepActivo === 0 && !cargando && <CmbClaveStepDetalle />}
    </Box>
  );
}

function header(stepActivo, accionesPantalla, guardar) {
  return (
    <HeaderTab>
      {stepActivo === 0 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <SaveButtonSgm onClick={() => guardar()} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
