import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import HeaderTab from "../header/HeaderTab.js";
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
import { parametroObj } from "../../util/types";
//steps
import ClaveFirmaDetalle from "./ClaveFirmaDetalle";
const steps = ["CLAVE DE FIRMA ELECTRONICA"];

export default function ClaveFirmaPage(props) {
  const { accionesPantalla } = props;
  const { stepActivo, registro, setRegistro } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion } = getUser();

  const cargarParametro = (orgCod, clave) => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/parametro/clave/" + orgCod + "/" + clave,
        null,
        "GET"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistro({
          ...registro,
          parametroId: respuesta.datos.parametroId,
          parametroDes: respuesta.datos.parametroDes,
          clave: respuesta.datos.clave,
          //valor: respuesta.datos.valor,
          organizacionCod: codigoOrganizacion,
        });
      } else {
        mensajeError("Error al recuperar parametro.");
      }
    })();
  };
  const guardar = () => {
    if (registro.valor === "") {
      mensajeError("Ingrese valor del campo.");
      return;
    }
    let datos = {
      parametroId: registro.parametroId,
      parametroDes: registro.parametroDes || "Clave para el certificado",
      clave: "sriCeCertClave",
      valor: registro.valor,
      fechaDesde: new Date("2022-01-01"),
      fechaHasta: new Date("2122-01-01"),
      organizacionCod: registro.organizacionCod,
    };
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/parametro",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        setRegistro({ ...registro, valor: "" });
        mensajeInfo("Valor registrado correctamente.");
      } else {
        mensajeError("Error al registrar valor.");
      }
    })();
  };
  useEffect(() => {
    localStorage.removeItem("registro");
    setRegistro(parametroObj());
    cargarParametro(codigoOrganizacion, "sriCeCertClave");
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
      {stepActivo === 0 && !cargando && <ClaveFirmaDetalle />}
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
