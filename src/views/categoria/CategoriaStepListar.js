import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { categoriaObj } from "../../util/types.js";

export default function CategoriaStepListar() {
  const { categorias, setRegistro, setStepActivo, stepActivo } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      //cat organizacion
      catOrgId: selectedRow.catOrgId,
      //categoria
      categoriaCod: selectedRow.categoriaCod,
      categoriaDes: selectedRow.categoriaDes,

      // Tipos Categorías
      categoriaTipoCod: selectedRow.categoriaTipoCod,
      categoriaTipoDes: selectedRow.categoriaTipoDes,

      // Organizaciones
      organizacionCod: selectedRow.organizacionCod,
      organizacionDes: selectedRow.organizacionDes,
    });
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  React.useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(categoriaObj());
  }, []);
  return (
    <div>
      <TableSgm
        title="LISTADO DE CATEGORÍAS"
        columns={[
          {
            title: "Código",
            field: "categoriaCod",
            editable: "never",
            width: "3%",
          },
          {
            title: "Descripción",
            field: "categoriaDes",
            editable: "never",
          },
          {
            title: "Tipo",
            field: "categoriaTipoDes",
            editable: "never",
          },
          {
            title: "Organización",
            field: "organizacionDes",
            editable: "never",
          },
        ]}
        data={categorias}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
