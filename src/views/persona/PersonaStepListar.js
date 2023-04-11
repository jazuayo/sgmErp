import React, { useContext, useEffect } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { personaObj } from "../../util/types.js";

export default function PersonaStepListar() {
  const {
    registro,
    setRegistro,
    stepActivo,
    setStepActivo,
    personas,
    setCantones,
    lugares,
  } = useContext(GenerarContext);

  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      ...registro,
      personaId: selectedRow.personaId,
      direccion: selectedRow.direccion,
      email: selectedRow.email,
      nombrePersona: selectedRow.nombre,
      numeroId: selectedRow.numeroId,
      telefono: selectedRow.telefono,
      perTipoCod: selectedRow.personaTipo.perTipoCod,
      perTipoDes: selectedRow.personaTipo.perTipoDes,
      esCliente: selectedRow.esCliente,
      esProveedor: selectedRow.esProveedor,
      siglasProveedor: selectedRow.siglasProveedor,
      //lugar
      lugarId: selectedRow.lugar.lugarId,
      provincia: selectedRow.lugar.lugar.nombre,
      //canton: selectedRow.lugar.nombre,
      nombre: selectedRow.lugar.nombre,
    });
    setCantones(lugares[selectedRow.lugar.lugar.nombre].cantones);
    stepSiguente();
  };
  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };
  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(personaObj());
  }, []);

  return (
    <div>
      <TableSgm
        title="LISTADO DE PERSONAS"
        columns={[
          {
            title: "Id",
            field: "personaId",
            editable: "never",
            width: "1%",
          },
          {
            title: "Numero Id",
            field: "numeroId",
            editable: "never",
            width: "auto",
          },
          {
            title: "Nombre",
            field: "nombre",
            editable: "never",
            width: "700px",
          },
          {
            title: "Tipo de persona",
            field: "personaTipo.perTipoDes",
            editable: "never",
            width: "auto",
          },
        ]}
        data={personas}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
