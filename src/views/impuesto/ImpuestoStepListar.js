import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { impuestoObj } from "../../util/types.js";
import { AppContext } from "../../context/AppContext";

export default function ImpuestoStepListar() {
  const { setCargando } = useContext(AppContext);

  const { impuesto, registro, setRegistro, setStepActivo, stepActivo } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setCargando(true);
    const categoriasAux = [];
    selectedRow.categorias.map((item) => {
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
      impuestoCod: selectedRow.impuestoCod,
      impuestoDes: selectedRow.impuestoDes,
      //Impuesto tipo
      impuestoTipoCod: selectedRow.impuestoTipo.impuestoTipoCod,
      impuestoTipoDes: selectedRow.impuestoTipo.impuestoTipoDes,
      //Categorias lista
      categorias: categoriasAux,
    });
    setCargando(false);
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  React.useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(impuestoObj());
  }, []);
  return (
    <div>
      <TableSgm
        title="LISTADO DE IMPUESTOS"
        columns={[
          {
            title: "Código",
            field: "impuestoCod",
            editable: "never",
            width: "3%",
          },
          { title: "Descripción", field: "impuestoDes", editable: "never" },
          {
            title: "Tipo",
            field: "impuestoTipo.impuestoTipoDes",
            editable: "never",
          },
        ]}
        data={impuesto}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
