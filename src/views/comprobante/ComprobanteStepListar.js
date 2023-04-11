import React, { useContext } from "react";
import TableSgm from "../../components/TableSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import TextFieldSgm from "../../components/TextFieldSgm";

export default function ComprobanteStepListar() {
  const { comprobantes, setRegistro, registro, setStepActivo, stepActivo } =
    useContext(GenerarContext);
  const seleccionarRegistro = (selectedRow) => {
    setRegistro({
      ...registro,
      // Comprobante
      comprobanteCod: selectedRow.comprobanteCod,
      fecha: selectedRow.fecha.split("T")[0],
      conceptoComp: selectedRow.concepto,
      fuente: selectedRow.fuente,
      deudorBeneficiario: selectedRow.deudorBeneficiario,
      esAutomatico: selectedRow.esAutomatico,
      usuario: ".",
      chequeNumero: selectedRow.chequeNumero,
      detalles: selectedRow.detalles,
      compAutCabcod: selectedRow.compAutCabcod,

      // Documento
      documentoCod: selectedRow.documento.documentoCod,
      documentoDes: selectedRow.documento.documentoDes,

      // Organización
      organizacionCod: selectedRow.organizacion.organizacionCod,
      organizacionDes: selectedRow.organizacion.organizacionDes,

      // Estado
      estadoCod: selectedRow.estado.estadoCod,
      estadoDes: selectedRow.estado.estadoDes,
    });
    stepSiguente();
  };

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const stepSiguente = () => {
    setStepActivo(stepActivo + 1);
  };

  return (
    <div>
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid container xs={12} md={12} spacing={5} paddingTop={5}>
          <Grid item xs={12} md={3}>
            <DateFieldSgm
              id="fechaDesde"
              label="Fecha Desde:"
              value={registro.fechaDesde}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DateFieldSgm
              id="fechaHasta"
              label="Fecha Hasta:"
              value={registro.fechaHasta}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="comprobanteBusqueda"
              label="Comprobante:"
              value={registro.comprobanteBusqueda}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextFieldSgm
              id="conceptoBusqueda"
              label="Concepto:"
              value={registro.conceptoBusqueda}
              onChange={handleOnChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <TableSgm
            title="LISTADO DE COMPROBANTES"
            columns={[
              {
                title: "Código",
                field: "comprobanteCod",
                editable: "never",
                width: "3%",
              },
              { title: "Concepto", field: "concepto", editable: "never" },
              {
                title: "Documento",
                field: "documento.documentoDes",
                editable: "never",
              },
              {
                title: "Fecha",
                field: "fecha",
                editable: "never",
                render: (rowData) => rowData.fecha.split("T")[0],
              },
              { title: "Estado", field: "estado.estadoDes", editable: "never" },
            ]}
            data={comprobantes}
            onRowClick={(evt, selectedRow) => seleccionarRegistro(selectedRow)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
