import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { planCuentaObj } from "../../util/types.js";

export default function CuentaStepListar() {
  const { cuentas, setRegistro, setStepActivo, stepActivo } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    let cuentaPadreCod = "";
    let cuentaPadreDes = "";

    if (selectedRow.ctaPlanCuentaPadre != null) {
      cuentaPadreCod = selectedRow.ctaPlanCuentaPadre.cuentaCod;
      cuentaPadreDes = selectedRow.ctaPlanCuentaPadre.cuentaDes;
    }
    setRegistro({
      cuentaCod: selectedRow.cuentaCod,
      cuentaNum: selectedRow.cuentaNum,
      cuentaDes: selectedRow.cuentaDes,
      observaciones: selectedRow.observaciones,
      movimiento: selectedRow.movimiento,
      nivel: selectedRow.nivel,
      fechaDesde: new Date(selectedRow.fechaDesde).toISOString().split("T")[0],
      fechaHasta: new Date(selectedRow.fechaHasta).toISOString().split("T")[0],
      operativa: selectedRow.operativa,

      // Padre Plan de Cuenta
      cuentaCodPad: cuentaPadreCod,
      cuentaDesPad: cuentaPadreDes,

      // Plan Cuenta Tipo
      cuentaTipoCod: selectedRow.planCuentaTipo.cuentaTipoCod,
      cuentaTipoDes: selectedRow.planCuentaTipo.cuentaTipoDes,

      // Organización
      organizacionCod: selectedRow.organizacion.organizacionCod,
      organizacionDes: selectedRow.organizacion.organizacionDes,
    });
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  React.useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(planCuentaObj());
  }, []);
  return (
    <div>
      <TableSgm
        title="LISTADO DE CUENTAS"
        columns={[
          {
            title: "Número",
            field: "cuentaNum",
            editable: "never",
            width: "3%",
          },
          { title: "Descripción", field: "cuentaDes", editable: "never" },
          {
            title: "Tipo",
            field: "planCuentaTipo.cuentaTipoDes",
            editable: "never",
          },
          { title: "Nivel", field: "nivel", editable: "never" },
        ]}
        data={cuentas}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
