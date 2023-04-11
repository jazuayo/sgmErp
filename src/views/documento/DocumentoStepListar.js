import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";

import { getUser } from "../../util/common/Common";
export default function DocumentoStepListar() {
  const { codigoOrganizacion, organizacion } = getUser();
  const { documentos, setRegistro, registro, setStepActivo, stepActivo } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      ...registro,
      codigo: selectedRow.documentoCod,
      descripcion: selectedRow.documentoDes,
      secuencial: selectedRow.secuencial,
      longitud: selectedRow.longitud,
      inicio: selectedRow.inicio,
      orden: selectedRow.orden,
      usuario: selectedRow.usuario,
      ce: selectedRow.ce,

      // Estado
      //codigoEstado: selectedRow.estado.estadoCod,
      estadoCod: selectedRow.estado.estadoCod,
      //descripcionEstado: selectedRow.estado.estadoDes,
      estadoDes: selectedRow.estado.estadoDes,

      // Organizacion
      codigoOrganizacion: selectedRow.organizacion.organizacionCod,
      descripcionOrganizacion: selectedRow.organizacion.organizacionDes,

      // Origen
      //codigoOrigen: selectedRow.origen.categoriaCod,
      categoriaCod: selectedRow.origen.categoriaCod,
      //descripcionOrigen: selectedRow.origen.categoriaDes,
      categoriaDes: selectedRow.origen.categoriaDes,
      // series
      series: selectedRow.series,
    });

    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  React.useEffect(() => {
    setRegistro({
      ...registro,
      codigoOrganizacion: codigoOrganizacion,
      descripcionOrganizacion: organizacion,
    });
  }, []);
  return (
    <div>
      <TableSgm
        title="LISTADO DE DOCUMENTOS"
        columns={[
          {
            title: "Código",
            field: "documentoCod",
            editable: "never",
            width: "3%",
          },
          { title: "Descripción", field: "documentoDes", editable: "never" },
          { title: "Secuencial", field: "secuencial", editable: "never" },
          { title: "Longitud", field: "longitud", editable: "never" },
          { title: "Inicio", field: "inicio", editable: "never" },
          { title: "Orden", field: "orden", editable: "never" },
          { title: "Estado", field: "estado.estadoDes", editable: "never" },
          { title: "Origen", field: "origen.categoriaDes", editable: "never" },
        ]}
        data={documentos}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
