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
import { GenerarContext } from "../../context/GenerarContext";
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";

// Steps
import PersonaStepListar from "./PersonaStepListar";
import PersonaStepDetalle from "./PersonaStepDetalle";
import SaveButtonSgm from "../../components/SaveButtonSgm.js";
import DeleteButtonSgm from "../../components/DeleteButtonSgm.js";
const steps = ["LISTAR PERSONAS", "DETALLE DE PERSONA"];

export default function PersonaPage(props) {
  const { accionesPantalla } = props;
  const {
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    listaPersonas,
    listaTipoPersona,
    listarLugares,
    setCantones,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion, organizacion } = getUser();

  const guardar = () => {
    // validar campos basado en el valor de la entidad-Back
    if (registro.esCliente === 0 && registro.esProveedor === 0) {
      mensajeError("Indique si es 'Cliente', 'Proveedor' o ambas.");
      return;
    }
    if (registro.provincia === "") {
      mensajeError("Seleccione provincia.");
      return;
    }
    if (registro.nombre === "") {
      mensajeError("Seleccione canton.");
      return;
    }
    if (registro.esProveedor === 1 && registro.siglasProveedor === "") {
      mensajeError("Ingrese la siglas del proveedor.");
      return;
    }

    if (registro.numeroId === "") {
      mensajeError("Ingrese numero de id.");
      return;
    }
    if (registro.direccion === "") {
      mensajeError("Ingrese direccion.");
      return;
    }
    if (registro.telefono === "") {
      mensajeError("Ingrese telefono.");
      return;
    }

    const email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!email.test(registro.email) && registro.email == !"") {
      mensajeError("Email no valido.");
      return;
    }
    setCargando(true);
    let datos = {
      personaId: registro.personaId,
      direccion: registro.direccion,
      email: registro.email,
      nombre: registro.nombrePersona,
      numeroId: registro.numeroId,
      telefono: registro.telefono,
      usuario: registro.usuario,
      //organizacion
      organizacionCod: registro.organizacionCod,
      //tipo de persona
      perTipoCod: registro.perTipoCod,
      esCliente: registro.esCliente,
      esProveedor: registro.esProveedor,
      siglasProveedor: registro.siglasProveedor,
      //lugar
      lugarId: registro.lugarId,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/persona",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaPersonas(codigoOrganizacion, "todas");
        setRegistro({
          ...registro,
          personaId: respuesta.datos.personaId,
        });
        mensajeInfo("Persona registrada correctamente.");
      } else {
        mensajeError("Error al registrar persona.");
      }
    })();
  };

  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/persona/" + registro.personaId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaPersonas(codigoOrganizacion, "todas");
        stepAterior();
        mensajeInfo("Persona eliminada correctamente.");
      } else {
        mensajeError("Error al eliminar persona.");
      }
    })();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  const stepAterior = () => {
    setStepActivo(stepActivo - 1);
    setCantones([]);
  };

  useEffect(() => {
    listaPersonas(codigoOrganizacion, "todas");
    listaTipoPersona();
    listarLugares();
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
        registro,
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
      {stepActivo === 0 && !cargando && <PersonaStepListar />}
      {stepActivo === 1 && !cargando && <PersonaStepDetalle />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardar,
  registro,
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
          <SaveButtonSgm onClick={() => guardar()} />
        </div>
      )}
      {stepActivo === 1 && registro.personaId !== 0 && (
        <div>
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminar(true)} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
