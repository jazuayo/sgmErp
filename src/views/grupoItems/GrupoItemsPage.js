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
import { verificaAccion, ACCIONES_PANTALLA } from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import { getUser } from "../../util/common/Common";
import { grupoItemObj } from "../../util/types.js";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
// Steps
import GrupoItemsStepListar from "./GrupoItemsStepListar.js";
import GrupoItemsStepDetalle from "./GrupoItemsStepDetalle.js";
const steps = ["LISTAR GRUPO DE ITEMS", "DETALLE DEL GRUPO DE ITEMS"];

export default function GrupoItemsPage(props) {
  const { accionesPantalla } = props;
  const {
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    listaGrupoItems,
    impuesto,
    setImpuesto,
    setGrupoItemsImpuesto,
    grupoItemsImpuesto,
    itemGrupoTipo,
    listaImpuestos,
    listarItemGrupoTiposPorOrganizacion,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion, organizacion } = getUser();
  const guardar = () => {
    // validar campos
    if (registro.itemGrupoCod === "") {
      mensajeError("Ingrese codigo del grupo.");
      return;
    }
    if (registro.itemGrupoDes === "") {
      mensajeError("Ingrese descripcion del grupo.");
      return;
    }
    setCargando(true);
    let datos = {
      itemGrupoCod: registro.itemGrupoCod,
      itemGrupoDes: registro.itemGrupoDes,
      organizacionCod: registro.organizacionCod,
      impuestoId: registro.impuestoId,
      itemGrupoTipoCod: registro.itemGrupoTipoCod,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/grupoItems",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        mensajeInfo("Grupo de items registrado.");
      } else {
        mensajeError("Error al registrar grupo de items.");
      }
    })();
  };

  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/grupoItems/" + registro.itemGrupoCod,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaGrupoItems(codigoOrganizacion);
        stepAterior();
        mensajeInfo("Grupo de items eliminado.");
      } else {
        mensajeError("Error al eliminar grupo de items.");
      }
    })();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
    if (itemGrupoTipo.length === 1) {
      setRegistro({
        ...registro,
        itemGrupoTipoCod: itemGrupoTipo[0].itemGrupoTipoCod,
        itemGrupoTipoDes: itemGrupoTipo[0].itemGrupoTipoDes,
      });
    }
  };

  const stepAterior = () => {
    setGrupoItemsImpuesto([]);
    setRegistro({
      ...registro,
      itemGrupoCod: "",
      itemGrupoDes: "",
      itemGrupoTipoCod: "",
      itemGrupoTipoDes: "",
    });
    listaGrupoItems(codigoOrganizacion);
    listaImpuestos();
    setStepActivo(stepActivo - 1);
  };
  const agregarEnAsignados = () => {
    const marcado = impuesto.filter((item) => item.tableData.checked === true);
    if (marcado.length === 0) {
      mensajeError("No existe valores de 'Disponibles' seleccionados.");
    } else {
      const auxDisponibles = [];
      const auxAsignados = [...grupoItemsImpuesto];

      impuesto.map((item) => {
        if (item.tableData.checked) {
          item.tableData["checked"] = false;
          auxAsignados.push(item);
        } else {
          auxDisponibles.push(item);
        }
      });
      setImpuesto(auxDisponibles);
      setGrupoItemsImpuesto(auxAsignados);
      setRegistro({
        ...registro,
        impuestoId: auxAsignados.map((item) => item.impuestoCod),
      });
      mensajeInfo("Valores agregados a asignados.");
      //guardar();
    }
  };
  const eliminarDeAsignados = () => {
    const marcado = grupoItemsImpuesto.filter(
      (item) => item.tableData.checked === true
    );
    if (marcado.length === 0) {
      mensajeError("No existe valores de 'Asignados' seleccionados.");
    } else {
      const auxAsignados = [];
      const auxDisponibles = [...impuesto];
      grupoItemsImpuesto.map((item) => {
        if (item.tableData.checked) {
          item.tableData["checked"] = false;
          auxDisponibles.push(item);
        } else {
          auxAsignados.push(item);
        }
      });
      setImpuesto(auxDisponibles);
      setGrupoItemsImpuesto(auxAsignados);
      //Actualizar registro
      setRegistro({
        ...registro,
        impuestoId: auxAsignados.map((item) => item.impuestoCod),
      });
      mensajeInfo("Valores eliminados de asigandos.");
      // guardar();
    }
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(grupoItemObj());
    listaImpuestos();
    listaGrupoItems(codigoOrganizacion);
    //listarItemGrupoTipos();
    listarItemGrupoTiposPorOrganizacion(codigoOrganizacion);
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
        agregarEnAsignados,
        eliminarDeAsignados,
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
      {stepActivo === 0 && !cargando && <GrupoItemsStepListar />}
      {stepActivo === 1 && !cargando && <GrupoItemsStepDetalle />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardar,
  agregarEnAsignados,
  eliminarDeAsignados,
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
          {/** Acciones de la barra para agregar e eliminar de tablas */}
          <HeaderButton
            label="Agregar a asignados."
            onClick={() => agregarEnAsignados()}
            tipo={"agregarItem"}
          />
          <HeaderButton
            label="Eliminar de asigandos."
            onClick={() => eliminarDeAsignados()}
            tipo={"removerItem"}
          />
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <SaveButtonSgm onClick={() => guardar()} />
          )}
          {verificaAccion(accionesPantalla, ACCIONES_PANTALLA.GRABAR) && (
            <DeleteButtonSgm onClick={() => eliminar(true)} />
          )}
        </div>
      )}
    </HeaderTab>
  );
}
