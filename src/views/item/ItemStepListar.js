import React, { useContext, useEffect } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { itemObj } from "../../util/types.js";
import { AppContext } from "../../context/AppContext";
export default function ItemStepListar() {
  const { setCargando } = useContext(AppContext);
  const { registro, setRegistro, setStepActivo, stepActivo, items } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setCargando(true);
    const categoriasAux = [];
    selectedRow.categorias.map((item) => {
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
      itemId: selectedRow.itemId,
      itemDes: selectedRow.itemDes,
      modificaPrecio: selectedRow.modificaPrecio,
      permiteDetalle: selectedRow.permiteDetalle,
      usuario: selectedRow.usuario,
      itemGrupoCod: selectedRow.itemGrupo.itemGrupoCod,
      itemGrupoDes: selectedRow.itemGrupo.itemGrupoDes,
      organizacionCod: selectedRow.organizacion.organizacionCod,
      organizacionDes: selectedRow.organizacion.organizacionDes,
      categorias: categoriasAux,
      precioVenta: selectedRow.precioVenta,
      costoCompra: selectedRow.costoCompra,
      secuenciaGenera: selectedRow.secuenciaGenera,
      siglasItem: selectedRow.siglasItem,
    });
    setCargando(false);
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  useEffect(() => {
    localStorage.removeItem("registro"); // Eliminar lo que se quedo en el registro anterior
    setRegistro(itemObj());
  }, []);
  return (
    <div>
      <TableSgm
        title="LISTADO DE ITEMS"
        columns={[
          {
            title: "Código",
            field: "itemId",
            editable: "never",
            width: "3%",
          },
          { title: "Descripción", field: "itemDes", editable: "never" },
          {
            title: "Grupo",
            field: "itemGrupo.itemGrupoDes",
            editable: "never",
          },
        ]}
        data={items}
        onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
      />
    </div>
  );
}
