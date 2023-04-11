export const notaCreditoObj = () => {
  const dato = {
    documentoId: 0,
    //Categoria
    categoriaCod: "",
    //Organizacion
    organizacionCod: "",
    organizacionDes: "",
    //Persona
    personaId: 0,
    nombre: "",

    fechaEmite: "", //date

    // Documento
    documentoCod: "",
    documentoDes: "",
    ce: 1, //Compribante electronico

    // Documento Tipo
    documentoTipoCod: "",
    documentoTipoDes: "",

    documentoNumero: "111111111111111",
    documentoValor: 0.0,
    autorizacionNumero: "0000000000",

    autorizacionFecha: new Date().toISOString().split("T")[0],

    // Estado
    estadoDes: "Nuevo",
    estadoCod: "",

    observaciones: ".",
    saldoPendiente: 0.0,

    // Forma de Pago
    formaPagoCod: "",
    formaPagoDes: "",

    plazoDias: 0,

    // listas
    detalles: [],
    impuestos: [],

    //Fatura Modifica
    facturaModifica: null,
    usuario: "",

    // detalles nota credito - items
    facturaDetalleId: null,
    itemDes: "",
    itemId: 0,
    descripcion: "",
    cantidad: 0.0,
    precioUnitario: 0.0,
    descuentoValor: 0.0,
    totalSinImp: 0.0,
    // item venta
    itemInvId: "",
    lote: "",
    loteCod: "",
    cantidadSeleccionada: 0,
    fechaVenceItemInv: "",
    // item compra
    costoArtesano: 0.0,
    pvp: 0.0,
    total: 0.0,
    fechaVence: new Date().toISOString().split("T")[0],
    impuestosItem: [],
    llevaIva: 0, //0 false 1 true,
    // permite modificaciones
    modificaPrecio: 0, //0 false 1 true
    permiteDetalle: 0, //0 false 1 true
  };
  return dato;
};
export const facturaCompraObj = () => {
  let datoValorBusqueda = {
    fechaDesde: new Date().toISOString().split("T")[0],
    fechaHasta: new Date().toISOString().split("T")[0],
    personaNombre: "",
  };
  let datoBusqueda = JSON.parse(sessionStorage.getItem("busqueda"));
  if (datoBusqueda) {
    if (datoBusqueda.categoriaCod === categorias.facturaCompras) {
      datoValorBusqueda = {
        fechaDesde: datoBusqueda.fechaDesde.split("T")[0],
        fechaHasta: datoBusqueda.fechaHasta.split("T")[0],
        personaNombre: datoBusqueda.personaNombre,
      };
    }
  }
  const dato = {
    documentoId: 0,
    //Categoria
    categoriaCod: categorias.facturaCompras,
    //Organizacion
    organizacionCod: "",
    organizacionDes: "",
    //Persona
    personaId: 0,
    nombre: "",
    llevaIva: 0, //0 false 1 true,

    fechaEmite: "", //date
    // Documento
    documentoCod: "",
    documentoDes: "",
    ce: 0, // comprobante electronico
    // Documento Tipo
    documentoTipoCod: "",
    documentoTipoDes: "",

    documentoNumero: "999999999999999",
    documentoValor: 0.0,
    autorizacionNumero: "0000000000",

    autorizacionFecha: "", //new Date().toISOString().split("T")[0], //fecha actual

    // Estado
    estadoDes: "Nuevo",
    estadoCod: "",

    observaciones: ".",
    saldoPendiente: 0.0,

    // Forma de Pago
    formaPagoCod: "",
    formaPagoDes: "",

    plazoDias: 0,

    // listas
    detalles: [],
    impuestos: [],
    impuestosItem: [],

    //Fatura Modifica
    facturaModifica: null,
    usuario: "",

    // detalles factura - items
    facturaDetalleId: null,
    itemDes: "",
    itemId: 0,
    descripcion: "",
    cantidad: 0.0,

    // Valores de galeria
    costoArtesano: 0.0, // precio unitario
    pvp: 0.0,
    total: 0.0,
    //Fin valores galeria
    descuentoValor: 0.0,
    totalSinImp: 0.0,
    fechaVence: new Date().toISOString().split("T")[0],
    lote: "",
    siglasProveedor: "",
    modificaPrecio: 0, //0 false 1 true
    permiteDetalle: 0, //0 false 1 true
    // Valor de filtros a buscar
    fechaDesde: datoValorBusqueda.fechaDesde, //fecha actual
    fechaHasta: datoValorBusqueda.fechaHasta, //fecha actual
    personaNombre: datoValorBusqueda.personaNombre,
    //id de tabla selecionada
    tableDataId: "",
    //
  };
  return dato;
};
export const facturaVentaObj = () => {
  let datoValorBusqueda = {
    fechaDesde: new Date().toISOString().split("T")[0],
    fechaHasta: new Date().toISOString().split("T")[0],
    personaNombre: "",
  };
  let datoBusqueda = JSON.parse(sessionStorage.getItem("busqueda"));
  if (datoBusqueda) {
    if (datoBusqueda.categoriaCod === categorias.facturaVenta) {
      datoValorBusqueda = {
        fechaDesde: datoBusqueda.fechaDesde.split("T")[0],
        fechaHasta: datoBusqueda.fechaHasta.split("T")[0],
        personaNombre: datoBusqueda.personaNombre,
      };
    }
  }

  const dato = {
    documentoId: 0,
    //Categoria
    categoriaCod: categorias.facturaVenta,
    //Organizacion
    organizacionCod: "",
    organizacionDes: "",
    //Persona
    personaId: 0,
    nombre: "",
    llevaIva: 0, //0 false 1 true,

    fechaEmite: new Date().toISOString().split("T")[0], //date
    // Document
    documentoCod: "",
    documentoDes: "",
    ce: 1, // comprobante electronico
    // Documento Tipo
    documentoTipoCod: "",
    documentoTipoDes: "",

    documentoNumero: "",
    documentoValor: 0.0,
    autorizacionNumero: "0000000000",

    autorizacionFecha: new Date().toISOString().split("T")[0], //fecha actual

    // Estado
    estadoDes: "Nuevo",
    estadoCod: "",

    observaciones: ".",
    saldoPendiente: 0.0,

    // Forma de Pago
    formaPagoCod: "",
    formaPagoDes: "",

    plazoDias: 0,

    // listas
    detalles: [],
    impuestos: [],

    //Fatura Modifica
    facturaModifica: null,
    usuario: "",

    // detalles factura - items
    facturaDetalleId: null,
    itemDes: "",
    itemId: 0,
    descripcion: "",
    cantidadSeleccionada: 0,
    precioUnitario: 0.0,
    descuentoValor: 0.0,
    totalSinImp: 0.0,
    // Valor de filtros a buscar
    fechaDesde: datoValorBusqueda.fechaDesde, //fecha actual
    fechaHasta: datoValorBusqueda.fechaHasta, //fecha actual
    personaNombre: datoValorBusqueda.personaNombre,
    // Id del lote de item inventatario
    itemInvId: "",
    lote: "",
    loteCod: "",
    cantidad: 0,
    fechaVenceItemInv: "",
    // item datos vista AYNi
    modificaPrecio: 0, //0 false 1 true
    permiteDetalle: 0, //0 false 1 true
    //id de tabla selecionada
    tableDataId: "",
  };
  return dato;
};

export const itemObj = () => {
  const dato = {
    itemId: 0,
    itemDes: "",
    modificaPrecio: 0, //0 false 1 true
    permiteDetalle: 0, //0 false 1 true
    usuario: "",
    itemGrupoCod: "",
    itemGrupoDes: "",
    // organizacion
    organizacionCod: "",
    organizacionDes: "",
    //Lista categoria
    categorias: [],
    //categorias
    itemCategoriaId: 0,
    categoriaCod: "",
    categoriaDes: "",
    cuentaCod: "",
    cuentaDes: "",
    //inventario
    secuenciaGenera: 1,
    siglasItem: "",
    precioVenta: 0.0,
    costoCompra: 0.0,
    //seleccion de tabla
    tableDataId: "",
  };
  return dato;
};

export const documentoObj = () => {
  const dato = {
    // Documento
    codigo: "",
    descripcion: "",
    secuencial: 0,
    longitud: 0,
    inicio: "",
    orden: "",
    usuario: ".",
    //Comprobante electronico
    ce: 0, //0 false 1 true
    // Estado
    estadoCod: "", //codigoEstado: "",
    estadoDes: "", //descripcionEstado: "",

    // Organizacion
    codigoOrganizacion: "",
    descripcionOrganizacion: "",

    // Origen
    codigoOrigen: "",
    descripcionOrigen: "",
    //categoria - origen
    categoriaCod: "",
    categoriaDes: "",
    // lista series
    series: [],
    // Documento Serie
    docSerieId: 0,
    fechaEmision: "",
    secuencialDesde: 0,
    secuencialHasta: 0,
    autorizacion: "",
    fechaCaduca: "",
    // selecion de tabla serie
    tableDataId: "",
  };
  return dato;
};

export const comprobanteObj = () => {
  const dato = {
    // Comprobante
    comprobanteCod: "",
    fecha: "",
    conceptoComp: "",
    fuente: "",
    deudorBeneficiario: "",
    esAutomatico: false,
    usuario: ".",
    chequeNumero: 0,
    detalles: [],
    compAutCabcod: 0,

    // Documento
    documentoCod: null,
    documentoDes: "",

    // Organización
    organizacionCod: "",
    organizacionDes: "",

    // Estado
    estadoCod: estado.mayorizado,
    estadoDes: "Mayorizado",

    // Detalles Comprobante Cuenta
    idReg: null,
    cuentaCod: "",
    cuentaDes: "",
    debito: "0",
    credito: "0",
    concepto: "",
    // Id o fila de la tabla seleccinada
    tableDataId: "",
    // Parámetros de búsqueda
    fechaDesde: new Date().toISOString().split("T")[0], //fecha actual
    fechaHasta: new Date().toISOString().split("T")[0], //fecha actual
    comprobanteBusqueda: "",
    conceptoBusqueda: "",
  };
  return dato;
};

export const retencionObj = () => {
  const dato = {
    // Retencion
    retencionId: 0,
    fechaEmite: "",
    documentoNumero: 0,
    autorizacionNumero: 0,
    autorizacionFecha: new Date().toISOString().split("T")[0],
    usuario: ".",
    detalles: [],

    // Documento
    documentoCod: "",
    documentoDes: "",
    ce: 1, //Comprobante electronico 1 = true , 0 = false
    // Organización
    organizacionCod: "",
    organizacionDes: "",

    // Estado
    estadoCod: "ING",
    estadoDes: "Ingresado",

    //Detalle Retencion
    retencionDetalleId: null,
    facturaId: "",
    facturaDes: "",
    impuestoCod: "",
    impuestoDes: "",
    baseImponible: 0,
    valorRetenido: 0,
    documentoNumeroFact: "",
    nombrePersona: "",
    personaId: 0,
  };
  return dato;
};

export const planCuentaObj = () => {
  const dato = {
    cuentaCod: "",
    cuentaNum: "",
    cuentaDes: "",
    observaciones: "",
    movimiento: false,
    nivel: 0,
    fechaDesde: "",
    fechaHasta: "",
    operativa: false,

    // Padre Plan de Cuenta
    cuentaCodPad: "",
    cuentaDesPad: "",

    // Plan Cuenta Tipo
    cuentaTipoCod: "",
    cuentaTipoDes: "",

    // Organización
    organizacionCod: "",
    organizacionDes: "",
  };
  return dato;
};

export const categoriaObj = () => {
  const dato = {
    categoriaCod: "",
    categoriaDes: "",

    // Tipos Categorías
    categoriaTipoCod: "",
    categoriaTipoDes: "",

    // Organizaciones
    organizacionCod: "",
    organizacionDes: "",
    //categoria organizacion
    catOrgId: 0,
  };
  return dato;
};
export const impuestoObj = () => {
  const dato = {
    impuestoCod: "",
    impuestoDes: "",
    //Impuesto tipo
    impuestoTipoCod: "",
    impuestoTipoDes: "",
    //Valores del porcentaje
    porcentaje: 12,
    porcentajeSri: 12,
    //lista impuesto categoria
    categorias: [],
    //ImpuestoCategoria
    impuestoCategoriaId: 0,
    categoriaDes: "",
    categoriaCod: "",
    cuentaDes: "",
    cuentaCod: "",
    organizacionDes: "",
    organizacionCod: "",
    //seleccion de tabla
    tableDataId: "",
  };
  return dato;
};
export const grupoItemObj = () => {
  const dato = {
    //grupo de items
    itemGrupoCod: "",
    itemGrupoDes: "",
    organizacionDes: "",
    organizacionCod: "",
    //item grupo tipo
    itemGrupoTipoCod: "",
    itemGrupoTipoDes: "",
    // Impuesto a agregar
    impuestoId: [],
  };
  return dato;
};
export const personaObj = () => {
  const dato = {
    personaId: 0,
    direccion: "",
    email: "",
    nombrePersona: "",
    numeroId: "",
    telefono: "",
    usuario: "",
    //organizacion
    organizacionCod: "",
    organizacionDes: "",
    //tipo de persona
    perTipoCod: "",
    perTipoDes: "",
    esCliente: 0,
    esProveedor: 0,
    siglasProveedor: "",
    //Lugar - Provincia - Canton
    lugarId: 0,
    provincia: "",
    canton: "",
    nombre: "", //lugar
  };
  return dato;
};

export const estado = {
  anulado: "ANU",
  registrado: "REG",
  mayorizado: "MAY",
  ingresado: "ING",
  editada: "EDI",
};

export const categorias = {
  comprobantesContables: "Cta",
  facturaCompras: "ComFac",
  facturaVenta: "VenFac",
  notaCreditoCompras: "ComNC",
  notaCreditoVentas: "VenNC",
  retencionesCompras: "ComRet",
  retencionesVentas: "VenRet",
};
export const itemGrupoTipo = {
  servicios: "S",
  productos: "P",
  lote: "L",
};

export const cambiarContraseñaObj = () => {
  const dato = {
    nuevaClave: "",
    confirmacionClave: "",
    claveAnterior: "",
  };
  return dato;
};

export const reporteObj = () => {
  const dato = {
    //tipo reporte
    tipoRepCod: "",
    tipoRepDes: "",
    //cuenta inicial
    cuentaIniCod: "",
    cuentaIniDes: "",
    //cuenta final
    cuentaFinCod: "",
    cuentaFinDes: "",
    //nivel
    nivel: "",
    //fechas
    fechaDesde: new Date().toISOString().split("T")[0],
    fechaHasta: new Date().toISOString().split("T")[0],
    //organizacion
    organizacionCod: "",
    organizacionDes: "",
    //dir URL de resp
    dir: "",
  };
  return dato;
};

export const parametroObj = () => {
  const dato = {
    parametroId: null,
    parametroDes: "",
    clave: "",
    valor: "",
    fechaDesde: "2022-01-01 00:00:00.0",
    fechaHasta: "2122-01-01 00:00:00.0",
    organizacionCod: "",
  };
  return dato;
};

export const reportes = () => {
  const tipoReportes = [
    {
      tipoRepCod: "mayGen",
      tipoRepDes: "Mayor General",
      dir: "/reporte/mayorGeneral",
      nombre: "MayorGeneral",
    },
    {
      tipoRepCod: "diaGen",
      tipoRepDes: "Diario General",
      dir: "/reporte/diarioGeneral",
      nombre: "DiarioGeneral",
    },
    {
      tipoRepCod: "balGen",
      tipoRepDes: "Balance General",
      dir: "/reporte/balanceGeneral",
      nombre: "BalanceGeneral",
    },
    {
      tipoRepCod: "estRes",
      tipoRepDes: "Estado Resultados",
      dir: "/reporte/estadoResultado",
      nombre: "EstadoResultado",
    },
  ];
  return tipoReportes;
};

export const reportesFacturaObj = () => {
  const dato = {
    //organizacion
    organizacionCod: "",
    organizacionDes: "",
    //categoria
    categoriaCod: "",
    categoriaDes: "",
    //fechas
    fechaDesde: new Date().toISOString().split("T")[0],
    fechaHasta: new Date().toISOString().split("T")[0],
    //Item
    itemDes: "",
    itemCod: "",
    //formato
    formatoReporte: "",
    tipo: "",
  };
  return dato;
};

export const inventarioValorObj = () => {
  const dato = {
    codigo: "invRep",
    valor: "Reporte de Inventario",
  };
  return dato;
};

export const formatoReporte = [
  { formatoReporte: ".xlsx", tipo: "EXCEL" },
  { formatoReporte: ".pdf", tipo: "PDF" },
];

export const atsObj = () => {
  const dato = {
    organizacionCod: "",
    organizacionDes: "",
    fechaGenera: new Date().toISOString().split("T")[0],
  };
  return dato;
};
