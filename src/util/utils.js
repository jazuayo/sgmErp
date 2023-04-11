import React from "react";

import * as moment from "moment";

export function dateTimeZone(date) {
  let fechaForma = date.replaceAll("-", "/");
  let fecha = new Date(fechaForma).toLocaleString("en-US", {
    timeZone: "UTC",
  });

  return new Date(new Date(fecha).setHours(0, 0, 0, 0));
}

export function numberFormat(num) {
  if (!num) {
    return 0;
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  //return num;
}

export function numberCompleteFormat(num) {
  if (!num) {
    return 0;
  }
  num = decimalFormat(parseFloat(num));
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  //return num;
}

export function decimalFormat(num) {
  if (!num) {
    return 0;
  }
  return `${parseFloat(num).toFixed(2)}`;
}

export function numberReactFormat(num) {
  if (!num || num === "" || num === undefined) {
    return 0;
  }
  return parseFloat(num);
}

export function localdatetime(date) {
  if (!date) {
    return "";
  }
  console.log(date);
  console.log(moment(date).format("YYYY-MM-DD"));
  return moment(date).format("YYYY-MM-DD");
}

export function DD_MM_YYYY_Format(date) {
  if (!date) {
    return "";
  }
  const NewDate = moment(date).format("DD/MM/YYYY");
  return NewDate;
}

export function fechaHoraFormat(date) {
  const NewDate = moment(date).format("DD/MM/YYYY hh:mm a");
  return NewDate;
}

export function fechaHoraFormatJunto(date) {
  const NewDate = moment(date).format("DD-MM-YYYY_HH-mm");
  return NewDate;
}

export function fechaFormatGuionSeparado(date) {
  const NewDate = moment(date).format("DD-MM-YYYY");
  return NewDate;
}

// formato completo miercoles 17 de junio de 2020
export function fechaCompleta(date) {
  if (!date) {
    return "";
  }
  const monthArray = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre",
  };
  moment.locale("es");
  var mes = moment(date).month();
  let mesS = monthArray[parseInt(mes, 10)];
  let fecha = moment(date).format("DD");
  let anio = moment(date).format("YYYY");
  let fechaCompleta = fecha + " de " + mesS.toLowerCase() + " de " + anio;
  return fechaCompleta;
}

export const maskAccount = (account) =>
  account && account.length ? account.replace(/\d(?=\d{3})/g, "X") : "XXXXXX";

export const validateCuentaContable = (number) => {
  const re =
    /^[1-9]{1}[.][1-9]{1}[.][0-9]{2}[.][0-9]{2}[.][0-9]{2}[.][0-9]{2}$/;
  return re.test(number);
};

export const validateOnlyNumbers = (number) => {
  const re = /^\d{0,15}$/;
  return re.test(number);
};

export const validateLetters = (letter) => {
  const re = /^[a-zA-Z Ññ]*$/;
  return re.test(letter);
};

export const validateNumbers = (number) => {
  const re = /^\d+$/;
  return re.test(number);
};

export const validateAlphanumeric = (number) => {
  const re = /^[a-zA-Z0-9 _\-,:/.ñÑáéíóúÁÉÍÓÚ]*$/;
  return re.test(number);
};

export const validateEmail = (number) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(number);
};

export const validateDocumentId = (number) => {
  const re = /^\d{0,13}$/;
  return re.test(number);
};

export const fixFloat = (money) => {
  let twoPlacedFloat = parseFloat(money).toFixed(2);
  return twoPlacedFloat;
};

export const validateMoney = (money) => {
  const re = /^\d+(\.\d{1,2})?$/;
  return re.test(money);
};

export const dateFormat = (date) => {
  const dateLong = date.includes("T") ? date : date.concat("T00:00:00-5");
  const dateCompleteArray = dateLong.split("T");
  const dateArray = dateCompleteArray[0].split("-");
  const month = dateArray[1];
  const monthArray = {
    1: "ENE",
    2: "FEB",
    3: "MAR",
    4: "ABR",
    5: "MAY",
    6: "JUN",
    7: "JUL",
    8: "AGO",
    9: "SEP",
    10: "OCT",
    11: "NOV",
    12: "DIC",
  };
  const day = dateArray[2];
  const hourArray = dateCompleteArray[1].split("-");
  const hour = hourArray[0];
  return {
    day,
    month: monthArray[parseInt(month, 10)],
    hour,
    date: dateCompleteArray[0],
  };
};

export const sentenceCase = (str) => {
  return str
    .replace(/[a-z]/i, function (letter) {
      return letter.toUpperCase();
    })
    .trim();
};

export const localizationTable = () => {
  const parametros = {
    pagination: {
      labelDisplayedRows: "{from}-{to} de {count}",
      labelRowsSelect: "Registros",
      firstAriaLabel: "Primera Página",
      firstTooltip: "Primera Página",
      previousAriaLabel: "Página Anterior",
      previousTooltip: "Página Anterior",
      nextAriaLabel: "Siguiente Página",
      nextTooltip: "Siguiente Página",
      lastAriaLabel: "Última Página",
      lastTooltip: "Última Página",
    },
    toolbar: {
      nRowsSelected: "{0} registro(s) seleccionados",
      searchPlaceholder: "Buscar",
    },
    header: {
      actions: "Acción",
    },
    grouping: {
      placeholder: "Arrastre una columna para filtrar",
      groupedBy: "Agrupado por: ",
    },
    body: {
      emptyDataSourceMessage: "No existen registros",
      filterRow: {
        filterTooltip: "Filtrar Datos Tabla",
      },
      addTooltip: "Agregar",
      deleteTooltip: "Borrar",
      editTooltip: "Editar",
      editRow: {
        deleteText: "¿Esta seguro que desea borrar este registro?",
      },
    },
  };
  return parametros;
};

export const estados = () => {
  const estado = {
    S: "SI",
    N: "NO",
  };
  return estado;
};

export const tipoBase = () => {
  const estado = {
    P: "Principal",
    C: "Contingente",
  };
  return estado;
};

export const estadosObject = () => {
  const estados = [
    { codigo: "S", descripcion: "SI" },
    { codigo: "N", descripcion: "NO" },
  ];
  return estados;
};

export const SiNoObject = () => {
  const estados = [
    { codigo: "N", descripcion: "NO" },
    { codigo: "S", descripcion: "SI" },
    { codigo: "T", descripcion: "TODAS" },
  ];
  return estados;
};
export const getEstado = (estado) => {
  if (estado === "N") {
    return { codigo: "N", descripcion: "NO" };
  }
  if (estado === "S") {
    return { codigo: "S", descripcion: "SI" };
  }
};

export const matchItem = (parts) => {
  return (
    <div>
      {parts.map((part, index) => (
        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
          {part.text}
        </span>
      ))}
    </div>
  );
};
