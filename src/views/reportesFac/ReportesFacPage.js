import React, { useContext, useEffect } from "react";
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
import { reportesFacturaObj } from "../../util/types";
import { descargarArchivoRegistro } from "../../util/descargarArchivos";
import { fechaHoraFormatJunto } from "../../util/utils";
import { inventarioValorObj } from "../../util/types";
import ClientJSON from "../../util/ClientJSON";
import endpoints from "../../util/Parametros";
// Steps
import ReportesFacDetalle from "./ReportesFacDetalle";
import { useState } from "react";

const steps = ["Generar reportes"];

export default function ReportesFacPage(props) {
  const { codigoOrganizacion } = getUser();
  const { stepActivo, setRegistro, registro, listaCategoriasOrg, listaItems } =
    useContext(GenerarContext);
  const { cargando, mensajeError, mensajeInfo, setCargando } =
    useContext(AppContext);
  const [tipoProducto, setTipoProducto] = useState();
  const generarReporte = () => {
    // Validar datos generales
    if (registro.categoriaCod === "") {
      mensajeError("Seleccione el tipo de categoria/reporte.");
      return;
    }
    if (registro.formatoReporte === "") {
      mensajeError("Seleccione el formato de reporte.");
      return;
    }
    if (
      registro.categoriaCod === inventarioValorObj().codigo &&
      registro.itemDes === ""
    ) {
      mensajeError("Seleccione item.");
      return;
    }

    let datos = {
      //tipo reporte
      categoriaCod: registro.categoriaCod,
      //fechas
      fechaDesde: new Date(registro.fechaDesde.replaceAll("-", "/")),
      fechaHasta: new Date(registro.fechaHasta.replaceAll("-", "/")),
      //organizacion
      orgCod: registro.organizacionCod,
      //item
      itemId: registro.itemId,
      //formato
      formatoReporte: registro.formatoReporte,
    };
    mensajeInfo("Generando reporte...");
    let formato = registro.formatoReporte;
    let fechaAct = fechaHoraFormatJunto(new Date());
    let nombPdf = "reporte_" + registro.categoriaCod + "_" + fechaAct + formato;
    descargarArchivoRegistro(
      "/facturacion/reporte/general",
      nombPdf,
      datos,
      setCargando
    );
    setRegistro({
      ...registro,
      //categoria
      categoriaCod: "",
      categoriaDes: "",
      //fechas
      fechaDesde: new Date().toISOString().split("T")[0],
      fechaHasta: new Date().toISOString().split("T")[0],
      //items
      itemDes: "",
      itemCod: "",
      //formato
      formatoReporte: "",
      tipo: "",
    });
  };
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
        setTipoProducto(respuesta.datos.valor);
      } else {
        mensajeError("Error al recuperar parametro.");
        setTipoProducto("");
      }
    })();
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(reportesFacturaObj());
    listaItems(codigoOrganizacion);
    listaCategoriasOrg(codigoOrganizacion);
    cargarParametro(codigoOrganizacion, "TipoProducto");
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
      {stepActivo === 0 && !cargando && (
        <ReportesFacDetalle tipoProducto={tipoProducto} />
      )}
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
