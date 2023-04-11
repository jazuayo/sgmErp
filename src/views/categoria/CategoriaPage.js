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
import CategoriaStepListar from "./CategoriaStepListar";
import CategoriaStepDetalle from "./CategoriaStepDetalle";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import DeleteButtonSgm from "../../components/DeleteButtonSgm.js";
import SaveButtonSgm from "../../components/SaveButtonSgm.js";
const steps = ["LISTADO CATEGORIAS", "DETALLE CATEGORIA"];

export default function CategoriaPage(props) {
  const { accionesPantalla } = props;
  const {
    stepActivo,
    setStepActivo,
    listaCategoriasTipo,
    listaCategoriasOrg,
    registro,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion, codigoUsuario } = getUser();

  const guardar = () => {
    if (stepActivo === 1) {
      //validar campos
      if (registro.categoriaCod === "") {
        mensajeError("Ingrese codigo de categoria.");
        return;
      }
      if (registro.categoriaDes === "") {
        mensajeError("Ingrese descripcion de categoria.");
        return;
      }
      if (registro.categoriaTipoDes === "") {
        mensajeError("Seleccione el tipo de categoria.");
        return;
      }
      setCargando(true);
      let datos = {
        categoriaCod: registro.categoriaCod,
        categoriaDes: registro.categoriaDes,
        categoriaTipoCod: registro.categoriaTipoCod,
        organizacionCod: registro.organizacionCod,
        usuario: codigoUsuario,
        catOrgId: registro.catOrgId,
      };

      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/categoria",
          JSON.stringify(datos),
          "POST"
        );
        setCargando(false);
        if (!respuesta.error) {
          listaCategoriasOrg(codigoOrganizacion);
          mensajeInfo("Categoria registrada correctamente.");
        } else {
          mensajeError("Error al registrar las categorías.");
        }
      })();
    }
  };

  const eliminar = () => {
    if (stepActivo === 1) {
      setCargando(true);
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/categoriaOrganizacion/" + registro.catOrgId,
          null,
          "POST"
        );
        setCargando(false);
        if (!respuesta.error) {
          listaCategoriasOrg(codigoOrganizacion);
          stepAterior();
          mensajeInfo("Categoria eliminada correctamente");
        } else {
          mensajeError("Error al eliminar las categorías.");
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
    listaCategoriasTipo();
    listaCategoriasOrg(codigoOrganizacion);
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
      {stepActivo === 0 && !cargando && <CategoriaStepListar />}
      {stepActivo === 1 && !cargando && <CategoriaStepDetalle />}
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
            <React.Fragment>
              <SaveButtonSgm onClick={() => guardar()} />
              <DeleteButtonSgm onClick={() => eliminar()} />
            </React.Fragment>
          )}
        </div>
      )}
    </HeaderTab>
  );
}