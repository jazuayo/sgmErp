import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import React, { useContext, useEffect } from "react";
import TableSgm from "../../components/TableSgm";
import TextFieldSgm from "../../components/TextFieldSgm";
import { GenerarContext } from "../../context/GenerarContext";
import {
  styleCard,
  styleCardHeader,
  styleCardHeaderTitle,
} from "../../style/style";
import { getUser } from "../../util/common/Common";
export default function GrupoItemsStepDetalle() {
  const {
    registro,
    setRegistro,
    impuesto,
    setImpuesto,
    setGrupoItemsImpuesto,
    grupoItemsImpuesto,
    itemGrupoTipo,
  } = useContext(GenerarContext);
  const { codigoOrganizacion, organizacion } = getUser();

  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const seleccionarRegistroImpuestos = (selectedRow) => {
    // Copie los datos de la fila y establezca el estado marcado
    const rowDataCopy = { ...selectedRow };
    rowDataCopy.tableData.checked = !rowDataCopy.tableData.checked;
    // Copiar datos para que podamos modificarlos.
    const dataCopy = [...impuesto];
    // Encuentra la fila en la que hicimos clic y actualízala con la propiedad `marcada`
    dataCopy[rowDataCopy.tableData.id] = rowDataCopy;
    setImpuesto(dataCopy);
  };
  const seleccionarRegistroAsignados = (selectedRow) => {
    // Copie los datos de la fila y establezca el estado marcado
    const rowDataCopy = { ...selectedRow };
    rowDataCopy.tableData.checked = !rowDataCopy.tableData.checked;
    // Copiar datos para que podamos modificarlos.
    const dataCopy = [...grupoItemsImpuesto];
    // Encuentra la fila en la que hicimos clic y actualízala con la propiedad `marcada`
    dataCopy[rowDataCopy.tableData.id] = rowDataCopy;
    setGrupoItemsImpuesto(dataCopy);
  };
  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionDes: organizacion,
      organizacionCod: codigoOrganizacion,
    });
  }, []);

  return (
    <div>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <Grid item xs={12} md={12}>
          <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
            <CardHeader
              titleTypographyProps={styleCardHeaderTitle}
              title="DETALLE DEL GRUPO DE ITEMS"
              style={styleCardHeader}
            />
            <CardContent>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={12} md={4}>
                  <TextFieldSgm
                    id="itemGrupoCod"
                    label="Código de grupo:"
                    value={registro.itemGrupoCod}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextFieldSgm
                    id="itemGrupoDes"
                    label="Descripción de grupo:"
                    value={registro.itemGrupoDes}
                    onChange={handleOnChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextFieldSgm
                    id="organizacionDes"
                    label="Organización:"
                    value={registro.organizacionDes}
                    disabled={true}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/**Impuestos asigandos seccion */}
        <Grid item xs={12} md={6}>
          <TableSgm
            title="ASIGNADOS"
            columns={[
              {
                title: "Codigo",
                field: "impuestoCod",
                editable: "never",
              },
              {
                title: "Descripción",
                field: "impuestoDes",
                editable: "never",
              },
              {
                title: "%",
                field: "porcentaje",
                editable: "never",
              },
            ]}
            data={grupoItemsImpuesto}
            onRowClick={(evt, selectedRow) =>
              seleccionarRegistroAsignados(selectedRow)
            }
            selection={true}
          />
        </Grid>
        {/**Impuestos disponibles seccion */}
        <Grid item xs={12} md={6}>
          <TableSgm
            title="DISPONIBLES"
            columns={[
              {
                title: "Código",
                field: "impuestoCod",
                editable: "never",
                width: "3%",
              },
              {
                title: "Descripción",
                field: "impuestoDes",
                editable: "never",
              },
              {
                title: "%",
                field: "porcentaje",
                editable: "never",
              },

              {
                title: "Tipo",
                field: "impuestoTipo.impuestoTipoDes",
                editable: "never",
              },
            ]}
            data={impuesto}
            onRowClick={(evt, selectedRow) =>
              seleccionarRegistroImpuestos(selectedRow)
            }
            selection={true}
          />
        </Grid>
      </Grid>
    </div>
  );
}
