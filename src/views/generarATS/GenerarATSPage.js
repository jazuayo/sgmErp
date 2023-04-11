import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import HeaderTab from "../header/HeaderTab";
import IconSgm from "../../util/IconSgm";
import SnackbarAppSgm from "../../components/SnackbarAppSgm";
import SpinnerSgm from "../../components/SpinnerSgm";
import HeaderButton from "../header/HeaderButton";
import GenerarATSDetalle from "./GenerarATSDetalle";
import { atsObj } from "../../util/types";
import { descargarArchivoRegistro } from "../../util/descargarArchivos";
import { getUser } from "../../util/common/Common";
import { fechaFormatGuionSeparado } from "../../util/utils";

const steps = ["Generar Documento ATS"];
export default function GenerarATSPage() {
  const { registro, setRegistro, stepActivo } = useContext(GenerarContext);
  const { cargando, setCargando, mensajeError, mensajeInfo } =
    useContext(AppContext);
  const { codigoOrganizacion, organizacion } = getUser();

  const generarDocumentoATS = () => {
    if (registro.fechaGenera === "") {
      mensajeError("Ingrese una fecha valida.");
      return;
    }
    let datos = {
      organizacionCod: codigoOrganizacion,
      fechaGenera: new Date(registro.fechaGenera.replaceAll("-", "/")),
    };
    mensajeInfo("Generando ATS...");
    let fechaN = fechaFormatGuionSeparado(datos.fechaGenera);
    let nombreXML = "ATS_" + codigoOrganizacion + "_" + fechaN + ".xml";
    descargarArchivoRegistro("/ATS", nombreXML, datos, setCargando);
    setRegistro({
      ...registro,
      fechaGenera: new Date().toISOString().split("T")[0],
    });
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(atsObj());
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackbarAppSgm />
      {header(generarDocumentoATS)}
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
      {stepActivo === 0 && !cargando && <GenerarATSDetalle />}
    </Box>
  );
}

function header(generarDocumentoATS) {
  return (
    <HeaderTab>
      <div>
        <HeaderButton
          label="Generar ATS"
          onClick={() => generarDocumentoATS()}
          tipo={"procesar"}
        />
      </div>
    </HeaderTab>
  );
}
