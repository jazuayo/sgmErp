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
  verificaAccion,
  ACCIONES_PANTALLA,
  getUser,
} from "../../util/common/Common";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
// Steps
import ImpuestoStepListar from "./ImpuestoStepListar";
import ImpuestoStepDetalle from "./ImpuestoStepDetalle";
const steps = ["LISTAR IMPUESTO", "DETALLE DEL IMPUESTO"];

export default function ImpuestoPage(props) {
  const { codigoOrganizacion, organizacion } = getUser();
  const { accionesPantalla } = props;
  const {
    listarPlanDeCuentas,
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    listaImpuestosTipo,
    listaImpuestos,
    listaCategoriasOrg,
    listaImpuestosConCategoriaPorOrg,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);

  const agregarCategoria = () => {
    if (registro.categoriaDes === "") {
      mensajeError("Seleccione valor de categoria.");
      return;
    }
    if (registro.cuentaDes === "") {
      mensajeError("Seleccione valor de cuenta.");
      return;
    }
    setCargando(true);
    let categoria = {
      impuestoCategoriaId: registro.impuestoCategoriaId,
      categoriaCod: registro.categoriaCod,
      categoriaDes: registro.categoriaDes,
      cuentaCod: registro.cuentaCod,
      cuentaDes: registro.cuentaDes,
      organizacionCod: registro.organizacionCod,
      organizacionDes: registro.organizacionDes,
    };
    const categorias = Array.from(registro.categorias);
    if (registro.tableDataId !== "") {
      let indice = categorias.findIndex(
        (categoria) => categoria.tableData.id === registro.tableDataId
      );
      categorias.splice(indice, 1);
    }
    categorias.push(categoria);
    setRegistro({
      ...registro,
      impuestoCategoriaId: 0,
      categoriaDes: "",
      categoriaCod: "",
      cuentaDes: "",
      cuentaCod: "",
      tableDataId: "",
      categorias: categorias,
    });
    setCargando(false);
    mensajeInfo("Categoria agregada al impuesto.");
  };
  const eliminarCategoria = () => {
    setCargando(true);
    const categorias = registro.categorias.filter(
      (detalle) => detalle.tableData.id !== registro.tableDataId
    );
    setRegistro({
      ...registro,
      impuestoCategoriaId: 0,
      categoriaDes: "",
      categoriaCod: "",
      cuentaDes: "",
      cuentaCod: "",
      tableDataId: "",
      categorias: categorias,
    });
    if (registro.impuestoCategoriaId !== 0) {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS +
            "/impuestoCategoria/" +
            registro.impuestoCategoriaId,
          null,
          "POST"
        );
        if (respuesta.error) {
          mensajeError("Error al eliminar la categoria del impuesto.");
        }
      })();
    }
    mensajeInfo("Categoria eliminada del impuesto");
    setCargando(false);
  };
  const guardar = () => {
    // validar campos impuesto
    if (registro.impuestoCod === "") {
      mensajeError("Ingrese codigo de impuesto.");
      return;
    }
    if (registro.impuestoDes === "") {
      mensajeError("Ingrese descripcion de impuesto.");
      return;
    }
    if (registro.impuestoTipoDes === "") {
      mensajeError("Seleccione el tipo de impuesto.");
      return;
    }
    setCargando(true);
    const categorias = Array.from(registro.categorias);
    const cateAux = [];
    categorias.map((item) => {
      let dataCategoria = {
        impuestoCategoriaId: item.impuestoCategoriaId,
        impuestoCod: registro.impuestoCod,
        categoria: {
          categoriaCod: item.categoriaCod,
          categoriaDes: item.categoriaDes,
        },
        organizacion: {
          organizacionCod: item.organizacionCod,
          organizacionDes: item.organizacionDes,
        },
        cuenta: {
          cuentaCod: item.cuentaCod,
          cuentaDes: item.cuentaDes,
        },
      };
      cateAux.push(dataCategoria);
    });
    let datos = {
      impuestoCod: registro.impuestoCod,
      impuestoDes: registro.impuestoDes,
      impuestoTipoCod: registro.impuestoTipoCod,
      porcentaje: registro.porcentaje,
      porcentajeSri: registro.porcentajeSri,
      categorias: cateAux,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/impuesto",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaImpuestos();
        const categoriasAux = [];
        respuesta.datos.categorias.map((item) => {
          let categoria = {
            impuestoCategoriaId: item.impuestoCategoriaId,
            categoriaCod: item.categoria.categoriaCod,
            categoriaDes: item.categoria.categoriaDes,
            cuentaCod: item.cuenta.cuentaCod,
            cuentaDes: item.cuenta.cuentaDes,
            organizacionCod: item.organizacion.organizacionCod,
            organizacionDes: item.organizacion.organizacionDes,
          };
          categoriasAux.push(categoria);
        });
        setRegistro({
          ...registro,
          categorias: categoriasAux,
        });
        mensajeInfo("Impuesto registrado.");
      } else {
        mensajeError("Error al registrar impuesto.");
      }
    })();
  };

  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/impuesto/" + registro.impuestoCod,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaImpuestos();
        stepAterior();
        mensajeInfo("Impuesto eliminado correctamente.");
      } else {
        mensajeError("Error al eliminar impuesto.");
      }
    })();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  const stepAterior = () => {
    setStepActivo(stepActivo - 1);
  };

  useEffect(() => {
    listaImpuestosTipo();
    //listaImpuestos();
    listaImpuestosConCategoriaPorOrg(codigoOrganizacion);
    listaCategoriasOrg(codigoOrganizacion);
    //listaCuentasPorOrganizacion(codigoOrganizacion);
    listarPlanDeCuentas(codigoOrganizacion,"movimiento");
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
        agregarCategoria,
        eliminarCategoria,
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
      {stepActivo === 0 && !cargando && <ImpuestoStepListar />}
      {stepActivo === 1 && !cargando && <ImpuestoStepDetalle />}
    </Box>
  );
}

function header(
  stepActivo,
  accionesPantalla,
  stepSiguente,
  stepAterior,
  guardar,
  agregarCategoria,
  eliminarCategoria,
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
          <HeaderButton
            label="Agregar Categoria"
            onClick={() => agregarCategoria()}
            tipo={"agregarItem"}
          />
          <HeaderButton
            label="Eliminar Categoria"
            onClick={() => eliminarCategoria()}
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
