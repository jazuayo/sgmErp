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
import {
  getUser,
  verificaAccion,
  ACCIONES_PANTALLA,
} from "../../util/common/Common";
import { GenerarContext } from "../../context/GenerarContext";
import ClientJSON from "../../util/ClientJSON";
import { AppContext } from "../../context/AppContext";
import endpoints from "../../util/Parametros";
import SaveButtonSgm from "../../components/SaveButtonSgm";
import DeleteButtonSgm from "../../components/DeleteButtonSgm";
// Steps
import ItemStepListar from "./ItemStepListar";
import ItemStepDetalle from "./ItemStepDetalle.js";
const steps = ["LISTAR ITEMS", "DETALLE DEL ITEM"];

export default function ItemPage(props) {
  const { accionesPantalla } = props;
  const {
    listaItems,
    listaGrupoItems,
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    listaCuentasPorOrganizacion,
    listaCategoriasOrg,
    listarPlanDeCuentas,
  } = useContext(GenerarContext);
  const { mensajeError, cargando, setCargando, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion, organizacion } = getUser();

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
      itemCategoriaId: registro.itemCategoriaId,
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
        (detalle) => detalle.tableData.id === registro.tableDataId
      );
      categorias.splice(indice, 1);
    }
    categorias.push(categoria);
    setRegistro({
      ...registro,
      itemCategoriaId: 0,
      categoriaDes: "",
      categoriaCod: "",
      cuentaDes: "",
      cuentaCod: "",
      categorias: categorias,
      tableDataId: "",
    });
    setCargando(false);
    mensajeInfo("Categoria agregada.");
  };

  const eliminarCategoria = () => {
    setCargando(true);
    const categorias = registro.categorias.filter(
      (detalle) => detalle.tableData.id !== registro.tableDataId
    );
    setRegistro({
      ...registro,
      itemCategoriaId: 0,
      categoriaDes: "",
      categoriaCod: "",
      cuentaDes: "",
      cuentaCod: "",
      categorias: categorias,
      tableDataId: "",
    });
    if (registro.itemCategoriaId !== 0) {
      (async () => {
        var respuesta = await ClientJSON(
          endpoints.sgmErpRS + "/itemCategoria/" + registro.itemCategoriaId,
          null,
          "POST"
        );
        if (respuesta.error) {
          mensajeError("Error al eliminar el comprobante cuenta.");
        }
      })();
    }
    mensajeInfo("Categoria eliminada del item.");
    setCargando(false);
  };
  const guardar = () => {
    //validaciones
    if (registro.itemDes === "") {
      mensajeError("Ingrese una descripcion.");
      return;
    }
    if (registro.itemGrupoDes === "") {
      mensajeError("Selecione un grupo.");
      return;
    }
    if (registro.siglasItem === "") {
      mensajeError("Indique las siglas del item.");
      return;
    }
    setCargando(true);
    const categorias = Array.from(registro.categorias);
    const cateAux = [];
    categorias.map((item) => {
      let dataCategoria = {
        itemCategoriaId: item.itemCategoriaId,
        itemId: null,
        usuario: registro.usuario,
        categoria: {
          categoriaCod: item.categoriaCod,
          categoriaDes: item.categoriaDes,
        },
        cuenta: {
          cuentaCod: item.cuentaCod,
          cuentaDes: item.cuentaDes,
        },
        organizacion: {
          organizacionCod: item.organizacionCod,
          organizacionDes: item.organizacionDes,
        },
      };
      cateAux.push(dataCategoria);
    });

    let datos = {
      itemId: registro.itemId,
      itemDes: registro.itemDes,
      modificaPrecio: registro.modificaPrecio, //0 false 1 true
      permiteDetalle: registro.permiteDetalle, //0 false 1 true
      usuario: registro.usuario,
      precioVenta: registro.precioVenta,
      costoCompra: registro.costoCompra,
      itemGrupoCod: registro.itemGrupoCod,
      // organizacion
      organizacionCod: registro.organizacionCod,
      //categorias
      categorias: cateAux,
      //secuenciaGenera
      secuenciaGenera: registro.secuenciaGenera,
      siglasItem: registro.siglasItem,
    };

    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/item",
        JSON.stringify(datos),
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaItems(codigoOrganizacion);
        // categorias
        const categoriasAux = [];
        respuesta.datos.categorias.map((item) => {
          let categoria = {
            itemCategoriaId: item.itemCategoriaId,
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
          itemId: respuesta.datos.itemId,
          categorias: categoriasAux,
        });

        mensajeInfo("Item registrado correctamente.");
      } else {
        mensajeError("Error al registrar item.");
      }
    })();
  };

  const eliminar = () => {
    setCargando(true);
    (async () => {
      var respuesta = await ClientJSON(
        endpoints.sgmErpRS + "/item/" + registro.itemId,
        null,
        "POST"
      );
      setCargando(false);
      if (!respuesta.error) {
        listaItems(codigoOrganizacion);
        stepAterior();
        mensajeInfo("Item eliminado correctamente.");
      } else {
        mensajeError("Error al eliminar item.");
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
    listaGrupoItems(codigoOrganizacion);
    listaItems(codigoOrganizacion);
    listaCategoriasOrg(codigoOrganizacion);
    //listaCuentasPorOrganizacion(codigoOrganizacion);
    listarPlanDeCuentas(codigoOrganizacion, "movimiento");
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
      {stepActivo === 0 && !cargando && <ItemStepListar />}
      {stepActivo === 1 && !cargando && <ItemStepDetalle />}
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
            label="Eliminar Detalle"
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
