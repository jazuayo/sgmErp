import React, { useContext, useEffect } from "react";
import TableSgm from "../../components/TableSgm";
import { GenerarContext } from "../../context/GenerarContext";
import { Grid } from "@mui/material";
import TextFieldSgm from "../../components/TextFieldSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
export default function FacturaVentaStepListar() {
  const { registro, setRegistro, setStepActivo, stepActivo, facturas } =
    useContext(GenerarContext);
  const agruparImpuestosPorCod = (impuestos) => {
    //Codigo para sumar impuestos y agrupar
    const resultado = [];
    impuestos.forEach(function (item) {
      var impuestoCod = item.impuesto.impuestoCod;
      var impuestoDes = item.impuesto.impuestoDes;
      if (!this[impuestoCod]) {
        this[impuestoCod] = {
          baseImponible: 0,
          impuestoValor: 0,
          impuesto: { impuestoCod: impuestoCod, impuestoDes: impuestoDes },
        };
        resultado.push(this[impuestoCod]);
      }
      this[impuestoCod].baseImponible += item.baseImponible;
      this[impuestoCod].impuestoValor += item.impuestoValor;
    }, Object.create(null));
    return resultado;
  };
  const seleccionarRegistro = (selectedRow) => {
    const detalleActualizado = [];
    selectedRow.detalles.map((item) => {
      const totalSinImp =
        item.cantidad * item.precioUnitario - item.descuentoValor;
      item.totalSinImp = Number(totalSinImp).toFixed(2);

      detalleActualizado.push(item);
    });
    //console.log(detalleActualizado);
    const impuestoAgrupado = agruparImpuestosPorCod(selectedRow.impuestos);
    setRegistro({
      ...registro,
      documentoId: selectedRow.documentoId,
      autorizacionFecha: selectedRow.autorizacionFecha.split("T")[0],

      autorizacionNumero: selectedRow.autorizacionNumero,
      documentoNumero: selectedRow.documentoNumero,
      documentoValor: selectedRow.documentoValor,
      fechaEmite: selectedRow.fechaEmite.split("T")[0],

      observaciones: selectedRow.observaciones,
      plazoDias: selectedRow.plazoDias,
      saldoPendiente: selectedRow.saldoPendiente,
      usuario: selectedRow.usuario,
      documentoCod: selectedRow.documento.documentoCod,
      documentoDes: selectedRow.documento.documentoDes,
      ce: selectedRow.documento.ce,
      documentoTipoCod: selectedRow.documentoTipo.documentoTipoCod,
      documentoTipoDes: selectedRow.documentoTipo.documentoTipoDes,
      estadoDes: selectedRow.estado.estadoDes,
      estadoCod: selectedRow.estado.estadoCod,

      formaPagoCod: selectedRow.formaPago.formaPagoCod,
      formaPagoDes: selectedRow.formaPago.formaPagoDes,
      organizacionCod: selectedRow.organizacion.organizacionCod,
      organizacionDes: selectedRow.organizacion.organizacionDes,
      personaId: selectedRow.persona.personaId,
      nombre: selectedRow.persona.nombre,
      // LISTAS
      detalles: detalleActualizado,
      impuestos: impuestoAgrupado,
    });
    stepSiguente();
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      <Grid item xs={6} md={4}>
        <DateFieldSgm
          id="fechaDesde"
          label="Fecha Desde:"
          value={registro.fechaDesde}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <DateFieldSgm
          id="fechaHasta"
          label="Fecha Hasta:"
          value={registro.fechaHasta}
          onChange={handleOnChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextFieldSgm
          id="personaNombre"
          label="Persona: "
          value={registro.personaNombre}
          onChange={handleOnChange}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <TableSgm
          title="LISTADO DE FACTURAS DE VENTA"
          columns={[
            {
              title: "Id",
              field: "documentoId",
              editable: "never",
              width: "3%",
            },
            {
              title: "Persona",
              field: "persona.nombre",
              editable: "never",
            },
            {
              title: "Documento",
              field: "documento.documentoCod",
              editable: "never",
            },
            {
              title: "Fecha",
              field: "fechaEmite",
              editable: "never",
              /**Edit para fechas */
              render: (rowData) => rowData.fechaEmite.split("T")[0],
            },
            {
              title: "Tipo",
              field: "documentoTipo.documentoTipoDes",
              editable: "never",
            },
            {
              title: "Numero",
              field: "documentoNumero",
              editable: "never",
            },
            {
              title: "Estado",
              field: "estado.estadoDes",
              editable: "never",
            },
          ]}
          data={facturas}
          onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
        />
      </Grid>
    </Grid>
  );
}
