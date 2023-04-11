import React, { useContext, useEffect } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { AppContext } from "../../context/AppContext";

export default function GrupoItemsStepListar() {
  const { mensajeError, setCargando } = useContext(AppContext);
  const {
    impuesto,
    registro,
    setRegistro,
    setStepActivo,
    stepActivo,
    setGrupoItemsImpuesto,
    grupoItems,
    setImpuesto,
  } = useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setCargando(true);

    // Obtener los impuestos disponibles
    const idImpuestos = impuesto.map((item) => item.impuestoCod);
    const idAsignados = selectedRow.impuestos.map((item) => item.impuestoCod);
    let diferencia = idImpuestos.filter((x) => !idAsignados.includes(x));
    const listaAux = [];
    impuesto.map((item) => {
      diferencia.map((item2) => {
        if (item.impuestoCod === item2) {
          listaAux.push(item);
        }
      });
    });
    setGrupoItemsImpuesto(selectedRow.impuestos); //asignados
    setImpuesto(listaAux); //disponibles
    setRegistro({
      ...registro,
      itemGrupoCod: selectedRow.itemGrupoCod,
      itemGrupoDes: selectedRow.itemGrupoDes,
      organizacionDes: selectedRow.organizacion.organizacionDes,
      organizacionCod: selectedRow.organizacion.organizacionCod,
      impuestoId: idAsignados,
      itemGrupoTipoCod: selectedRow.itemGrupoTipo.itemGrupoTipoCod,
      itemGrupoTipoDes: selectedRow.itemGrupoTipo.itemGrupoTipoDes,
    });
    setCargando(false);
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  return (
    <div>
      <TableSgm
        title="LISTADO DE ITEMS"
        columns={[
          {
            title: "Código",
            field: "itemGrupoCod",
            editable: "never",
            width: "1%",
          },
          { title: "Descripción", field: "itemGrupoDes", editable: "never" },
        ]}
        data={grupoItems}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
