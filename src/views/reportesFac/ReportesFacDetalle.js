import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { GenerarContext } from "../../context/GenerarContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import AutocompleteSgm from "../../components/AutocompleteSgm";
import {
  styleCard,
  styleCardHeaderTitle,
  styleCardHeader,
} from "../../style/style";
import TextFieldSgm from "../../components/TextFieldSgm";
import DateFieldSgm from "../../components/DateFieldSgm";
import { getUser } from "../../util/common/Common";
import { inventarioValorObj } from "../../util/types";
import { formatoReporte } from "../../util/types";
import { itemGrupoTipo } from "../../util/types";

export default function ReporteFacDetalle(props) {
  const { registro, setRegistro, categorias, items } =
    useContext(GenerarContext);
  const { tipoProducto } = props;
  const { codigoOrganizacion, organizacion } = getUser();

  // funciones para obtener datos
  const handleOnChange = (event) => {
    setRegistro({
      ...registro,
      [event.target.id]: event.target.value,
    });
  };

  const handleOnChangeAutoTipoRep = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        categoriaCod: value.categoriaCod,
        categoriaDes: value.categoriaDes,
      });
    }
  };

  const handleOnChangeFormatoRep = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        formatoReporte: value.formatoReporte,
        tipo: value.tipo,
      });
    }
  };

  const handleOnChangeAutoItem = (event, value) => {
    if (value !== null) {
      setRegistro({
        ...registro,
        itemDes: value.itemDes,
        itemId: value.itemId,
      });
    }
  };

  const [reportes, setReportes] = useState([]);
  useEffect(() => {
    setRegistro({
      ...registro,
      organizacionCod: codigoOrganizacion,
      organizacionDes: organizacion,
    });
  }, []);

  useEffect(() => {
    let arrayAux = Array.from(categorias);
    if (itemGrupoTipo.productos === tipoProducto) {
      let inventario = {
        categoriaCod: inventarioValorObj().codigo,
        categoriaDes: inventarioValorObj().valor,
      };
      arrayAux.push(inventario);
    }
    setReportes(arrayAux);
  }, [categorias]);

  return (
    <div>
      <Card spacing={{ xs: 1, md: 2 }} style={styleCard}>
        <CardHeader
          titleTypographyProps={styleCardHeaderTitle}
          title="GENERAR REPORTES"
          style={styleCardHeader}
        />
        <CardContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item md={8} xs={12}>
              <AutocompleteSgm
                id="categoriaCod"
                label="Categoria de reporte"
                options={reportes}
                value={registro}
                getOptionLabel={(option) => option.categoriaDes}
                onChange={handleOnChangeAutoTipoRep}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteSgm
                id="formatoReporte"
                label="Formato de reporte"
                options={formatoReporte}
                value={registro}
                getOptionLabel={(option) => option.tipo}
                onChange={handleOnChangeFormatoRep}
              />
            </Grid>
            {registro.categoriaCod === inventarioValorObj().codigo && (
              <Grid item md={12} xs={12}>
                <AutocompleteSgm
                  id="itemDes"
                  label="Items:"
                  options={items}
                  value={registro}
                  getOptionLabel={(option) => option.itemDes}
                  onChange={handleOnChangeAutoItem}
                />
              </Grid>
            )}
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaDesde"
                label="Fecha desde: "
                value={registro.fechaDesde}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateFieldSgm
                id="fechaHasta"
                label="Fecha hasta: "
                value={registro.fechaHasta}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextFieldSgm
                id="organizacionDes"
                label="Organizacion"
                value={registro.organizacionDes}
                disabled="true"
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
